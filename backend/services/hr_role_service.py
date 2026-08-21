# ====================================
# IMPORTS
# ====================================

from backend.repositories.hr_role_repository import (
    list_hr_roles,
    get_hr_role,
    create_hr_role,
    update_hr_role,
    delete_hr_role
)

from backend.repositories.notification_repository import record_business_master_change


def list_hr_roles_request(db):
    return list_hr_roles(db)


def create_hr_role_request(db, payload):

    row = create_hr_role(db, payload)

    record_business_master_change(
        db=db,
        module="Business Masters",
        action="CREATE",
        actor_user_id=payload.actor.user_id,
        actor_name=payload.actor.name,
        actor_role=payload.actor.role,
        title=f"{payload.actor.name} added HR role '{row.role}' in Business Masters",
        changes=[
            {"field": "role", "before": None, "after": row.role},
            {"field": "day_rate", "before": None, "after": float(row.day_rate)}
        ],
        remark=payload.remark
    )

    return row


def update_hr_role_request(db, hr_role_id, payload):

    before = get_hr_role(db, hr_role_id)

    if not before:
        return None

    before_role, before_rate = before.role, float(before.day_rate)

    row = update_hr_role(db, hr_role_id, payload)

    changes = []

    if "role" in payload.model_fields_set and payload.role != before_role:
        changes.append({"field": "role", "before": before_role, "after": row.role})

    if "day_rate" in payload.model_fields_set and payload.day_rate != before_rate:
        changes.append({"field": "day_rate", "before": before_rate, "after": float(row.day_rate)})

    if changes:

        record_business_master_change(
            db=db,
            module="Business Masters",
            action="UPDATE",
            actor_user_id=payload.actor.user_id,
            actor_name=payload.actor.name,
            actor_role=payload.actor.role,
            title=f"{payload.actor.name} updated HR role '{row.role}' in Business Masters",
            changes=changes,
            remark=payload.remark
        )

    return row


def delete_hr_role_request(db, hr_role_id, actor, remark):

    row = get_hr_role(db, hr_role_id)

    if not row:
        return False

    title = f"{actor.name} removed HR role '{row.role}' from Business Masters"
    changes = [{"field": "role", "before": row.role, "after": None}]

    success = delete_hr_role(db, hr_role_id)

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
