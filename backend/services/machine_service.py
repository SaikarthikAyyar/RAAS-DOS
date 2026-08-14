# ====================================
# IMPORTS
# ====================================

from backend.repositories.machine_repository import (
    list_machines,
    get_machine,
    create_machine,
    update_machine,
    delete_machine,
    list_active_machines_as_dicts
)

from backend.repositories.notification_repository import record_business_master_change


# ====================================
# DIFF HELPER
# ====================================

def _diff_fields(before_row, payload, field_names):

    changes = []

    for field in field_names:

        before = getattr(before_row, field)
        after = getattr(payload, field)

        if before != after:
            changes.append({"field": field, "before": before, "after": after})

    return changes


MACHINE_FIELDS = (
    "code", "name", "service_configuration", "power_type",
    "minimum_width", "minimum_height", "base_output_per_day", "base_output_basis",
    "recommended_max_volume", "pump_package", "hose_size", "preferred_job_types", "preferred_materials",
    "debris_tolerance", "setup_complexity", "crew", "approval_gate", "accessories",
    "description", "rate", "material_construction", "max_operating_temp",
    "hazard_rating", "max_vertical_lift", "crane_required", "vehicle",
    "vehicle_payload", "dims", "weight", "hubs_available", "active"
)


# ====================================
# MACHINES
# ====================================

def list_machines_request(db):
    return list_machines(db)


def create_machine_request(db, payload):

    row = create_machine(db, payload)

    record_business_master_change(
        db=db,
        module="Business Masters",
        action="CREATE",
        actor_user_id=payload.actor.user_id,
        actor_name=payload.actor.name,
        actor_role=payload.actor.role,
        title=f"{payload.actor.name} created Machine '{row.code}' in Business Masters",
        changes=[
            {"field": "code", "before": None, "after": row.code},
            {"field": "name", "before": None, "after": row.name}
        ],
        remark=payload.remark
    )

    return row


def update_machine_request(db, machine_id, payload):

    before = get_machine(db, machine_id)

    if not before:
        return None

    fields_sent = [f for f in MACHINE_FIELDS if f in payload.model_fields_set]

    changes = _diff_fields(before, payload, fields_sent)

    row = update_machine(db, machine_id, payload)

    if changes:

        record_business_master_change(
            db=db,
            module="Business Masters",
            action="UPDATE",
            actor_user_id=payload.actor.user_id,
            actor_name=payload.actor.name,
            actor_role=payload.actor.role,
            title=f"{payload.actor.name} updated Machine '{row.code}' in Business Masters",
            changes=changes,
            remark=payload.remark
        )

    return row


def delete_machine_request(db, machine_id, actor, remark):

    row = get_machine(db, machine_id)

    if not row:
        return False

    title = f"{actor.name} deleted Machine '{row.code}' from Business Masters"

    changes = [{"field": "code", "before": row.code, "after": None}]

    success = delete_machine(db, machine_id)

    if success:

        record_business_master_change(
            db=db,
            module="Business Masters",
            action="DELETE",
            actor_user_id=actor.user_id,
            actor_name=actor.name,
            actor_role=actor.role,
            title=title,
            changes=changes,
            remark=remark
        )

    return success


# ====================================
# OPS ENGINE ADAPTER (no notification -
# a plain read used by the Ops Selector,
# not a Business Masters mutation)
# ====================================

def list_active_machines_for_ops_engine(db):
    return list_active_machines_as_dicts(db)
