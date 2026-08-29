# ====================================
# IMPORTS
# ====================================

from backend.repositories.fleet_schedule_repository import (
    book_fleet_unit,
    list_fleet_unit_queue,
    list_schedules_for_job,
    reschedule_fleet_schedule,
    cancel_fleet_schedule
)

from backend.repositories.job_creation_repository import get_job
from backend.repositories.execution_repository import get_execution_by_job
from backend.services.execution_service import (
    create_execution_request,
    update_execution_after_allocation
)


# ====================================
# BOOK
# Every booked job gets its own Execution row (get-or-create,
# matching allocate_resources' own unconditional
# create_execution_request/update_execution_after_allocation tail)
# and the new fleet_schedule row is linked to it via execution_id -
# this is what dequeue_fleet_schedules matches against once that
# job's execution reaches EXECUTION_COMPLETED.
# ====================================

def book_fleet_unit_request(db, payload):

    schedule = book_fleet_unit(
        db,
        fleet_unit_id=payload.fleet_unit_id,
        job_id=payload.job_id,
        site_location=payload.site_location,
        planned_start=payload.planned_start,
        planned_completion=payload.planned_completion
    )

    execution = get_execution_by_job(db, payload.job_id)

    if execution is None:
        execution = create_execution_request(db, payload.job_id)

    job = get_job(db, payload.job_id)

    updated_execution = update_execution_after_allocation(db, job, payload)

    schedule.execution_id = execution.id
    db.commit()
    db.refresh(schedule)

    # Site location is geocoded into the execution's destination
    # coordinates as part of the call above (see
    # update_execution_after_allocation) - if a real site was given but
    # nothing could be found for it, surface that now rather than
    # leaving it as a silent blank the user only discovers later on
    # the Execution tab's map. destination_geocode_warning is a plain
    # attribute set on the ORM object here, not a real column - picked
    # up by FleetScheduleResponse purely for this one response.
    if (
        updated_execution is not None
        and payload.site_location
        and updated_execution.destination_latitude is None
    ):
        schedule.destination_geocode_warning = (
            f"Couldn't find coordinates for site location \"{payload.site_location}\" - "
            f"the destination will need to be set manually on the Execution tab's Save Route form."
        )

    return schedule


# ====================================
# QUEUE
# ====================================

def _serialize_schedule(r):
    return {
        "id": r.id,
        "fleet_unit_id": r.fleet_unit_id,
        "job_creation_id": r.job_creation_id,
        "execution_id": r.execution_id,
        "queue_position": r.queue_position,
        "site_location": r.site_location,
        "planned_start": r.planned_start,
        "planned_completion": r.planned_completion,
        "actual_start": r.actual_start,
        "actual_completion": r.actual_completion,
        "schedule_status": r.schedule_status
    }


def list_fleet_unit_queue_request(db, fleet_unit_id):

    rows = list_fleet_unit_queue(db, fleet_unit_id)
    return [_serialize_schedule(r) for r in rows]


def list_schedules_for_job_request(db, job_id):

    rows = list_schedules_for_job(db, job_id)
    return [_serialize_schedule(r) for r in rows]


# ====================================
# RESCHEDULE / CANCEL
# ====================================

def reschedule_fleet_schedule_request(db, schedule_id, payload):

    return reschedule_fleet_schedule(
        db,
        schedule_id,
        payload.planned_start,
        payload.planned_completion
    )


def cancel_fleet_schedule_request(db, schedule_id):

    return cancel_fleet_schedule(db, schedule_id)
