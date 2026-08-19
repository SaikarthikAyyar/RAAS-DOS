# ====================================
# IMPORTS
# ====================================

import os

from backend.repositories.purchase_order_repository import (
    list_purchase_orders,
    count_purchase_orders,
    create_purchase_order,
    get_purchase_order,
    delete_purchase_order
)

from backend.models.enquiry import Enquiry
from backend.models.techno_commercial_quote import Quote

from backend.services.workflow_service import (
    WORKFLOW_ORDER,
    WorkflowStage,
    advance_stage_at_least
)

from backend.repositories.notification_repository import record_workflow_change


# ====================================
# NOTIFICATION HELPER (Phase 26)
# ====================================

def _notify_po_change(db, enquiry, actor_user_id, actor_name, actor_role, action, changes, title):

    if not enquiry or not changes:
        return

    record_workflow_change(
        db,
        "PO",
        action,
        actor_user_id,
        actor_name,
        actor_role,
        enquiry.id,
        enquiry.customer_name,
        title,
        changes
    )


# ====================================
# LIST
# ====================================

def list_purchase_orders_request(db, enquiry_id):
    return list_purchase_orders(db, enquiry_id)


# ====================================
# PO NUMBER / PO VALUE - both derived from real DB data, never
# user-typed. PO Number reuses this app's existing Quote-ID convention
# (QT-{enquiry_id}-v{revision}) with a "PO-" prefix. PO Value prefers
# the Commercial-Approval-set final_approved_value (the number actually
# agreed on); falls back to the combined budgetary value's upper bound
# when a quote somehow reached Quote Released with no final value set.
# ====================================

def _compute_po_number(enquiry, quote):

    if quote is not None:
        return f"PO-{enquiry.id}-v{quote.revision_number}"

    return f"PO-{enquiry.id}"


def _compute_po_value(quote):

    if quote is None:
        return None

    if quote.final_approved_value is not None:
        return quote.final_approved_value

    return quote.combined_budgetary_value_max


# ====================================
# UPLOAD
# PO can only be uploaded once the quote has been released - matches
# "PO can be uploaded once the quote is released." Only one PO may be
# on file for an enquiry at a time - a second upload is rejected until
# the existing one is removed. The first (and only) upload advances
# stage to PO_RECEIVED (guarded to fire only once).
# ====================================

async def upload_purchase_order_request(db, enquiry_id, file, uploaded_by, actor_user_id=None, actor_role=None):

    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()

    if enquiry is None:
        raise ValueError("Enquiry not found.")

    try:
        current_index = WORKFLOW_ORDER.index(enquiry.stage)
    except ValueError:
        current_index = -1

    quote_released_index = WORKFLOW_ORDER.index(WorkflowStage.QUOTE_RELEASED.value)

    if current_index < quote_released_index:
        raise ValueError("PO can be uploaded once the quote is released.")

    if count_purchase_orders(db, enquiry_id) > 0:
        raise ValueError("A PO is already on file for this enquiry. Remove it before uploading a new one.")

    folder = f"backend/uploads/purchase_orders/{enquiry_id}"
    os.makedirs(folder, exist_ok=True)

    file_path = f"{folder}/{file.filename}"

    contents = await file.read()

    with open(file_path, "wb") as f:
        f.write(contents)

    quote = db.query(Quote).filter(Quote.id == enquiry.quote_id).first() if enquiry.quote_id else None

    row = create_purchase_order(
        db,
        enquiry_id,
        file.filename,
        file_path,
        _compute_po_number(enquiry, quote),
        _compute_po_value(quote),
        uploaded_by
    )

    advance_stage_at_least(db, enquiry_id, WorkflowStage.PO_RECEIVED.value)

    _notify_po_change(
        db, enquiry, actor_user_id, uploaded_by, actor_role, "CREATE",
        [
            {"field": "file_name", "before": None, "after": row.file_name},
            {"field": "po_number", "before": None, "after": row.po_number},
            {"field": "po_value", "before": None, "after": row.po_value}
        ],
        f"{uploaded_by or 'Someone'} uploaded a PO for Enquiry #{enquiry.id}"
        f"{' - ' + enquiry.customer_name if enquiry.customer_name else ''}"
    )

    return row


# ====================================
# DELETE
# Real delete (not soft-delete) - PO uploads are leaf records nothing
# else references. Deleting a PO never regresses stage - the job may
# already be further along; removing a file shouldn't silently undo
# workflow state.
# ====================================

def delete_purchase_order_request(db, po_id, actor=None):

    po = get_purchase_order(db, po_id)

    if po is None:
        raise ValueError("PO not found.")

    enquiry = db.query(Enquiry).filter(Enquiry.id == po.enquiry_id).first()

    file_name = po.file_name
    po_number = po.po_number
    po_value = po.po_value

    if os.path.exists(po.file_path):
        os.remove(po.file_path)

    delete_purchase_order(db, po)

    _notify_po_change(
        db, enquiry,
        actor.user_id if actor else None,
        actor.name if actor else None,
        actor.role if actor else None,
        "DELETE",
        [
            {"field": "file_name", "before": file_name, "after": None},
            {"field": "po_number", "before": po_number, "after": None},
            {"field": "po_value", "before": po_value, "after": None}
        ],
        f"{actor.name if actor else 'Someone'} removed the PO for Enquiry #{enquiry.id if enquiry else po.enquiry_id}"
        f"{' - ' + enquiry.customer_name if enquiry and enquiry.customer_name else ''}"
    )
