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

    approval = (

        db.query(

            ApprovalBoard

        )

        .filter(

            ApprovalBoard.quote_id ==

            quote_id

        )

        .first()

    )

    if approval is None:

        approval = ApprovalBoard(

            quote_id = quote_id

        )

        db.add(

            approval

        )

    approval.approval_status = "APPROVED"

    approval.approved_by = "ADMIN"

    approval.approval_date = func.now()

    customer = (

        db.query(

            CustomerRequest

        )

        .filter(

            CustomerRequest.id ==

            quote.customer_request_id

        )

        .first()

    )

    if customer is not None:

        customer.status = "APPROVED"

        print(

            "Customer Updated:",

            customer.id

        )

    db.commit()

    db.refresh(

        approval

    )

    print(

        "Approval Saved:",

        approval.id

    )

    print(

        "=========================================\n"

    )

    return approval