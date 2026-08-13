# ====================================
# IMPORTS
# ====================================

from backend.repositories.hub_repository import (
    list_hubs,
    get_hub,
    create_hub,
    update_hub,
    delete_hub
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


# ====================================
# HUBS
# ====================================

def list_hubs_request(db):
    return list_hubs(db)


def create_hub_request(db, payload):

    row = create_hub(db, payload)

    record_business_master_change(
        db=db,
        module="Business Masters",
        action="CREATE",
        actor_user_id=payload.actor.user_id,
        actor_name=payload.actor.name,
        actor_role=payload.actor.role,
        title=f"{payload.actor.name} created Hub '{row.hub_name}' in Business Masters",
        changes=[
            {"field": "hub_name", "before": None, "after": row.hub_name},
            {"field": "region", "before": None, "after": row.region},
            {"field": "ops_owner", "before": None, "after": row.ops_owner},
            {"field": "techno_approver", "before": None, "after": row.techno_approver}
        ],
        remark=payload.remark
    )

    return row


def update_hub_request(db, hub_id, payload):

    before = get_hub(db, hub_id)

    if not before:
        return None

    fields_sent = [
        f for f in ("hub_name", "region", "ops_owner", "techno_approver")
        if f in payload.model_fields_set
    ]

    changes = _diff_fields(before, payload, fields_sent)

    row = update_hub(db, hub_id, payload)

    if changes:

        record_business_master_change(
            db=db,
            module="Business Masters",
            action="UPDATE",
            actor_user_id=payload.actor.user_id,
            actor_name=payload.actor.name,
            actor_role=payload.actor.role,
            title=f"{payload.actor.name} updated Hub '{row.hub_name}' in Business Masters",
            changes=changes,
            remark=payload.remark
        )

    return row


def delete_hub_request(db, hub_id, actor, remark):

    row = get_hub(db, hub_id)

    if not row:
        return False

    title = f"{actor.name} deleted Hub '{row.hub_name}' from Business Masters"

    changes = [{"field": "hub_name", "before": row.hub_name, "after": None}]

    success = delete_hub(db, hub_id)

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
