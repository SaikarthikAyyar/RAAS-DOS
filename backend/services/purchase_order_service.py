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

from backend.services.workflow_service import (
    WORKFLOW_ORDER,
    WorkflowStage,
    advance_stage_at_least
)


# ====================================
# LIST
# ====================================

def list_purchase_orders_request(db, enquiry_id):
    return list_purchase_orders(db, enquiry_id)


# ====================================
# UPLOAD
# PO can only be uploaded once the quote has been released - matches
# "PO can be uploaded once the quote is released." The FIRST upload
# for this enquiry advances stage to PO_RECEIVED (guarded to fire
# only once, same precondition-guard pattern used everywhere else in
# this phase); every subsequent upload just adds another row, since
# multiple quote-release cycles can mean multiple real POs.
# ====================================

async def upload_purchase_order_request(db, enquiry_id, file, po_number, po_value, uploaded_by):

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

    folder = f"backend/uploads/purchase_orders/{enquiry_id}"
    os.makedirs(folder, exist_ok=True)

    file_path = f"{folder}/{file.filename}"

    contents = await file.read()

    with open(file_path, "wb") as f:
        f.write(contents)

    is_first_upload = count_purchase_orders(db, enquiry_id) == 0

    row = create_purchase_order(
        db,
        enquiry_id,
        file.filename,
        file_path,
        po_number,
        po_value,
        uploaded_by
    )

    if is_first_upload:

        advance_stage_at_least(db, enquiry_id, WorkflowStage.PO_RECEIVED.value)

    return row


# ====================================
# DELETE
# Real delete (not soft-delete) - PO uploads are leaf records nothing
# else references. Deleting a PO never regresses stage - the job may
# already be further along; removing a file shouldn't silently undo
# workflow state.
# ====================================

def delete_purchase_order_request(db, po_id):

    po = get_purchase_order(db, po_id)

    if po is None:
        raise ValueError("PO not found.")

    if os.path.exists(po.file_path):
        os.remove(po.file_path)

    delete_purchase_order(db, po)
