# ====================================
# MACHINE TELEMETRY (read side)
# Serves what the RAAS-DOS screens show about each machine's sensors:
# Machine Statistics, Machine Inventory, Fleet Units and Execution.
#
# Source of truth is the MQTT hub (services/mqtt_telemetry.py) - the
# live packets received straight from the machines. While a machine is
# offline (or after a backend restart) the last known reading persisted
# on its inventory row (services/telemetry_sync.py) is served instead,
# so "last seen" and the last values never disappear.
#
# Sensor readings are read as an OPEN set of keys, so a newly added
# sensor appears automatically (under "Other" until it is labelled in
# METRIC_CATALOG).
# ====================================

from datetime import datetime, timezone

from backend.models.execution import Execution
from backend.models.machine_inventory import MachineInventory
from backend.models.machine_telemetry_log import MachineTelemetryLog
from backend.models.machines_pumps import Machine
from backend.services.mqtt_telemetry import hub
from backend.services.telemetry_sync import expected_bot_id, gps_from_packet

LIVE_MAX_AGE_SECONDS = 15
STALE_MAX_AGE_SECONDS = 30

META_KEYS = {"botId", "deviceId", "timestamp"}

# key -> (label, unit, group). Unknown keys still render, as "Other".
METRIC_CATALOG = {
    "motor_status": ("Motor status", None, "Motion"),
    "direction": ("Direction", None, "Motion"),
    "drive_direction": ("Drive direction", None, "Motion"),
    "left_motor_direction": ("Left motor direction", None, "Motion"),
    "right_motor_direction": ("Right motor direction", None, "Motion"),
    "motor_rpm": ("Motor RPM", "rpm", "Motion"),
    "left_motor_rpm": ("Left motor RPM", "rpm", "Motion"),
    "right_motor_rpm": ("Right motor RPM", "rpm", "Motion"),
    "motor_temp": ("Motor temperature", "°C", "Motion"),
    "bus_voltage": ("Bus voltage", "V", "Power"),
    "bus_current": ("Bus current", "A", "Power"),
    "bus_power": ("Bus power", "W", "Power"),
    "pressure": ("Pressure", "bar", "Process"),
    "pump_flow_rate": ("Pump flow rate", "m³/h", "Process"),
    "gps_lat": ("Latitude", "°", "Location"),
    "gps_lng": ("Longitude", "°", "Location"),
    "gps_alt": ("Altitude", "m", "Location"),
    "speed": ("Speed", "m/s", "Location"),
    "heading": ("Heading", "°", "Location"),
    "imu_pitch": ("Pitch", "°", "Orientation"),
    "imu_roll": ("Roll", "°", "Orientation"),
    "imu_yaw": ("Yaw", "°", "Orientation"),
    "imu_accel_x": ("Acceleration X", "g", "Orientation"),
    "imu_accel_y": ("Acceleration Y", "g", "Orientation"),
    "imu_accel_z": ("Acceleration Z", "g", "Orientation"),
}

GROUP_ORDER = ["Motion", "Power", "Process", "Location", "Orientation", "Other"]

HISTORY_LIMIT = 300
LOG_FALLBACK_ROWS = 200


# ====================================
# SHAPING
# ====================================

def _flat_values(packet):
    raw = packet.get("rawPayload") if isinstance(packet.get("rawPayload"), dict) else packet
    return {
        key: value for key, value in raw.items()
        if key not in META_KEYS and value is not None and not isinstance(value, (dict, list))
    }


def _build_metrics(packet):
    groups = {}
    for key, value in _flat_values(packet).items():
        label, unit, group = METRIC_CATALOG.get(key, (key.replace("_", " ").capitalize(), None, "Other"))
        groups.setdefault(group, []).append({"key": key, "label": label, "unit": unit, "value": value})
    return [{"group": g, "metrics": groups[g]} for g in GROUP_ORDER if g in groups]


def _iso(epoch):
    return datetime.fromtimestamp(epoch, timezone.utc).isoformat() if epoch else None


def _status(received_at):
    """live / stale / offline from OUR receive time (or the persisted
    last-known time); no_source when nothing was ever received."""

    if received_at is None:
        return "no_source", None

    age = max(0.0, datetime.now(timezone.utc).timestamp() - received_at)

    if age <= LIVE_MAX_AGE_SECONDS:
        return "live", age
    if age <= STALE_MAX_AGE_SECONDS:
        return "stale", age
    return "offline", age


def _current_reading(unit, bot_id):
    """(packet, received_at_epoch, from_hub) - live hub reading first,
    the persisted last-known reading second, else (None, None, False)."""

    entry = hub.get_latest(bot_id) if bot_id else None

    if entry:
        return entry["packet"], entry["received_at"], True

    if unit.last_telemetry and unit.last_telemetry_at:
        return unit.last_telemetry, unit.last_telemetry_at.timestamp(), False

    return None, None, False


def _machine_entry(unit, machine_type):

    bot_id = unit.telemetry_bot_id or expected_bot_id(unit.machine_code, machine_type.code)
    packet, received_at, live_source = _current_reading(unit, bot_id)
    state, age = _status(received_at)

    gps = gps_from_packet(packet) if packet else None

    return {
        "id": unit.id,
        "machine_code": unit.machine_code,
        "machine_name": unit.machine_name,
        "machine_type": machine_type.name,
        "inventory_status": unit.status,
        "current_site": unit.current_site,
        "telemetry_status": state,
        "bot_id": bot_id if packet else None,
        "last_seen": _iso(received_at),
        "age_seconds": age,
        "position": {"lat": gps["lat"], "lng": gps["lng"]} if gps else None,
        "metric_groups": _build_metrics(packet) if packet else [],
    }


# ====================================
# PUBLIC
# ====================================

def _active_units(db):
    return (
        db.query(MachineInventory, Machine)
        .join(Machine, MachineInventory.machine_type_id == Machine.id)
        .filter(Machine.active.is_(True), MachineInventory.status != "RETIRED")
        .order_by(Machine.id, MachineInventory.machine_code)
        .all()
    )


def get_machine_statistics(db):

    status = hub.status()

    return {
        "source": "mqtt",
        "mqtt": status,
        "error": None if status["configured"] else "MQTT is not configured (set MQTT_HOST) - showing last known readings only.",
        "machines": [_machine_entry(unit, machine_type) for unit, machine_type in _active_units(db)],
    }


def get_machine_detail(db, unit_id):

    row = (
        db.query(MachineInventory, Machine)
        .join(Machine, MachineInventory.machine_type_id == Machine.id)
        .filter(MachineInventory.id == unit_id)
        .first()
    )

    if not row:
        return None

    unit, machine_type = row
    entry = _machine_entry(unit, machine_type)
    bot_id = unit.telemetry_bot_id or expected_bot_id(unit.machine_code, machine_type.code)
    packet, received_at, _ = _current_reading(unit, bot_id)

    history = [
        {"timestamp": _iso(at), "values": _flat_values(p)}
        for at, p in hub.get_history(bot_id, HISTORY_LIMIT)
    ]

    # After a restart the in-memory trail is short - lengthen it with the
    # sampled log (only exists for time spent on a job).
    if len(history) < 30:
        log_rows = (
            db.query(MachineTelemetryLog)
            .filter(MachineTelemetryLog.machine_inventory_id == unit.id)
            .order_by(MachineTelemetryLog.recorded_at.desc())
            .limit(LOG_FALLBACK_ROWS)
            .all()
        )
        first = history[0]["timestamp"] if history else None
        older = [
            {"timestamp": r.recorded_at.isoformat(), "values": _flat_values(r.payload)}
            for r in reversed(log_rows)
            if first is None or r.recorded_at.isoformat() < first
        ]
        history = older + history

    return {
        **{k: entry[k] for k in ("id", "machine_code", "machine_name", "machine_type", "inventory_status",
                                 "current_site", "telemetry_status", "bot_id", "last_seen", "age_seconds")},
        "machine_type_code": machine_type.code,
        "family": "SCH" if "SCH-" in (machine_type.code or "") else None,
        "values": _flat_values(packet) if packet else {},
        "history": history,
        "mqtt": hub.status(),
        "error": None,
    }


def get_execution_telemetry(db, execution_id):
    """Sensor state of the machines working one execution, plus whether
    the execution's own position is currently supplied by the machine."""

    from backend.services.execution_service import _current_phase_status, _resolve_execution_machines

    execution = db.query(Execution).filter(Execution.id == execution_id).first()

    if execution is None:
        return None

    machines = _resolve_execution_machines(db, execution.job_creation_id)

    items = []
    for index, unit in enumerate(machines):
        machine_type = db.query(Machine).filter(Machine.id == unit.machine_type_id).first()
        if machine_type is None:
            continue
        entry = _machine_entry(unit, machine_type)
        entry["role"] = "PRIMARY" if index == 0 else "SUPPORT"
        items.append(entry)

    primary = items[0] if items else None

    return {
        "execution_id": execution.id,
        "current_phase": execution.current_phase,
        "phase_status": _current_phase_status(execution),
        "position_source": execution.last_update_source,
        "device_position_active": bool(
            execution.last_update_source == "DEVICE"
            and primary is not None
            and primary["telemetry_status"] in ("live", "stale")
        ),
        "primary_status": primary["telemetry_status"] if primary else "no_source",
        "machines": items,
        "mqtt": hub.status(),
    }
