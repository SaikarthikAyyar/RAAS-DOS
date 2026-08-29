# ====================================
# IMPORTS
# ====================================

from datetime import date

from backend.models.fleet_unit import FleetUnit, FleetUnitPersonnel
from backend.models.fleet_schedule import FleetSchedule
from backend.models.machine_inventory import MachineInventory
from backend.models.personnel import Personnel
from backend.models.job_creation import JobCreation

from backend.utils.geocode import reverse_geocode


# ====================================
# CREW LOOKUP
# ====================================

def _crew_for_fleet_unit(db, fleet_unit_id):

    return (
        db.query(Personnel)
        .join(FleetUnitPersonnel, FleetUnitPersonnel.personnel_id == Personnel.id)
        .filter(FleetUnitPersonnel.fleet_unit_id == fleet_unit_id)
        .all()
    )


# ====================================
# BOOK FLEET UNIT
# FIFO enqueue against fleet_schedule - direct structural port of the
# machine_schedule enqueue logic (allocation_assignment_service.py),
# now at the Fleet Unit level so machine + crew move together.
# ====================================

def book_fleet_unit(db, fleet_unit_id, job_id, site_location, planned_start, planned_completion):

    fleet_unit = db.query(FleetUnit).filter(FleetUnit.id == fleet_unit_id).first()

    if fleet_unit is None:
        raise ValueError("Fleet unit not found.")

    job = db.query(JobCreation).filter(JobCreation.id == job_id).first()

    if job is None:
        raise ValueError("Job not found.")

    machine = (
        db.query(MachineInventory)
        .filter(MachineInventory.id == fleet_unit.machine_inventory_id)
        .first()
    )

    crew = _crew_for_fleet_unit(db, fleet_unit_id)

    for person in crew:
        if not person.documents_verified:
            raise ValueError(f"{person.full_name} documents are not verified.")

    last_schedule = (
        db.query(FleetSchedule)
        .filter(FleetSchedule.fleet_unit_id == fleet_unit_id)
        .order_by(FleetSchedule.queue_position.desc())
        .first()
    )

    if last_schedule is not None and planned_start <= last_schedule.planned_completion:
        raise ValueError(
            f"{fleet_unit.fleet_name} is already scheduled until "
            f"{last_schedule.planned_completion}."
        )

    queue_position = 1 if last_schedule is None else last_schedule.queue_position + 1

    schedule = FleetSchedule(
        fleet_unit_id=fleet_unit_id,
        job_creation_id=job.id,
        queue_position=queue_position,
        site_location=site_location,
        planned_start=planned_start,
        planned_completion=planned_completion,
        schedule_status="QUEUED"
    )

    db.add(schedule)

    if queue_position == 1:

        # schedule_status stays QUEUED here, matching MachineSchedule's
        # own convention - it's only ever flipped to ACTIVE by a
        # dequeue promoting it after the row ahead of it completes.
        # queue_position==1 plus the live MachineInventory/Personnel
        # state below is what actually marks "this is the current job."

        if machine is not None:
            machine.status = "ALLOCATED"
            machine.current_job_id = job.id
            machine.current_site = site_location

        for person in crew:
            person.availability_status = "ALLOCATED"
            person.current_job_id = job.id
            person.current_location = site_location

    db.commit()
    db.refresh(schedule)

    if machine is not None:
        machine.queue_count = (
            db.query(FleetSchedule)
            .filter(
                FleetSchedule.fleet_unit_id == fleet_unit_id,
                FleetSchedule.schedule_status.in_(["QUEUED", "ACTIVE"])
            )
            .count()
        )
        db.commit()

    return schedule


# ====================================
# QUEUE LISTING
# ====================================

def list_fleet_unit_queue(db, fleet_unit_id):

    return (
        db.query(FleetSchedule)
        .filter(
            FleetSchedule.fleet_unit_id == fleet_unit_id,
            FleetSchedule.schedule_status.in_(["QUEUED", "ACTIVE"])
        )
        .order_by(FleetSchedule.queue_position)
        .all()
    )


def get_fleet_schedule(db, schedule_id):
    return db.query(FleetSchedule).filter(FleetSchedule.id == schedule_id).first()


def list_schedules_for_job(db, job_id):
    return (
        db.query(FleetSchedule)
        .filter(FleetSchedule.job_creation_id == job_id)
        .order_by(FleetSchedule.id)
        .all()
    )


# ====================================
# RESCHEDULE
# QUEUED rows only - re-validated against the same overlap rule used
# at enqueue time, against this fleet unit's other queued neighbors.
# ====================================

def reschedule_fleet_schedule(db, schedule_id, planned_start, planned_completion):

    schedule = get_fleet_schedule(db, schedule_id)

    if schedule is None:
        raise ValueError("Fleet schedule not found.")

    if schedule.schedule_status != "QUEUED":
        raise ValueError("Only a queued booking can be rescheduled.")

    neighbors = (
        db.query(FleetSchedule)
        .filter(
            FleetSchedule.fleet_unit_id == schedule.fleet_unit_id,
            FleetSchedule.id != schedule.id,
            FleetSchedule.schedule_status.in_(["QUEUED", "ACTIVE"])
        )
        .all()
    )

    for other in neighbors:
        if other.queue_position < schedule.queue_position:
            if planned_start <= other.planned_completion:
                raise ValueError(
                    f"Conflicts with the booking ahead of it "
                    f"(scheduled until {other.planned_completion})."
                )
        else:
            if other.planned_start <= planned_completion:
                raise ValueError(
                    f"Conflicts with the booking behind it "
                    f"(starts {other.planned_start})."
                )

    schedule.planned_start = planned_start
    schedule.planned_completion = planned_completion

    db.commit()
    db.refresh(schedule)

    return schedule


# ====================================
# CANCEL
# QUEUED rows only - removes the row and re-compacts queue_position
# for the rest of that fleet unit's queue.
# ====================================

def cancel_fleet_schedule(db, schedule_id):

    schedule = get_fleet_schedule(db, schedule_id)

    if schedule is None:
        raise ValueError("Fleet schedule not found.")

    if schedule.schedule_status != "QUEUED":
        raise ValueError("Only a queued booking can be cancelled.")

    fleet_unit_id = schedule.fleet_unit_id

    db.delete(schedule)
    db.flush()

    remaining = (
        db.query(FleetSchedule)
        .filter(
            FleetSchedule.fleet_unit_id == fleet_unit_id,
            FleetSchedule.schedule_status.in_(["QUEUED", "ACTIVE"])
        )
        .order_by(FleetSchedule.queue_position)
        .all()
    )

    for index, row in enumerate(remaining, start=1):
        if row.queue_position != index:
            row.queue_position = index

    fleet_unit = db.query(FleetUnit).filter(FleetUnit.id == fleet_unit_id).first()

    if fleet_unit is not None:
        machine = (
            db.query(MachineInventory)
            .filter(MachineInventory.id == fleet_unit.machine_inventory_id)
            .first()
        )
        if machine is not None:
            machine.queue_count = len(remaining)

    db.commit()

    return True


# ====================================
# DEQUEUE (fleet-level, execution-driven)
# Direct structural port of dequeue_execution_schedules
# (execution_repository.py) at the Fleet Unit level - promoting the
# next queued booking now also promotes/releases every crew member,
# fixing the personnel-dequeue bug by construction.
# ====================================

def dequeue_fleet_schedules(db, execution):

    completed_schedules = (
        db.query(FleetSchedule)
        .filter(FleetSchedule.execution_id == execution.id)
        .all()
    )

    if not completed_schedules:
        return []

    fleet_unit_ids = {s.fleet_unit_id for s in completed_schedules}

    for fleet_unit_id in fleet_unit_ids:

        fleet_unit = (
            db.query(FleetUnit)
            .filter(FleetUnit.id == fleet_unit_id)
            .with_for_update()
            .first()
        )

        if fleet_unit is None:
            continue

        machine = (
            db.query(MachineInventory)
            .filter(MachineInventory.id == fleet_unit.machine_inventory_id)
            .with_for_update()
            .first()
        )

        crew = _crew_for_fleet_unit(db, fleet_unit_id)

        this_units_completed = [
            s for s in completed_schedules if s.fleet_unit_id == fleet_unit_id
        ]

        for s in this_units_completed:
            s.schedule_status = "COMPLETED"
            s.actual_completion = date.today()

        # This session is configured with autoflush=False (see
        # database/connection.py) - without an explicit flush here,
        # the "remaining" query below re-selects straight from the DB,
        # doesn't see the pending COMPLETED status yet, and the
        # identity map hands back the SAME in-memory row, silently
        # clobbering the completion with an ACTIVE re-promotion.
        db.flush()

        remaining = (
            db.query(FleetSchedule)
            .filter(
                FleetSchedule.fleet_unit_id == fleet_unit_id,
                FleetSchedule.schedule_status.in_(["QUEUED", "ACTIVE"])
            )
            .order_by(FleetSchedule.queue_position)
            .with_for_update()
            .all()
        )

        for index, s in enumerate(remaining, start=1):
            if s.queue_position != index:
                s.queue_position = index

        if remaining:

            next_schedule = remaining[0]
            next_schedule.schedule_status = "ACTIVE"

            if machine is not None:
                machine.status = "ALLOCATED"
                machine.current_job_id = next_schedule.job_creation_id
                machine.current_site = next_schedule.site_location

            for person in crew:
                person.availability_status = "ALLOCATED"
                person.current_job_id = next_schedule.job_creation_id
                person.current_location = next_schedule.site_location

        else:

            if machine is not None:
                machine.status = "AVAILABLE"
                machine.current_job_id = None

                # Genuinely idle - no next job to name a site after.
                # Rather than clearing this to a blank/None (a real
                # position with no readable label), it's reverse-
                # geocoded from the machine's own just-synced
                # current_latitude/current_longitude (set by
                # complete_execution_phase right before this call, to
                # the execution's real source point) - same mechanism
                # already used for the "in transit" position labels.
                if machine.current_latitude is not None and machine.current_longitude is not None:
                    place_name = reverse_geocode(machine.current_latitude, machine.current_longitude)
                    machine.current_site = f"Available - {place_name}" if place_name else None
                else:
                    machine.current_site = None

            for person in crew:
                person.availability_status = "AVAILABLE"
                person.current_job_id = None

        if machine is not None:
            machine.queue_count = len(remaining)

    db.commit()

    return completed_schedules
