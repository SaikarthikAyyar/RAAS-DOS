# ====================================
# IMPORTS
# ====================================

from backend.models.fleet_unit import FleetUnit, FleetUnitPersonnel, FleetUnitMachine
from backend.models.machine_inventory import MachineInventory
from backend.models.personnel import Personnel
from backend.models.hub import Hub

from backend.repositories.fleet_kit_repository import (
    unit_kit,
    set_unit_kit,
    validate_kit,
    machine_ids_for_unit,
    machine_types_for_machine_ids,
    compatible_pumps_for_machine_types
)


# ====================================
# READS
# ====================================

def list_fleet_units(db):
    return db.query(FleetUnit).order_by(FleetUnit.fleet_code).all()


def get_fleet_unit(db, fleet_unit_id):
    return db.query(FleetUnit).filter(FleetUnit.id == fleet_unit_id).first()


def list_crew(db, fleet_unit_id):

    rows = (
        db.query(Personnel)
        .join(FleetUnitPersonnel, FleetUnitPersonnel.personnel_id == Personnel.id)
        .filter(FleetUnitPersonnel.fleet_unit_id == fleet_unit_id)
        .all()
    )

    return rows


# ====================================
# MACHINE MEMBERSHIP (Phase 45)
# A Fleet Unit bundles one or more real machines - some for the job,
# some just for transport/support - booked and released together
# (see fleet_schedule_repository.py). Exactly one is PRIMARY: the
# machine that actually does the job, which is what drives pump
# compatibility, service configuration, etc. elsewhere in the app.
# ====================================

def list_machines_for_unit(db, fleet_unit_id):

    rows = (
        db.query(FleetUnitMachine, MachineInventory)
        .join(MachineInventory, MachineInventory.id == FleetUnitMachine.machine_inventory_id)
        .filter(FleetUnitMachine.fleet_unit_id == fleet_unit_id)
        .all()
    )

    # PRIMARY first, then by machine code - done in Python rather than
    # a SQL CASE so this reads identically regardless of dialect.
    rows.sort(key=lambda pair: (0 if pair[0].role == "PRIMARY" else 1, pair[1].machine_code or ""))

    hub_ids = {m.hub_id for _, m in rows if m.hub_id}
    hubs_by_id = {h.id: h for h in db.query(Hub).filter(Hub.id.in_(hub_ids)).all()} if hub_ids else {}

    return [
        {
            "id": m.id,
            "machine_code": m.machine_code,
            "machine_name": m.machine_name,
            "role": fum.role,
            "hub_id": m.hub_id,
            "hub_name": hubs_by_id[m.hub_id].hub_name if m.hub_id in hubs_by_id else None,
            "current_site": m.current_site
        }
        for fum, m in rows
    ]


def set_unit_machines(db, fleet_unit_id, machine_ids, primary_machine_id):
    """Replace-all, same delete-then-reinsert pattern as set_crew. A
    unit always needs at least one machine, and the primary must be
    one of the machines actually being kept."""

    machine_ids = list(dict.fromkeys(machine_ids or []))

    if not machine_ids:
        raise ValueError("A fleet unit needs at least one machine.")

    if primary_machine_id not in machine_ids:
        raise ValueError("The primary machine must be one of the selected machines.")

    found = {
        row.id
        for row in db.query(MachineInventory.id).filter(MachineInventory.id.in_(machine_ids)).all()
    }

    missing = [m for m in machine_ids if m not in found]

    if missing:
        raise ValueError("Machine id(s) " + ", ".join(str(m) for m in missing) + " do not exist.")

    db.query(FleetUnitMachine).filter(FleetUnitMachine.fleet_unit_id == fleet_unit_id).delete()

    for machine_id in machine_ids:
        db.add(FleetUnitMachine(
            fleet_unit_id=fleet_unit_id,
            machine_inventory_id=machine_id,
            role="PRIMARY" if machine_id == primary_machine_id else "SUPPORT"
        ))

    # fleet_units.machine_inventory_id predates multi-machine bundling
    # and is NOT NULL - every place that hasn't been updated to read
    # the real membership above still finds a sensible single machine
    # here, always the current primary.
    fleet_unit = db.query(FleetUnit).filter(FleetUnit.id == fleet_unit_id).first()

    if fleet_unit is not None:
        fleet_unit.machine_inventory_id = primary_machine_id

    db.flush()


# ====================================
# RESPONSE ASSEMBLY
# Resolves the full machine bundle, hub and crew - a Fleet Unit's own
# columns only hold ids, matching the same "build the display dict in
# the service/repository layer" convention already used for Hub's
# resolved approver lists. machine_inventory_id/machine_code/
# machine_name/hub_* on the returned dict describe the PRIMARY machine
# only, kept for whatever hasn't moved to reading the full "machines"
# list yet; "machines" is the real, complete membership.
# ====================================

def build_fleet_unit_dict(db, fleet_unit):

    machines = list_machines_for_unit(db, fleet_unit.id)
    primary = next((m for m in machines if m["role"] == "PRIMARY"), machines[0] if machines else None)

    crew = list_crew(db, fleet_unit.id)

    kit = unit_kit(db, fleet_unit.id)

    return {
        "id": fleet_unit.id,
        "fleet_code": fleet_unit.fleet_code,
        "fleet_name": fleet_unit.fleet_name,
        "active": fleet_unit.active,
        "machine_inventory_id": primary["id"] if primary else fleet_unit.machine_inventory_id,
        "machine_code": primary["machine_code"] if primary else None,
        "machine_name": primary["machine_name"] if primary else None,
        "hub_id": primary["hub_id"] if primary else None,
        "hub_name": primary["hub_name"] if primary else None,
        # Resolved live from the linked Machine Inventory rows, never
        # stored on fleet_units itself - matches current_site's own
        # real-time-updated nature (set by the booking/dequeue flow
        # today, a real GPS/telemetry feed later) rather than freezing
        # a copy that could go stale the moment a machine moves.
        "current_location": primary["current_site"] if primary else None,
        # Phase 45 - every machine this unit bundles, PRIMARY first,
        # each with its own code/name/hub/current site.
        "machines": machines,
        "crew": [
            {"id": p.id, "full_name": p.full_name, "designation": p.designation}
            for p in crew
        ],
        # Phase 44 - the pumps/accessories this unit is currently
        # mobilised with, each with its id. Changed by the booking that
        # is live on the unit, or edited in Business Masters.
        "pumps": kit["pumps"],
        "accessories": kit["accessories"]
    }


# ====================================
# SUPPORT: machine list for the "pick machines" multi-select
# A real Machine Inventory Business Master (Phase 20B) doesn't exist
# yet - this is a minimal listing, scoped to what the Fleet Units tab
# needs, not a stand-in for that future module.
# ====================================

def list_all_machines(db):
    # RETIRED units (the old, superseded fictional catalog - kept in
    # place non-destructively, never deleted) are excluded here so new
    # Fleet Unit bookings only ever target the real, current fleet.
    # They still appear in the Machine Inventory tab itself.
    return (
        db.query(MachineInventory)
        .filter(MachineInventory.status != "RETIRED")
        .order_by(MachineInventory.machine_code)
        .all()
    )


# ====================================
# CREW - replace-all semantics, same "delete then reinsert" pattern
# already used for Hub<->approver and Machine<->Pump compatibility.
# ====================================

def set_crew(db, fleet_unit_id, personnel_ids):

    db.query(FleetUnitPersonnel).filter(
        FleetUnitPersonnel.fleet_unit_id == fleet_unit_id
    ).delete()

    for personnel_id in personnel_ids or []:
        db.add(FleetUnitPersonnel(fleet_unit_id=fleet_unit_id, personnel_id=personnel_id))


# ====================================
# CREATE / UPDATE / DELETE (33C, extended 45 for multi-machine)
# ====================================

_FLEET_UNIT_PAYLOAD_EXCLUDE = {
    "actor", "remark", "crew_personnel_ids", "pump_ids", "accessory_ids",
    "machine_ids", "primary_machine_id"
}


def create_fleet_unit(db, payload):

    row = FleetUnit(
        fleet_code=payload.fleet_code,
        fleet_name=payload.fleet_name,
        # NOT NULL column - seeded here from the chosen primary, then
        # kept in sync by set_unit_machines below and on every later
        # update.
        machine_inventory_id=payload.primary_machine_id,
        hub_id=payload.hub_id,
        active=payload.active
    )

    # Validate against the machine bundle BEFORE anything is written.
    pump_ids, accessory_ids = validate_kit(db, payload.machine_ids, payload.pump_ids, payload.accessory_ids)

    db.add(row)
    db.commit()
    db.refresh(row)

    set_unit_machines(db, row.id, payload.machine_ids, payload.primary_machine_id)

    if payload.crew_personnel_ids:
        set_crew(db, row.id, payload.crew_personnel_ids)

    set_unit_kit(db, row.id, pump_ids, accessory_ids)

    db.commit()
    db.refresh(row)

    return row


def update_fleet_unit(db, fleet_unit_id, payload):

    row = get_fleet_unit(db, fleet_unit_id)
    if not row:
        return None

    machines_changed = "machine_ids" in payload.model_fields_set

    for field, value in payload.model_dump(exclude_unset=True, exclude=_FLEET_UNIT_PAYLOAD_EXCLUDE).items():
        setattr(row, field, value)

    if machines_changed:

        primary_machine_id = payload.primary_machine_id or (
            payload.machine_ids[0] if payload.machine_ids else None
        )

        set_unit_machines(db, fleet_unit_id, payload.machine_ids, primary_machine_id)

    if "crew_personnel_ids" in payload.model_fields_set:
        set_crew(db, fleet_unit_id, payload.crew_personnel_ids or [])

    # Kit (Phase 44/45). Validated against the unit's machine bundle AS
    # IT WILL BE after this update. If the bundle changed and no new
    # pump list was sent, pumps that no longer fit any remaining
    # machine are dropped rather than left carrying an incompatible one.
    pump_ids = payload.pump_ids if "pump_ids" in payload.model_fields_set else None
    accessory_ids = payload.accessory_ids if "accessory_ids" in payload.model_fields_set else None

    current_machine_ids = machine_ids_for_unit(db, fleet_unit_id)

    if pump_ids is None and machines_changed:
        machine_types = machine_types_for_machine_ids(db, current_machine_ids)
        allowed = {p.id for p in compatible_pumps_for_machine_types(db, [mt.id for mt in machine_types])}
        pump_ids = [p["id"] for p in unit_kit(db, fleet_unit_id)["pumps"] if p["id"] in allowed]

    if pump_ids is not None or accessory_ids is not None:

        checked_pumps, checked_accessories = validate_kit(db, current_machine_ids, pump_ids, accessory_ids)

        set_unit_kit(
            db,
            fleet_unit_id,
            checked_pumps if pump_ids is not None else None,
            checked_accessories if accessory_ids is not None else None
        )

    db.commit()
    db.refresh(row)

    return row


def delete_fleet_unit(db, fleet_unit_id):

    row = db.query(FleetUnit).filter(FleetUnit.id == fleet_unit_id).first()
    if not row:
        return False

    db.delete(row)
    db.commit()

    return True


# ====================================
# SEED
# One Fleet Unit per already-seeded machine_inventory row, as its sole
# PRIMARY machine - nominal crew and any extra bundled machines defined
# later via 33C/45's CRUD tab. Idempotent, same "if existing: return"
# pattern already used by seed_machine_inventory/seed_personnel.
# ====================================

def seed_fleet_units(db):

    existing = db.query(FleetUnit).first()
    if existing:
        return

    machines = db.query(MachineInventory).order_by(MachineInventory.id).all()

    for machine in machines:

        fleet_code = f"FU-{machine.id:03d}"

        row = FleetUnit(
            fleet_code=fleet_code,
            fleet_name=machine.machine_name,
            machine_inventory_id=machine.id,
            hub_id=None,
            active=True
        )

        db.add(row)
        db.flush()

        db.add(FleetUnitMachine(
            fleet_unit_id=row.id,
            machine_inventory_id=machine.id,
            role="PRIMARY"
        ))

    db.commit()
