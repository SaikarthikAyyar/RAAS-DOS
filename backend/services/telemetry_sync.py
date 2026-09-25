# ====================================
# TELEMETRY SYNC
# Turns the live MQTT readings (services/mqtt_telemetry.py) into what
# RAAS-DOS actually keeps and acts on. Runs in the hub's worker thread,
# never in the MQTT callback.
#
# Per machine, with a throttle on each so the DB is not written every
# 2 s:
#   1. Inventory - last known reading + the bot it came from
#      (survives restarts / offline periods)  ........ every 30 s
#   2. Inventory - current latitude/longitude from the machine's own GPS
#   3. Execution - while the machine is the PRIMARY machine of a job
#      that is IN PROGRESS in Phase 1 or 3 (in transit), the GPS is fed
#      through the SAME update path staff use (update_execution_progress),
#      so distance travelled, ETA, transport status, machine position and
#      progress all derive exactly as before - with the source recorded
#      as DEVICE instead of OPS  ..................... every 30 s
#   4. Log - a sampled row tied to the execution, for any phase that is
#      in progress  ................................... every 30 s
#
# A bot id is matched to an inventory unit by model + unit number
# (Varaha SCH 300 M1  <->  SCH-300-001); see expected_bot_id().
# ====================================

import logging
import re
import threading
import time
from datetime import datetime, timezone

from backend.database.connection import SessionLocal
from backend.models.fleet_schedule import FleetSchedule
from backend.models.fleet_unit import FleetUnit, FleetUnitMachine
from backend.models.machine_inventory import MachineInventory
from backend.models.machine_schedule import MachineSchedule
from backend.models.machine_telemetry_log import MachineTelemetryLog
from backend.models.machines_pumps import Machine
from backend.models.execution import Execution
from backend.services.mqtt_telemetry import hub

logger = logging.getLogger("telemetry_sync")

PERSIST_INTERVAL_SECONDS = 30
EXECUTION_SYNC_INTERVAL_SECONDS = 30
LOG_INTERVAL_SECONDS = 30
UNIT_MAP_TTL_SECONDS = 60

_last_persist = {}
_last_exec_sync = {}
_last_log = {}
_unit_map = {"at": 0.0, "map": {}}
_map_lock = threading.Lock()


# ====================================
# BOT <-> UNIT MATCHING
# ====================================

def expected_bot_id(machine_code, type_code):
    """'VARAHA-SCH-300-M1' (type VARAHA-SCH-300) -> 'SCH-300-001'.
    Their models drop the brand prefix and number units 001, 002..."""

    number = re.search(r"-M(\d+)$", machine_code or "")

    if not number:
        return None

    model = re.sub(r"^VARAHA-", "", (type_code or "").upper())

    return f"{model}-{int(number.group(1)):03d}"


def unit_map(db):
    """{BOT_ID: machine_inventory_id} for every active inventory unit.
    An explicitly stored telemetry_bot_id wins over the derived id."""

    with _map_lock:

        if time.time() - _unit_map["at"] < UNIT_MAP_TTL_SECONDS and _unit_map["map"]:
            return _unit_map["map"]

        mapping = {}

        rows = (
            db.query(MachineInventory, Machine)
            .join(Machine, MachineInventory.machine_type_id == Machine.id)
            .filter(Machine.active.is_(True), MachineInventory.status != "RETIRED")
            .all()
        )

        for unit, machine_type in rows:
            derived = expected_bot_id(unit.machine_code, machine_type.code)
            if derived:
                mapping[derived] = unit.id
            if unit.telemetry_bot_id:
                mapping[unit.telemetry_bot_id.upper()] = unit.id

        _unit_map["at"] = time.time()
        _unit_map["map"] = mapping

        return mapping


def _due(store, key, interval, now):

    if now - store.get(key, 0) >= interval:
        store[key] = now
        return True

    return False


# ====================================
# READING HELPERS
# ====================================

def _num(value):
    return value if isinstance(value, (int, float)) and not isinstance(value, bool) else None


def gps_from_packet(packet):
    lat, lng = _num(packet.get("gps_lat")), _num(packet.get("gps_lng"))

    if lat is None or lng is None:
        return None

    if lat == 0 and lng == 0:  # no fix
        return None

    return {
        "lat": lat,
        "lng": lng,
        "alt": _num(packet.get("gps_alt")),
        "speed_mps": _num(packet.get("speed")),
        "heading": _num(packet.get("heading")),
    }


def _packet_time(packet, fallback):
    try:
        text = str(packet.get("timestamp")).replace("Z", "+00:00")
        parsed = datetime.fromisoformat(text)
        return parsed if parsed.tzinfo else parsed.replace(tzinfo=timezone.utc)
    except Exception:
        return fallback


# ====================================
# ACTIVE EXECUTION FOR A MACHINE
# ====================================

def find_active_execution(db, machine_id):
    """The Execution this machine is currently working (a phase IN
    PROGRESS), plus whether it is the job's PRIMARY machine."""

    from backend.services.execution_service import (
        _current_phase_status,
        _resolve_execution_machines,
    )

    unit_ids = {
        r[0] for r in db.query(FleetUnitMachine.fleet_unit_id)
        .filter(FleetUnitMachine.machine_inventory_id == machine_id).all()
    }
    unit_ids |= {
        r[0] for r in db.query(FleetUnit.id)
        .filter(FleetUnit.machine_inventory_id == machine_id).all()
    }

    job_ids = set()

    if unit_ids:
        job_ids |= {
            r[0] for r in db.query(FleetSchedule.job_creation_id)
            .filter(FleetSchedule.fleet_unit_id.in_(unit_ids), FleetSchedule.schedule_status == "ACTIVE").all()
        }

    job_ids |= {
        r[0] for r in db.query(MachineSchedule.job_creation_id)
        .filter(MachineSchedule.machine_id == machine_id, MachineSchedule.schedule_status == "ACTIVE").all()
    }

    if not job_ids:
        return None, False

    executions = (
        db.query(Execution)
        .filter(Execution.job_creation_id.in_(job_ids))
        .order_by(Execution.id.desc())
        .all()
    )

    for execution in executions:

        if _current_phase_status(execution) == "IN_PROGRESS":

            machines = _resolve_execution_machines(db, execution.job_creation_id)
            is_primary = bool(machines) and machines[0].id == machine_id

            return execution, is_primary

    return None, False


# ====================================
# PER-PACKET SYNC
# ====================================

FRESH_PACKET_SECONDS = 120


def sync_packet(db, unit, bot_id, packet, now, received_at=None):

    received_at = received_at if received_at is not None else now
    now_dt = datetime.fromtimestamp(now, timezone.utc)
    seen_dt = datetime.fromtimestamp(received_at, timezone.utc)
    gps = gps_from_packet(packet)

    # 1. last known reading (survives restarts / offline) - stamped with
    #    when the MACHINE sent it, so an old packet never looks recent
    if _due(_last_persist, unit.id, PERSIST_INTERVAL_SECONDS, now):
        unit.telemetry_bot_id = bot_id
        unit.last_telemetry_at = seen_dt
        unit.last_telemetry = packet

    # A stale packet (machine stopped sending, the relay still holds its
    # last one) is remembered above but must not move the machine or a job.
    if now - received_at > FRESH_PACKET_SECONDS:
        return

    # 2. machine position from its own GPS
    if gps:
        unit.current_latitude = gps["lat"]
        unit.current_longitude = gps["lng"]

    execution, is_primary = find_active_execution(db, unit.id)

    if execution is None:
        return

    # 3. GPS -> execution (transit phases, primary machine only)
    if (
        gps
        and is_primary
        and execution.current_phase in ("PHASE_1", "PHASE_3")
        and _due(_last_exec_sync, execution.id, EXECUTION_SYNC_INTERVAL_SECONDS, now)
    ):
        from backend.schemas.execution_schema import ExecutionProgressUpdateSchema
        from backend.services.execution_service import update_execution_progress

        speed = gps["speed_mps"]

        try:
            update_execution_progress(
                db,
                execution.id,
                ExecutionProgressUpdateSchema(
                    latitude=gps["lat"],
                    longitude=gps["lng"],
                    speed_kmph=round(speed * 3.6, 2) if speed is not None else None,
                    heading=gps["heading"],
                    altitude=gps["alt"],
                    gps_timestamp=_packet_time(packet, now_dt),
                    update_source="DEVICE",
                ),
            )
        except Exception as error:  # gates (planned start, phase not started...) are not errors here
            db.rollback()
            logger.info("execution %s not updated from device GPS: %s", execution.id, getattr(error, "detail", error))

    # 4. sampled trail while a phase is running
    if _due(_last_log, unit.id, LOG_INTERVAL_SECONDS, now):
        db.add(MachineTelemetryLog(
            machine_inventory_id=unit.id,
            execution_id=execution.id,
            bot_id=bot_id,
            recorded_at=now_dt,
            payload=packet,
        ))


def sync_batch(batch):
    """batch = {BOT_ID: packet} handed over by the hub's worker."""

    db = SessionLocal()

    try:
        mapping = unit_map(db)
        now = time.time()

        for bot_id, packet in batch.items():

            unit_id = mapping.get(bot_id)

            if unit_id is None:
                continue

            unit = db.query(MachineInventory).filter(MachineInventory.id == unit_id).first()

            if unit is None:
                continue

            try:
                entry = hub.get_latest(bot_id)
                sync_packet(db, unit, bot_id, packet, now, entry["received_at"] if entry else now)
                db.commit()
            except Exception:
                db.rollback()
                logger.exception("telemetry sync failed for %s", bot_id)

    finally:
        db.close()
