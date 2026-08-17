# ====================================
# IMPORTS
# ====================================

from backend.repositories.hub_repository import (
    list_hubs,
    get_hub,
    create_hub,
    update_hub,
    delete_hub,
    list_hub_approvers
)

from backend.repositories.notification_repository import record_business_master_change

from backend.models.users import User


# ====================================
# USER NAME LOOKUP
# ====================================

def _user_name_map(db):
    return {user.id: user.name for user in db.query(User).all()}


# ====================================
# HUB -> RESPONSE DICT
# Resolves ops_owner_user_ids/techno_approver_user_ids into display
# names - built here (not left to Pydantic's from_attributes) since
# the approver lists come from a separate table, not Hub's own columns.
# ====================================

def _build_hub_dict(db, hub, user_names=None):

    user_names = user_names if user_names is not None else _user_name_map(db)

    approvers = list_hub_approvers(db, hub.id)

    ops_owner_ids = [a.user_id for a in approvers if a.approval_type == "ops_review"]
    techno_ids = [a.user_id for a in approvers if a.approval_type == "techno_commercial"]

    return {
        "id": hub.id,
        "hub_name": hub.hub_name,
        "region": hub.region,
        "ops_owner": hub.ops_owner,
        "techno_approver": hub.techno_approver,
        "ops_owner_user_ids": ops_owner_ids,
        "ops_owners": [{"id": uid, "name": user_names.get(uid)} for uid in ops_owner_ids],
        "techno_approver_user_ids": techno_ids,
        "techno_approvers": [{"id": uid, "name": user_names.get(uid)} for uid in techno_ids]
    }


def _names_display(ids, user_names):
    names = [user_names.get(i) for i in ids if user_names.get(i)]
    return ", ".join(names) if names else None


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

    hubs = list_hubs(db)
    user_names = _user_name_map(db)

    return [_build_hub_dict(db, h, user_names) for h in hubs]


def create_hub_request(db, payload):

    row = create_hub(db, payload)

    user_names = _user_name_map(db)
    hub_dict = _build_hub_dict(db, row, user_names)

    changes = [
        {"field": "hub_name", "before": None, "after": row.hub_name},
        {"field": "region", "before": None, "after": row.region}
    ]

    if hub_dict["ops_owners"]:
        changes.append({
            "field": "ops_owners",
            "before": None,
            "after": ", ".join(o["name"] for o in hub_dict["ops_owners"] if o["name"])
        })

    if hub_dict["techno_approvers"]:
        changes.append({
            "field": "techno_approvers",
            "before": None,
            "after": ", ".join(o["name"] for o in hub_dict["techno_approvers"] if o["name"])
        })

    record_business_master_change(
        db=db,
        module="Business Masters",
        action="CREATE",
        actor_user_id=payload.actor.user_id,
        actor_name=payload.actor.name,
        actor_role=payload.actor.role,
        title=f"{payload.actor.name} created Hub '{row.hub_name}' in Business Masters",
        changes=changes,
        remark=payload.remark
    )

    return hub_dict


def update_hub_request(db, hub_id, payload):

    before = get_hub(db, hub_id)

    if not before:
        return None

    user_names = _user_name_map(db)

    fields_sent = [
        f for f in ("hub_name", "region")
        if f in payload.model_fields_set
    ]

    changes = _diff_fields(before, payload, fields_sent)

    before_approvers = list_hub_approvers(db, hub_id)
    before_ops_ids = [a.user_id for a in before_approvers if a.approval_type == "ops_review"]
    before_techno_ids = [a.user_id for a in before_approvers if a.approval_type == "techno_commercial"]

    row = update_hub(db, hub_id, payload)

    if "ops_owner_user_ids" in payload.model_fields_set:

        after_ops_ids = payload.ops_owner_user_ids or []

        if set(before_ops_ids) != set(after_ops_ids):
            changes.append({
                "field": "ops_owners",
                "before": _names_display(before_ops_ids, user_names),
                "after": _names_display(after_ops_ids, user_names)
            })

    if "techno_approver_user_ids" in payload.model_fields_set:

        after_techno_ids = payload.techno_approver_user_ids or []

        if set(before_techno_ids) != set(after_techno_ids):
            changes.append({
                "field": "techno_approvers",
                "before": _names_display(before_techno_ids, user_names),
                "after": _names_display(after_techno_ids, user_names)
            })

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

    return _build_hub_dict(db, row, user_names)


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
