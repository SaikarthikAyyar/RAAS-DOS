# ====================================
# IMPORTS
# ====================================

from backend.models.hub import Hub
from backend.models.hub_approver import HubApprover


# ====================================
# HUBS
# ====================================

def list_hubs(db):
    return db.query(Hub).order_by(Hub.hub_name).all()


def get_hub(db, hub_id):
    return db.query(Hub).filter(Hub.id == hub_id).first()


def get_hub_by_name(db, hub_name):
    return db.query(Hub).filter(Hub.hub_name == hub_name).first()


_HUB_PAYLOAD_EXCLUDE = {
    "actor", "remark",
    "ops_owner_user_ids", "quote_commercial_approver_user_ids", "commercial_approver_user_ids"
}


# actor/remark (Phase 15) ride along on every Business Masters payload
# for the notification layer only - excluded here so they never reach
# the ORM constructor/setattr loop (which would otherwise choke on
# unknown columns). ops_owner_user_ids/quote_commercial_approver_user_ids/
# commercial_approver_user_ids are handled separately below (a real
# many-to-many, not a Hub column).
def create_hub(db, payload):
    row = Hub(**payload.model_dump(exclude=_HUB_PAYLOAD_EXCLUDE))
    db.add(row)
    db.commit()
    db.refresh(row)

    if payload.ops_owner_user_ids:
        _set_hub_approvers(db, row.id, "ops_review", payload.ops_owner_user_ids)

    if payload.quote_commercial_approver_user_ids:
        _set_hub_approvers(db, row.id, "quote_commercial", payload.quote_commercial_approver_user_ids)

    if payload.commercial_approver_user_ids:
        _set_hub_approvers(db, row.id, "commercial_approval", payload.commercial_approver_user_ids)

    db.commit()

    return row


def update_hub(db, hub_id, payload):
    row = db.query(Hub).filter(Hub.id == hub_id).first()
    if not row:
        return None

    for field, value in payload.model_dump(exclude_unset=True, exclude=_HUB_PAYLOAD_EXCLUDE).items():
        setattr(row, field, value)

    if "ops_owner_user_ids" in payload.model_fields_set:
        _set_hub_approvers(db, hub_id, "ops_review", payload.ops_owner_user_ids or [])

    if "quote_commercial_approver_user_ids" in payload.model_fields_set:
        _set_hub_approvers(db, hub_id, "quote_commercial", payload.quote_commercial_approver_user_ids or [])

    if "commercial_approver_user_ids" in payload.model_fields_set:
        _set_hub_approvers(db, hub_id, "commercial_approval", payload.commercial_approver_user_ids or [])

    db.commit()
    db.refresh(row)
    return row


def delete_hub(db, hub_id):
    row = db.query(Hub).filter(Hub.id == hub_id).first()
    if not row:
        return False
    db.delete(row)
    db.commit()
    return True


# ====================================
# HUB APPROVERS
# Replace-all semantics per (hub, approval_type) - same "delete then
# reinsert" pattern already used for Machine<->Pump compatibility
# (Phase 18A).
# ====================================

def list_hub_approvers(db, hub_id):
    return db.query(HubApprover).filter(HubApprover.hub_id == hub_id).all()


def list_all_hub_approvers(db):
    return db.query(HubApprover).all()


def _set_hub_approvers(db, hub_id, approval_type, user_ids):

    db.query(HubApprover).filter(
        HubApprover.hub_id == hub_id,
        HubApprover.approval_type == approval_type
    ).delete()

    for user_id in user_ids:
        db.add(HubApprover(hub_id=hub_id, user_id=user_id, approval_type=approval_type))
