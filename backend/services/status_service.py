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

    "OPS_COMPLETED",

    "QUOTE_CREATED",

    "APPROVAL_COMPLETED",

    "JOB_SHEET_CREATED",

    "JOB_IN_PROGRESS",

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

    current_index = WORKFLOW_STATUS.index(customer.status)
    new_index = WORKFLOW_STATUS.index(status)

    print(current_index, new_index)

    if new_index > current_index:

        customer.status = status

        db.commit()

        db.refresh(customer)

        print("Updated To:", customer.status)