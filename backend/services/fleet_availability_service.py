# ====================================
# IMPORTS
# ====================================

from datetime import date, timedelta

from backend.models.fleet_unit import FleetUnit
from backend.models.fleet_schedule import FleetSchedule
from backend.models.machine_inventory import MachineInventory
from backend.models.machines_pumps import Machine
from backend.models.job_creation import JobCreation

from backend.repositories.fleet_unit_repository import build_fleet_unit_dict
from backend.repositories.customer_repository import get_customer
from backend.services.invoice_service import _resolve_purchase_order_for_job


# ====================================
# CUSTOMER NAME RESOLUTION
# A booked week's cell shows the customer/site the job belongs to,
# resolved via the job's own customer_request_id - same chain
# job_creation_service.py already uses to build its own header.
# ====================================

def _customer_name_for_job(db, job_id, cache):

    if job_id in cache:
        return cache[job_id]

    job = db.query(JobCreation).filter(JobCreation.id == job_id).first()

    name = None

    if job is not None:
        customer = get_customer(db, job.customer_request_id)
        name = customer.company_name if customer else None

    cache[job_id] = name

    return name


# ====================================
# PO VALUE RESOLUTION (cached per job)
# ====================================

def _po_value_for_job(db, job_id, cache):

    if job_id in cache:
        return cache[job_id]

    job = db.query(JobCreation).filter(JobCreation.id == job_id).first()
    po = _resolve_purchase_order_for_job(db, job) if job is not None else None

    value = float(po.po_value) if po is not None and po.po_value is not None else 0.0

    cache[job_id] = value

    return value


# ====================================
# CATEGORY RESOLUTION
# Fleet Unit -> machine_inventory -> matched Machine spec row ->
# power_type, the closest existing field to the reference
# spreadsheet's Electric/Hydraulic/RHF/Floating category grouping.
# machine_inventory.machine_code is the spec's own code plus a
# per-unit "-NN" suffix (e.g. spec "SCH-300-PBM" -> inventory
# "SCH-300-PBM-01") - not a strict FK, so matched by prefix, same
# dual-tolerant spirit as quote_engine.py::resolve_machine_rate.
# ====================================

def _category_for_fleet_unit(db, fleet_unit, machine_inventory_row, machine_spec_by_code):

    if machine_inventory_row is None or not machine_inventory_row.machine_code:
        return "Other"

    inventory_code = machine_inventory_row.machine_code

    spec = machine_spec_by_code.get(inventory_code)

    if spec is None:
        for spec_code, candidate in machine_spec_by_code.items():
            if inventory_code.startswith(spec_code + "-") or inventory_code == spec_code:
                spec = candidate
                break

    if spec is None or not spec.power_type:
        return "Other"

    return spec.power_type


# ====================================
# OVERVIEW - Fleet Unit list + each one's current queue
# ====================================

def get_fleet_availability_overview_request(db):

    units = db.query(FleetUnit).filter(FleetUnit.active == True).order_by(FleetUnit.fleet_code).all()  # noqa: E712

    customer_cache = {}

    result = []

    for unit in units:

        unit_dict = build_fleet_unit_dict(db, unit)

        queue_rows = (
            db.query(FleetSchedule)
            .filter(
                FleetSchedule.fleet_unit_id == unit.id,
                FleetSchedule.schedule_status.in_(["QUEUED", "ACTIVE"])
            )
            .order_by(FleetSchedule.queue_position)
            .all()
        )

        unit_dict["queue"] = [
            {
                "id": r.id,
                "job_creation_id": r.job_creation_id,
                "queue_position": r.queue_position,
                "site_location": r.site_location,
                "customer_name": _customer_name_for_job(db, r.job_creation_id, customer_cache),
                "planned_start": r.planned_start,
                "planned_completion": r.planned_completion,
                "schedule_status": r.schedule_status
            }
            for r in queue_rows
        ]

        result.append(unit_dict)

    return result


# ====================================
# FORECAST DATA
# The one real data-assembly pass shared by the JSON endpoint and the
# styled .xlsx export below, so the two can never drift. Per the
# reference spreadsheet's own "3 months Forecast" sheet: real months
# (not just weeks) carry a per-machine Billed Value figure of their
# own, sitting between the Status column and the weekly occupancy
# grid - not just a single aggregate row. Rows = active Fleet Units
# grouped by category; columns = real calendar months touched by the
# rolling week-window, then the weeks themselves.
# ====================================

def _forecast_data(db, weeks=13):

    units = db.query(FleetUnit).filter(FleetUnit.active == True).order_by(FleetUnit.fleet_code).all()  # noqa: E712

    machine_inventory_by_id = {m.id: m for m in db.query(MachineInventory).all()}
    machine_spec_by_code = {m.code: m for m in db.query(Machine).all()}

    today = date.today()
    week_starts = [today + timedelta(days=7 * i) for i in range(weeks)]

    week_columns = []
    for i, start in enumerate(week_starts, start=1):
        end = start + timedelta(days=6)
        week_columns.append({
            "label": f"W{i}",
            "range_label": f"{start.strftime('%d-%b-%y')} to {end.strftime('%d-%b-%y')}",
            "start": start,
            "end": end
        })

    months = []
    seen_months = set()

    for col in week_columns:
        for edge in (col["start"], col["end"]):
            key = (edge.year, edge.month)
            if key not in seen_months:
                seen_months.add(key)
                months.append(key)

    months.sort()

    month_columns = [
        {"key": key, "label": date(key[0], key[1], 1).strftime("%b-%y")}
        for key in months
    ]

    customer_cache = {}
    po_value_cache = {}

    aggregate_monthly = {key: 0.0 for key in months}

    rows = []

    for unit in units:

        machine_row = machine_inventory_by_id.get(unit.machine_inventory_id)
        category = _category_for_fleet_unit(db, unit, machine_row, machine_spec_by_code)

        bookings = (
            db.query(FleetSchedule)
            .filter(
                FleetSchedule.fleet_unit_id == unit.id,
                FleetSchedule.schedule_status.in_(["QUEUED", "ACTIVE"])
            )
            .all()
        )

        # weekly occupancy cells
        cells = []
        booked_weeks = 0

        for col in week_columns:

            occupant = None

            for booking in bookings:
                if booking.planned_start <= col["end"] and booking.planned_completion >= col["start"]:
                    occupant = _customer_name_for_job(db, booking.job_creation_id, customer_cache)
                    break

            if occupant:
                booked_weeks += 1

            cells.append(occupant or "")

        # per-unit monthly billed value, attributed to the month each
        # booking starts in - only for months this window touches.
        unit_monthly = {key: 0.0 for key in months}

        for booking in bookings:

            key = (booking.planned_start.year, booking.planned_start.month)

            if key not in unit_monthly:
                continue

            value = _po_value_for_job(db, booking.job_creation_id, po_value_cache)

            unit_monthly[key] += value
            aggregate_monthly[key] += value

        rows.append({
            "fleet_code": unit.fleet_code,
            "fleet_name": unit.fleet_name,
            "machine_code": machine_row.machine_code if machine_row else None,
            "current_location": bookings[0].site_location if bookings else None,
            "category": category,
            "utilization": f"{booked_weeks}/{weeks}",
            "monthly_values": [unit_monthly[key] for key in months],
            "cells": cells
        })

    rows.sort(key=lambda r: r["category"])

    return {
        "weeks": [{"label": c["label"], "range_label": c["range_label"]} for c in week_columns],
        "months": month_columns,
        "monthly_billed_value": [
            {"month_label": date(key[0], key[1], 1).strftime("%b-%y"), "total": aggregate_monthly[key]}
            for key in months
        ],
        "rows": rows
    }


def build_forecast_request(db, weeks=13):
    return _forecast_data(db, weeks)
