# ====================================
# IMPORTS
# ====================================

from backend.models.hub import Hub
from backend.models.hub_approver import HubApprover
from backend.models.sales_survey import SalesSurvey
from backend.models.users import User
from backend.models.enquiry import Enquiry

from backend.repositories.notification_repository import record_approval_change


# ====================================
# APPROVAL TYPES
# One HubApprover.approval_type value per real approval gate this app
# enforces identity/hub-standing on. Kept as a small set of plain
# strings (matching the existing DB values) rather than a DB enum,
# since HubApprover.approval_type is already a free VARCHAR.
#
# Phase 22: QUOTE_COMMERCIAL replaces the old TECHNO_COMMERCIAL type -
# Techno-Commercial's standalone approval action is retired (its tab
# becomes a read-only "Techno-Commercial Review"), and the hub-approver
# gate it used to own moves to the Quote & Commercial tab instead. Same
# underlying HubApprover rows, renamed value (see migration 037).
# ====================================

OPS_REVIEW = "ops_review"
QUOTE_COMMERCIAL = "quote_commercial"
COMMERCIAL_APPROVAL = "commercial_approval"

ALL_APPROVAL_TYPES = [OPS_REVIEW, QUOTE_COMMERCIAL, COMMERCIAL_APPROVAL]

_APPROVAL_TYPE_LABELS = {
    OPS_REVIEW: "Ops Review",
    QUOTE_COMMERCIAL: "Quote & Commercial",
    COMMERCIAL_APPROVAL: "Commercial Approval"
}

# Stage labels for verify_stage_action's error message - kept as a
# small local dict rather than importing frontend label maps (backend
# has no reason to depend on frontend files); mirrors the wording used
# elsewhere for these same stages.
_STAGE_LABELS = {
    "CUSTOMER_REQUEST": "Customer Request",
    "SALES_SURVEY": "Survey",
    "OPS_REVIEW": "Ops Review",
    "QUOTE_COMMERCIAL_REVIEW": "Quote & Commercial",
    "COMMERCIAL_APPROVAL": "Commercial Approval",
    "QUOTE_RELEASED": "Quote Released",
    "PO_RECEIVED": "PO Received",
    "JOB_CREATION": "Job Creation",
    "EXECUTION": "Execution",
    "COMPLETED": "Completed"
}


# ====================================
# RESOLVE AN ENQUIRY'S HUB
# Enquiry -> Enquiry.sales_survey_id -> SalesSurvey.nearest_hub (a
# free-text string) -> Hub.hub_name (string match). Mirrors
# reviews_service.py's own _hub_for_enquiry exactly, but kept as an
# independent copy here rather than importing that one - this module
# is used from security-relevant approval-gating code paths and
# reviews_service.py is display-only; keeping them decoupled means a
# future change to either can't accidentally regress the other.
# ====================================

def resolve_enquiry_hub(db, enquiry):

    if not enquiry or not enquiry.sales_survey_id:
        return None

    survey = (
        db.query(SalesSurvey)
        .filter(SalesSurvey.id == enquiry.sales_survey_id)
        .first()
    )

    if not survey or not survey.nearest_hub:
        return None

    return (
        db.query(Hub)
        .filter(Hub.hub_name == survey.nearest_hub)
        .first()
    )


# ====================================
# VERIFICATION ERROR
# Raised by verify_approval_action/verify_stage_action specifically -
# a ValueError subclass, so any existing bare `except ValueError`
# still catches it, but API routes can also catch this exact type to
# map it to 403 (standing/stage failures) while a plain ValueError
# elsewhere in the same try block (e.g. "not found") still maps to 404
# - no string-sniffing the message to guess which one occurred.
# ====================================

class ApprovalVerificationError(ValueError):
    pass


# ====================================
# IS THIS USER APPROVED FOR THIS HUB + GATE
# ====================================

def is_approved_for_hub(db, hub_id, user_id, approval_type):

    if not hub_id or not user_id:
        return False

    return (
        db.query(HubApprover)
        .filter(
            HubApprover.hub_id == hub_id,
            HubApprover.user_id == user_id,
            HubApprover.approval_type == approval_type
        )
        .first()
    ) is not None


# ====================================
# VERIFY AN APPROVAL ACTION
# Raises ValueError (caller translates to HTTP 403) unless the actor
# genuinely holds real approval standing for this enquiry's hub, for
# this specific gate (ops_review / quote_commercial /
# commercial_approval).
#
# Phase 22: identity comes purely from being logged in as this actor -
# no typed "your name" confirmation anymore (removed per direct
# instruction; every decision surface that used to compare a typed
# name against actor.name no longer collects one at all).
# ====================================

def verify_approval_action(db, enquiry, actor, approval_type):

    if not actor or not actor.name or not actor.user_id:
        raise ApprovalVerificationError("You must be logged in to perform this action.")

    hub = resolve_enquiry_hub(db, enquiry)

    if not hub:
        raise ApprovalVerificationError(
            "This enquiry's hub could not be determined from its Sales Survey - "
            "approval standing cannot be verified."
        )

    if not is_approved_for_hub(db, hub.id, actor.user_id, approval_type):

        label = _APPROVAL_TYPE_LABELS.get(approval_type, approval_type.replace("_", " "))

        raise ApprovalVerificationError(
            f"{actor.name} does not have {label} approval standing for hub '{hub.hub_name}'."
        )


# ====================================
# VERIFY THE ENQUIRY IS AT THE RIGHT STAGE
# Every gate's Approve/Send-back needs the enquiry to actually be
# sitting at that gate's stage right now - active only during exactly
# the "preceding stage" for that action, not before and not after a
# decision has already moved it on. Raises ValueError either way
# (too early or already past) so a stale page / re-click can never
# silently re-fire an already-completed decision.
# ====================================

def verify_stage_action(enquiry, required_stage):

    current = enquiry.stage if enquiry else None

    required_value = (
        required_stage.value if hasattr(required_stage, "value") else required_stage
    )

    if current == required_value:
        return

    current_label = _STAGE_LABELS.get(current, current or "an unknown stage")
    required_label = _STAGE_LABELS.get(required_value, required_value)

    raise ApprovalVerificationError(
        f"This case is at {current_label}, not {required_label} - action unavailable."
    )


# ====================================
# SHARED REGRESSION HELPER
# Every "send this case back to Ops Review" path (Quote & Commercial's
# Send Back, Commercial Approval's Reject, Commercial Approval's own
# Send Back) lands on the exact same real state: stage -> OPS_REVIEW,
# AND both gates downstream of Ops Review reset to a clean "Pending" -
# not just OpsSelection.review_status (the only thing any of the three
# call sites reset before Phase 22), but also Quote.quote_commercial_
# status, so re-entering the Quote & Commercial gate after a real
# regression doesn't show a stale "already approved" and refuse to
# re-open. One function, three call sites, instead of three
# near-identical partial copies.
# ====================================

def regress_to_ops_review(db, ops, quote, target_enquiry, actor_name, note):

    # Deferred imports - workflow_service/ops_selector_service both
    # import from other modules at their own top level, so importing
    # them at this module's top level risks a circular import; by the
    # time this function is actually called, everything is fully
    # loaded, so a function-local import is safe.
    from backend.services.workflow_service import update_stage, WorkflowStage
    from backend.services.ops_selector_service import save_ops_review_decision
    from backend.repositories.techno_commercial_quote_repository import reset_quote_commercial_status

    if target_enquiry:
        update_stage(db, target_enquiry.id, WorkflowStage.OPS_REVIEW.value)

    if ops is not None:
        save_ops_review_decision(db, ops.id, "Pending", actor_name, note)

    if quote is not None:
        reset_quote_commercial_status(db, quote.id, note)


# ====================================
# APPROVAL STANDING (read-only, for the frontend to pre-disable
# buttons before the user even attempts an action)
# ====================================

def get_enquiry_approval_standing(db, enquiry, user_id):

    hub = resolve_enquiry_hub(db, enquiry)

    if not hub:
        return {
            "hub_name": None,
            "ops_review": False,
            "quote_commercial": False,
            "commercial_approval": False,
            "ops_review_approvers": [],
            "quote_commercial_approvers": [],
            "commercial_approval_approvers": []
        }

    approvers = (
        db.query(HubApprover)
        .filter(HubApprover.hub_id == hub.id)
        .all()
    )

    user_names = {
        user.id: user.name
        for user in db.query(User).all()
    }

    names_by_type = {approval_type: [] for approval_type in ALL_APPROVAL_TYPES}
    user_ids_by_type = {approval_type: set() for approval_type in ALL_APPROVAL_TYPES}

    for approver in approvers:

        if approver.approval_type not in names_by_type:
            continue

        user_ids_by_type[approver.approval_type].add(approver.user_id)

        name = user_names.get(approver.user_id)

        if name:
            names_by_type[approver.approval_type].append(name)

    return {
        "hub_name": hub.hub_name,
        "ops_review": user_id in user_ids_by_type[OPS_REVIEW],
        "quote_commercial": user_id in user_ids_by_type[QUOTE_COMMERCIAL],
        "commercial_approval": user_id in user_ids_by_type[COMMERCIAL_APPROVAL],
        "ops_review_approvers": names_by_type[OPS_REVIEW],
        "quote_commercial_approvers": names_by_type[QUOTE_COMMERCIAL],
        "commercial_approval_approvers": names_by_type[COMMERCIAL_APPROVAL]
    }


# ====================================
# APPROVER USER IDS (Phase 27)
# Every real user_id who holds standing for this hub + gate - the
# recipient list for both a real decision notification and a "Request
# Approval" ping. Small helper factored out of the standing-lookup
# above so notification-targeting call sites don't need to re-derive
# it from a full HubApprover query themselves.
# ====================================

def get_approver_user_ids(db, hub_id, approval_type):

    if not hub_id:
        return []

    return [
        row.user_id
        for row in (
            db.query(HubApprover)
            .filter(HubApprover.hub_id == hub_id, HubApprover.approval_type == approval_type)
            .all()
        )
    ]


# ====================================
# REQUEST APPROVAL (Phase 27)
# The new "please review this" ping, available on every tab that has a
# real approval gate (Ops Review, Quote & Commercial, Commercial
# Approval) - unlike an actual decision, this never changes any state;
# it only notifies the real hub-approvers for that gate. Reuses the
# exact same record_change() pipeline (via record_approval_change) so
# it shows up in the Audit Trail / export like everything else, with a
# single synthetic "change" row since there's no real field diff.
# ====================================

def request_approval_request(db, enquiry_id, approval_type, actor):

    if approval_type not in ALL_APPROVAL_TYPES:
        raise ValueError(f"Unknown approval type '{approval_type}'.")

    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()

    if enquiry is None:
        raise ValueError("Enquiry not found.")

    hub = resolve_enquiry_hub(db, enquiry)

    if not hub:
        raise ValueError(
            "This enquiry's hub could not be determined from its Sales Survey - "
            "unable to resolve who to notify."
        )

    approver_ids = get_approver_user_ids(db, hub.id, approval_type)

    label = _APPROVAL_TYPE_LABELS.get(approval_type, approval_type.replace("_", " "))

    if not approver_ids:
        raise ValueError(f"No {label} approvers configured for hub '{hub.hub_name}'.")

    actor_name = actor.name if actor else "Someone"

    title = (
        f"{actor_name} requested {label} approval for Enquiry #{enquiry.id}"
        f"{' - ' + enquiry.customer_name if enquiry.customer_name else ''}"
    )

    record_approval_change(
        db,
        label,
        "REQUEST",
        actor.user_id if actor else None,
        actor.name if actor else None,
        actor.role if actor else None,
        enquiry.id,
        enquiry.customer_name,
        title,
        [{"field": "approval_requested", "before": None, "after": label}],
        approver_ids
    )

    return {"requested_to": len(approver_ids)}
