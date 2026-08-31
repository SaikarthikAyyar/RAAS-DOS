# ====================================
# IMPORTS
# ====================================

from datetime import date, timedelta

from backend.models.fleet_unit import FleetUnit
from backend.models.fleet_schedule import FleetSchedule
from backend.models.machine_inventory import MachineInventory
from backend.models.invoice import Invoice
from backend.models.purchase_order import PurchaseOrder
from backend.models.job_creation import JobCreation
from backend.models.machine_deployment_segment import MachineDeploymentSegment
from backend.models.execution import Execution
from backend.models.enquiry import Enquiry
from backend.models.hub import Hub

from backend.utils.geocode import forward_geocode


# ====================================
# KPI SUMMARY
# Everything but Total PO revenue is resolved purely by walking the
# Invoice reference chain, per the module's own design - Total PO
# revenue is the one figure that genuinely only exists on
# PurchaseOrder itself.
# ====================================

def get_kpi_summary(db):

    total_po_revenue = sum(
        float(po.po_value)
        for po in db.query(PurchaseOrder).all()
        if po.po_value is not None
    )

    invoices = db.query(Invoice).all()

    expected_invoice_revenue = sum(
        float(inv.invoice_value)
        for inv in invoices
        if inv.invoice_value is not None
    )

    collected_invoice_revenue = sum(
        float(inv.amount_collected)
        for inv in invoices
        if inv.amount_collected is not None
    )

    total_machines = (
        db.query(MachineInventory)
        .filter(MachineInventory.status != "RETIRED")
        .count()
    )

    # A real booking (QUEUED or ACTIVE) counts as deployed whether or
    # not the phase has actually started yet - confirmed design
    # decision (Phase 39). A cancelled booking is a hard-deleted row
    # already, so it's never counted here.
    deployed_machine_ids = (
        db.query(FleetUnit.machine_inventory_id)
        .join(FleetSchedule, FleetSchedule.fleet_unit_id == FleetUnit.id)
        .filter(FleetSchedule.schedule_status.in_(["QUEUED", "ACTIVE"]))
        .distinct()
        .all()
    )

    return {
        "total_po_revenue": total_po_revenue,
        "expected_invoice_revenue": expected_invoice_revenue,
        "collected_invoice_revenue": collected_invoice_revenue,
        "total_machines": total_machines,
        "deployed_machines": len(deployed_machine_ids)
    }


# ====================================
# MACHINE LIST
# Styled like Fleet & Availability's own "All fleet units" table -
# reused as the picker for both Revenue and Deployment tabs.
# ====================================

def get_machine_list(db):

    machines = (
        db.query(MachineInventory)
        .filter(MachineInventory.status != "RETIRED")
        .order_by(MachineInventory.machine_code)
        .all()
    )

    hubs_by_id = {h.id: h for h in db.query(Hub).all()}

    return [
        {
            "id": m.id,
            "machine_code": m.machine_code,
            "machine_name": m.machine_name,
            "hub_name": hubs_by_id[m.hub_id].hub_name if m.hub_id in hubs_by_id else None,
            "current_location": m.current_site,
            "status": m.status
        }
        for m in machines
    ]


# ====================================
# PERIOD BOUNDS + BUCKETS
# Every window is genuinely user-selectable, spanning both directions
# (forecast and history) - confirmed module-wide requirement (Phase 39).
# ====================================

# The user picks the actual start/end dates directly (a real date-range
# control, not a fixed list of presets it's locked to - "the selection
# of time period must not be rigid" was explicit) - this just decides
# a sensible bucket size for whatever span they chose, so a 2-week
# range doesn't render as a single lump and a 2-year range doesn't
# render as 100+ unreadable weekly bars.
def _bucket_granularity_for_range(start, end):

    span_days = (end - start).days

    return "week" if span_days <= 62 else "month"


def _build_buckets(start, end, granularity):

    buckets = []

    if granularity == "week":

        cursor = start

        while cursor <= end:

            bucket_end = min(cursor + timedelta(days=6), end)

            buckets.append({
                "label": f"{cursor.strftime('%d %b')}",
                "start": cursor,
                "end": bucket_end
            })

            cursor = cursor + timedelta(days=7)

    else:

        cursor = date(start.year, start.month, 1)

        while cursor <= end:

            if cursor.month == 12:
                next_month = date(cursor.year + 1, 1, 1)
            else:
                next_month = date(cursor.year, cursor.month + 1, 1)

            buckets.append({
                "label": cursor.strftime("%b-%y"),
                "start": cursor,
                "end": next_month - timedelta(days=1)
            })

            cursor = next_month

    return buckets


# ====================================
# REVENUE FORECAST
# One machine's invoice value plotted against the selected period's
# real buckets, plus every active machine compared over the same
# window with the selected one flagged - both genuinely re-derived
# per (machine, period) combination, nothing pre-computed/cached.
# ====================================

def _invoice_value_for_job(db, job_creation_id, cache):

    if job_creation_id in cache:
        return cache[job_creation_id]

    invoice = (
        db.query(Invoice)
        .filter(Invoice.job_creation_id == job_creation_id)
        .first()
    )

    value = (
        float(invoice.invoice_value)
        if invoice is not None and invoice.invoice_value is not None
        else 0.0
    )

    cache[job_creation_id] = value

    return value


def _bookings_for_machine(db, machine_inventory_id):

    fleet_unit = (
        db.query(FleetUnit)
        .filter(FleetUnit.machine_inventory_id == machine_inventory_id)
        .first()
    )

    if fleet_unit is None:
        return []

    # QUEUED/ACTIVE = future or currently in progress. COMPLETED = real
    # history (dequeue_fleet_schedules marks a finished row this way) -
    # one query genuinely covers both forecast and history.
    return (
        db.query(FleetSchedule)
        .filter(
            FleetSchedule.fleet_unit_id == fleet_unit.id,
            FleetSchedule.schedule_status.in_(["QUEUED", "ACTIVE", "COMPLETED"])
        )
        .all()
    )


def get_revenue_forecast(db, machine_inventory_id, start, end):

    if end < start:
        raise ValueError("End date must not be before start date.")

    granularity = _bucket_granularity_for_range(start, end)
    buckets = _build_buckets(start, end, granularity)

    value_cache = {}

    bookings = _bookings_for_machine(db, machine_inventory_id)

    series = []

    for bucket in buckets:

        total = 0.0

        for booking in bookings:
            if booking.planned_start <= bucket["end"] and booking.planned_completion >= bucket["start"]:
                total += _invoice_value_for_job(db, booking.job_creation_id, value_cache)

        series.append({"label": bucket["label"], "value": round(total, 2)})

    machines = (
        db.query(MachineInventory)
        .filter(MachineInventory.status != "RETIRED")
        .order_by(MachineInventory.machine_code)
        .all()
    )

    comparison = []

    for machine in machines:

        machine_bookings = _bookings_for_machine(db, machine.id)

        total = 0.0

        for booking in machine_bookings:
            if booking.planned_start <= end and booking.planned_completion >= start:
                total += _invoice_value_for_job(db, booking.job_creation_id, value_cache)

        comparison.append({
            "machine_id": machine.id,
            "machine_code": machine.machine_code,
            "value": round(total, 2),
            "selected": machine.id == machine_inventory_id
        })

    return {
        "start": start,
        "end": end,
        "period_label": f"{start.strftime('%d %b %Y')} to {end.strftime('%d %b %Y')}",
        "granularity": granularity,
        "series": series,
        "comparison": comparison
    }


# ====================================
# DEPLOYMENT TIMELINE
# Two layers, clearly distinguished (Phase 39 decision): "actual" is
# the machine's genuine, already-happened history
# (machine_deployment_segments, never contains the future by
# construction); "planned" is synthesized live from this machine's
# still-QUEUED/ACTIVE FleetSchedule bookings whose Phase 1 hasn't
# genuinely started yet - never written to a table, so a reschedule/
# cancellation is reflected immediately with zero stale data.
#
# Both layers are filtered to the same user-selected [start, end]
# range the Revenue tab uses (a real date range, not a fixed preset -
# direct correction, this must never be rigid) - a segment/booking
# "falls under the period" when its own span overlaps the window at
# all, not only when it's fully contained by it, so a job that started
# before the window but is still ongoing inside it still shows.
# ====================================

def get_deployment_timeline(db, machine_inventory_id, start, end):

    if end < start:
        raise ValueError("End date must not be before start date.")

    # Filtered in Python, not at the SQL layer - comparing a plain date
    # against this TIMESTAMPTZ column would have Postgres cast the date
    # to midnight, silently excluding anything later that same calendar
    # day (the exact class of bug already fixed once before in this
    # codebase, for notifications' own date_to filter). A machine's
    # total segment count is always small, so fetching all of them and
    # filtering here in Python sidesteps that ambiguity entirely rather
    # than trying to get the SQL boundary exactly right.
    all_segments = (
        db.query(MachineDeploymentSegment)
        .filter(MachineDeploymentSegment.machine_inventory_id == machine_inventory_id)
        .order_by(MachineDeploymentSegment.started_at)
        .all()
    )

    def _segment_overlaps_range(segment):

        segment_start_date = segment.started_at.date()
        segment_end_date = segment.ended_at.date() if segment.ended_at else date.today()

        return segment_start_date <= end and segment_end_date >= start

    real_segments = [s for s in all_segments if _segment_overlaps_range(s)]

    actual = [
        {
            "segment_type": s.segment_type,
            "start_latitude": s.start_latitude,
            "start_longitude": s.start_longitude,
            "end_latitude": s.end_latitude,
            "end_longitude": s.end_longitude,
            "place_name": s.place_name,
            "purpose_label": s.purpose_label,
            "started_at": s.started_at,
            "ended_at": s.ended_at
        }
        for s in real_segments
    ]

    planned = []

    fleet_unit = (
        db.query(FleetUnit)
        .filter(FleetUnit.machine_inventory_id == machine_inventory_id)
        .first()
    )

    if fleet_unit:

        upcoming = (
            db.query(FleetSchedule)
            .filter(
                FleetSchedule.fleet_unit_id == fleet_unit.id,
                FleetSchedule.schedule_status.in_(["QUEUED", "ACTIVE"])
            )
            .order_by(FleetSchedule.queue_position)
            .all()
        )

        for booking in upcoming:

            execution = (
                db.query(Execution).filter(Execution.id == booking.execution_id).first()
                if booking.execution_id else None
            )

            # A booking whose Phase 1 has genuinely started already has
            # a real "actual" segment above - skip it here so the same
            # job never shows twice.
            if execution and execution.phase_1_status != "PENDING":
                continue

            # Falls under the selected period only if its own planned
            # span overlaps the window at all.
            if booking.planned_start > end or booking.planned_completion < start:
                continue

            coordinates = forward_geocode(booking.site_location) if booking.site_location else None

            enquiry = (
                db.query(Enquiry)
                .filter(Enquiry.job_creation_id == booking.job_creation_id)
                .first()
            )

            purpose = (
                f"{enquiry.customer_name} - {booking.site_location}"
                if enquiry and enquiry.customer_name
                else booking.site_location
            )

            planned.append({
                "segment_type": "PLANNED_JOB",
                "latitude": coordinates[0] if coordinates else None,
                "longitude": coordinates[1] if coordinates else None,
                "place_name": booking.site_location,
                "purpose_label": purpose,
                "started_at": booking.planned_start,
                "ended_at": booking.planned_completion
            })

    machine = db.query(MachineInventory).filter(MachineInventory.id == machine_inventory_id).first()

    # The live position marker must carry the same "why is it here"
    # context every other pin does, not just bare coordinates. Prefers
    # the machine's currently-open segment (real_segments is already
    # ordered oldest-first, so the last one with no ended_at, if any,
    # is the live one) - that's the exact same purpose_label/duration
    # story its own "actual" pin tells, just at the live position
    # instead of the segment's fixed start/end point. Falls back to
    # whatever the machine's own live status/current_job already says
    # when no open segment exists (e.g. its position predates this
    # machine ever going through a real phase transition) - never left
    # with no context at all just because the segment history is thin.
    open_segment = next((s for s in reversed(real_segments) if s.ended_at is None), None)

    current_position = None

    # "Current position" is inherently about right now - only relevant
    # when the selected window actually includes today. A purely past
    # or purely future range shouldn't show a "here's where it is at
    # this instant" pin that has nothing to do with the period being
    # looked at.
    today_in_range = start <= date.today() <= end

    if today_in_range and machine and machine.current_latitude is not None and machine.current_longitude is not None:

        if open_segment:

            # The segment's own started_at only says when THIS leg
            # (transit/on-site) began - the job it belongs to has its
            # own real scheduled window, resolved via the linked
            # Execution, which is what "start and end date of the job"
            # actually means here.
            job_start = None
            job_end = None

            if open_segment.execution_id:

                segment_execution = (
                    db.query(Execution)
                    .filter(Execution.id == open_segment.execution_id)
                    .first()
                )

                if segment_execution:
                    job_start = segment_execution.planned_start
                    job_end = segment_execution.estimated_completion

            current_position = {
                "latitude": machine.current_latitude,
                "longitude": machine.current_longitude,
                "segment_type": open_segment.segment_type,
                "purpose_label": open_segment.purpose_label,
                "started_at": open_segment.started_at,
                "job_start": job_start,
                "job_end": job_end
            }

        else:

            job_purpose = None
            job_start = None
            job_end = None

            if machine.current_job_id:

                job_enquiry = (
                    db.query(Enquiry)
                    .filter(Enquiry.job_creation_id == machine.current_job_id)
                    .first()
                )
                job_purpose = job_enquiry.customer_name if job_enquiry else None

                job_row = (
                    db.query(JobCreation)
                    .filter(JobCreation.id == machine.current_job_id)
                    .first()
                )

                if job_row:
                    job_start = job_row.planned_start
                    job_end = job_row.planned_completion

            current_position = {
                "latitude": machine.current_latitude,
                "longitude": machine.current_longitude,
                "segment_type": machine.status,
                "purpose_label": job_purpose or machine.current_site or "No current job on record",
                "started_at": None,
                "job_start": job_start,
                "job_end": job_end
            }

    return {
        "actual": actual,
        "planned": planned,
        "current_position": current_position
    }
