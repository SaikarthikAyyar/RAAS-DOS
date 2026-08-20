# ====================================
# ADMIN DASHBOARD — BUSINESS OVERVIEW
# A self-contained aggregation service for the wireframe-matching
# Admin dashboard - deliberately separate from dashboard_service.py/
# dashboard_repository.py (the existing, already-duplicated file
# backing the Sales/Ops/Management/Customer single-enquiry-drill-down
# dashboards), so those 4 stay completely unaffected.
#
# Every number here is computed live against real Enquiry/Quote/
# Customer/Notification rows - nothing is cached or persisted, same
# posture as the Enquiries list's own aging/value attachment.
# ====================================

from backend.models.enquiry import Enquiry
from backend.models.techno_commercial_quote import Quote
from backend.models.customer_master import Customer
from backend.models.notification import Notification, NotificationChange

from backend.services.workflow_service import WorkflowStage
from backend.services.customer_master_service import _follow_up_bucket

from backend.utils.aging import compute_aging_seconds, aging_seconds_to_days_display


AGING_THRESHOLD_DAYS = 5

RECENT_CASES_LIMIT = 8


# ====================================
# SHARED HELPERS
# ====================================

def _active_enquiries_query(db):

    return db.query(Enquiry).filter(Enquiry.closed_at.is_(None))


def _quotes_by_id(db, enquiries):

    quote_ids = [e.quote_id for e in enquiries if e.quote_id]

    if not quote_ids:
        return {}

    quotes = db.query(Quote).filter(Quote.id.in_(quote_ids)).all()

    return {q.id: q for q in quotes}


def _quote_pipeline_value(quote):

    if quote is None:
        return 0.0

    if quote.final_approved_value is not None:
        return float(quote.final_approved_value)

    if quote.combined_budgetary_value_min is not None and quote.combined_budgetary_value_max is not None:
        return (float(quote.combined_budgetary_value_min) + float(quote.combined_budgetary_value_max)) / 2

    return 0.0


def _attach_aging(enquiries):

    for enquiry in enquiries:

        aging_seconds = compute_aging_seconds(enquiry.stage_entered_at)

        enquiry.aging_seconds = int(aging_seconds)
        enquiry.aging_display = aging_seconds_to_days_display(aging_seconds)

    return enquiries


# ====================================
# KPI TILES
# ====================================

def get_kpi_tiles(db):

    active = _active_enquiries_query(db).all()

    quotes_by_id = _quotes_by_id(db, active)

    open_count = sum(1 for e in active if e.stage != WorkflowStage.COMPLETED.value)

    pipeline_value = sum(
        _quote_pipeline_value(quotes_by_id.get(e.quote_id)) if e.quote_id else 0.0
        for e in active
    )

    pending_approval = 0

    for e in active:

        quote = quotes_by_id.get(e.quote_id) if e.quote_id else None

        if quote and (quote.quote_commercial_status == "Pending" or quote.revision_requested):
            pending_approval += 1

    active_jobs = sum(1 for e in active if e.stage == WorkflowStage.EXECUTION.value)

    quote_commercial_backlog = sum(
        1 for e in active if e.stage == WorkflowStage.QUOTE_COMMERCIAL_REVIEW.value
    )

    active_enquiry_ids = [e.id for e in active]

    ops_amendments = 0

    if active_enquiry_ids:

        ops_amendments = (
            db.query(NotificationChange)
            .join(Notification, NotificationChange.notification_id == Notification.id)
            .filter(
                NotificationChange.field_name == "stage",
                NotificationChange.updated_value == WorkflowStage.OPS_REVIEW.value,
                Notification.enquiry_id.in_(active_enquiry_ids)
            )
            .count()
        )

    return {
        "open_enquiries": open_count,
        "pipeline_value": round(pipeline_value, 2),
        "pending_approval": pending_approval,
        "active_jobs": active_jobs,
        "quote_commercial_backlog": quote_commercial_backlog,
        "ops_amendments_raised": ops_amendments
    }


# ====================================
# PIPELINE BY STAGE
# ====================================

def get_pipeline_by_stage(db):

    active = _active_enquiries_query(db).all()

    counts = {}

    for stage in WorkflowStage:
        counts[stage.value] = 0

    for enquiry in active:

        if enquiry.stage in counts:
            counts[enquiry.stage] += 1

    return [
        {"stage": stage.value, "count": counts[stage.value]}
        for stage in WorkflowStage
    ]


# ====================================
# AGING CASES
# ====================================

def get_aging_cases(db, threshold_days=AGING_THRESHOLD_DAYS):

    active = _active_enquiries_query(db).filter(
        Enquiry.stage != WorkflowStage.COMPLETED.value
    ).all()

    _attach_aging(active)

    threshold_seconds = threshold_days * 86400

    stuck = [e for e in active if e.aging_seconds >= threshold_seconds]

    stuck.sort(key=lambda e: e.aging_seconds, reverse=True)

    return [
        {
            "enquiry_id": e.id,
            "customer_name": e.customer_name,
            "stage": e.stage,
            "aging_seconds": e.aging_seconds,
            "aging_display": e.aging_display
        }
        for e in stuck
    ]


# ====================================
# FOLLOW-UPS
# ====================================

def get_follow_ups(db):

    customers = (
        db.query(Customer)
        .filter(Customer.next_follow_up_date.isnot(None))
        .order_by(Customer.next_follow_up_date.asc())
        .all()
    )

    result = []

    for customer in customers:

        bucket = _follow_up_bucket(customer.next_follow_up_date)

        result.append({
            "customer_id": customer.id,
            "company_name": customer.company_name,
            "owner": customer.next_follow_up_owner,
            "date": customer.next_follow_up_date.isoformat() if customer.next_follow_up_date else None,
            "note": customer.next_follow_up_note,
            "bucket": bucket
        })

    return result


# ====================================
# RECENT CASES
# ====================================

def get_recent_cases(db, limit=RECENT_CASES_LIMIT):

    recent = (
        _active_enquiries_query(db)
        .order_by(Enquiry.created_at.desc())
        .limit(limit)
        .all()
    )

    quotes_by_id = _quotes_by_id(db, recent)

    _attach_aging(recent)

    result = []

    for e in recent:

        quote = quotes_by_id.get(e.quote_id) if e.quote_id else None

        result.append({
            "enquiry_id": e.id,
            "customer_name": e.customer_name,
            "stage": e.stage,
            "value": _quote_pipeline_value(quote) if quote else None,
            "quote_commercial_status": quote.quote_commercial_status if quote else None
        })

    return result


# ====================================
# COMBINED OVERVIEW
# ====================================

def get_dashboard_overview(db):

    return {
        "kpi_tiles": get_kpi_tiles(db),
        "pipeline_by_stage": get_pipeline_by_stage(db),
        "aging_cases": get_aging_cases(db),
        "follow_ups": get_follow_ups(db),
        "recent_cases": get_recent_cases(db)
    }
