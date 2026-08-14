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

from backend.repositories.approval_board_repository import (
    record_commercial_approval_decision,
    get_approval_history
)

from backend.models.enquiry import Enquiry

from backend.services.enquiry_consolidated_service import update_module_reference

from backend.services.workflow_service import advance_stage_at_least, update_stage, WorkflowStage

from backend.services.ops_selector_service import save_ops_review_decision

from backend.services.quote_release_service import generate_quote_release_docx

from datetime import date



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

    EnquiryService.create_job_creation_enquiry(

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


# ====================================
# SHARED: REGRESS TO OPS REVIEW
# Factored out of send_back_commercial_approval_request so the
# REJECTED decision path (below) can reuse the exact same stage-
# regression + review-status-reset mechanics without duplicating them.
# ====================================

def _regress_to_ops_review(db, ops, target_enquiry, actor_name, note):

    if target_enquiry:

        update_stage(
            db,
            target_enquiry.id,
            WorkflowStage.OPS_REVIEW.value
        )

    # Ops Review must show a clean, unapproved state when the case
    # lands back there - not the stale "Approved" from before.
    if ops is not None:

        save_ops_review_decision(
            db,
            ops.id,
            "Pending",
            actor_name,
            note
        )


# ====================================
# COMMERCIAL APPROVAL TAB
# ====================================

def get_approval_history_request(

    db,

    ops_selection_id

):

    return get_approval_history(

        db,

        ops_selection_id

    )


def record_commercial_approval_decision_request(

    db,

    quote_id,

    decision,

    approved_by,

    note,

    final_approved_value,

    enquiry_id=None

):

    if decision not in ("APPROVED", "REJECTED"):

        raise ValueError(

            "Decision must be APPROVED or REJECTED."

        )

    quote = get_quote(db, quote_id)

    if quote is None:

        raise ValueError("Quote not found.")

    if quote.techno_status != "Approved":

        raise ValueError(

            "Quote must be Techno-Commercial Approved before it can go "
            "through Commercial Approval."

        )

    if quote.revision_requested:

        raise ValueError(

            "A revision has been requested on this quote - save a new "
            "version before recording a Commercial Approval decision."

        )

    approval = record_commercial_approval_decision(

        db,

        quote_id,

        decision,

        approved_by,

        note

    )

    ops = get_ops_selection(db, quote.ops_selection_id)

    if enquiry_id is not None:

        target_enquiry = (

            db.query(Enquiry)

            .filter(Enquiry.id == enquiry_id)

            .first()

        )

    else:

        # Fallback for callers that don't know their enquiry_id yet.
        # Ambiguous when historical duplicate rows share a
        # sales_survey_id (pre-dates the consolidated-enquiry fix) -
        # callers that have an enquiry_id in hand should always pass it.
        target_enquiry = (

            db.query(Enquiry)

            .filter(Enquiry.sales_survey_id == ops.sales_survey_id)

            .order_by(Enquiry.id.desc())

            .first()

        )

    generated_document = None

    if decision == "APPROVED":

        quote.final_approved_value = final_approved_value

        quote.workflow_status = "APPROVAL_COMPLETED"

        quote.released = True
        quote.released_by = approved_by
        quote.released_date = date.today().isoformat()

        db.commit()

        db.refresh(quote)

        if target_enquiry:

            update_module_reference(

                db,

                target_enquiry.id,

                "approval_board_id",

                approval.id

            )

            # Safety precondition: only ever advance to QUOTE_RELEASED when
            # this enquiry is genuinely sitting at COMMERCIAL_APPROVAL right
            # now - the decision itself is still always recorded above
            # regardless, only the stage-advance is guarded.
            if target_enquiry.stage == WorkflowStage.COMMERCIAL_APPROVAL.value:

                advance_stage_at_least(

                    db,

                    target_enquiry.id,

                    WorkflowStage.QUOTE_RELEASED.value

                )

            generated_document = generate_quote_release_docx(

                db,
                quote_id,
                target_enquiry.id,
                approved_by

            )

    else:

        quote.workflow_status = "REJECTED"

        db.commit()

        db.refresh(quote)

        if target_enquiry:

            update_module_reference(

                db,

                target_enquiry.id,

                "approval_board_id",

                approval.id

            )

        # Direct instruction: Reject must still route the case back to
        # Ops Review, same as Send Back - just recorded under the
        # REJECTED label instead of SENT_BACK for the decision history.
        _regress_to_ops_review(db, ops, target_enquiry, approved_by, note)

    return {
        "approval": approval,
        "quote_release_document_id": generated_document.id if generated_document else None
    }


# ====================================
# SEND BACK FOR REVIEW (Commercial Approval)
# Rejects this pass and routes the whole case back to Ops Review to be
# re-worked and re-walked through every gate again - matches the
# wireframe's commercialApprovalDecision(id,'Sent back') exactly
# (regresses past Techno-Commercial, not just one step back). Commercial
# Approval doesn't revise the quote's values itself, so "send back" here
# means "reject this pass," not "edit the numbers."
# ====================================

def send_back_commercial_approval_request(

    db,

    quote_id,

    sent_back_by,

    note,

    enquiry_id=None

):

    quote = get_quote(db, quote_id)

    if quote is None:

        raise ValueError("Quote not found.")

    if quote.techno_status != "Approved":

        raise ValueError(
            "Quote must be Techno-Commercial Approved before it can go "
            "through Commercial Approval."
        )

    approval = record_commercial_approval_decision(

        db,

        quote_id,

        "SENT_BACK",

        sent_back_by,

        note

    )

    ops = get_ops_selection(db, quote.ops_selection_id)

    if enquiry_id is not None:

        target_enquiry = (

            db.query(Enquiry)

            .filter(Enquiry.id == enquiry_id)

            .first()

        )

    else:

        target_enquiry = (

            db.query(Enquiry)

            .filter(Enquiry.sales_survey_id == ops.sales_survey_id)

            .order_by(Enquiry.id.desc())

            .first()

        )

    if target_enquiry:

        update_module_reference(

            db,

            target_enquiry.id,

            "approval_board_id",

            approval.id

        )

        update_stage(

            db,

            target_enquiry.id,

            WorkflowStage.OPS_REVIEW.value

        )

    # Ops Review must show a clean, unapproved state when the case lands
    # back there - not the stale "Approved" from before this send-back.
    if ops is not None:

        save_ops_review_decision(

            db,

            ops.id,

            "Pending",

            sent_back_by,
            "Reset - sent back from Commercial Approval"

        )

    return approval