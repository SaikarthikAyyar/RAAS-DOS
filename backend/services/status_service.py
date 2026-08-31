# ====================================
# IMPORTS
# ====================================

from backend.models.customer_requests import CustomerRequest


# ====================================
# WORKFLOW ORDER
# ====================================

WORKFLOW_STATUS = [

    "REQUESTED",

    "SURVEY_COMPLETED",

    "OPS_APPROVED",

    "OPS_COMPLETED",

    "AWAITING_CUSTOMER_REVIEW",

    "OPS_APPROVAL_PENDING",

    "REVISION_REQUESTED",

    "MANAGEMENT_APPROVAL",

    "APPROVAL_COMPLETED",

    "JOB_SHEET_CREATED",

    "READY_FOR_ALLOCATION",

    "EXECUTION_READY",

    "JOB_IN_PROGRESS",

    "EXECUTION_COMPLETED",

    "JOB_COMPLETED"
]


# ====================================
# UPDATE CUSTOMER STATUS
# ====================================

def update_customer_request_status(
    db,
    customer_request_id,
    status
):

    print("Updating Customer:", customer_request_id)
    print("Target Status:", status)

    customer = (
        db.query(
            CustomerRequest
        )
        .filter(
            CustomerRequest.id == customer_request_id
        )
        .first()
    )

    print("Customer Found:", customer)

    if not customer:
        print("Customer not found")
        return

    print("Current Status:", customer.status)

    if customer.status is None:
        customer.status = status
        db.commit()
        print("Committed (None case)")
        return

    # A legacy/out-of-vocabulary status value here must never turn an
    # otherwise-real, already-persisted completion into a 500 - this
    # call sits at the very end of complete_execution_phase, after
    # dequeue/deployment-segment/invoice-collected writes have already
    # committed successfully (Phase 39). Falls back to a direct set
    # (skipping the ordering guard) rather than crashing.
    try:
        current_index = WORKFLOW_STATUS.index(customer.status)
        new_index = WORKFLOW_STATUS.index(status)
    except ValueError:
        print(f"[WARNING] Unrecognized status '{customer.status}' or '{status}' - setting directly.")
        customer.status = status
        db.commit()
        db.refresh(customer)
        return

    print(current_index, new_index)

    if new_index > current_index:

        customer.status = status

        db.commit()

        db.refresh(customer)

        print("Updated To:", customer.status)