# ====================================
# IMPORTS
# ====================================

from backend.repositories.pump_repository import (
    list_pumps,
    get_pump,
    create_pump,
    update_pump,
    delete_pump,
    list_active_pumps_as_dicts
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


PUMP_FIELDS = (
    "code", "name", "hp", "phase", "voltage", "peak_current", "density_range",
    "flow_rate", "type", "max_suction_lift", "max_discharge_head",
    "max_solids_size", "hazard_rating", "power_source", "active"
)


# ====================================
# PUMPS
# ====================================

def list_pumps_request(db):
    return list_pumps(db)


def create_pump_request(db, payload):

    row = create_pump(db, payload)

    record_business_master_change(
        db=db,
        module="Business Masters",
        action="CREATE",
        actor_user_id=payload.actor.user_id,
        actor_name=payload.actor.name,
        actor_role=payload.actor.role,
        title=f"{payload.actor.name} created Pump '{row.code}' in Business Masters",
        changes=[
            {"field": "code", "before": None, "after": row.code},
            {"field": "name", "before": None, "after": row.name}
        ],
        remark=payload.remark
    )

    return row


def update_pump_request(db, pump_id, payload):

    before = get_pump(db, pump_id)

    if not before:
        return None

    fields_sent = [f for f in PUMP_FIELDS if f in payload.model_fields_set]

    changes = _diff_fields(before, payload, fields_sent)

    row = update_pump(db, pump_id, payload)

    if changes:

        record_business_master_change(
            db=db,
            module="Business Masters",
            action="UPDATE",
            actor_user_id=payload.actor.user_id,
            actor_name=payload.actor.name,
            actor_role=payload.actor.role,
            title=f"{payload.actor.name} updated Pump '{row.code}' in Business Masters",
            changes=changes,
            remark=payload.remark
        )

    return row


def delete_pump_request(db, pump_id, actor, remark):

    row = get_pump(db, pump_id)

    if not row:
        return False

    title = f"{actor.name} deleted Pump '{row.code}' from Business Masters"

    changes = [{"field": "code", "before": row.code, "after": None}]

    success = delete_pump(db, pump_id)

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
# OPS ENGINE ADAPTER
# ====================================

def list_active_pumps_for_ops_engine(db):
    return list_active_pumps_as_dicts(db)
