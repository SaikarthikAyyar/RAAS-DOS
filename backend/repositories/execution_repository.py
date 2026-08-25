# ====================================
# IMPORTS
# ====================================

from backend.models.execution import Execution

from backend.models.machine_schedule import MachineSchedule

from backend.models.machine_inventory import MachineInventory

from backend.models.invoice import Invoice

from datetime import date


# ====================================
# CREATE EXECUTION
# ====================================

def create_execution(

    db,

    payload

):

    execution = Execution(

        job_creation_id=
        payload.job_creation_id,

        customer_request_id=
        payload.customer_request_id,

        sales_survey_id=
        payload.sales_survey_id,

        workflow_status=
        payload.workflow_status,

        current_phase=
        payload.current_phase,

        phase_1_status=
        payload.phase_1_status,

        phase_2_status=
        payload.phase_2_status,

        phase_3_status=
        payload.phase_3_status,

        site_location=
        payload.site_location,

        planned_start=
        payload.planned_start,

        estimated_completion=
        payload.estimated_completion,

        execution_progress=
        payload.execution_progress,

        delay_days=
        payload.delay_days,

        current_activity=
        payload.current_activity,

        transport_status=
        payload.transport_status,

        invoice_synced=
        payload.invoice_synced,

        actual_completion=
        payload.actual_completion,

        remarks=
        payload.remarks,

        latitude = None,

        longitude = None,

        speed_kmph = 0,

        heading = 0,

        altitude = 0,

        accuracy_meters = 0,

        gps_timestamp = None,

        last_update_source = "OPS",

        eta_minutes = 0,

        today_output = 0,

        total_output = 0,

        daily_target = 0,

        output_unit = "m³",

        proof_uploaded = False



    )

    db.add(

        execution

    )

    db.commit()

    db.refresh(

        execution

    )

    return execution


# ====================================
# GET EXECUTION
# ====================================

def get_execution(

    db,

    execution_id

):

    return (

        db.query(

            Execution

        )

        .filter(

            Execution.id == execution_id

        )

        .first()

    )


# ====================================
# GET EXECUTION BY JOB
# ====================================

def get_execution_by_job(

    db,

    job_creation_id

):

    return (

        db.query(

            Execution

        )

        .filter(

            Execution.job_creation_id == job_creation_id

        )

        .first()

    )


# ====================================
# UPDATE EXECUTION
# ====================================

def update_execution(

    db,

    execution

):

    db.commit()

    db.refresh(

        execution

    )

    return execution


# ====================================
# LIST EXECUTIONS
# ====================================

def list_executions(

    db

):

    return (

        db.query(

            Execution

        )

        .order_by(

            Execution.id

        )

        .all()

    )


# ====================================
# START PHASE
# ====================================

def start_phase(

    db,

    execution

):

    execution.workflow_status = "CURRENTLY_WORKING"

    if execution.current_phase == "PHASE_1":


        execution.phase_1_status = "IN_PROGRESS"

        execution.current_activity = "Machine Mobilisation"

        execution.execution_progress = 10

        execution.transport_status = "IN_TRANSIT"

    elif execution.current_phase == "PHASE_2":

        execution.phase_2_status = "IN_PROGRESS"

        execution.current_activity = "Site Work In Progress"

        execution.execution_progress = 50


    elif execution.current_phase == "PHASE_3":

        execution.phase_3_status = "IN_PROGRESS"

        execution.current_activity = "Testing and Demobilisation"

        execution.execution_progress = 90

    # ====================================
    # ACTIVATE MACHINE SCHEDULE
    # ====================================




    active_schedule = (

        db.query(

            MachineSchedule

        )

        .filter(

            MachineSchedule.job_creation_id == execution.job_creation_id,

            MachineSchedule.queue_position == 1

        )

        .first()

    )

    if active_schedule:

        active_schedule.schedule_status = "ACTIVE"

        machine = (

            db.query(

                MachineInventory

            )

            .filter(

                MachineInventory.id == active_schedule.machine_id

            )

            .first()

        )

        if machine:

            machine.status = "ALLOCATED"

            machine.current_job_id = execution.job_creation_id

            machine.current_site = active_schedule.site_location

    invoice = (

        db.query(

            Invoice

        )

        .filter(

            Invoice.job_creation_id ==

            execution.job_creation_id

        )

        .first()

    )



    if invoice:

        invoice.execution_phase = execution.current_phase

        invoice.execution_progress = execution.execution_progress

        invoice.customer_visible_status = execution.current_activity

        invoice.current_activity = execution.current_activity

        invoice.transport_status = execution.transport_status

    execution.last_updated = date.today()

    db.commit()

    db.refresh(

        execution

    )

    return execution


# ====================================
# COMPLETE CURRENT PHASE
# ====================================

def complete_phase(

    db,

    execution

):

    print("\n========== PHASE TRANSITION ==========")
    print(f"Execution ID   : {execution.id}")
    print(f"Current Phase  : {execution.current_phase}")

    if execution.current_phase == "PHASE_1":

        execution.phase_1_status = "COMPLETED"
        execution.current_phase = "PHASE_2"

    elif execution.current_phase == "PHASE_2":

        execution.phase_2_status = "COMPLETED"
        execution.current_phase = "PHASE_3"

    elif execution.current_phase == "PHASE_3":

        execution.phase_3_status = "COMPLETED"
        execution.workflow_status = "EXECUTION_COMPLETED"
        execution.execution_progress = 100
        execution.current_activity = "Execution Completed"
        execution.transport_status = "COMPLETED"
        execution.actual_completion = date.today()

    print(f"New Phase       : {execution.current_phase}")
    print(f"Workflow Status : {execution.workflow_status}")

    db.commit()
    db.refresh(execution)

    return execution



# ====================================
# DEQUEUE EXECUTION SCHEDULES
# ====================================

def dequeue_execution_schedules(

    db,

    execution

):
    """
    Authoritative dequeue. Matches on execution_id only (exact FK
    link set at allocation time) — never on site/date, which are
    single-valued on Execution but can be multi-valued across a
    job's MachineSchedule rows. Returns the list of schedule rows
    it completed, so the caller knows which machines to check for
    promotion.
    """

    print("\n========== DEQUEUE (execution_id-linked) ==========")
    print(f"Execution ID    : {execution.id}")
    print(f"Job Creation ID : {execution.job_creation_id}")

    completed_schedules = (
        db.query(MachineSchedule)
        .filter(MachineSchedule.execution_id == execution.id)
        .all()
    )

    if not completed_schedules:
        print("[ERROR] No schedules linked to this execution_id.")
        return []

    machine_ids = {s.machine_id for s in completed_schedules}

    for machine_id in machine_ids:

        # Row-lock this machine for the duration of the transaction.
        # Serializes concurrent completions/allocations on the SAME
        # machine only -- unrelated machines are never blocked.
        machine = (
            db.query(MachineInventory)
            .filter(MachineInventory.id == machine_id)
            .with_for_update()
            .first()
        )

        if machine is None:
            print(f"[WARNING] Machine {machine_id} not found, skipping")
            continue

        this_machines_completed = [
            s for s in completed_schedules if s.machine_id == machine_id
        ]

        for s in this_machines_completed:
            print(
                f"[DEQUEUE] schedule={s.id} machine={machine_id} "
                f"job={s.job_creation_id} pos={s.queue_position} -> COMPLETED"
            )
            s.schedule_status = "COMPLETED"
            s.actual_completion = date.today()

        # This session is configured with autoflush=False (see
        # database/connection.py) - without an explicit flush here,
        # the "remaining" query below re-selects straight from the DB,
        # doesn't see the pending COMPLETED status yet, and the
        # identity map hands back the SAME in-memory row, silently
        # clobbering the completion with an ACTIVE re-promotion. A
        # real, pre-existing bug that only manifests with a genuine
        # 2+-deep queue at completion time - found and fixed while
        # building the fleet-level analog of this exact function.
        db.flush()

        # Lock and re-fetch everything still QUEUED/ACTIVE for this
        # machine, in position order, then compact to 1,2,3...
        remaining = (
            db.query(MachineSchedule)
            .filter(
                MachineSchedule.machine_id == machine_id,
                MachineSchedule.schedule_status.in_(["QUEUED", "ACTIVE"])
            )
            .order_by(MachineSchedule.queue_position)
            .with_for_update()
            .all()
        )

        for index, s in enumerate(remaining, start=1):
            if s.queue_position != index:
                print(
                    f"[RENUMBER] schedule={s.id} machine={machine_id} "
                    f"pos {s.queue_position} -> {index}"
                )
                s.queue_position = index

        if remaining:
            next_schedule = remaining[0]
            next_schedule.schedule_status = "ACTIVE"
            machine.status = "ALLOCATED"
            machine.current_job_id = next_schedule.job_creation_id
            machine.current_site = next_schedule.site_location
            print(
                f"[PROMOTE] machine={machine_id} -> job="
                f"{next_schedule.job_creation_id} (schedule={next_schedule.id}, "
                f"pos 1, ACTIVE)"
            )
        else:
            machine.status = "AVAILABLE"
            machine.current_job_id = None
            machine.current_site = None
            print(f"[RELEASE] machine={machine_id} -> AVAILABLE, queue empty")

        machine.queue_count = len(remaining)
        print(f"[QUEUE COUNT] machine={machine_id} -> {machine.queue_count}")

    db.commit()
    print("========== DEQUEUE COMPLETE ==========\n")

    return completed_schedules