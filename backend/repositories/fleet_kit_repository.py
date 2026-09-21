# ====================================
# IMPORTS
# ====================================

from backend.models.fleet_unit import FleetUnit, FleetUnitPump, FleetUnitAccessory
from backend.models.fleet_schedule import FleetSchedulePump, FleetScheduleAccessory
from backend.models.machine_inventory import MachineInventory
from backend.models.machines_pumps import Machine, Pump, MachinePumpCompatibility
from backend.models.business_masters_pricing import Accessory
from backend.models.job_creation import JobCreation
from backend.models.ops_selector import OpsSelection


# ====================================
# FLEET KIT (Phase 44)
# The compatible pumps and accessories a machine is mobilised with,
# stored by id. Two levels - see 061_fleet_kit.sql: the fleet unit's
# standing kit, and the kit chosen for one specific booking. This
# module is the only place either is read or written, so
# fleet_unit_repository and fleet_schedule_repository share it without
# importing each other.
# ====================================

def pump_dict(pump):
    return {"id": pump.id, "code": pump.code, "name": pump.name}


def accessory_dict(accessory):
    return {"id": accessory.id, "name": accessory.name}


# ====================================
# READ
# ====================================

def unit_kit(db, fleet_unit_id):

    pumps = (
        db.query(Pump)
        .join(FleetUnitPump, FleetUnitPump.pump_id == Pump.id)
        .filter(FleetUnitPump.fleet_unit_id == fleet_unit_id)
        .order_by(Pump.code)
        .all()
    )

    accessories = (
        db.query(Accessory)
        .join(FleetUnitAccessory, FleetUnitAccessory.accessory_id == Accessory.id)
        .filter(FleetUnitAccessory.fleet_unit_id == fleet_unit_id)
        .order_by(Accessory.name)
        .all()
    )

    return {
        "pumps": [pump_dict(p) for p in pumps],
        "accessories": [accessory_dict(a) for a in accessories],
    }


def schedule_kit(db, fleet_schedule_id):

    pumps = (
        db.query(Pump)
        .join(FleetSchedulePump, FleetSchedulePump.pump_id == Pump.id)
        .filter(FleetSchedulePump.fleet_schedule_id == fleet_schedule_id)
        .order_by(Pump.code)
        .all()
    )

    accessories = (
        db.query(Accessory)
        .join(FleetScheduleAccessory, FleetScheduleAccessory.accessory_id == Accessory.id)
        .filter(FleetScheduleAccessory.fleet_schedule_id == fleet_schedule_id)
        .order_by(Accessory.name)
        .all()
    )

    return {
        "pumps": [pump_dict(p) for p in pumps],
        "accessories": [accessory_dict(a) for a in accessories],
    }


# ====================================
# OPTIONS
# What a fleet unit may be given. Pumps: only those the machine TYPE
# is compatible with (Machine Specs -> Compatible pumps). Accessories:
# the whole Accessories master (an accessory outside the machine's
# standard set can still be sent along). Defaults: the accessories
# marked "Needed: Yes" on the job's Deployment Plan when a job_id is
# given (that's what was quoted), else the machine type's own standard
# accessory list.
# ====================================

def _machine_type_for_unit(db, fleet_unit):

    inventory = (
        db.query(MachineInventory)
        .filter(MachineInventory.id == fleet_unit.machine_inventory_id)
        .first()
    )

    if inventory is None or inventory.machine_type_id is None:
        return None

    return db.query(Machine).filter(Machine.id == inventory.machine_type_id).first()


def compatible_pumps_for_machine_type(db, machine_type_id):

    if machine_type_id is None:
        return []

    return (
        db.query(Pump)
        .join(MachinePumpCompatibility, MachinePumpCompatibility.pump_id == Pump.id)
        .filter(
            MachinePumpCompatibility.machine_id == machine_type_id,
            Pump.active.is_(True)
        )
        .order_by(Pump.code)
        .all()
    )


def _default_accessory_ids(db, machine_type, job_id):

    names = []

    if job_id is not None:

        job = db.query(JobCreation).filter(JobCreation.id == job_id).first()

        ops = (
            db.query(OpsSelection).filter(OpsSelection.id == job.ops_selection_id).first()
            if job is not None and job.ops_selection_id
            else None
        )

        if ops is not None:
            names = [
                row.get("name")
                for row in (ops.accessories_plan or [])
                if row.get("needed") == "Yes"
            ]

    if not names and machine_type is not None:
        names = list(machine_type.accessories or [])

    if not names:
        return []

    rows = db.query(Accessory).filter(Accessory.name.in_(names)).all()

    return [row.id for row in rows]


def kit_options_for_fleet_unit(db, fleet_unit, job_id=None):

    machine_type = _machine_type_for_unit(db, fleet_unit)

    pumps = compatible_pumps_for_machine_type(db, machine_type.id if machine_type else None)

    accessories = db.query(Accessory).order_by(Accessory.name).all()

    return {
        "machine_type_id": machine_type.id if machine_type else None,
        "compatible_pumps": [pump_dict(p) for p in pumps],
        "accessories": [accessory_dict(a) for a in accessories],
        "default_accessory_ids": _default_accessory_ids(db, machine_type, job_id),
    }


# ====================================
# VALIDATE
# require_pump: a booking must name at least one pump when the machine
# has compatible pumps at all (a pump-less machine such as the sonar
# boat is never blocked). Business Masters edits don't require one.
# ====================================

def validate_kit(db, fleet_unit, pump_ids, accessory_ids, require_pump=False):

    pump_ids = list(dict.fromkeys(pump_ids or []))
    accessory_ids = list(dict.fromkeys(accessory_ids or []))

    machine_type = _machine_type_for_unit(db, fleet_unit)

    allowed = {p.id for p in compatible_pumps_for_machine_type(db, machine_type.id if machine_type else None)}

    if pump_ids:

        if machine_type is None:
            raise ValueError(
                "This fleet unit's machine has no machine type assigned yet, so "
                "compatible pumps can't be checked. Set its type in Machine Inventory first."
            )

        bad = [pid for pid in pump_ids if pid not in allowed]

        if bad:
            raise ValueError(
                "Pump id(s) " + ", ".join(str(b) for b in bad) +
                " are not compatible with this machine."
            )

    elif require_pump and allowed:
        raise ValueError("Select at least one compatible pump to take along.")

    if accessory_ids:

        found = {
            row.id
            for row in db.query(Accessory.id).filter(Accessory.id.in_(accessory_ids)).all()
        }

        missing = [aid for aid in accessory_ids if aid not in found]

        if missing:
            raise ValueError(
                "Accessory id(s) " + ", ".join(str(m) for m in missing) + " do not exist."
            )

    return pump_ids, accessory_ids


# ====================================
# WRITE - replace-all, same delete-then-reinsert pattern as set_crew.
# None means "leave as is" so a partial update never wipes a kit.
# ====================================

def set_unit_kit(db, fleet_unit_id, pump_ids=None, accessory_ids=None):

    if pump_ids is not None:
        db.query(FleetUnitPump).filter(FleetUnitPump.fleet_unit_id == fleet_unit_id).delete()
        for pid in dict.fromkeys(pump_ids):
            db.add(FleetUnitPump(fleet_unit_id=fleet_unit_id, pump_id=pid))

    if accessory_ids is not None:
        db.query(FleetUnitAccessory).filter(FleetUnitAccessory.fleet_unit_id == fleet_unit_id).delete()
        for aid in dict.fromkeys(accessory_ids):
            db.add(FleetUnitAccessory(fleet_unit_id=fleet_unit_id, accessory_id=aid))

    # This session runs with autoflush=False (database/connection.py):
    # without an explicit flush, a read straight after a write
    # (apply_kit_to_fleet_unit reading the booking's kit it just wrote)
    # sees the OLD rows and silently copies an empty kit.
    db.flush()


def set_schedule_kit(db, fleet_schedule_id, pump_ids=None, accessory_ids=None):

    if pump_ids is not None:
        db.query(FleetSchedulePump).filter(FleetSchedulePump.fleet_schedule_id == fleet_schedule_id).delete()
        for pid in dict.fromkeys(pump_ids):
            db.add(FleetSchedulePump(fleet_schedule_id=fleet_schedule_id, pump_id=pid))

    if accessory_ids is not None:
        db.query(FleetScheduleAccessory).filter(FleetScheduleAccessory.fleet_schedule_id == fleet_schedule_id).delete()
        for aid in dict.fromkeys(accessory_ids):
            db.add(FleetScheduleAccessory(fleet_schedule_id=fleet_schedule_id, accessory_id=aid))

    db.flush()


def apply_kit_to_fleet_unit(db, fleet_unit_id, fleet_schedule_id, only_if_present=False):
    """Make a booking's kit the unit's standing kit. Called when that
    booking becomes the live one (booked at queue position 1, promoted
    after the job ahead completes, or its kit edited while live).

    only_if_present: skip when the booking carries no kit at all - a
    booking made before kits existed must not wipe the unit's kit the
    moment it is promoted."""

    kit = schedule_kit(db, fleet_schedule_id)

    if only_if_present and not kit["pumps"] and not kit["accessories"]:
        return

    set_unit_kit(
        db,
        fleet_unit_id,
        pump_ids=[p["id"] for p in kit["pumps"]],
        accessory_ids=[a["id"] for a in kit["accessories"]],
    )
