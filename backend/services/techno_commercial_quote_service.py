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

from backend.models.enquiry import Enquiry

from backend.services.enquiry_consolidated_service import update_module_reference

from backend.models.customer_master import Customer

from backend.repositories.business_masters_pricing_repository import (
    get_margin_for_category
)

from backend.services.workflow_service import (
    advance_stage_at_least,
    WorkflowStage
)

from backend.services.hub_approval_service import (
    verify_approval_action,
    verify_stage_action,
    regress_to_ops_review,
    QUOTE_COMMERCIAL
)

from backend.repositories.notification_repository import record_workflow_change


# ====================================
# NOTIFICATION HELPER (Phase 26)
# ====================================

def _notify_quote_commercial_change(db, target_enquiry, actor, action, changes, title):

    if not target_enquiry or not changes:
        return

    record_workflow_change(
        db,
        "Quote & Commercial",
        action,
        actor.user_id if actor else None,
        actor.name if actor else None,
        actor.role if actor else None,
        target_enquiry.id,
        target_enquiry.customer_name,
        title,
        changes
    )


def _resolve_enquiry_for_quote(db, quote, enquiry_id):

    if enquiry_id:
        return db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()

    ops = get_ops_selection(db, quote.ops_selection_id)

    return (
        db.query(Enquiry).filter(Enquiry.sales_survey_id == ops.sales_survey_id)
        .order_by(Enquiry.id.desc()).first()
        if ops else None
    )


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
        payload.ops_selection_id
    )

    workflow_status = "CUSTOMER_REVIEW"

    dewatering_assessment_id = None

    # ====================================
    # RESOLVE ENQUIRY / CUSTOMER CATEGORY
    # Moved up from after quote-creation (where only quote_id linkage
    # used to need it) so the customer's category margin override can
    # be looked up before the commercial calculation runs.
    # ====================================

    if getattr(payload, "enquiry_id", None):

        target_enquiry = (

            db.query(Enquiry)

            .filter(Enquiry.id == payload.enquiry_id)

            .first()

        )

    else:

        # Fallback when the caller doesn't know its enquiry_id (e.g. the
        # standalone Quotes Module opened without workspace context).
        # Ambiguous when historical duplicate rows share a sales_survey_id
        # (pre-dates the consolidated-enquiry fix).
        target_enquiry = (

            db.query(Enquiry)

            .filter(Enquiry.sales_survey_id == ops.sales_survey_id)

            .order_by(Enquiry.id.desc())

            .first()

        )

    category_margin_pct = None

    if target_enquiry and target_enquiry.customer_id:

        customer = (
            db.query(Customer)
            .filter(Customer.id == target_enquiry.customer_id)
            .first()
        )

        if customer:
            category_margin_pct = get_margin_for_category(db, customer.category)

    # ====================================
    # BUILD COMMERCIAL QUOTE
    # ====================================

    quote = build_quote(

        db,

        ops,

        category_margin_pct

    )

    # ====================================
    # BUILD PAYLOAD
    # ====================================

    revision_reason = payload.reason or "Quote generated"

    quote_data = {

        "ops_selection_id":
            payload.ops_selection_id,

        "customer_request_id":
            ops.customer_request_id,

        "revision_number":
            revision_number,

        "workflow_status":
            workflow_status,

        "created_by":
            payload.created_by,

        "revision_reason":
            revision_reason,

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

        "dewatering_method":
            quote["dewatering_method"],

        # --------------------------------
        # User editable fields - every
        # commercial line accepts an
        # override, falling back to the
        # engine-computed value when the
        # user leaves it blank.
        # --------------------------------

    }

    EDITABLE_FIELDS = [

        "mobilisation_cost_min", "mobilisation_cost_max",
        "setup_cost_min", "setup_cost_max",
        "execution_cost_min", "execution_cost_max",
        "pump_addon_cost_min", "pump_addon_cost_max",
        "documentation_buffer",
        "access_support_buffer",
        "direct_cost_min", "direct_cost_max",
        "overhead_cost_min", "overhead_cost_max",
        "contingency_cost_min", "contingency_cost_max",
        "margin_percentage",
        "margin_value_min", "margin_value_max",
        "cleaning_quote_min", "cleaning_quote_max",
        "dewatering_addon_min", "dewatering_addon_max",
        "combined_budgetary_value_min", "combined_budgetary_value_max"

    ]

    for field in EDITABLE_FIELDS:

        override = getattr(payload, field, None)

        quote_data[field] = override if override is not None else quote[field]



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

    print("[Workflow] Updating consolidated Enquiry")

    if target_enquiry:

        update_module_reference(

            db,

            target_enquiry.id,

            "quote_id",

            quote.id

        )

        print(f"[Workflow] Enquiry {target_enquiry.id} -> quote_id={quote.id}")

    else:

        print("[Workflow] WARNING: No consolidated Enquiry found for this sales_survey_id")

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

    return get_quote_by_ops_selection(

        db,

        ops_selection_id

    )


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
# QUOTE & COMMERCIAL GATE DECISION (Phase 22)
# Replaces the retired Techno-Commercial standalone approval - this is
# the real, hub-gated, stage-advancing decision for the Quote &
# Commercial tab now. Atomic and backend-orchestrated, mirroring the
# same pattern used for Ops Review and Commercial Approval: verify
# stage + hub standing, apply the decision, move the stage, all in one
# call. "Pending" is never sent through this function's public entry
# point - the shared regress_to_ops_review helper resets this quote's
# status via its own dedicated repository call instead.
# ====================================

def record_quote_commercial_decision_request(db, quote_id, status, note, actor, enquiry_id):

    quote = get_quote(db, quote_id)

    if quote is None:
        raise ValueError("Quote not found.")

    target_enquiry = (
        db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
        if enquiry_id else None
    )

    if target_enquiry is None:

        ops = get_ops_selection(db, quote.ops_selection_id)

        target_enquiry = (
            db.query(Enquiry).filter(Enquiry.sales_survey_id == ops.sales_survey_id)
            .order_by(Enquiry.id.desc()).first()
            if ops else None
        )

    if status in ("Approved", "Sent back"):

        verify_stage_action(target_enquiry, WorkflowStage.QUOTE_COMMERCIAL_REVIEW)
        verify_approval_action(db, target_enquiry, actor, QUOTE_COMMERCIAL)

        if status == "Approved" and quote.revision_requested:
            raise ValueError("Save a new quote version first.")

    stage_before = target_enquiry.stage if target_enquiry else None

    if status == "Sent back":

        ops = get_ops_selection(db, quote.ops_selection_id)
        regress_to_ops_review(db, ops, quote, target_enquiry, actor.name if actor else None, note)

        result = get_quote(db, quote_id)

        _notify_quote_commercial_change(
            db, target_enquiry, actor, "UPDATE",
            [
                {"field": "quote_commercial_status", "before": "Approved", "after": "Sent back"},
                {"field": "stage", "before": stage_before, "after": target_enquiry.stage if target_enquiry else None}
            ],
            f"{actor.name if actor else 'Someone'} sent the quote back to Ops Review "
            f"for Enquiry #{target_enquiry.id if target_enquiry else quote_id}"
            f"{' - ' + target_enquiry.customer_name if target_enquiry and target_enquiry.customer_name else ''}"
        )

        return result

    quote.quote_commercial_status = status
    quote.quote_commercial_approved_by = actor.name if actor else None
    quote.quote_commercial_approved_date = date.today().isoformat()
    quote.quote_commercial_note = note

    db.commit()
    db.refresh(quote)

    if status == "Approved" and target_enquiry:
        advance_stage_at_least(db, target_enquiry.id, WorkflowStage.COMMERCIAL_APPROVAL.value)

    _notify_quote_commercial_change(
        db, target_enquiry, actor, "UPDATE",
        [
            {"field": "quote_commercial_status", "before": None, "after": status},
            {"field": "quote_commercial_note", "before": None, "after": note},
            {"field": "stage", "before": stage_before, "after": target_enquiry.stage if target_enquiry else None}
        ],
        f"{actor.name if actor else 'Someone'} approved the quote at Quote & Commercial "
        f"for Enquiry #{target_enquiry.id if target_enquiry else quote_id}"
        f"{' - ' + target_enquiry.customer_name if target_enquiry and target_enquiry.customer_name else ''}"
    )

    return quote


# ====================================
# QUOTE & COMMERCIAL TAB
# ====================================

def get_quote_history_request(

    db,

    ops_selection_id

):

    from backend.repositories.techno_commercial_quote_repository import (
        get_quote_history
    )

    return get_quote_history(

        db,

        ops_selection_id

    )


def update_internal_extra_request(

    db,

    quote_id,

    enabled,

    amount,

    note,

    enquiry_id=None,

    actor=None

):

    from backend.repositories.techno_commercial_quote_repository import (
        update_internal_extra
    )

    quote = get_quote(

        db,

        quote_id

    )

    if quote is None:

        raise ValueError("Quote not found.")

    old = {
        "internal_extra_enabled": quote.internal_extra_enabled,
        "internal_extra_amount": quote.internal_extra_amount,
        "internal_extra_note": quote.internal_extra_note
    }

    result = update_internal_extra(

        db,

        quote,

        enabled,

        amount,

        note

    )

    target_enquiry = _resolve_enquiry_for_quote(db, quote, enquiry_id)

    changes = [
        c for c in [
            {"field": "internal_extra_enabled", "before": old["internal_extra_enabled"], "after": enabled}
            if old["internal_extra_enabled"] != enabled else None,
            {"field": "internal_extra_amount", "before": old["internal_extra_amount"], "after": amount}
            if old["internal_extra_amount"] != amount else None,
            {"field": "internal_extra_note", "before": old["internal_extra_note"], "after": note}
            if old["internal_extra_note"] != note else None
        ] if c
    ]

    _notify_quote_commercial_change(
        db, target_enquiry, actor, "UPDATE", changes,
        f"{actor.name if actor else 'Someone'} saved an internal addition on the quote "
        f"for Enquiry #{target_enquiry.id if target_enquiry else quote_id}"
        f"{' - ' + target_enquiry.customer_name if target_enquiry and target_enquiry.customer_name else ''}"
    )

    return result


def update_valid_till_request(

    db,

    quote_id,

    valid_till,

    enquiry_id=None,

    actor=None

):

    from backend.repositories.techno_commercial_quote_repository import (
        update_valid_till
    )

    quote = get_quote(

        db,

        quote_id

    )

    if quote is None:

        raise ValueError("Quote not found.")

    old_valid_till = quote.valid_till

    result = update_valid_till(

        db,

        quote,

        valid_till

    )

    target_enquiry = _resolve_enquiry_for_quote(db, quote, enquiry_id)

    changes = (
        [{"field": "valid_till", "before": old_valid_till, "after": valid_till}]
        if old_valid_till != valid_till else []
    )

    _notify_quote_commercial_change(
        db, target_enquiry, actor, "UPDATE", changes,
        f"{actor.name if actor else 'Someone'} saved the valid-till date on the quote "
        f"for Enquiry #{target_enquiry.id if target_enquiry else quote_id}"
        f"{' - ' + target_enquiry.customer_name if target_enquiry and target_enquiry.customer_name else ''}"
    )

    return result


def flag_quote_revision_requested_request(

    db,

    quote_id,

    requested_by,

    enquiry_id=None,

    actor=None

):

    from backend.repositories.techno_commercial_quote_repository import (
        flag_revision_requested
    )

    quote = get_quote(

        db,

        quote_id

    )

    if quote is None:

        raise ValueError("Quote not found.")

    result = flag_revision_requested(

        db,

        quote,

        requested_by,

        date.today().isoformat()

    )

    target_enquiry = _resolve_enquiry_for_quote(db, quote, enquiry_id)

    _notify_quote_commercial_change(
        db, target_enquiry, actor, "UPDATE",
        [{"field": "revision_requested", "before": False, "after": True},
         {"field": "revision_requested_by", "before": None, "after": requested_by}],
        f"{actor.name if actor else requested_by or 'Someone'} requested a revision on the quote "
        f"for Enquiry #{target_enquiry.id if target_enquiry else quote_id}"
        f"{' - ' + target_enquiry.customer_name if target_enquiry and target_enquiry.customer_name else ''}"
    )

    return result


# ====================================
# QUOTES MODULE
# ====================================

def _status_label(quote):

    if quote.revision_requested:

        return "Revision Requested"

    if quote.workflow_status == "APPROVAL_COMPLETED":

        return "Approved"

    if quote.workflow_status == "REJECTED":

        return "Rejected"

    return quote.workflow_status or "Draft"


def list_quotes_request(

    db,

    status,

    search,

    page,

    page_size

):

    from backend.repositories.techno_commercial_quote_repository import (
        list_quotes
    )

    rows, total = list_quotes(

        db,

        status,

        search,

        page,

        page_size

    )

    items = []

    for quote, company_name, enquiry_id, enquiry_stage in rows:

        items.append({

            "id": quote.id,

            "ops_selection_id": quote.ops_selection_id,

            "customer_request_id": quote.customer_request_id,

            "customer_name": company_name,

            "enquiry_id": enquiry_id,

            "enquiry_stage": enquiry_stage,

            "revision_number": quote.revision_number,

            "workflow_status": quote.workflow_status,

            "status_label": _status_label(quote),

            "revision_requested": quote.revision_requested,

            "combined_budgetary_value_min": quote.combined_budgetary_value_min,

            "combined_budgetary_value_max": quote.combined_budgetary_value_max,

            "created_on": quote.created_on

        })

    return items, total