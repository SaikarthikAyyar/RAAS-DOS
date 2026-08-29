# ====================================
# IMPORTS
# ====================================

from fastapi import HTTPException

from backend.schemas.execution_schema import (
    ExecutionSchema
)

from datetime import datetime

from backend.models.sales_survey import SalesSurvey

from backend.repositories.execution_repository import (
    create_execution,
    get_execution,
    get_execution_by_job,
    list_executions,
    start_phase,
    complete_phase,
    dequeue_execution_schedules
)

from backend.repositories.job_creation_repository import (
    get_job
)

from backend.services.enquiry_service import (
    EnquiryService
)

from backend.services.status_service import (
    update_customer_request_status
)

from backend.repositories.invoice_repository import (
    get_invoice_by_job,
    update_invoice
)

from backend.models.machine_schedule import MachineSchedule

from backend.models.machine_inventory import MachineInventory

from backend.models.fleet_schedule import FleetSchedule

from backend.models.fleet_unit import FleetUnit

from backend.repositories.fleet_schedule_repository import dequeue_fleet_schedules

from backend.utils.geo import haversine_km

from backend.utils.geocode import reverse_geocode, forward_geocode, extract_hub_city

from backend.models.enquiry import Enquiry

from backend.services.workflow_service import (
    advance_stage_at_least,
    WorkflowStage
)


# ====================================
# MACHINE RESOLUTION (Phase 38)
# Tries the current FleetSchedule/FleetUnit path first (Phase 33+ -
# the real path for any job booked today), falls back to the legacy
# MachineSchedule path for older data - same dual-path convention
# dequeue_execution_schedules/dequeue_fleet_schedules already use.
# ====================================

def _resolve_execution_machine(db, job_creation_id):

    fleet_schedule = (
        db.query(FleetSchedule)
        .filter(FleetSchedule.job_creation_id == job_creation_id)
        .order_by(FleetSchedule.queue_position)
        .first()
    )

    if fleet_schedule:

        fleet_unit = (
            db.query(FleetUnit)
            .filter(FleetUnit.id == fleet_schedule.fleet_unit_id)
            .first()
        )

        if fleet_unit and fleet_unit.machine_inventory_id:

            machine = (
                db.query(MachineInventory)
                .filter(MachineInventory.id == fleet_unit.machine_inventory_id)
                .first()
            )

            if machine:
                return machine

    machine_schedule = (
        db.query(MachineSchedule)
        .filter(MachineSchedule.job_creation_id == job_creation_id)
        .order_by(MachineSchedule.queue_position)
        .first()
    )

    if machine_schedule:

        return (
            db.query(MachineInventory)
            .filter(MachineInventory.id == machine_schedule.machine_id)
            .first()
        )

    return None


# ====================================
# ENQUIRY RESOLUTION
# Execution has no direct FK to Enquiry - the real link is
# Enquiry.job_creation_id, set once by create_job_request. Needed so
# starting/completing a phase can advance the enquiry's own overall
# stage (previously never touched by anything in this file - stage
# stayed frozen at PO_RECEIVED through the entire Job Creation and
# Execution lifecycle, so the workflow stepper's own final two steps
# could never actually be reached).
# ====================================

def _resolve_execution_enquiry(db, job_creation_id):

    return (
        db.query(Enquiry)
        .filter(Enquiry.job_creation_id == job_creation_id)
        .first()
    )


# ====================================
# PHASE STARTED CHECK
# workflow_status alone can't answer "has THIS phase been started" -
# it only ever moves forward (READY -> CURRENTLY_WORKING once, at
# Phase 1's own start) and stays CURRENTLY_WORKING across every later
# phase transition, even while that new phase's own phase_N_status is
# still PENDING. Real per-phase status is what start_phase/complete_phase
# actually track, so that's what has to be checked here - reporting
# progress or completing a phase that was never started via "Start
# Current Phase" would be recording work that was never actually
# begun.
# ====================================

def _current_phase_status(execution):

    return {
        "PHASE_1": execution.phase_1_status,
        "PHASE_2": execution.phase_2_status,
        "PHASE_3": execution.phase_3_status
    }.get(execution.current_phase)


def _require_phase_started(execution, action_label):

    if _current_phase_status(execution) == "PENDING":

        raise HTTPException(
            status_code=422,
            detail=(
                f"Start Current Phase before {action_label} - "
                f"this phase hasn't begun yet."
            )
        )


# ====================================
# PLANNED START DATE GATE
# Every job is scheduled against a real planned_start date (set at
# booking, editable via Job Creation's "Save planned dates") - Phase 1
# is the machine's actual mobilisation leg, so it must not be startable
# before that date has genuinely arrived, no matter how early someone
# clicks the button. Phase 2/3 have no equivalent gate - they only ever
# begin once Phase 1 has genuinely completed, which is itself already a
# real event, not a scheduled date to jump ahead of.
# ====================================

def _require_planned_start_reached(execution):

    if (
        execution.current_phase == "PHASE_1"
        and execution.phase_1_status == "PENDING"
        and execution.planned_start
        and datetime.utcnow().date() < execution.planned_start
    ):

        raise HTTPException(
            status_code=422,
            detail=(
                f"This job isn't scheduled to start until {execution.planned_start} - "
                f"execution can't begin before then."
            )
        )


# ====================================
# PHASE COMPLETION TARGET VALIDATION
# "Complete Current Phase" must not be allowed to mark a phase done
# before its real, measurable target has actually been met - otherwise
# it's just a label, not a real completion. Phase 1/3 are "has the
# machine covered the distance"; Phase 2 is "has output reached the
# survey's estimated volume". A phase with no real target set yet
# (route never entered, no estimated volume on the survey) is let
# through rather than permanently blocked - there's nothing honest to
# validate against, and this must never trap a case with a data gap.
# ====================================

def _validate_phase_completion(db, execution):

    phase = execution.current_phase

    if phase in ("PHASE_1", "PHASE_3"):

        total = execution.distance_to_cover_km or 0
        travelled = execution.distance_travelled_km or 0

        if total > 0 and travelled < total:

            leg = "to the site" if phase == "PHASE_1" else "back to source"

            raise HTTPException(
                status_code=422,
                detail=(
                    f"Cannot complete {'Mobilisation' if phase == 'PHASE_1' else 'Demobilisation'} yet - "
                    f"only {travelled:.2f} km of {total:.2f} km {leg} has been covered. "
                    f"Update Distance Travelled once the machine has actually arrived."
                )
            )

    elif phase == "PHASE_2":

        survey = (
            db.query(SalesSurvey)
            .filter(SalesSurvey.id == execution.sales_survey_id)
            .first()
        )

        estimated_volume = (
            survey.estimated_volume
            if survey and survey.estimated_volume
            else 0
        )

        total_output = execution.total_output or 0

        if estimated_volume > 0 and total_output < estimated_volume:

            raise HTTPException(
                status_code=422,
                detail=(
                    f"Cannot complete Job Execution yet - only {total_output:.2f} "
                    f"{execution.output_unit or 'units'} of {estimated_volume:.2f} estimated "
                    f"has been recorded. Update Total Output once the target has been reached."
                )
            )


# ====================================
# CREATE EXECUTION
# ====================================

def create_execution_request(

    db,

    job_creation_id

):

    print("\n========== EXECUTION SERVICE ==========")

    job = get_job(

        db,

        job_creation_id

    )

    if job is None:

        raise HTTPException(

            status_code=404,

            detail="Job not found."

        )

    existing = get_execution_by_job(

        db,

        job.id

    )

    if existing:

        raise HTTPException(

            status_code=409,

            detail="Execution already exists."

        )

    execution = ExecutionSchema(

        job_creation_id=job.id,

        customer_request_id=job.customer_request_id,

        sales_survey_id=job.sales_survey_id,

        workflow_status="READY",

        current_phase="PHASE_1",

        execution_progress=0,

        phase_1_status="PENDING",

        phase_2_status="PENDING",

        phase_3_status="PENDING",

        site_location=None,

        planned_start=job.planned_start,

        estimated_completion=job.planned_completion,

        actual_completion=None,

        delay_days=0,

        current_activity="Execution Ready",

        transport_status="WAITING",

        remarks=None,

        invoice_synced="YES",

        latitude=None,
        longitude=None,
        speed_kmph=0,
        heading=0,
        altitude=0,
        accuracy_meters=0,
        gps_timestamp=None,
        last_update_source="OPS",

        eta_minutes=0,
        distance_to_cover_km=0,
        distance_travelled_km=0,

        today_output=0,
        total_output=0,
        daily_target=0,

        output_unit="m³",

        proof_uploaded=False



    )

    execution = create_execution(

        db,

        execution

    )

    # ====================================
    # PREFILL SOURCE COORDINATES
    # Convenience prefill, not a lock - still editable via
    # set_execution_route before Phase 1 starts if the real pickup
    # point differs. Same "picking one thing prefills another" pattern
    # already used for Fleet Unit's hub-from-machine prefill (Phase 36).
    #
    # Priority 1: the assigned machine's own last known position - the
    # most physically accurate source when it exists (Phase 38).
    # Priority 2 (new): geocoded straight from the enquiry's own hub
    # name - covers the far more common case of a machine that has
    # never had a real position recorded yet (every brand-new
    # machine/fleet unit, confirmed dead end otherwise per Phase 38's
    # own flagged scope gap).
    # ====================================

    machine = _resolve_execution_machine(db, job.id)

    if machine and machine.current_latitude is not None and machine.current_longitude is not None:

        execution.source_latitude = machine.current_latitude
        execution.source_longitude = machine.current_longitude

        db.commit()
        db.refresh(execution)

    else:

        survey = (
            db.query(SalesSurvey)
            .filter(SalesSurvey.id == job.sales_survey_id)
            .first()
        )

        hub_name = survey.nearest_hub if survey else None

        hub_city = extract_hub_city(hub_name)

        if hub_city:

            coordinates = forward_geocode(hub_city)

            if coordinates:

                execution.source_latitude, execution.source_longitude = coordinates

                db.commit()
                db.refresh(execution)

    invoice = get_invoice_by_job(

        db,

        job.id

    )

    if invoice:

        invoice.execution_phase = "READY"

        invoice.execution_progress = 0

        invoice.customer_visible_status = "Execution Ready"

        invoice.current_activity = "Waiting to Start Execution"

        invoice.transport_status = "WAITING"

        update_invoice(

            db,

            invoice

        )

    print(

        f"[Workflow] Execution Created : {execution.id}"

    )

    enquiries = EnquiryService.get_received_enquiries(

        db,

        "OPS"

    )

    for enquiry in enquiries:

        if (

            enquiry.requested_task == "ALLOCATION"

            and

            enquiry.job_creation_id == job.id

        ):

            enquiry.completed = True

            enquiry.workflow_status = "COMPLETED"

            EnquiryService.update(

                db,

                enquiry

            )

            break



    return execution


def update_execution_after_allocation(
        db,
        job,
        payload
    ):

    execution = get_execution_by_job(db, job.id)

    if execution is None:
        raise HTTPException(404, "Execution not found")

    machine = (
        db.query(MachineInventory)
        .filter(
            MachineInventory.current_job_id == job.id
        )
        .order_by(MachineInventory.id)
        .first()
    )

    schedules = (
        db.query(MachineSchedule)
        .filter(
            MachineSchedule.job_creation_id == job.id
        )
        .all()
    )

    print("\n========== LINK EXECUTION TO MACHINE SCHEDULE ==========")

    if not schedules:
        print(f"[WARNING] No machine schedules found for job {job.id}")

    for schedule in schedules:

        schedule.execution_id = execution.id

        print(f"Schedule ID          : {schedule.id}")
        print(f"Execution ID         : {execution.id}")
        print(f"Machine ID           : {schedule.machine_id}")
        print(f"Site                 : {schedule.site_location}")
        print(f"Planned Start        : {schedule.planned_start}")
        print(f"Planned Completion   : {schedule.planned_completion}")
        print("---")

    db.commit()

    execution.workflow_status = "READY"

    execution.current_phase = "PHASE_1"

    execution.current_activity = "Resources Allocated"

    if execution.site_location is None and payload.site_location is not None:

        execution.site_location = payload.site_location

        # Prefill destination coordinates from the real site name
        # being set right now, the same "convenience prefill, not a
        # lock" way source coordinates are handled above - still
        # editable via set_execution_route afterward if this doesn't
        # land precisely enough. Only fires while destination hasn't
        # already been set (e.g. by hand, before booking) so this
        # never overwrites something already there.
        if execution.destination_latitude is None:

            coordinates = forward_geocode(payload.site_location)

            if coordinates:
                execution.destination_latitude, execution.destination_longitude = coordinates

    if execution.planned_start is not None and payload.planned_start is not None:
        execution.planned_start = payload.planned_start

    if execution.estimated_completion is not None and payload.planned_completion is not None:
        execution.estimated_completion = payload.planned_completion

    db.commit()

    db.refresh(execution)

    sync_invoice_from_execution(

        db,

        execution

    )

    print("\n========== EXECUTION UPDATED ==========")

    print(f"Execution : {execution.id}")

    print(f"Workflow : {execution.workflow_status}")

    print(f"Site : {execution.site_location}")

    print(f"Start : {execution.planned_start}")

    print(f"Completion : {execution.estimated_completion}")

    return execution


    # ====================================
    # SYNC INVOICE FROM EXECUTION
    # ====================================

def sync_invoice_from_execution(

    db,

    execution

):

    from backend.models.personnel import Personnel

    invoice = (

        get_invoice_by_job(

            db,

            execution.job_creation_id

        )

    )

    if invoice is None:

        return

    # ====================================
    # MACHINE SNAPSHOT
    # ====================================

    schedule = (

        db.query(

            MachineSchedule

        )

        .filter(

            MachineSchedule.job_creation_id == execution.job_creation_id

        )

        .order_by(

            MachineSchedule.queue_position

        )

        .first()

    )

    machine = None

    if schedule:

        machine = (

            db.query(

                MachineInventory

            )

            .filter(

                MachineInventory.id == schedule.machine_id

            )

            .first()

        )
    # ====================================
    # PERSONNEL SNAPSHOT
    # ====================================

    allocated_personnel = (

        db.query(

            Personnel

        )

        .filter(

            Personnel.current_job_id == execution.job_creation_id

        )

        .all()

    )

    # ====================================
    # EXECUTION STATUS
    # ====================================

    invoice.execution_phase = execution.current_phase

    invoice.execution_progress = execution.execution_progress

    invoice.customer_visible_status = execution.current_activity

    invoice.current_activity = execution.current_activity



    # ====================================
    # SCHEDULE
    # ====================================

    invoice.planned_start = execution.planned_start

    invoice.estimated_completion = execution.estimated_completion

    invoice.actual_completion = execution.actual_completion

    invoice.delay_days = execution.delay_days

    # ====================================
    # TRANSPORT
    # ====================================

    invoice.transport_status = execution.transport_status

    invoice.gps_location = (
        None
        if execution.latitude is None
        else f"{execution.latitude},{execution.longitude}"
    )

    total = execution.distance_to_cover_km or 0
    travelled = execution.distance_travelled_km or 0

    remaining_distance = max(
        total - travelled,
        0
    )

    invoice.distance_remaining_km = remaining_distance

    invoice.eta_minutes = execution.eta_minutes or 0

    logs = invoice.live_execution_log or []

    logs.append(

        {

            "timestamp": str(execution.last_updated),

            "phase": execution.current_phase,

            "activity": execution.current_activity,

            "progress": execution.execution_progress,

            "today_output": execution.today_output,

            "total_output": execution.total_output,

            "transport": execution.transport_status,

            "gps": invoice.gps_location,


            "machine": machine.machine_name if machine else None,

            "machine_status": machine.status if machine else None,

            "site": execution.site_location,


            "eta": execution.eta_minutes,

            "distance_remaining": remaining_distance,

            "distance_travelled": execution.distance_travelled_km,

            "total_distance": execution.distance_to_cover_km,

            "source": execution.last_update_source


        }

    )

    logs = logs[-1000:]

    invoice.live_execution_log = logs





    # ====================================
    # MACHINE DETAILS
    # ====================================

    if machine:

        invoice.machine_status = machine.status

        invoice.machine_name = machine.machine_name

        invoice.machine_code = machine.machine_code

        invoice.machine_location = machine.current_site

    else:

        invoice.machine_status = "NOT_ALLOCATED"

        invoice.machine_name = None

        invoice.machine_code = None

        invoice.machine_location = None

    # ====================================
    # PERSONNEL DETAILS
    # ====================================

    if allocated_personnel:

        invoice.personnel_status = "ALLOCATED"

        invoice.personnel_json = [

            {

                "id": person.id,

                "name": person.full_name,

                "designation": person.designation,

                "skill": person.skill,

                "location": person.current_location

            }

            for person in allocated_personnel

        ]

    else:

        invoice.personnel_status = "NOT_ASSIGNED"

        invoice.personnel_json = []

    # ====================================
    # JOB STATUS
    # ====================================

    if execution.workflow_status == "EXECUTION_COMPLETED":

        invoice.invoice_status = "COMPLETED"

    else:

        invoice.invoice_status = "ACTIVE"

    print("\n========== INVOICE SYNC ==========")
    print(f"Invoice ID          : {invoice.id}")
    print(f"Execution Phase     : {invoice.execution_phase}")
    print(f"Progress            : {invoice.execution_progress}")
    print(f"Customer Status     : {invoice.customer_visible_status}")
    print(f"Transport           : {invoice.transport_status}")
    print(f"Machine             : {invoice.machine_name}")
    print(f"Personnel Count     : {len(invoice.personnel_json)}")
    print(f"GPS                 : {invoice.gps_location}")
    print(f"ETA                 : {invoice.eta_minutes}")
    print(f"Distance Remaining  : {invoice.distance_remaining_km}")
    print(f"Live Log Entries    : {len(invoice.live_execution_log)}")


    update_invoice(

        db,

        invoice

    )


# ====================================
# SET EXECUTION ROUTE (Phase 38)
# Sets/edits the source and/or destination coordinates for Phase 1/3
# and recomputes distance_to_cover_km from them via haversine_km -
# distance is never accepted directly from the client, it's always
# derived from these two points.
# ====================================

def set_execution_route(
    db,
    execution_id,
    payload
):

    execution = get_execution(db, execution_id)

    if execution is None:
        raise HTTPException(status_code=404, detail="Execution not found.")

    if payload.source_latitude is not None:
        execution.source_latitude = payload.source_latitude

    if payload.source_longitude is not None:
        execution.source_longitude = payload.source_longitude

    if payload.destination_latitude is not None:
        execution.destination_latitude = payload.destination_latitude

    if payload.destination_longitude is not None:
        execution.destination_longitude = payload.destination_longitude

    distance = haversine_km(
        execution.source_latitude,
        execution.source_longitude,
        execution.destination_latitude,
        execution.destination_longitude
    )

    if distance is not None:
        execution.distance_to_cover_km = distance

    execution.last_updated = datetime.utcnow()

    db.commit()
    db.refresh(execution)

    sync_invoice_from_execution(db, execution)

    return execution


# ====================================
# FILL MISSING ROUTE COORDINATES
# The two prefill points above (execution creation for source, fleet
# booking for destination) only ever fire once, at that exact moment -
# an execution created before either existed, or one whose first
# geocode attempt genuinely failed (no match for the hub/site text at
# the time), had no other way to pick up a coordinate later without
# someone editing the DB directly. Rather than a separate manual
# button, this same resolution logic is re-run as a third, automatic
# occasion - right when "Start Current Phase" is clicked (see
# start_execution_phase below) - so a stale gap quietly closes itself
# the moment it would actually matter, with zero extra action needed
# from the user. Only ever fills whichever of the 4 fields is still
# blank - never overwrites a coordinate that's already set (manually
# or otherwise), so it's always safe to call again on every phase
# start, not just the first.
# ====================================

def _fill_missing_route_coordinates(

    db,

    execution

):

    warnings = {"source": None, "destination": None}

    if execution.source_latitude is None or execution.source_longitude is None:

        machine = _resolve_execution_machine(db, execution.job_creation_id)

        if machine and machine.current_latitude is not None and machine.current_longitude is not None:

            execution.source_latitude = machine.current_latitude
            execution.source_longitude = machine.current_longitude

        else:

            survey = (
                db.query(SalesSurvey)
                .filter(SalesSurvey.id == execution.sales_survey_id)
                .first()
            )

            hub_name = survey.nearest_hub if survey else None
            hub_city = extract_hub_city(hub_name)

            if hub_city:

                coordinates = forward_geocode(hub_city)

                if coordinates:
                    execution.source_latitude, execution.source_longitude = coordinates
                else:
                    warnings["source"] = (
                        f"Couldn't find coordinates for hub \"{hub_city}\" - "
                        f"set the source manually below."
                    )
            else:
                warnings["source"] = (
                    "No machine position or hub on file for this job - "
                    "set the source manually below."
                )

    if execution.destination_latitude is None or execution.destination_longitude is None:

        if execution.site_location:

            coordinates = forward_geocode(execution.site_location)

            if coordinates:
                execution.destination_latitude, execution.destination_longitude = coordinates
            else:
                warnings["destination"] = (
                    f"Couldn't find coordinates for \"{execution.site_location}\" - "
                    f"set the destination manually below."
                )
        else:
            warnings["destination"] = (
                "No site location on file for this job - "
                "set the destination manually below."
            )

    if warnings["source"]:
        print(f"[GEOCODE] {warnings['source']}")

    if warnings["destination"]:
        print(f"[GEOCODE] {warnings['destination']}")

    return warnings


# ====================================
# GET COORDINATES (manual button, Phase 1's Source & Destination card)
# Callable on demand, any number of times - Start Current Phase can
# only ever be clicked once per phase, so an execution that still has
# a gap after that (the hub/site text didn't resolve the first time,
# or the site location was corrected afterward) needs its own
# always-available trigger, not just the one-shot automatic occasions
# at creation/booking/phase-start.
#
# Deliberately simple, exactly two text fields in, two coordinate
# pairs out - no machine-position lookup, no "only if currently
# blank" gate: Source is always re-resolved from the job's hub name
# text (via extract_hub_city + forward_geocode), Destination is
# always re-resolved from the job's own site_location text
# (forward_geocode directly). A field is only ever left alone when
# its own text has no match at all (real coordinates already there
# aren't wiped by a failed lookup) - otherwise every click genuinely
# re-searches both, which is what "Get Coordinates" should do.
# ====================================

def refresh_execution_coordinates(

    db,

    execution_id

):

    execution = get_execution(db, execution_id)

    if execution is None:
        raise HTTPException(status_code=404, detail="Execution not found.")

    warnings = {"source": None, "destination": None}

    survey = (
        db.query(SalesSurvey)
        .filter(SalesSurvey.id == execution.sales_survey_id)
        .first()
    )

    hub_name = survey.nearest_hub if survey else None
    hub_city = extract_hub_city(hub_name)

    if hub_city:

        coordinates = forward_geocode(hub_city)

        if coordinates:
            execution.source_latitude, execution.source_longitude = coordinates
        else:
            warnings["source"] = f"Couldn't find coordinates for hub \"{hub_city}\"."
    else:
        warnings["source"] = "No hub on file for this job's survey."

    if execution.site_location:

        coordinates = forward_geocode(execution.site_location)

        if coordinates:
            execution.destination_latitude, execution.destination_longitude = coordinates
        else:
            warnings["destination"] = f"Couldn't find coordinates for \"{execution.site_location}\"."
    else:
        warnings["destination"] = "No site location on file for this job."

    distance = haversine_km(
        execution.source_latitude,
        execution.source_longitude,
        execution.destination_latitude,
        execution.destination_longitude
    )

    if distance is not None:
        execution.distance_to_cover_km = distance

    execution.last_updated = datetime.utcnow()

    db.commit()
    db.refresh(execution)

    sync_invoice_from_execution(db, execution)

    result = execution.__dict__.copy()
    result["geocode_warnings"] = warnings

    return result


def update_execution_progress(
    db,
    execution_id,
    payload
):

    execution = get_execution(

        db,

        execution_id

    )

    if execution is None:

        raise HTTPException(

            status_code=404,

            detail="Execution not found."

        )

    _require_phase_started(execution, "recording progress")


    # ====================================
    # PARTIAL UPDATE
    # This endpoint is shared by two very different callers: the full
    # per-phase forms (Phase1Mobilisation/Phase2Execution/
    # Phase3Demobilisation, which always send every field, even 0) and
    # Execution Controls' generic "Update Execution" button (which only
    # ever sends current_activity/transport_status/remarks). Every
    # field here used to be assigned unconditionally, so the smaller
    # payload's missing fields (defaulting to None per the schema)
    # silently wiped GPS/output data the fuller forms had just saved.
    # Guarding every assignment the same way distance_travelled_km
    # already was makes this a genuine partial update - a field is
    # only ever touched when the caller actually sent it.
    # ====================================

    if payload.current_activity is not None:
        execution.current_activity = payload.current_activity

    if payload.latitude is not None:
        execution.latitude = payload.latitude

    if payload.longitude is not None:
        execution.longitude = payload.longitude

    if payload.speed_kmph is not None:
        execution.speed_kmph = payload.speed_kmph

    if payload.heading is not None:
        execution.heading = payload.heading

    if payload.altitude is not None:
        execution.altitude = payload.altitude

    if payload.accuracy_meters is not None:
        execution.accuracy_meters = payload.accuracy_meters

    if payload.gps_timestamp is not None:
        execution.gps_timestamp = payload.gps_timestamp

    if payload.latitude is not None or payload.longitude is not None:
        execution.last_update_source = "OPS"

    # ====================================
    # DISTANCE + ETA - DERIVED FROM POSITION, NOT TYPED
    # A previous version of this endpoint accepted distance_travelled_km
    # as its own manually-entered figure - first as a raw overwrite,
    # then (still wrong) as a manually-entered increment. Either way,
    # it let latitude/longitude and "how far I've come" drift apart
    # into two disconnected numbers a non-technical field user had to
    # keep in sync themselves - exactly the kind of incoherence this
    # is meant to prevent. Distance travelled is now always the real
    # haversine distance from wherever this phase's leg physically
    # starts to wherever the machine's last known position now is, so
    # entering a position is the only thing that moves it. ETA follows
    # the same reasoning - remaining distance divided by the just-
    # entered speed, not a second independently-typed guess.
    # ====================================

    if (
        execution.current_phase in ("PHASE_1", "PHASE_3")
        and execution.latitude is not None
        and execution.longitude is not None
    ):

        # Phase 1 travels source -> destination, so "distance covered"
        # is measured from source. Phase 3 is the return leg
        # (destination -> source), so it's measured from destination -
        # matches the same swapped orientation already applied to the
        # Phase 3 map/route display.
        if execution.current_phase == "PHASE_1":
            reference_lat = execution.source_latitude
            reference_lng = execution.source_longitude
        else:
            reference_lat = execution.destination_latitude
            reference_lng = execution.destination_longitude

        if reference_lat is not None and reference_lng is not None:

            execution.distance_travelled_km = haversine_km(
                reference_lat, reference_lng,
                execution.latitude, execution.longitude
            )

        remaining_km = max(
            (execution.distance_to_cover_km or 0) - (execution.distance_travelled_km or 0),
            0
        )

        if execution.speed_kmph:
            execution.eta_minutes = round((remaining_km / execution.speed_kmph) * 60)

        # Transport Status is the same story - a free-typed field lets
        # it say "Reached" while distance/position show 0% covered,
        # exactly the incoherence being fixed here. It's now read
        # straight off the same distance figure just derived above,
        # so it can never disagree with what the map/metrics show.
        total_km = execution.distance_to_cover_km or 0

        if total_km > 0 and execution.distance_travelled_km >= total_km:
            execution.transport_status = "REACHED"
        elif execution.distance_travelled_km and execution.distance_travelled_km > 0:
            execution.transport_status = "IN_TRANSIT"
        else:
            execution.transport_status = "WAITING"

    # Today's Output is this save's own increment - it folds into
    # Total Output (the real, cumulative production figure) rather
    # than being a second independently-typed number that could drift
    # from it. total_output is never accepted as a direct overwrite
    # (same reasoning already applied to distance_to_cover_km/
    # distance_travelled_km above) - it's derived by summing every
    # Today's Output entry as it comes in.
    if payload.today_output is not None:
        execution.today_output = payload.today_output
        execution.total_output = (execution.total_output or 0) + payload.today_output

    # Daily Target is a fixed planning figure, not a running log entry
    # - settable once, while still at its 0 default, then frozen. A
    # later save must not be able to silently redefine what "on
    # target" means partway through the phase.
    if payload.daily_target is not None and not execution.daily_target:
        execution.daily_target = payload.daily_target

    if payload.output_unit is not None:
        execution.output_unit = payload.output_unit

    if payload.proof_uploaded is not None:
        execution.proof_uploaded = payload.proof_uploaded

    if payload.remarks is not None:
        execution.remarks = payload.remarks

    execution.last_updated = datetime.utcnow()

    # ====================================
    # LIVE MACHINE POSITION SYNC
    # Phase 1/3's "Last Known Position" fields only ever reached the
    # execution row itself - MachineInventory (and therefore Fleet
    # Units' "Current Location" column, resolved live from it) only
    # got updated at phase transitions (arrival, return), so a machine
    # correctly reported as "at Kanpur" mid-transit still showed its
    # stale pre-departure site name everywhere outside this one form.
    # Every save while genuinely in transit now pushes the same
    # position through, closing that gap without waiting for the next
    # phase boundary. The site text itself is reverse-geocoded to a
    # real place name (best-effort, falls back to raw coordinates if
    # the lookup fails) rather than showing bare numbers.
    # ====================================

    if (
        execution.current_phase in ("PHASE_1", "PHASE_3")
        and execution.latitude is not None
        and execution.longitude is not None
    ):

        transit_machine = _resolve_execution_machine(
            db, execution.job_creation_id
        )

        if transit_machine:

            transit_machine.current_latitude = execution.latitude
            transit_machine.current_longitude = execution.longitude

            direction = (
                "to" if execution.current_phase == "PHASE_1" else "from"
            )

            place_name = reverse_geocode(execution.latitude, execution.longitude)

            location_text = (
                place_name
                if place_name
                else f"{execution.latitude}, {execution.longitude}"
            )

            transit_machine.current_site = (
                f"In transit {direction} {execution.site_location} "
                f"- near {location_text}"
            )

    # ====================================
    # AUTO PROGRESS CALCULATION
    # ====================================

    survey = (
        db.query(SalesSurvey)
        .filter(
            SalesSurvey.id == execution.sales_survey_id
        )
        .first()
    )

    estimated_volume = (
        survey.estimated_volume
        if survey and survey.estimated_volume
        else 0
    )

    progress = execution.execution_progress

    # -------------------------------
    # PHASE 1
    # -------------------------------

    if execution.current_phase == "PHASE_1":

        total_distance = execution.distance_to_cover_km or 0
        travelled = execution.distance_travelled_km or 0

        if total_distance > 0:
            phase_progress = min(travelled / total_distance, 1)
        else:
            phase_progress = 0

        progress = phase_progress * 33

    # -------------------------------
    # PHASE 2
    # -------------------------------

    elif execution.current_phase == "PHASE_2":

        if estimated_volume > 0:

            phase_progress = min(
                execution.total_output / estimated_volume,
                1
            )

            progress = 33 + phase_progress * 33

    # -------------------------------
    # PHASE 3
    # -------------------------------

    elif execution.current_phase == "PHASE_3":

        total_distance = execution.distance_to_cover_km or 0
        travelled = execution.distance_travelled_km or 0

        if total_distance > 0:
            phase_progress = min(travelled / total_distance, 1)
        else:
            phase_progress = 0

        progress = 66 + phase_progress * 34

    # Reaching 100% distance/output coverage means this LEG is done,
    # not that the phase (or the whole execution) has been marked
    # complete - that's an explicit action (complete_execution_phase,
    # the "Complete Current Phase" button), which runs real completion
    # logic (the target-met validation just added, dequeue, syncing
    # the machine back to source, advancing the enquiry's stage). A
    # workflow_status flip here bypassed all of that from a routine
    # position/output save the moment progress hit 100 - exactly the
    # same "marked complete without actually completing it" problem,
    # just at the whole-execution level instead of the button level.
    execution.execution_progress = round(
        min(progress,100)
    )


    print("\n========== EXECUTION UPDATE ==========")
    print(f"Execution ID : {execution.id}")
    print(f"Progress     : {execution.execution_progress}")
    print(f"Activity     : {execution.current_activity}")
    print(f"Transport    : {execution.transport_status}")
    print(f"GPS          : {execution.latitude}, {execution.longitude}")
    print(f"ETA          : {execution.eta_minutes}")
    print(f"Distance     : {execution.distance_to_cover_km}")
    print(f"Today Output : {execution.today_output}")
    print(f"Total Output : {execution.total_output}")
    print(f"Updated By   : {execution.last_update_source}")

    print("\n========== EXECUTION SAVED ==========")
    print(f"Timestamp : {execution.last_updated}")

    db.commit()

    db.refresh(execution)

    sync_invoice_from_execution(
        db,
        execution
    )

    return execution




# ====================================
# LOAD EXECUTION
# ====================================

def get_execution_request(
    db,
    execution_id
):

    execution = get_execution(
        db,
        execution_id
    )

    if execution is None:

        raise HTTPException(
            status_code=404,
            detail="Execution not found."
        )

    survey = (

        db.query(SalesSurvey)

        .filter(

            SalesSurvey.id == execution.sales_survey_id

        )

        .first()

    )

    result = execution.__dict__.copy()

    result["estimated_volume"] = (

        survey.estimated_volume

        if survey

        else 0

    )

    return result


# ====================================
# GET EXECUTION BY JOB (Phase 38 - Enquiry Workspace's Execution tab
# resolves its own execution row this way, matching the established
# by-enquiry/by-job lookup pattern already used for Job Creation and
# Fleet Schedule)
# ====================================

def get_execution_by_job_request(
    db,
    job_creation_id
):

    execution = get_execution_by_job(db, job_creation_id)

    if execution is None:
        return None

    survey = (
        db.query(SalesSurvey)
        .filter(SalesSurvey.id == execution.sales_survey_id)
        .first()
    )

    result = execution.__dict__.copy()

    result["estimated_volume"] = (
        survey.estimated_volume
        if survey
        else 0
    )

    return result


# ====================================
# LIST EXECUTIONS
# ====================================

def list_execution_request(

    db

):

    return list_executions(

        db

    )


# ====================================
# START PHASE
# ====================================

def start_execution_phase(

    db,

    execution_id

):

    execution = get_execution(

        db,

        execution_id

    )

    if execution is None:

        raise HTTPException(

            status_code=404,

            detail="Execution not found."

        )

    _require_planned_start_reached(execution)

    execution = start_phase(

        db,

        execution

    )

    # ====================================
    # ENQUIRY STAGE -> EXECUTION
    # Starting any phase means the enquiry has genuinely entered
    # execution - advance_stage_at_least only ever moves forward and
    # no-ops once already at/past EXECUTION, so this is safe to call
    # on every phase start (1, 2, or 3), not just the very first one.
    # Previously nothing in this file ever touched enquiry.stage at
    # all, so it stayed frozen at PO_RECEIVED for the entire Job
    # Creation + Execution lifecycle.
    # ====================================

    stage_enquiry = _resolve_execution_enquiry(db, execution.job_creation_id)

    if stage_enquiry:
        advance_stage_at_least(db, stage_enquiry.id, WorkflowStage.EXECUTION.value)

    # ====================================
    # ROUTE DISTANCE + MACHINE LOCATION SYNC (Phase 38)
    # distance_to_cover_km is derived from source/destination via
    # haversine_km on Phase 1 start and again on Phase 3 start (the
    # return leg - same two points, distance is symmetric) - no more
    # hardcoded constants. On Phase 2 start (Phase 1 just completed),
    # the resolved machine's own "last known position" is synced to
    # the destination it just arrived at, so Business Masters / Fleet &
    # Availability reflect the move as it happens, not just at final
    # dequeue.
    # ====================================

    route_machine = _resolve_execution_machine(db, execution.job_creation_id)

    if execution.current_phase in ("PHASE_1", "PHASE_3"):

        # Third and final occasion the source/destination geocode fill
        # gets a chance to run (after creation and after booking) -
        # closes the gap for any execution that still has a blank
        # coordinate right before it would actually be needed to
        # compute a real distance below.
        _fill_missing_route_coordinates(db, execution)

        distance = haversine_km(
            execution.source_latitude,
            execution.source_longitude,
            execution.destination_latitude,
            execution.destination_longitude
        )

        if distance is not None:
            execution.distance_to_cover_km = distance

        execution.distance_travelled_km = 0

    elif execution.current_phase == "PHASE_2":

        if route_machine and execution.destination_latitude is not None:

            route_machine.current_latitude = execution.destination_latitude
            route_machine.current_longitude = execution.destination_longitude
            route_machine.current_site = execution.site_location

    # ====================================
    # START MACHINE SCHEDULE
    # ====================================

    current_schedule = (

        db.query(

            MachineSchedule

        )

        .filter(

            MachineSchedule.execution_id == execution.id,

            MachineSchedule.site_location == execution.site_location,

            MachineSchedule.planned_start == execution.planned_start,

            MachineSchedule.planned_completion == execution.estimated_completion,

            MachineSchedule.queue_position == 1,

            MachineSchedule.schedule_status == "QUEUED"

        )

        .first()

    )

    if current_schedule:

        print("\n========== EXECUTION START ==========")

        print(f"Execution : {execution.id}")

        print(f"Job : {execution.job_creation_id}")

        print(f"Machine : {current_schedule.machine_id}")

        current_schedule.schedule_status = "ACTIVE"

        machine = (

            db.query(

                MachineInventory

            )

            .filter(

                MachineInventory.id == current_schedule.machine_id

            )

            .first()

        )

        if machine:

            machine.status = "ALLOCATED"

            machine.current_job_id = execution.job_creation_id

            machine.current_site = execution.site_location

            machine.queue_count = (

                db.query(

                    MachineSchedule

                )

                .filter(

                    MachineSchedule.machine_id == machine.id

                )

                .count()

            )

            print(f"Machine Status : {machine.status}")

            print(f"Current Job : {machine.current_job_id}")

            print(f"Queue Count : {machine.queue_count}")

    sync_invoice_from_execution(

        db,

        execution

    )

    return execution


# ====================================
# FUTURE: AUTOMATIC EXECUTION PROGRESS
# ====================================
#
# execution_progress must NOT be manually entered once live tracking
# is integrated. It should be automatically calculated from the
# execution state during each phase.
#
# -------------------------
# PHASE 1 (0% -> 33%)
# -------------------------
# Objective:
# Machine mobilisation from warehouse to customer site.
#
# Inputs:
# - Total route distance
# - Remaining distance (GPS)
#
# Formula:
# phase1_progress =
#     (distance_covered / total_route_distance) * 100
#
# Overall execution contribution:
# execution_progress =
#     phase1_progress * 0.33
#
# Reaches approximately 33% once machine reaches site.
#
#
# -------------------------
# PHASE 2 (33% -> 66%)
# -------------------------
# Objective:
# Actual cleaning / dredging / dewatering operation.
#
# Inputs:
# - Estimated work volume
# - Total output completed
#
# Formula:
# phase2_progress =
#     (total_output / estimated_volume) * 100
#
# Overall execution contribution:
# execution_progress =
#     33 + (phase2_progress * 0.33)
#
# Phase automatically completes once total_output >= estimated_volume.
#
#
# -------------------------
# PHASE 3 (66% -> 100%)
# -------------------------
# Objective:
# Demobilisation + return to warehouse + maintenance.
#
# Stage A:
# Return journey
# - Remaining distance
# - Total return distance
#
# Stage B:
# Maintenance duration
# - Planned repair duration
# - Actual repair elapsed time
#
# Combined Phase 3 Progress:
#
# return_progress =
#     distance_covered / total_return_distance
#
# maintenance_progress =
#     elapsed_repair_time / planned_repair_time
#
# phase3_progress =
#     weighted(return_progress, maintenance_progress)
#
# Overall execution contribution:
# execution_progress =
#     66 + (phase3_progress * 0.34)
#
# When execution_progress reaches 100:
# - workflow_status = EXECUTION_COMPLETED
# - perform FIFO dequeue
# - activate next queued schedule
# - release machine if queue empty
# - sync invoice
# - update customer request status
#
# IMPORTANT:
# execution_progress should become a computed field derived from
# telemetry and operational metrics rather than a user-editable value.


# ====================================
# COMPLETE PHASE
# ====================================

def complete_execution_phase(

    db,

    execution_id

):

    execution = get_execution(db, execution_id)

    if execution is None:
        raise HTTPException(
            status_code=404,
            detail="Execution not found."
        )

    print("\n========== EXECUTION SERVICE : COMPLETE PHASE ==========")
    print(f"Execution ID    : {execution.id}")
    print(f"Job Creation ID : {execution.job_creation_id}")
    print(f"Phase Before    : {execution.current_phase}")

    _require_phase_started(execution, "completing it")

    # Reject the completion outright if this phase's real target
    # hasn't actually been reached yet - a phase must not be markable
    # "complete" just because the button was clicked.
    _validate_phase_completion(db, execution)

    execution = complete_phase(db, execution)

    if execution is None:
        raise HTTPException(
            status_code=404,
            detail="Execution not found."
        )

    if execution.workflow_status != "EXECUTION_COMPLETED":

        print(f"Phase After     : {execution.current_phase} (not final yet)")

        sync_invoice_from_execution(db, execution)

        return execution

    print("Final phase reached -> dequeuing machine schedules")

    # ====================================
    # ENQUIRY STAGE -> COMPLETED
    # This enquiry's own execution has genuinely finished (all 3
    # phases done) - its overall stage should reach the workflow
    # stepper's final step. Deliberately keyed to THIS enquiry, not
    # whatever job gets promoted next below - a machine being
    # reassigned to someone else's queued job has no bearing on
    # whether this enquiry's own case is done.
    # ====================================

    completed_enquiry = _resolve_execution_enquiry(db, execution.job_creation_id)

    if completed_enquiry:
        advance_stage_at_least(db, completed_enquiry.id, WorkflowStage.COMPLETED.value)

    # ====================================
    # MACHINE RETURNED TO SOURCE (Phase 38)
    # Demobilisation (Phase 3) just completed - the machine is back at
    # its source point. Synced before dequeue so Business Masters /
    # Fleet & Availability reflect it immediately; if dequeue below
    # promotes a next queued job for this same machine, that job's own
    # allocation correctly overwrites current_site/status right after -
    # no conflict, same "last write wins" reasoning already used
    # throughout dequeue_fleet_schedules.
    # ====================================

    return_machine = _resolve_execution_machine(db, execution.job_creation_id)

    if return_machine and execution.source_latitude is not None:

        return_machine.current_latitude = execution.source_latitude
        return_machine.current_longitude = execution.source_longitude
        db.commit()

    affected_schedules = dequeue_execution_schedules(db, execution)

    # ====================================
    # DEQUEUE FLEET SCHEDULES (Phase 33)
    # A given execution_id only ever has rows in ONE of
    # machine_schedule / fleet_schedule (whichever mechanism actually
    # booked it), so calling both dequeues unconditionally is safe -
    # the one with no matching rows just returns [] harmlessly.
    # ====================================

    affected_fleet_schedules = dequeue_fleet_schedules(db, execution)

    promoted_fleet_unit_ids = {s.fleet_unit_id for s in affected_fleet_schedules}

    for fleet_unit_id in promoted_fleet_unit_ids:

        promoted = (
            db.query(FleetSchedule)
            .filter(
                FleetSchedule.fleet_unit_id == fleet_unit_id,
                FleetSchedule.queue_position == 1,
                FleetSchedule.schedule_status == "ACTIVE"
            )
            .first()
        )

        if not promoted:
            print(f"[NEXT] Fleet unit {fleet_unit_id} : queue empty, nothing to promote")
            continue

        print(
            f"[NEXT] Fleet unit {fleet_unit_id} : promoting job "
            f"{promoted.job_creation_id} (schedule {promoted.id})"
        )

        next_execution = get_execution_by_job(db, promoted.job_creation_id)

        if not next_execution:
            print(f"[NEXT] No execution row for job {promoted.job_creation_id}")
            continue

        next_execution.workflow_status = "READY"
        next_execution.current_phase = "PHASE_1"
        next_execution.execution_progress = 0
        next_execution.phase_1_status = "PENDING"
        next_execution.phase_2_status = "PENDING"
        next_execution.phase_3_status = "PENDING"
        next_execution.current_activity = "Resources Allocated"
        next_execution.site_location = promoted.site_location
        next_execution.planned_start = promoted.planned_start
        next_execution.estimated_completion = promoted.planned_completion
        next_execution.actual_completion = None
        next_execution.delay_days = 0
        next_execution.transport_status = "WAITING"

        db.commit()
        db.refresh(next_execution)

        promoted.execution_id = next_execution.id
        db.commit()

        print(
            f"[NEXT] Execution {next_execution.id} reset to READY/PHASE_1, "
            f"relinked to fleet schedule {promoted.id}"
        )

        sync_invoice_from_execution(db, next_execution)

    # ====================================
    # RESET NEXT EXECUTION PER PROMOTED MACHINE
    # ====================================

    promoted_machine_ids = {s.machine_id for s in affected_schedules}

    for machine_id in promoted_machine_ids:

        promoted = (
            db.query(MachineSchedule)
            .filter(
                MachineSchedule.machine_id == machine_id,
                MachineSchedule.queue_position == 1,
                MachineSchedule.schedule_status == "ACTIVE"
            )
            .first()
        )

        if not promoted:
            print(f"[NEXT] Machine {machine_id} : queue empty, nothing to promote")
            continue

        print(
            f"[NEXT] Machine {machine_id} : promoting job "
            f"{promoted.job_creation_id} (schedule {promoted.id})"
        )

        next_execution = get_execution_by_job(db, promoted.job_creation_id)

        if not next_execution:
            print(f"[NEXT] No execution row for job {promoted.job_creation_id}")
            continue

        next_execution.workflow_status = "READY"
        next_execution.current_phase = "PHASE_1"
        next_execution.execution_progress = 0
        next_execution.phase_1_status = "PENDING"
        next_execution.phase_2_status = "PENDING"
        next_execution.phase_3_status = "PENDING"
        next_execution.current_activity = "Resources Allocated"
        next_execution.site_location = promoted.site_location
        next_execution.planned_start = promoted.planned_start
        next_execution.estimated_completion = promoted.planned_completion
        next_execution.actual_completion = None
        next_execution.delay_days = 0
        next_execution.transport_status = "WAITING"

        db.commit()
        db.refresh(next_execution)

        # Relink promoted schedule to its new execution -- without this,
        # the NEXT completion on this machine hits the same failure
        # mode this whole fix addresses.
        promoted.execution_id = next_execution.id
        db.commit()

        print(
            f"[NEXT] Execution {next_execution.id} reset to READY/PHASE_1, "
            f"relinked to schedule {promoted.id}"
        )

        sync_invoice_from_execution(db, next_execution)

    sync_invoice_from_execution(db, execution)

    update_customer_request_status(
        db,
        execution.customer_request_id,
        "EXECUTION_COMPLETED"
    )

    print("========== COMPLETE PHASE DONE ==========\n")

    return execution