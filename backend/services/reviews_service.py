# ====================================
# IMPORTS
# Queue-read functions for the Reviews & Approvals module (Phase 16).
# Each function returns only the enquiries currently pending at that
# specific gate. Queue membership is decided by real per-gate status
# fields (enquiry.stage plus OpsSelection.review_status / Quote.
# techno_status / revision_requested / decision history), not by
# `enquiry.stage` alone - Quote & Commercial and Commercial Approval
# both sit at the same COMMERCIAL_APPROVAL stage, so they're told
# apart by whether a commercial-approval decision has been recorded
# yet for the current quote revision.
# ====================================

from backend.models.enquiry import Enquiry
from backend.models.sales_survey import SalesSurvey
from backend.models.ops_selector import OpsSelection
from backend.models.techno_commercial_quote import Quote
from backend.models.approval_board import ApprovalBoard
from backend.models.hub import Hub
from backend.models.hub_approver import HubApprover
from backend.models.users import User

from backend.utils.aging import compute_aging_seconds, aging_seconds_to_days_display


# ====================================
# HUB LOOKUP
# Owner display now comes from real per-user hub_approvers rows
# (Phase 21C), not the old free-text Hub.ops_owner/techno_approver
# columns - one batch query for all hubs/approvers, not N+1.
# ====================================

def _format_names(names):

    if not names:
        return None

    if len(names) == 1:
        return names[0]

    return f"{names[0]} +{len(names) - 1} more"


def _hub_map(db):

    hubs = db.query(Hub).all()

    user_names = {u.id: u.name for u in db.query(User).all()}

    approvers_by_hub = {}

    for approver in db.query(HubApprover).all():

        entry = approvers_by_hub.setdefault(approver.hub_id, {"ops_review": [], "techno_commercial": []})

        name = user_names.get(approver.user_id)

        if name:
            entry[approver.approval_type].append(name)

    result = {}

    for hub in hubs:

        entry = approvers_by_hub.get(hub.id, {"ops_review": [], "techno_commercial": []})

        result[hub.hub_name] = {
            "ops_owner_display": _format_names(entry["ops_review"]),
            "techno_approver_display": _format_names(entry["techno_commercial"])
        }

    return result


def _hub_for_enquiry(db, enquiry, hub_lookup):

    if not enquiry.sales_survey_id:
        return None, None

    survey = (
        db.query(SalesSurvey)
        .filter(SalesSurvey.id == enquiry.sales_survey_id)
        .first()
    )

    if not survey or not survey.nearest_hub:
        return None, None

    return survey.nearest_hub, hub_lookup.get(survey.nearest_hub)


def _base_row(db, enquiry, hub_lookup):

    hub_name, hub = _hub_for_enquiry(db, enquiry, hub_lookup)

    return {

        "enquiry_id": enquiry.id,
        "customer_name": enquiry.customer_name,
        "hub": hub_name,
        "aging_display": aging_seconds_to_days_display(
            compute_aging_seconds(enquiry.stage_entered_at)
        ),
        "_hub_row": hub

    }


# ====================================
# OPS REVIEW QUEUE
# ====================================

def get_ops_review_queue(db):

    hub_lookup = _hub_map(db)

    enquiries = (
        db.query(Enquiry)
        .filter(Enquiry.stage == "OPS_REVIEW")
        .filter(Enquiry.status == "OPEN")
        .order_by(Enquiry.id.desc())
        .all()
    )

    result = []

    for enquiry in enquiries:

        row = _base_row(db, enquiry, hub_lookup)

        result.append({

            "enquiry_id": row["enquiry_id"],
            "customer_name": row["customer_name"],
            "hub": row["hub"],
            "owner": row["_hub_row"]["ops_owner_display"] if row["_hub_row"] else None,
            "metric": row["aging_display"]

        })

    return result


# ====================================
# TECHNO-COMMERCIAL QUEUE
# ====================================

def get_techno_queue(db):

    hub_lookup = _hub_map(db)

    enquiries = (
        db.query(Enquiry)
        .filter(Enquiry.stage == "TECHNO_COMMERCIAL_APPROVAL")
        .filter(Enquiry.status == "OPEN")
        .order_by(Enquiry.id.desc())
        .all()
    )

    result = []

    for enquiry in enquiries:

        row = _base_row(db, enquiry, hub_lookup)

        quote = (
            db.query(Quote).filter(Quote.id == enquiry.quote_id).first()
            if enquiry.quote_id else None
        )

        metric = "—"

        if quote and quote.combined_budgetary_value_min is not None:
            metric = f"{quote.combined_budgetary_value_min:,.0f} - {quote.combined_budgetary_value_max:,.0f}"

        result.append({

            "enquiry_id": row["enquiry_id"],
            "customer_name": row["customer_name"],
            "hub": row["hub"],
            "owner": row["_hub_row"]["techno_approver_display"] if row["_hub_row"] else None,
            "metric": metric

        })

    return result


# ====================================
# QUOTE & COMMERCIAL QUEUE
# Techno-Commercial Approved, and either not yet decided in Commercial
# Approval or explicitly kicked back for revision.
# ====================================

def get_quote_commercial_queue(db):

    hub_lookup = _hub_map(db)

    enquiries = (
        db.query(Enquiry)
        .filter(Enquiry.stage == "COMMERCIAL_APPROVAL")
        .filter(Enquiry.status == "OPEN")
        .order_by(Enquiry.id.desc())
        .all()
    )

    result = []

    for enquiry in enquiries:

        if not enquiry.quote_id:
            continue

        quote = db.query(Quote).filter(Quote.id == enquiry.quote_id).first()

        if not quote or quote.techno_status != "Approved":
            continue

        decided = (
            db.query(ApprovalBoard)
            .filter(ApprovalBoard.quote_id == quote.id)
            .first()
        )

        if decided and not quote.revision_requested:
            continue

        row = _base_row(db, enquiry, hub_lookup)

        metric = "Revision requested" if quote.revision_requested else "Ready to proceed"

        result.append({

            "enquiry_id": row["enquiry_id"],
            "customer_name": row["customer_name"],
            "hub": row["hub"],
            "owner": None,
            "metric": metric

        })

    return result


# ====================================
# COMMERCIAL APPROVAL QUEUE
# ====================================

def get_commercial_queue(db):

    hub_lookup = _hub_map(db)

    enquiries = (
        db.query(Enquiry)
        .filter(Enquiry.stage == "COMMERCIAL_APPROVAL")
        .filter(Enquiry.status == "OPEN")
        .order_by(Enquiry.id.desc())
        .all()
    )

    result = []

    for enquiry in enquiries:

        if not enquiry.quote_id:
            continue

        quote = db.query(Quote).filter(Quote.id == enquiry.quote_id).first()

        if not quote or quote.techno_status != "Approved" or quote.revision_requested:
            continue

        decided = (
            db.query(ApprovalBoard)
            .filter(ApprovalBoard.quote_id == quote.id)
            .first()
        )

        if decided:
            continue

        row = _base_row(db, enquiry, hub_lookup)

        metric = f"{quote.combined_budgetary_value_min:,.0f} - {quote.combined_budgetary_value_max:,.0f}" \
            if quote.combined_budgetary_value_min is not None else "—"

        result.append({

            "enquiry_id": row["enquiry_id"],
            "customer_name": row["customer_name"],
            "hub": row["hub"],
            "owner": None,
            "metric": metric

        })

    return result
