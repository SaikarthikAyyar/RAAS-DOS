# ====================================
# IMPORTS
# ====================================

from backend.models.machines_pumps import Machine, Pump, MachinePumpCompatibility


# ====================================
# COMPATIBLE PUMP CODES (derived, not a
# raw column - attached as a plain
# attribute so Pydantic's from_attributes
# reads it via getattr, same pattern
# already used for aging_display etc.)
# ====================================

def _attach_compatible_pump_codes(db, machine):

    codes = (
        db.query(Pump.code)
        .join(MachinePumpCompatibility, MachinePumpCompatibility.pump_id == Pump.id)
        .filter(MachinePumpCompatibility.machine_id == machine.id)
        .order_by(Pump.code)
        .all()
    )

    machine.compatible_pump_codes = [c[0] for c in codes]

    return machine


def _set_compatible_pumps(db, machine_id, pump_ids):

    db.query(MachinePumpCompatibility).filter(
        MachinePumpCompatibility.machine_id == machine_id
    ).delete()

    for pump_id in pump_ids:
        db.add(MachinePumpCompatibility(machine_id=machine_id, pump_id=pump_id))


# ====================================
# MACHINES
# ====================================

def list_machines(db):

    rows = db.query(Machine).order_by(Machine.code).all()

    for row in rows:
        _attach_compatible_pump_codes(db, row)

    return rows


def list_active_machines(db):
    # Ordered by id (insertion order), not code - the seed migration
    # inserted rows in the exact same order backend/data/machine_library.py's
    # MACHINE_LIBRARY list had them in, and score_all_machines' stable sort
    # means a genuine score tie is broken by list position - preserving
    # insertion order here is what keeps tie-break outcomes byte-identical
    # to pre-migration behavior. The admin-facing list_machines() above
    # stays alphabetical by code, which is purely a display/UX choice with
    # no bearing on the Ops Engine.
    return db.query(Machine).filter(Machine.active.is_(True)).order_by(Machine.id).all()


def get_machine(db, machine_id):

    row = db.query(Machine).filter(Machine.id == machine_id).first()

    if row:
        _attach_compatible_pump_codes(db, row)

    return row


# actor/remark/compatible_pump_ids ride along on the payload for the
# notification layer and the join table respectively - excluded from
# the ORM constructor/setattr loop (same reasoning as hub_repository.py).
def create_machine(db, payload):

    data = payload.model_dump(exclude={"actor", "remark", "compatible_pump_ids"})

    row = Machine(**data)
    db.add(row)
    db.commit()
    db.refresh(row)

    if payload.compatible_pump_ids:
        _set_compatible_pumps(db, row.id, payload.compatible_pump_ids)
        db.commit()

    _attach_compatible_pump_codes(db, row)

    return row


def update_machine(db, machine_id, payload):

    row = db.query(Machine).filter(Machine.id == machine_id).first()

    if not row:
        return None

    updates = payload.model_dump(
        exclude_unset=True,
        exclude={"actor", "remark", "compatible_pump_ids"}
    )

    for field, value in updates.items():
        setattr(row, field, value)

    if "compatible_pump_ids" in payload.model_fields_set:
        _set_compatible_pumps(db, machine_id, payload.compatible_pump_ids or [])

    db.commit()
    db.refresh(row)

    _attach_compatible_pump_codes(db, row)

    return row


def delete_machine(db, machine_id):

    row = db.query(Machine).filter(Machine.id == machine_id).first()

    if not row:
        return False

    db.delete(row)
    db.commit()

    return True


# ====================================
# HUB AVAILABILITY (derived, per machine TYPE)
# Hub ownership now lives on Machine Inventory (a real per-UNIT home
# hub), not on this spec catalog's own hubs_available column anymore -
# that column is frozen going forward (kept non-destructively, still
# readable, just no longer edited from the Machine Specs tab). Ops
# Engine's hub_fit scoring still needs a real, live answer to "is this
# machine TYPE stationed at hub X", so it's derived here instead: a
# type counts as available at a hub if any of its real, non-retired
# physical units currently has that hub set.
# ====================================

def _hubs_available_by_machine_type_id(db):

    from backend.models.machine_inventory import MachineInventory
    from backend.models.hub import Hub

    rows = (
        db.query(MachineInventory.machine_type_id, Hub.hub_name)
        .join(Hub, Hub.id == MachineInventory.hub_id)
        .filter(
            MachineInventory.machine_type_id.isnot(None),
            MachineInventory.status != "RETIRED"
        )
        .distinct()
        .all()
    )

    result = {}

    for machine_type_id, hub_name in rows:
        result.setdefault(machine_type_id, []).append(hub_name)

    return result


# ====================================
# OPS ENGINE ADAPTER
# Converts active Machine rows into plain dicts using the exact same
# key names backend/data/machine_library.py's MACHINE_LIBRARY entries
# already use, plus the new spec fields - this is what lets ops_engine.py's
# existing .get("...") calls keep working completely unmodified while the
# data source underneath swaps from a hardcoded constant to the DB.
# ====================================

def list_active_machines_as_dicts(db):

    rows = list_active_machines(db)

    hubs_available_by_type = _hubs_available_by_machine_type_id(db)

    machines = []

    for row in rows:

        _attach_compatible_pump_codes(db, row)

        machines.append({
            "code": row.code,
            "name": row.name,
            "service_configuration": row.service_configuration,
            "power_type": row.power_type,
            "minimum_width": float(row.minimum_width) if row.minimum_width is not None else 0,
            "minimum_height": float(row.minimum_height) if row.minimum_height is not None else 0,
            "base_output_per_day": float(row.base_output_per_day) if row.base_output_per_day is not None else 0,
            "recommended_max_volume": float(row.recommended_max_volume) if row.recommended_max_volume is not None else 0,
            "pump_package": row.pump_package,
            "hose_size": row.hose_size,
            "preferred_job_types": row.preferred_job_types or [],
            "preferred_materials": row.preferred_materials or [],
            "debris_tolerance": row.debris_tolerance,
            "setup_complexity": row.setup_complexity,
            "crew": row.crew,
            "approval_gate": row.approval_gate,
            "accessories": row.accessories or [],
            "description": row.description,
            "active": row.active,
            "rate": float(row.rate) if row.rate is not None else None,
            "material_construction": row.material_construction,
            "max_operating_temp": float(row.max_operating_temp) if row.max_operating_temp is not None else None,
            "hazard_rating": row.hazard_rating,
            "max_vertical_lift": float(row.max_vertical_lift) if row.max_vertical_lift is not None else None,
            "crane_required": row.crane_required,
            "hubs_available": hubs_available_by_type.get(row.id, []),
            "compatible_pump_codes": row.compatible_pump_codes
        })

    return machines
