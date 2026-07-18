# ====================================
# IMPORTS
# ====================================

from backend.repositories.approval_board_repository import (
    list_approval_quotes
)

from backend.repositories.approval_board_repository import (
    approve_quote
)

from backend.repositories.approval_board_repository import (

    get_approval

)

from backend.repositories.techno_commercial_quote_repository import get_ops_selection, get_quote
from backend.services.enquiry_service import EnquiryService

from backend.services.status_service import (
    update_customer_request_status
)

from backend.repositories.approval_board_repository import (
    get_approval_board_by_quote
)



# ====================================
# GET APPROVAL BOARD
# ====================================

def get_approval_board_request(

    db

):

    print(

        "\n========== APPROVAL SERVICE =========="

    )

    approvals = list_approval_quotes(

        db

    )

    print(

        "Approval Records:",

        len(

            approvals

        )

    )

    for approval in approvals:

        print(

            approval

        )

    print(

        "======================================\n"

    )

    return approvals





# ====================================
# APPROVE QUOTE
# ====================================

def approve_quote_request(

    db,

    quote_id

):

    print(

        "\n========== APPROVAL WORKFLOW =========="

    )

    print(

        f"[Workflow] Quote : {quote_id}"

    )

    approval = approve_quote(

        db,

        quote_id

    )

    quote = get_quote(db, quote_id)

    ops = get_ops_selection(
        db,
        quote.ops_selection_id
    )

    print(

        f"[Workflow] Approval ID : {approval.id}"

    )

    print(

        "[Workflow] Searching MANAGER enquiry"

    )

    enquiries = EnquiryService.get_received_enquiries(

        db,

        "MANAGER"

    )

    for enquiry in enquiries:

        if (
            enquiry.requested_task == "APPROVAL_BOARD"
            and enquiry.receiver_role == "MANAGER"
            and enquiry.completed is False
            and enquiry.quote_id == quote_id
        ):

            print(

                f"[Workflow] Completing Enquiry {enquiry.id}"

            )

            enquiry.completed = True

            enquiry.workflow_status = "COMPLETED"

            EnquiryService.update(

                db,

                enquiry

            )

            break

    print(

        "[Workflow] Creating Job Creation enquiry"

    )

    EnquiryService.create_allocation_enquiry(

        db,

        quote.customer_request_id,

        ops.sales_survey_id,

        approval.id,

        {

            "customer_request_id": quote.customer_request_id,

            "sales_survey_id": ops.sales_survey_id,

            "approval_board_id": approval.id

        }

    )

    

    update_customer_request_status(

        db,

        quote.customer_request_id,

        "APPROVAL_COMPLETED"

    )

    print(

        "[Workflow] Customer Status -> APPROVAL_COMPLETED"

    )

    print(

        "========== APPROVAL COMPLETE ==========\n"

    )

    return approval


# ====================================
# GET APPROVAL
# ====================================

def get_approval_request(

    db,

    approval_board_id

):

    print(

        "\n========== APPROVAL SERVICE =========="

    )

    print(

        "Approval:",

        approval_board_id

    )

    approval = get_approval(

        db,

        approval_board_id

    )

    print(

        approval

    )

    print(

        "======================================\n"

    )

    return approval

# ====================================
# GET APPROVAL BOARD BY QUOTE
# ====================================

def get_approval_board_by_quote_request(

    db,

    quote_id

):

    print("\n========== APPROVAL SERVICE ==========")

    print(f"Quote : {quote_id}")

    approval = get_approval_board_by_quote(

        db,

        quote_id

    )

    print(approval)

    print("======================================\n")

    return approval