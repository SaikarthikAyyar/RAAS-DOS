# ====================================
# IMPORTS
# ====================================

from datetime import date

from backend.models.fleet_unit import FleetUnit, FleetUnitPersonnel
from backend.models.fleet_schedule import FleetSchedule
from backend.models.machine_inventory import MachineInventory
from backend.models.personnel import Personnel
from backend.models.job_creation import JobCreation
from backend.models.invoice import Invoice

from backend.utils.geocode import reverse_geocode

from backend.repositories.fleet_kit_repository import (
    validate_kit,
    set_schedule_kit,
    apply_kit_to_fleet_unit,
    machine_ids_for_unit
)


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

def book_fleet_unit(
    db,
    fleet_unit_id,
    job_id,
    site_location,
    planned_start,
    planned_completion,
    pump_ids=None,
    accessory_ids=None
):

    fleet_unit = db.query(FleetUnit).filter(FleetUnit.id == fleet_unit_id).first()

    if fleet_unit is None:
        raise ValueError("Fleet unit not found.")

    job = db.query(JobCreation).filter(JobCreation.id == job_id).first()

    if job is None:
        raise ValueError("Job not found.")

    # Phase 45 - every machine bundled onto this Fleet Unit (some for
    # the job, some just for transport/support), not just one. Booking
    # the unit books, and later releases, all of them together.
    machine_ids = machine_ids_for_unit(db, fleet_unit_id)

    machines = (
        db.query(MachineInventory).filter(MachineInventory.id.in_(machine_ids)).all()
        if machine_ids else []
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

    # Phase 44/45 - the pumps/accessories this job takes along, checked
    # against the whole machine bundle. At least one pump is required
    # whenever any machine in the bundle has a compatible pump at all.
    pump_ids, accessory_ids = validate_kit(
        db, machine_ids, pump_ids, accessory_ids, require_pump=True
    )

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
    db.flush()

    # The booking always keeps its own kit; the unit's standing kit
    # only takes it on when this booking is the live one (position 1),
    # so a job queued behind another never overwrites the live kit.
    set_schedule_kit(db, schedule.id, pump_ids, accessory_ids)

    if queue_position == 1:

        apply_kit_to_fleet_unit(db, fleet_unit_id, schedule.id)

        # schedule_status stays QUEUED here, matching MachineSchedule's
        # own convention - it's only ever flipped to ACTIVE by a
        # dequeue promoting it after the row ahead of it completes.
        # queue_position==1 plus the live MachineInventory/Personnel
        # state below is what actually marks "this is the current job."
        # Every machine in the bundle moves together - a transport
        # vehicle is exactly as allocated to this job as the machine
        # doing the work.

        for one_machine in machines:
            one_machine.status = "ALLOCATED"
            one_machine.current_job_id = job.id
            one_machine.current_site = site_location

        # Real reference chain (Phase 39) - a Personnel row's
        # current_invoice_id was declared on the model but never
        # written anywhere until now. Invoice already exists by this
        # point (created at Job Creation time, before any booking).
        booking_invoice = db.query(Invoice).filter(Invoice.job_creation_id == job.id).first()

        for person in crew:
            person.availability_status = "ALLOCATED"
            person.current_job_id = job.id
            person.current_location = site_location
            person.current_invoice_id = booking_invoice.id if booking_invoice else None

    db.commit()
    db.refresh(schedule)

    if machines:

        count = (
            db.query(FleetSchedule)
            .filter(
                FleetSchedule.fleet_unit_id == fleet_unit_id,
                FleetSchedule.schedule_status.in_(["QUEUED", "ACTIVE"])
            )
            .count()
        )

        for one_machine in machines:
            one_machine.queue_count = count

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
# EDIT KIT (Phase 44)
# Swap a broken pump for another, or send an accessory in later. Allowed
# on QUEUED and ACTIVE bookings (unlike reschedule/cancel, which are
# QUEUED-only) since this is exactly what happens mid-job. If the
# booking is the live one (position 1) the unit's standing kit follows.
# ====================================

def update_schedule_kit(db, schedule_id, pump_ids, accessory_ids):

    schedule = get_fleet_schedule(db, schedule_id)

    if schedule is None:
        raise ValueError("Fleet schedule not found.")

    if schedule.schedule_status not in ("QUEUED", "ACTIVE"):
        raise ValueError("Only a queued or active booking's kit can be edited.")

    machine_ids = machine_ids_for_unit(db, schedule.fleet_unit_id)

    pump_ids, accessory_ids = validate_kit(
        db, machine_ids, pump_ids, accessory_ids, require_pump=True
    )

    set_schedule_kit(db, schedule.id, pump_ids, accessory_ids)

    if schedule.queue_position == 1:
        apply_kit_to_fleet_unit(db, schedule.fleet_unit_id, schedule.id)

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

    machine_ids = machine_ids_for_unit(db, fleet_unit_id)

    if machine_ids:
        for machine in db.query(MachineInventory).filter(MachineInventory.id.in_(machine_ids)).all():
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

        # Phase 45 - every machine bundled onto this Fleet Unit moves
        # and releases together, not just one.
        machine_ids = machine_ids_for_unit(db, fleet_unit_id)

        machines = (
            db.query(MachineInventory)
            .filter(MachineInventory.id.in_(machine_ids))
            .with_for_update()
            .all()
            if machine_ids else []
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

            # Phase 44 - the promoted booking's kit becomes the unit's
            # standing kit (skipped for a pre-kit booking with none).
            apply_kit_to_fleet_unit(
                db, fleet_unit_id, next_schedule.id, only_if_present=True
            )

            for one_machine in machines:
                one_machine.status = "ALLOCATED"
                one_machine.current_job_id = next_schedule.job_creation_id
                one_machine.current_site = next_schedule.site_location

            promoted_invoice = db.query(Invoice).filter(
                Invoice.job_creation_id == next_schedule.job_creation_id
            ).first()

            for person in crew:
                person.availability_status = "ALLOCATED"
                person.current_job_id = next_schedule.job_creation_id
                person.current_location = next_schedule.site_location
                person.current_invoice_id = promoted_invoice.id if promoted_invoice else None

        else:

            for one_machine in machines:

                one_machine.status = "AVAILABLE"
                one_machine.current_job_id = None

                # Genuinely idle - no next job to name a site after.
                # Rather than clearing this to a blank/None (a real
                # position with no readable label), it's reverse-
                # geocoded from the machine's own just-synced
                # current_latitude/current_longitude (set by
                # complete_execution_phase right before this call, to
                # the execution's real source point) - same mechanism
                # already used for the "in transit" position labels.
                if one_machine.current_latitude is not None and one_machine.current_longitude is not None:
                    place_name = reverse_geocode(one_machine.current_latitude, one_machine.current_longitude)
                    one_machine.current_site = f"Available - {place_name}" if place_name else None
                else:
                    one_machine.current_site = None

            for person in crew:
                person.availability_status = "AVAILABLE"
                person.current_job_id = None
                person.current_invoice_id = None

        for one_machine in machines:
            one_machine.queue_count = len(remaining)

    db.commit()

    return completed_schedules
