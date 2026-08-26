# ====================================
# IMPORTS
# ====================================

from backend.models.fleet_unit import FleetUnit, FleetUnitPersonnel
from backend.models.machine_inventory import MachineInventory
from backend.models.personnel import Personnel
from backend.models.hub import Hub


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
# RESPONSE ASSEMBLY
# Resolves machine code/name and hub name - a Fleet Unit's own
# columns only hold the FKs, matching the same "build the display
# dict in the service/repository layer" convention already used for
# Hub's resolved approver lists.
# ====================================

def build_fleet_unit_dict(db, fleet_unit):

    machine = db.query(MachineInventory).filter(
        MachineInventory.id == fleet_unit.machine_inventory_id
    ).first()

    hub = None
    if fleet_unit.hub_id:
        hub = db.query(Hub).filter(Hub.id == fleet_unit.hub_id).first()

    crew = list_crew(db, fleet_unit.id)

    return {
        "id": fleet_unit.id,
        "fleet_code": fleet_unit.fleet_code,
        "fleet_name": fleet_unit.fleet_name,
        "active": fleet_unit.active,
        "machine_inventory_id": fleet_unit.machine_inventory_id,
        "machine_code": machine.machine_code if machine else None,
        "machine_name": machine.machine_name if machine else None,
        "hub_id": fleet_unit.hub_id,
        "hub_name": hub.hub_name if hub else None,
        # Resolved live from the linked Machine Inventory row, never
        # stored on fleet_units itself - matches current_site's own
        # real-time-updated nature (set by the booking/dequeue flow
        # today, a real GPS/telemetry feed later) rather than freezing
        # a copy that could go stale the moment the machine moves.
        "current_location": machine.current_site if machine else None,
        "crew": [
            {"id": p.id, "full_name": p.full_name, "designation": p.designation}
            for p in crew
        ]
    }


# ====================================
# SUPPORT: machine list for the "pick a machine" dropdown
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
# CREATE / UPDATE / DELETE (33C)
# ====================================

_FLEET_UNIT_PAYLOAD_EXCLUDE = {"actor", "remark", "crew_personnel_ids"}


def create_fleet_unit(db, payload):

    row = FleetUnit(**payload.model_dump(exclude=_FLEET_UNIT_PAYLOAD_EXCLUDE))
    db.add(row)
    db.commit()
    db.refresh(row)

    if payload.crew_personnel_ids:
        set_crew(db, row.id, payload.crew_personnel_ids)
        db.commit()

    return row


def update_fleet_unit(db, fleet_unit_id, payload):

    row = get_fleet_unit(db, fleet_unit_id)
    if not row:
        return None

    for field, value in payload.model_dump(exclude_unset=True, exclude=_FLEET_UNIT_PAYLOAD_EXCLUDE).items():
        setattr(row, field, value)

    if "crew_personnel_ids" in payload.model_fields_set:
        set_crew(db, fleet_unit_id, payload.crew_personnel_ids or [])

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
# One Fleet Unit per already-seeded machine_inventory row - nominal
# crew left empty, defined later via 33C's CRUD tab. Idempotent, same
# "if existing: return" pattern already used by
# seed_machine_inventory/seed_personnel.
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

    db.commit()
