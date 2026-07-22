# ====================================
# IMPORTS
# ====================================

from backend.models.techno_commercial_quote import Quote

from backend.models.customer_requests import CustomerRequest

from backend.models.ops_selector import OpsSelection

from backend.models.approval_board import ApprovalBoard

from sqlalchemy.sql import func


# ====================================
# APPROVAL BOARD LIST
# ====================================

def list_approval_quotes(

    db

):

    print(

        "\n========== APPROVAL REPOSITORY =========="

    )

    approvals = (

        db.query(

            Quote,

            CustomerRequest,

            OpsSelection

        )

        .filter(
            Quote.workflow_status == "MANAGEMENT_APPROVAL"
        )

        .join(

            CustomerRequest,

            Quote.customer_request_id

            ==

            CustomerRequest.id

        )

        .join(

            OpsSelection,

            Quote.ops_selection_id

            ==

            OpsSelection.id

        )

        .order_by(

            Quote.id

        )

        .all()

    )

    result = []

    for quote, customer, ops in approvals:

        record = {

            "quote_id":

                quote.id,

            "customer":

                customer.company_name,

            "summary":

                f"{ops.service_configuration} + "
                f"{ops.recommended_machine} + "
                f"{ops.pump_hose_package}",

            "quote_value":

                quote.combined_budgetary_value,

            "flag":

                ops.approval_gate

        }

        print(

            record

        )

        result.append(

            record

        )

    print(

        "=========================================\n"

    )

    return result


# ====================================
# APPROVE QUOTE
# ====================================

def approve_quote(

    db,

    quote_id

):

    print(

        "\n========== APPROVAL REPOSITORY =========="

    )

    print(

        "Approving Quote:",

        quote_id

    )

    quote = (

        db.query(

            Quote

        )

        .filter(

            Quote.id ==

            quote_id

        )

        .first()

    )

    if quote is None:

        raise ValueError(

            "Quote not found."

        )
    
    print("Quote ID:", quote.id)
    print("Workflow:", repr(quote.workflow_status))
    print("Expected:", repr("MANAGEMENT_APPROVAL"))
    print("Equal:", quote.workflow_status == "MANAGEMENT_APPROVAL")
    
    if quote.workflow_status == "MANAGEMENT_APPROVAL":

        approval = (
            db.query(ApprovalBoard)
            .filter(
                ApprovalBoard.quote_id == quote_id
            )
            .first()
        )

        if approval is None:
            approval = ApprovalBoard(
                quote_id=quote_id
            )
            db.add(approval)

            approval.approval_status = "APPROVED"
            approval.approved_by = "ADMIN"
            approval.approval_date = func.now()

            quote.workflow_status = "MANAGEMENT_APPROVED"

            db.commit()

            db.refresh(approval)

            db.refresh(quote)

            return approval

        else:

            raise ValueError(
                "Quote is not awaiting management approval."
            )






# ====================================
# GET APPROVAL
# ====================================

def get_approval(

    db,

    approval_board_id

):

    return (

        db.query(

            ApprovalBoard

        )

        .filter(

            ApprovalBoard.id ==

            approval_board_id

        )

        .first()

    )


# ====================================
# GET APPROVAL BY QUOTE
# ====================================

def get_approval_board_by_quote(
    db,
    quote_id
):

    quote, customer, ops = (

        db.query(

            Quote,
            CustomerRequest,
            OpsSelection

        )

        .join(
            CustomerRequest,
            Quote.customer_request_id == CustomerRequest.id
        )

        .join(
            OpsSelection,
            Quote.ops_selection_id == OpsSelection.id
        )

        .filter(
            Quote.id == quote_id
        )

        .first()

    )

    return {

        "quote_id": quote.id,

        "customer": customer.company_name,

        "summary":
            f"{ops.service_configuration} + "
            f"{ops.recommended_machine} + "
            f"{ops.pump_hose_package}",

        "quote_value": quote.combined_budgetary_value,

        "flag": ops.approval_gate

    }