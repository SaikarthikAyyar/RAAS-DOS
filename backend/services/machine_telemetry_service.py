# ====================================
# MACHINE TELEMETRY (read-only passthrough)
# The Varaha IoT dashboard team owns machine telemetry - RAAS-DOS only
# READS it from their API and never stores a copy (no duplicate data).
# Nothing here is persisted: bots come from /api/fleet/bots, live
# packets from /api/telemetry/live, matched to our Machine Inventory
# units by model name + unit number.
#
# Built to survive their changes: the machine list is whatever their
# fleet registry returns, and sensor readings are read as an OPEN set of
# keys from each packet's rawPayload - a new sensor shows up
# automatically (under "Other" until it is labelled in METRIC_CATALOG).
# ====================================

import os
import re
import time
from datetime import datetime, timezone

import requests

from backend.models.machine_inventory import MachineInventory
from backend.models.machines_pumps import Machine


# Placeholder default = their Vercel deployment (currently an in-memory
# snapshot, not the live feed). Override with VARAHA_API_BASE_URL once
# the real backend URL is confirmed. VARAHA_API_TOKEN is sent as a
# Bearer token only if set (their API has no auth today).
DEFAULT_BASE_URL = "https://raas-dashboard-beta.vercel.app"
REQUEST_TIMEOUT_SECONDS = 10
CACHE_TTL_SECONDS = 3

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

_cache = {"at": 0.0, "data": None}


# ====================================
# UPSTREAM FETCH
# ====================================

def _base_url():
    return os.getenv("VARAHA_API_BASE_URL", DEFAULT_BASE_URL).rstrip("/")


def _get(path):
    headers = {}
    token = os.getenv("VARAHA_API_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    response = requests.get(_base_url() + path, headers=headers, timeout=REQUEST_TIMEOUT_SECONDS)
    response.raise_for_status()
    return response.json()


def _fetch_upstream():
    now = time.time()
    if _cache["data"] is not None and now - _cache["at"] < CACHE_TTL_SECONDS:
        return _cache["data"]
    bots = _get("/api/fleet/bots").get("data") or []
    live = _get("/api/telemetry/live").get("data") or {}
    data = {"bots": bots, "live": live}
    _cache["at"] = now
    _cache["data"] = data
    return data


# ====================================
# MATCHING (inventory unit -> their bot)
# ====================================

def _norm(text):
    return re.sub(r"[^A-Z0-9]", "", (text or "").upper())


def _model_key(type_code):
    # "VARAHA-SCH-300" -> "SCH-300"; their models drop the brand prefix.
    return re.sub(r"^VARAHA-", "", (type_code or "").upper())


def _unit_number(machine_code):
    match = re.search(r"-M(\d+)$", machine_code or "")
    return int(match.group(1)) if match else None


def match_bot(unit, type_code, bots):
    number = _unit_number(unit.machine_code)
    if number is None:
        return None
    key = _model_key(type_code)

    # 1) exact bot id, e.g. SCH-300 + M1 -> SCH-300-001
    wanted = f"{key}-{number:03d}"
    for bot in bots:
        if (bot.get("id") or "").upper() == wanted:
            return bot

    # 2) same model name, Nth bot of that model (their ids may change)
    same_model = sorted(
        (b for b in bots if _norm(b.get("modelId")) == _norm(key)),
        key=lambda b: b.get("id") or ""
    )
    if number <= len(same_model):
        return same_model[number - 1]
    return None


# ====================================
# SHAPING
# ====================================

def _parse_time(value):
    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except (ValueError, TypeError):
        return None


def _status(bot, packet):
    if bot is None:
        return "no_source", None
    if not packet:
        return "no_data", None
    when = _parse_time(packet.get("timestamp"))
    if when is None:
        return "no_data", None
    if when.tzinfo is None:
        when = when.replace(tzinfo=timezone.utc)
    age = max(0.0, (datetime.now(timezone.utc) - when).total_seconds())
    if age <= LIVE_MAX_AGE_SECONDS:
        return "live", age
    if age <= STALE_MAX_AGE_SECONDS:
        return "stale", age
    return "offline", age


def _build_metrics(packet):
    raw = packet.get("rawPayload") if isinstance(packet.get("rawPayload"), dict) else packet
    groups = {}
    for key, value in raw.items():
        if key in META_KEYS or value is None or isinstance(value, (dict, list)):
            continue
        label, unit, group = METRIC_CATALOG.get(key, (key.replace("_", " ").capitalize(), None, "Other"))
        groups.setdefault(group, []).append({"key": key, "label": label, "unit": unit, "value": value})
    return [{"group": g, "metrics": groups[g]} for g in GROUP_ORDER if g in groups]


# ====================================
# PUBLIC
# ====================================

def get_machine_statistics(db):
    rows = (
        db.query(MachineInventory, Machine)
        .join(Machine, MachineInventory.machine_type_id == Machine.id)
        .filter(Machine.active.is_(True), MachineInventory.status != "RETIRED")
        .order_by(Machine.id, MachineInventory.machine_code)
        .all()
    )

    upstream_error = None
    bots, live = [], {}
    try:
        upstream = _fetch_upstream()
        bots, live = upstream["bots"], upstream["live"]
    except Exception as error:  # upstream down must never break RAAS-DOS
        upstream_error = f"Telemetry API unavailable: {error.__class__.__name__}"

    machines = []
    for unit, machine_type in rows:
        bot = match_bot(unit, machine_type.code, bots)
        packet = live.get(bot["id"]) if bot else None
        state, age = _status(bot, packet)
        machines.append({
            "id": unit.id,
            "machine_code": unit.machine_code,
            "machine_name": unit.machine_name,
            "machine_type": machine_type.name,
            "inventory_status": unit.status,
            "current_site": unit.current_site,
            "telemetry_status": state,
            "bot_id": bot["id"] if bot else None,
            "last_seen": packet.get("timestamp") if packet else None,
            "age_seconds": age,
            "metric_groups": _build_metrics(packet) if packet else [],
        })

    return {
        "source": _base_url(),
        "error": upstream_error,
        "machines": machines,
    }


# ====================================
# PER-MACHINE DETAIL (live values + history for the dashboard view)
# ====================================

HISTORY_LIMIT = 500


def _flat_values(packet):
    raw = packet.get("rawPayload") if isinstance(packet.get("rawPayload"), dict) else packet
    return {
        key: value for key, value in raw.items()
        if key not in META_KEYS and value is not None and not isinstance(value, (dict, list))
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

    error = None
    bot, packet, history = None, None, []
    try:
        upstream = _fetch_upstream()
        bot = match_bot(unit, machine_type.code, upstream["bots"])
        packet = upstream["live"].get(bot["id"]) if bot else None
        if bot:
            records = _get(f"/api/telemetry/history/{bot['id']}?limit={HISTORY_LIMIT}").get("data") or []
            history = [
                {"timestamp": r.get("timestamp"), "values": _flat_values(r)}
                for r in records if r.get("timestamp")
            ]
    except Exception as exc:  # upstream down must never break RAAS-DOS
        error = f"Telemetry API unavailable: {exc.__class__.__name__}"

    state, age = _status(bot, packet)
    return {
        "id": unit.id,
        "machine_code": unit.machine_code,
        "machine_name": unit.machine_name,
        "machine_type_code": machine_type.code,
        "machine_type": machine_type.name,
        "inventory_status": unit.status,
        "current_site": unit.current_site,
        "family": bot.get("familyId") if bot else None,
        "bot_id": bot["id"] if bot else None,
        "telemetry_status": state,
        "age_seconds": age,
        "last_seen": packet.get("timestamp") if packet else None,
        "values": _flat_values(packet) if packet else {},
        "history": history,
        "error": error,
    }
