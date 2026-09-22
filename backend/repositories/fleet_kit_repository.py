# ====================================
# IMPORTS
# ====================================

from sqlalchemy import case

from backend.models.fleet_unit import FleetUnit, FleetUnitMachine, FleetUnitPump, FleetUnitAccessory
from backend.models.fleet_schedule import FleetSchedulePump, FleetScheduleAccessory
from backend.models.machine_inventory import MachineInventory
from backend.models.machines_pumps import Machine, Pump, MachinePumpCompatibility
from backend.models.business_masters_pricing import Accessory
from backend.models.job_creation import JobCreation
from backend.models.ops_selector import OpsSelection


# ====================================
# FLEET KIT (Phase 44) + MULTI-MACHINE (Phase 45)
# The compatible pumps and accessories a Fleet Unit is mobilised with,
# stored by id. Two levels - see 061_fleet_kit.sql: the fleet unit's
# standing kit, and the kit chosen for one specific booking. A Fleet
# Unit can also bundle several MACHINES together (061_fleet_unit_
# multi_machine.sql) - some for transport, some for the job itself -
# so every function here that used to resolve "the machine" now
# resolves "every machine in the unit" and aggregates across all of
# them (union of compatible pumps, union of standard accessories).
# This module is the only place either the kit or the machine
# membership is read or written, so fleet_unit_repository and
# fleet_schedule_repository share it without importing each other.
# ====================================

def pump_dict(pump):
    return {"id": pump.id, "code": pump.code, "name": pump.name}


def accessory_dict(accessory):
    return {"id": accessory.id, "name": accessory.name}


# ====================================
# MACHINE MEMBERSHIP
# ====================================

def machine_ids_for_unit(db, fleet_unit_id):

    rows = (
        db.query(FleetUnitMachine)
        .filter(FleetUnitMachine.fleet_unit_id == fleet_unit_id)
        .all()
    )

    return [r.machine_inventory_id for r in rows]


def machine_inventory_rows_for_unit(db, fleet_unit):
    """Every MachineInventory row bundled onto this Fleet Unit, PRIMARY
    first. Falls back to the unit's own machine_inventory_id when it
    has no fleet_unit_machines rows yet (a transient, not-yet-saved
    FleetUnit built in memory only, e.g. by get_kit_options_for_machine
    -style call sites) - never returns nothing for a real machine."""

    machine_ids = machine_ids_for_unit(db, fleet_unit.id) if fleet_unit.id else []

    if not machine_ids and fleet_unit.machine_inventory_id:
        machine_ids = [fleet_unit.machine_inventory_id]

    if not machine_ids:
        return []

    order_expr = case(
        (FleetUnitMachine.role == "PRIMARY", 0),
        else_=1
    )

    return (
        db.query(MachineInventory)
        .outerjoin(
            FleetUnitMachine,
            (FleetUnitMachine.machine_inventory_id == MachineInventory.id)
            & (FleetUnitMachine.fleet_unit_id == fleet_unit.id)
        )
        .filter(MachineInventory.id.in_(machine_ids))
        .order_by(order_expr, MachineInventory.id)
        .all()
    )


# ====================================
# READ - kit
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
# What a Fleet Unit may be given, aggregated across every machine it
# bundles. Pumps: the union of the pumps each bundled machine TYPE is
# compatible with (Machine Specs -> Compatible pumps) - a machine with
# none configured (a plain transport vehicle) simply contributes
# nothing to the union, it never narrows it. Accessories: the whole
# Accessories master (an accessory outside any bundled machine's
# standard set can still be sent along). Defaults: the accessories
# marked "Needed: Yes" on the job's Deployment Plan when a job_id is
# given (that's what was quoted), else the union of every bundled
# machine type's own standard accessory list - each machine's own
# required set, combined.
# ====================================

def machine_types_for_machine_ids(db, machine_inventory_ids):

    if not machine_inventory_ids:
        return []

    inventory_rows = (
        db.query(MachineInventory)
        .filter(MachineInventory.id.in_(machine_inventory_ids))
        .all()
    )

    type_ids = {row.machine_type_id for row in inventory_rows if row.machine_type_id}

    if not type_ids:
        return []

    return db.query(Machine).filter(Machine.id.in_(type_ids)).all()


def compatible_pumps_for_machine_types(db, machine_type_ids):

    machine_type_ids = [i for i in (machine_type_ids or []) if i]

    if not machine_type_ids:
        return []

    return (
        db.query(Pump)
        .join(MachinePumpCompatibility, MachinePumpCompatibility.pump_id == Pump.id)
        .filter(
            MachinePumpCompatibility.machine_id.in_(machine_type_ids),
            Pump.active.is_(True)
        )
        .distinct()
        .order_by(Pump.code)
        .all()
    )


def _default_accessory_ids(db, machine_types, job_id):

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

    if not names:

        seen = set()

        for machine_type in machine_types:
            for name in (machine_type.accessories or []):
                if name not in seen:
                    seen.add(name)
                    names.append(name)

    if not names:
        return []

    rows = db.query(Accessory).filter(Accessory.name.in_(names)).all()

    return [row.id for row in rows]


def kit_options_for_machine_ids(db, machine_inventory_ids, job_id=None):

    machine_types = machine_types_for_machine_ids(db, machine_inventory_ids)

    pumps = compatible_pumps_for_machine_types(db, [mt.id for mt in machine_types])

    accessories = db.query(Accessory).order_by(Accessory.name).all()

    return {
        "machine_type_ids": [mt.id for mt in machine_types],
        "compatible_pumps": [pump_dict(p) for p in pumps],
        "accessories": [accessory_dict(a) for a in accessories],
        "default_accessory_ids": _default_accessory_ids(db, machine_types, job_id),
    }


def kit_options_for_fleet_unit(db, fleet_unit, job_id=None):

    machine_ids = machine_ids_for_unit(db, fleet_unit.id) if fleet_unit.id else []

    if not machine_ids and fleet_unit.machine_inventory_id:
        machine_ids = [fleet_unit.machine_inventory_id]

    return kit_options_for_machine_ids(db, machine_ids, job_id)


# ====================================
# VALIDATE
# require_pump: a booking must name at least one pump when at least
# one machine in the bundle has compatible pumps at all (a unit made
# up entirely of pump-less machines, e.g. the sonar boat, is never
# blocked).
# ====================================

def validate_kit(db, machine_inventory_ids, pump_ids, accessory_ids, require_pump=False):

    pump_ids = list(dict.fromkeys(pump_ids or []))
    accessory_ids = list(dict.fromkeys(accessory_ids or []))

    machine_types = machine_types_for_machine_ids(db, machine_inventory_ids)

    allowed = {p.id for p in compatible_pumps_for_machine_types(db, [mt.id for mt in machine_types])}

    if pump_ids:

        if not machine_types:
            raise ValueError(
                "None of this fleet unit's machines have a machine type assigned yet, "
                "so compatible pumps can't be checked. Set machine types in Machine Inventory first."
            )

        bad = [pid for pid in pump_ids if pid not in allowed]

        if bad:
            raise ValueError(
                "Pump id(s) " + ", ".join(str(b) for b in bad) +
                " are not compatible with any machine in this fleet unit."
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
