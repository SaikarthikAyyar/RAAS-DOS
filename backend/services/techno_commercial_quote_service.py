# ====================================
# CREATE QUOTE
# ====================================

from backend.services.quote_engine import (

    build_quote

)

from backend.repositories.techno_commercial_quote_repository import (

    create_quote,

    get_ops_selection

)

from backend.repositories.techno_commercial_quote_repository import (
    get_quote
)

from backend.repositories.techno_commercial_quote_repository import (

    get_latest_quote

)

from backend.repositories.techno_commercial_quote_repository import (

    get_quote_by_ops_selection

)
from backend.services.status_service import update_customer_request_status

from backend.services.enquiry_service import EnquiryService


def create_quote_request(

    db,

    payload

):

    # ====================================
    # FETCH OPS SELECTION
    # ====================================

    ops = get_ops_selection(

        db,

        payload.ops_selection_id

    )

    if ops is None:

        raise ValueError(

            "OPS Selection not found."

        )
    
    print("\n========== QUOTE WORKFLOW ==========")
    print("[Workflow] Loading incoming SALES quote enquiry")

    latest = get_latest_quote(
        db,
        payload.ops_selection_id
    )    

    incoming = EnquiryService.get_received_enquiries(

        db,

        "SALES"

    )

    for enquiry in incoming:

        if enquiry.requested_task == "QUOTE":

            if enquiry.ops_selector_id == payload.ops_selection_id:

                enquiry.completed = True
                enquiry.workflow_status = "COMPLETED"
                EnquiryService.update(db, enquiry)

                print("[Workflow] Quote enquiry completed")

                break

        elif enquiry.requested_task == "QUOTE_REVISION":

            if latest and enquiry.quote_id == latest.id:

                enquiry.completed = True
                enquiry.workflow_status = "COMPLETED"
                EnquiryService.update(db, enquiry)

                print("[Workflow] Quote revision enquiry completed")

                break
    
    dewatering_assessment_id = None



    if latest is None:

        revision_number = 1

    else:

        if latest.workflow_status != "REVISION_REQUESTED":

            raise ValueError(
                "Customer has not requested a quote revision."
            )

        revision_number = latest.revision_number + 1

    workflow_status = "CUSTOMER_REVIEW"

    # ====================================
    # BUILD COMMERCIAL QUOTE
    # ====================================

    quote = build_quote(

        ops

    )

    # ====================================
    # BUILD PAYLOAD
    # ====================================

    quote_data = {

        "ops_selection_id":
            payload.ops_selection_id,

        
        "customer_request_id":

        ops.customer_request_id,

        "revision_number":
            revision_number,

        "workflow_status":
            workflow_status,

        "dewatering_assessment_id":
            dewatering_assessment_id,

        **quote

    }



    # ====================================
    # SAVE
    # ====================================

    quote = create_quote(

        db,

        quote_data

    )

    print(f"[Workflow] Quote Created : {quote.id}")

    update_customer_request_status(

        db,

        ops.customer_request_id,

        "AWAITING_CUSTOMER_REVIEW"

    )

    print("[Workflow] Customer Status -> AWAITING_CUSTOMER_REVIEW")

    print("[Workflow] Creating Customer Review enquiry")

    EnquiryService.create_customer_quote_review_enquiry(

        db,

        ops.customer_request_id,

        ops.sales_survey_id,

        quote.id,

        {

            "customer_request_id": ops.customer_request_id,

            "sales_survey_id": ops.sales_survey_id,

            "quote_id": quote.id,

            "revision": quote.revision_number

        }

    )

    print("[Workflow] Customer Review enquiry created")
    print("[Workflow] Waiting for Customer Decision")

    print("========== QUOTE WORKFLOW COMPLETE ==========\n")

    return quote




# ====================================
# GET QUOTE
# ====================================

def get_quote_request(

    db,

    ops_selection_id

):

    quote = get_quote_by_ops_selection(

        db,

        ops_selection_id

    )

    if quote is None:

        raise ValueError(

            "Quote not found."

        )

    return quote


# ====================================
# LIST QUOTE OPS
# ====================================

from backend.services.enquiry_service import EnquiryService


def list_quote_ops_request(db):

    enquiries = EnquiryService.get_received_enquiries(
        db,
        "SALES"
    )

    results = []

    seen = set()

    for enquiry in enquiries:

        if enquiry.ops_selector_id is None:
            continue

        if enquiry.ops_selector_id in seen:
            continue

        seen.add(enquiry.ops_selector_id)

        results.append({

            "id": enquiry.ops_selector_id,

            "label":
                f"ENQ-{enquiry.id} | "
                f"CR-{enquiry.customer_request_id} | "
                f"OPS-{enquiry.ops_selector_id}"

        })

    return results


def get_quote_preview_request(db, ops_selection_id):

    ops = get_ops_selection(db, ops_selection_id)

    if ops is None:
        raise ValueError("OPS Selection not found.")

    return build_quote(ops)


def approve_quote_by_customer(

    db,

    quote_id

):

    print("\n========== CUSTOMER APPROVAL ==========")

    quote = get_quote(

        db,

        quote_id

    )

    if quote is None:

        raise ValueError("Quote not found.")
    
    if quote.workflow_status != "CUSTOMER_REVIEW":
        raise ValueError(
            "Quote is no longer awaiting customer review."
        )
    
    ops = get_ops_selection(db, quote.ops_selection_id)

    print("[Workflow] Quote:", quote.id)

    enquiries = EnquiryService.get_received_enquiries(

        db,

        "CUSTOMER"

    )

    for enquiry in enquiries:

        if (
            enquiry.requested_task == "QUOTE_REVIEW"
            and enquiry.receiver_role == "CUSTOMER"
            and enquiry.completed is False
            and enquiry.quote_id == quote.id
        ):

            enquiry.completed = True

            enquiry.workflow_status = "COMPLETED"

            EnquiryService.update(

                db,

                enquiry

            )

            print("[Workflow] Customer enquiry completed")

            break

    # Customer accepted the quote.
    # Quote now moves to Management.

    print(">>> CHANGING STATUS TO MANAGEMENT_APPROVAL <<<")

    quote.workflow_status = "MANAGEMENT_APPROVAL"

    print("Current status:", quote.workflow_status)

    db.commit()
    db.refresh(quote)

    update_customer_request_status(
        db,
        quote.customer_request_id,
        "MANAGEMENT_APPROVAL"
    )

    EnquiryService.create_approval_board_enquiry(
        db,
        quote.customer_request_id,
        ops.sales_survey_id,
        quote.id,
        {
            "customer_request_id": quote.customer_request_id,
            "sales_survey_id": ops.sales_survey_id,
            "quote_id": quote.id,
            "revision": quote.revision_number
        }
    )

    print("[Workflow] Quote moved to MANAGEMENT_APPROVAL")
    print("[Workflow] Approval Board enquiry created")

    print("[Workflow] Approval enquiry created")

    return quote


def request_quote_revision(

    db,

    quote_id

):

    print("\n========== QUOTE REVISION ==========")

    quote = get_quote(

        db,

        quote_id

    )

    if quote is None:

        raise ValueError("Quote not found.")
    
    if quote.workflow_status != "CUSTOMER_REVIEW":
        raise ValueError(
            "Quote is no longer awaiting customer review."
        )
    
    ops = get_ops_selection(
        db,
        quote.ops_selection_id
    )

    enquiries = EnquiryService.get_received_enquiries(

        db,

        "CUSTOMER"

    )

    for enquiry in enquiries:

        if (
            enquiry.requested_task == "QUOTE_REVIEW"
            and enquiry.receiver_role == "CUSTOMER"
            and enquiry.completed is False
            and enquiry.quote_id == quote.id
        ):

            enquiry.completed = True

            enquiry.workflow_status = "COMPLETED"

            EnquiryService.update(

                db,

                enquiry

            )

            break





    quote.workflow_status = "REVISION_REQUESTED"

    db.commit()

    db.refresh(quote)

    update_customer_request_status(
        db,
        quote.customer_request_id,
        "OPS_APPROVAL_PENDING"
    )

    existing = EnquiryService.get_received_enquiries(
        db,
        "OPERATIONS"
    )

    already_exists = any(
        e.requested_task == "OPS_APPROVAL"
        and e.customer_request_id == quote.customer_request_id
        and e.quote_id == quote.id
        and not e.completed
        for e in existing
    )

    if already_exists:

        print("[Workflow] Existing OPS Approval enquiry found.")

    else:

        EnquiryService.create_ops_approval_enquiry(

            db,

            quote.customer_request_id,

            ops.sales_survey_id,

            {

                "customer_request_id": quote.customer_request_id,

                "sales_survey_id": ops.sales_survey_id,

                "quote_id": quote.id,

                "revision": quote.revision_number

            }

        )

        print("[Workflow] Revision returned to OPS Approval")

    return quote