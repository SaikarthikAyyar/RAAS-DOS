# ====================================
# CREATE QUOTE
# ====================================

from datetime import date

from backend.services.quote_engine import (

    build_quote

)

from backend.repositories.techno_commercial_quote_repository import (

    create_quote,
    get_ops_selection,
    get_next_revision_number

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

    revision_number = get_next_revision_number(
        db,
        ops.customer_request_id,
        ops.sales_survey_id
    )

    workflow_status = "CUSTOMER_REVIEW"

    dewatering_assessment_id = None

    # ====================================
    # BUILD COMMERCIAL QUOTE
    # ====================================

    quote = build_quote(

        db,

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
            payload.dewatering_assessment_id,

        # --------------------------------
        # Engine values
        # --------------------------------

        "recommended_machine":
            quote["recommended_machine"],

        "service_configuration":
            quote["service_configuration"],

        "pump_hose_package":
            quote["pump_hose_package"],

        "approval_gate":
            quote["approval_gate"],

        "mobilisation_cost_min":
            quote["mobilisation_cost_min"],
        "mobilisation_cost_max":
            quote["mobilisation_cost_max"],

        "setup_cost_min":
            quote["setup_cost_min"],
        "setup_cost_max":
            quote["setup_cost_max"],

        "execution_cost_min":
            quote["execution_cost_min"],
        "execution_cost_max":
            quote["execution_cost_max"],

        "pump_addon_cost_min":
            quote["pump_addon_cost_min"],
        "pump_addon_cost_max":
            quote["pump_addon_cost_max"],

        "documentation_buffer":
            quote["documentation_buffer"],

        "access_support_buffer":
            quote["access_support_buffer"],

        "direct_cost_min":
            quote["direct_cost_min"],
        "direct_cost_max":
            quote["direct_cost_max"],

        "overhead_cost_min":
            quote["overhead_cost_min"],
        "overhead_cost_max":
            quote["overhead_cost_max"],

        "contingency_cost_min":
            quote["contingency_cost_min"],
        "contingency_cost_max":
            quote["contingency_cost_max"],

        "margin_percentage":
            quote["margin_percentage"],

        "margin_value_min":
            quote["margin_value_min"],
        "margin_value_max":
            quote["margin_value_max"],

        "dewatering_method":
            quote["dewatering_method"],

        # --------------------------------
        # User editable fields
        # --------------------------------

        "cleaning_quote_min":
            payload.cleaning_quote_min
            if payload.cleaning_quote_min is not None
            else quote["cleaning_quote_min"],

        "cleaning_quote_max":
            payload.cleaning_quote_max
            if payload.cleaning_quote_max is not None
            else quote["cleaning_quote_max"],

        "dewatering_addon_min":
            payload.dewatering_addon_min
            if payload.dewatering_addon_min is not None
            else quote["dewatering_addon_min"],

        "dewatering_addon_max":
            payload.dewatering_addon_max
            if payload.dewatering_addon_max is not None
            else quote["dewatering_addon_max"],

        "combined_budgetary_value_min":
            payload.combined_budgetary_value_min
            if payload.combined_budgetary_value_min is not None
            else quote["combined_budgetary_value_min"],

        "combined_budgetary_value_max":
            payload.combined_budgetary_value_max
            if payload.combined_budgetary_value_max is not None
            else quote["combined_budgetary_value_max"]

    }



    # ====================================
    # SAVE
    # ====================================

    print("\n===== QUOTE DATA =====")
    for k, v in quote_data.items():
        print(k, "=", v)
    print("======================\n")

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
            "ops_selector_id": quote.ops_selection_id,
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

    return build_quote(db, ops)


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
    
    BLOCKED_STATUSES = {
        "MANAGEMENT_APPROVAL",
        "APPROVAL_COMPLETED",
        "JOB_SHEET_CREATED",
        "READY_FOR_ALLOCATION",
        "JOB_IN_PROGRESS",
        "JOB_COMPLETED"
    }

    if quote.workflow_status in BLOCKED_STATUSES:
        raise ValueError(
            "Customer review has already been completed."
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

    existing = EnquiryService.get_received_enquiries(
        db,
        "MANAGEMENT"
    )

    already_exists = any(
        e.requested_task == "MANAGEMENT_APPROVAL"
        and e.quote_id == quote.id
        and not e.completed
        for e in existing
    )

    if already_exists:

        print("[Workflow] Existing Management Approval enquiry found.")

    else:

        EnquiryService.create_approval_board_enquiry(
            db,
            quote.customer_request_id,
            ops.sales_survey_id,
            quote.id,
            {
                "customer_request_id": ops.customer_request_id,
                "sales_survey_id": ops.sales_survey_id,
                "ops_selector_id": quote.ops_selection_id,
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
    
    BLOCKED_STATUSES = {
        "MANAGEMENT_APPROVAL",
        "APPROVAL_COMPLETED",
        "JOB_SHEET_CREATED",
        "READY_FOR_ALLOCATION",
        "JOB_IN_PROGRESS",
        "JOB_COMPLETED"
    }

    if quote.workflow_status in BLOCKED_STATUSES:
        raise ValueError(
            "Customer review has already been completed."
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





    quote.workflow_status = "OPS_APPROVAL"

    db.commit()

    db.refresh(quote)

    update_customer_request_status(
        db,
        quote.customer_request_id,
        "OPS_APPROVED"
    )

    print("========== REVISION DEBUG ==========")
    print("Current quote revision:", quote.revision_number)
    print("Checking existing OPS approvals...")

    for e in existing:
        print(
            e.id,
            e.requested_task,
            e.revision,
            e.completed
        )

    print("already_exists =", already_exists)

    existing = EnquiryService.get_received_enquiries(
        db,
        "OPERATIONS"
    )

    already_exists = any(
        e.requested_task == "OPS_APPROVAL"
        and e.customer_request_id == quote.customer_request_id
        and e.revision == quote.revision_number + 1
        and not e.completed
        for e in existing
    )

    if already_exists:

        print("[Workflow] Existing OPS Approval enquiry found.")

    else:

        print("CREATING NEW OPS APPROVAL ENQUIRY")

        EnquiryService.create_ops_approval_enquiry(

            db,

            quote.customer_request_id,

            ops.sales_survey_id,

            {
                "customer_request_id": ops.customer_request_id,
                "sales_survey_id": ops.sales_survey_id,

                # Force new pipeline
                "ops_selector_id": None,
                "quote_id": None,

                "revision": quote.revision_number + 1
            }

        )

        print("[Workflow] Revision returned to OPS Approval")

    return quote


# ====================================
# SAVE TECHNO-COMMERCIAL APPROVAL DECISION
# ====================================

def save_techno_approval_decision(

    db,

    quote_id,

    status,

    approved_by,

    note

):

    quote = get_quote(

        db,

        quote_id

    )

    if quote is None:

        raise ValueError(

            "Quote not found."

        )

    quote.techno_status = status

    quote.techno_approved_by = approved_by

    quote.techno_approved_date = date.today().isoformat()

    quote.techno_note = note

    db.commit()

    db.refresh(

        quote

    )

    return quote