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

from backend.services.invoice_service import _resolve_purchase_order_for_job
from backend.repositories.techno_commercial_quote_repository import get_quote_by_ops_selection


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

    # Expected and Collected are two segments of the SAME pool, not two
    # independently-computed numbers: every created invoice's real PO
    # value sits in exactly one of them - Expected while the job isn't
    # done, Collected once it is - so together they must reconstruct
    # Total PO Revenue exactly. That only holds if both draw from the
    # SAME resolved-PO value (via _resolve_po_value_for_invoice below).
    # Previously Collected pulled from the separately-stored
    # amount_collected column instead - correct in the normal flow
    # (it's set from invoice_value at completion, which is itself
    # PO-derived), but it silently drifted whenever invoice_value had
    # been set directly with no real PO behind it (e.g. manually-seeded
    # test data) - exactly what let Expected + Collected exceed Total
    # PO Revenue. An invoice with no resolvable PO at all now
    # contributes 0 to both segments, rather than inflating Collected
    # on its own with a figure Total PO Revenue never included in the
    # first place.
    #
    # One shared dedup set across BOTH segments, not one per segment -
    # if the same real PO ever backs two invoices where one has been
    # collected and the other hasn't, per-segment dedup would still let
    # that PO's value land in both buckets at once (double-counted
    # across Expected+Collected even though neither segment
    # double-counted it on its own). Whichever invoice is processed
    # first claims that PO's value into its own bucket; any later
    # invoice referencing the same PO is skipped entirely, regardless
    # of its own status - so every real PO's value lands in exactly one
    # segment, never split or duplicated across the two.
    po_cache = {}
    job_cache = {}
    seen_po_ids = set()
    expected_invoice_revenue = 0.0
    collected_invoice_revenue = 0.0

    for inv in invoices:

        po_id, value = _resolve_po_value_for_invoice(db, inv, po_cache, job_cache)

        if po_id is not None:
            if po_id in seen_po_ids:
                continue
            seen_po_ids.add(po_id)

        if inv.collection_status == "Collected":
            collected_invoice_revenue += value
        else:
            expected_invoice_revenue += value

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

# Strictly PO-backed - the stored invoice_value snapshot, its linked
# PO, or a PO that exists now but wasn't linked yet (re-resolved live,
# same chain create_invoice_request itself uses). Deliberately never
# falls back to a Quote estimate - this is what "Expected Invoice
# Revenue" is built from, shown right next to "Total PO Revenue" on
# the same KPI card, so it must never exceed the real PO pool it's
# drawn from. A job with no real PO at all correctly contributes 0
# here - see _job_value_detail below for a version that also surfaces
# a pre-PO quote estimate, clearly labeled as such, for the Deployment
# tab's per-job display (where showing nothing at all was the actual
# complaint - the KPI/forecast total must still stay PO-backed only).
#
# include_collected=False (the KPI/Revenue-tab "Expected" callers)
# excludes any job whose invoice has already reached
# collection_status == "Collected" - once a job is genuinely done and
# its value has moved into Collected Invoice Revenue, it is no longer
# "expected" (direct correction: the same job's value was being
# counted in BOTH totals at once, which is exactly why Expected could
# read higher than Total PO Revenue - a job that's Collected is a
# strict subset of PO-backed jobs, so double-counting it was the only
# way Expected could ever exceed the PO pool). include_collected=True
# (the default, used by Deployment's own _job_value_detail) keeps
# showing a completed job's real historical value there, since that's
# a factual record of what the job was worth, not a forward-looking
# figure that must stay disjoint from "already collected".
# KPI-level shared resolver. Returns (po_id, value) for ANY invoice's
# real, resolvable Purchase Order - regardless of collection status.
# This is the one resolution both Expected and Collected build from in
# get_kpi_summary, so the two segments are genuinely built from the
# same PO-backed figure and partition Total PO Revenue between them,
# rather than each pulling from a different source that can drift.
# Deliberately does NOT fall back to a bare invoice_value with no
# resolvable PO - a value only counts here if it traces back to a real
# Purchase Order, matching "expected invoice is only when jobs are
# created" extended equally to the Collected side: an invoice with no
# real PO contributes 0 to both segments instead of inflating either
# one on its own.
def _resolve_po_value_for_invoice(db, invoice, po_cache, job_cache):

    if invoice is None:
        return None, 0.0

    job_creation_id = invoice.job_creation_id

    if job_creation_id in job_cache:
        job = job_cache[job_creation_id]
    else:
        job = db.query(JobCreation).filter(JobCreation.id == job_creation_id).first()
        job_cache[job_creation_id] = job

    po = None

    if invoice.purchase_order_id is not None:

        cache_key = invoice.purchase_order_id

        if cache_key in po_cache:
            po = po_cache[cache_key]
        else:
            po = db.query(PurchaseOrder).filter(PurchaseOrder.id == cache_key).first()
            po_cache[cache_key] = po

    if po is None and job is not None:
        po = _resolve_purchase_order_for_job(db, job)

    if po is not None and po.po_value is not None:
        return po.id, float(po.po_value)

    return None, 0.0


def _invoice_value_for_job(db, job_creation_id, cache, include_collected=True):

    cache_key = (job_creation_id, include_collected)

    if cache_key in cache:
        return cache[cache_key]

    invoice = (
        db.query(Invoice)
        .filter(Invoice.job_creation_id == job_creation_id)
        .first()
    )

    value = 0.0

    if not include_collected and invoice is not None and invoice.collection_status == "Collected":

        value = 0.0

    elif invoice is not None and invoice.invoice_value is not None:

        value = float(invoice.invoice_value)

    else:

        job = db.query(JobCreation).filter(JobCreation.id == job_creation_id).first()

        po = None

        if invoice is not None and invoice.purchase_order_id is not None:
            po = db.query(PurchaseOrder).filter(PurchaseOrder.id == invoice.purchase_order_id).first()

        if po is None and job is not None:
            po = _resolve_purchase_order_for_job(db, job)

        if po is not None and po.po_value is not None:
            value = float(po.po_value)

    cache[cache_key] = value

    return value


# ====================================
# JOB VALUE DETAIL (Deployment tab only)
# Prefers the real PO-backed figure above; only when that's genuinely
# 0 (no PO on file at all) falls back to the job's own finalized Quote
# value, explicitly labeled "quote_estimate" rather than folded
# silently into a real committed figure - so a job the user is looking
# at in Deployment always shows something meaningful, without ever
# contaminating the strictly-PO-backed revenue totals above.
# ====================================

def _job_value_detail(db, job_creation_id):

    po_value = _invoice_value_for_job(db, job_creation_id, {})

    if po_value > 0:
        return {"value": po_value, "source": "po"}

    job = db.query(JobCreation).filter(JobCreation.id == job_creation_id).first()

    if job is not None and job.ops_selection_id is not None:

        quote = get_quote_by_ops_selection(db, job.ops_selection_id)

        if quote is not None:

            if quote.final_approved_value is not None:
                return {"value": float(quote.final_approved_value), "source": "quote_estimate"}

            if quote.combined_budgetary_value_min is not None and quote.combined_budgetary_value_max is not None:
                return {
                    "value": (float(quote.combined_budgetary_value_min) + float(quote.combined_budgetary_value_max)) / 2,
                    "source": "quote_estimate"
                }

    return {"value": 0.0, "source": "none"}


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
                total += _invoice_value_for_job(db, booking.job_creation_id, value_cache, include_collected=False)

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
                total += _invoice_value_for_job(db, booking.job_creation_id, value_cache, include_collected=False)

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

    # Resolves a segment's own job value once per execution_id, not
    # once per segment - a job's 3 phases share the same execution, so
    # this avoids re-querying the same Invoice/PO/Quote chain 3 times.
    job_value_cache_by_execution = {}

    def _value_for_segment(segment):

        if segment.execution_id is None:
            return {"value": 0.0, "source": "none"}

        if segment.execution_id not in job_value_cache_by_execution:

            segment_execution = (
                db.query(Execution)
                .filter(Execution.id == segment.execution_id)
                .first()
            )

            job_value_cache_by_execution[segment.execution_id] = (
                _job_value_detail(db, segment_execution.job_creation_id)
                if segment_execution else {"value": 0.0, "source": "none"}
            )

        return job_value_cache_by_execution[segment.execution_id]

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
            "ended_at": s.ended_at,
            **_value_for_segment(s)
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
                "ended_at": booking.planned_completion,
                **_job_value_detail(db, booking.job_creation_id)
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
    #
    # Shows whenever there's EITHER a real position to plot OR a real
    # job to report on - not the AND of both. A machine can be
    # genuinely idle with only a last-known position (no job, still
    # worth a pin), or have a genuine current job with no GPS position
    # ever recorded (no pin possible, but its job value/dates are
    # still real and worth showing). latitude/longitude stay null in
    # the response when unavailable - the frontend only plots a map
    # pin when they're present, but still renders the job info either
    # way.
    today_in_range = start <= date.today() <= end
    has_position = machine and machine.current_latitude is not None and machine.current_longitude is not None
    has_current_job = open_segment or (machine and machine.current_job_id)

    if today_in_range and machine and (has_position or has_current_job):

        if open_segment:

            # The segment's own started_at only says when THIS leg
            # (transit/on-site) began - the job it belongs to has its
            # own real scheduled window, resolved via the linked
            # Execution, which is what "start and end date of the job"
            # actually means here.
            job_start = None
            job_end = None
            job_value = _value_for_segment(open_segment)

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
                "job_end": job_end,
                **job_value
            }

        else:

            job_purpose = None
            job_start = None
            job_end = None
            job_value = {"value": 0.0, "source": "none"}

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

                job_value = _job_value_detail(db, machine.current_job_id)

            current_position = {
                "latitude": machine.current_latitude,
                "longitude": machine.current_longitude,
                "segment_type": machine.status,
                "purpose_label": job_purpose or machine.current_site or "No current job on record",
                "started_at": None,
                "job_start": job_start,
                "job_end": job_end,
                **job_value
            }

    return {
        "actual": actual,
        "planned": planned,
        "current_position": current_position
    }
