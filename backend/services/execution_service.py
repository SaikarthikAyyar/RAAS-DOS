# ====================================
# IMPORTS
# ====================================

from fastapi import HTTPException

from backend.schemas.execution_schema import (
    ExecutionSchema
)

from datetime import datetime

from backend.repositories.execution_repository import (
    create_execution,
    get_execution,
    get_execution_by_job,
    list_executions,
    start_phase,
    complete_phase
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
        distance_remaining_km=0,

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

    execution.workflow_status = "READY"

    execution.current_phase = "PHASE_1"

    execution.current_activity = "Resources Allocated"

    execution.site_location = payload.site_location

    execution.planned_start = payload.planned_start

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

    invoice.distance_remaining_km = execution.distance_remaining_km

    invoice.eta_minutes = execution.eta_minutes

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

            "distance": execution.distance_remaining_km,

            "source": execution.last_update_source


        }

    )

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

    update_invoice(

        db,

        invoice

    )


def update_execution_progress(
    db,
    execution,
    payload
):

    execution.execution_progress = payload.execution_progress

    execution.current_activity = payload.current_activity

    execution.transport_status = payload.transport_status

    execution.latitude = payload.latitude

    execution.longitude = payload.longitude

    execution.speed_kmph = payload.speed_kmph

    execution.heading = payload.heading

    execution.altitude = payload.altitude

    execution.accuracy_meters = payload.accuracy_meters

    execution.gps_timestamp = payload.gps_timestamp

    execution.last_update_source = payload.last_update_source

    execution.distance_remaining_km = payload.distance_remaining_km

    execution.eta_minutes = payload.eta_minutes

    execution.today_output = payload.today_output

    execution.total_output = payload.total_output

    execution.daily_target = payload.daily_target

    execution.output_unit = payload.output_unit

    execution.proof_uploaded = payload.proof_uploaded

    execution.last_updated = datetime.utcnow()

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

    return get_execution(

        db,

        execution_id

    )


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

    execution = start_phase(

        db,

        execution

    )

    # ====================================
    # START MACHINE SCHEDULE
    # ====================================

    current_schedule = (

        db.query(

            MachineSchedule

        )

        .filter(

            MachineSchedule.job_creation_id == execution.job_creation_id,

            MachineSchedule.schedule_status == "QUEUED"

        )

        .order_by(

            MachineSchedule.queue_position

        )

        .first()

    )

    if current_schedule:

        print("\n========== EXECUTION START ==========")

        print(f"Execution : {execution.id}")

        print(f"Job : {execution.job_creation_id}")

        print(f"Machine : {current_schedule.machine_id}")

        current_schedule.schedule_status = "IN_PROGRESS"

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
# COMPLETE PHASE
# ====================================

def complete_execution_phase(

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

    execution = complete_phase(

        db,

        execution

    )

    # ====================================
    # COMPLETE CURRENT MACHINE SCHEDULE
    # ====================================

    current_schedule = (

        db.query(

            MachineSchedule

        )

        .filter(

            MachineSchedule.job_creation_id == execution.job_creation_id,

            MachineSchedule.schedule_status == "IN_PROGRESS"

        )

        .first()

    )

    if current_schedule:

        print("\n========== FIFO DEQUEUE ==========")

        print(f"Completed Job : {execution.job_creation_id}")

        print(f"Machine ID : {current_schedule.machine_id}")

        print(f"Queue Position : {current_schedule.queue_position}")

        machine_id = current_schedule.machine_id

        db.delete(current_schedule)

        db.flush()

    else:

        machine_id = None

    db.commit()

    # ====================================
    # PROMOTE NEXT FIFO JOB
    # ====================================

    if machine_id is not None:

        remaining_jobs = (

            db.query(

                MachineSchedule

            )

            .filter(

                MachineSchedule.machine_id == machine_id

            )

            .order_by(

                MachineSchedule.queue_position

            )

            .all()

        )

        print("\n========== FIFO QUEUE ==========")

        print(f"Remaining Jobs : {len(remaining_jobs)}")

        for index, schedule in enumerate(remaining_jobs, start=1):

            old_position = schedule.queue_position

            schedule.queue_position = index

            print(

                f"Job {schedule.job_creation_id} : "

                f"{old_position} -> {index}"

            )

        db.commit()

    # ====================================
    # START NEXT FIFO JOB
    # ====================================

    next_schedule = (

        db.query(

            MachineSchedule

        )

        .filter(

            MachineSchedule.machine_id == machine_id,

            MachineSchedule.queue_position == 1

        )

        .first()

    )

    if next_schedule:

        print("\n========== NEXT FIFO JOB ==========")

        print(f"Job : {next_schedule.job_creation_id}")

        print(f"Machine : {machine_id}")

        next_schedule.schedule_status = "IN_PROGRESS"

        machine = (

            db.query(

                MachineInventory

            )

            .filter(

                MachineInventory.id == machine_id

            )

            .first()

        )

        if machine:

            next_job = (

                get_job(

                    db,

                    next_schedule.job_creation_id

                )

            )

            machine.status = "ALLOCATED"

            machine.current_job_id = next_job.id

            machine.current_site = next_schedule.site_location

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

        db.commit()

        # ====================================
        # UPDATE NEXT EXECUTION
        # ====================================

        next_execution = (

            get_execution_by_job(

                db,

                next_schedule.job_creation_id

            )

        )

        if next_execution:

            # ====================================
            # RESET EXECUTION STATE
            # ====================================

            next_execution.workflow_status = "READY"

            next_execution.current_phase = "PHASE_1"

            next_execution.execution_progress = 0

            next_execution.phase_1_status = "PENDING"

            next_execution.phase_2_status = "PENDING"

            next_execution.phase_3_status = "PENDING"

            # ====================================
            # RESOURCE DETAILS
            # ====================================

            next_execution.current_activity = "Resources Allocated"

            next_execution.site_location = next_schedule.site_location

            # ====================================
            # SCHEDULE
            # ====================================

            next_execution.planned_start = next_schedule.planned_start

            next_execution.estimated_completion = (

                next_schedule.planned_completion

            )

            next_execution.actual_completion = None

            next_execution.delay_days = 0

            # ====================================
            # TRANSPORT
            # ====================================

            next_execution.transport_status = "WAITING"

            print("\n========== EXECUTION RESET ==========")

            print(

                f"Execution : {next_execution.id}"

            )

            print(

                f"Workflow : {next_execution.workflow_status}"

            )

            print(

                f"Phase : {next_execution.current_phase}"

            )

            print(

                f"Transport : {next_execution.transport_status}"

            )

            print("\n========== EXECUTION PROMOTED ==========")

            print(

                f"Execution : {next_execution.id}"

            )

            print(

                f"Job : {next_execution.job_creation_id}"

            )

            print(

                f"Site : {next_execution.site_location}"

            )

            db.commit()

            db.refresh(next_execution)

            sync_invoice_from_execution(

                db,

                next_execution

            )

    else:

        print("\n========== MACHINE RELEASE ==========")

        machine = (

            db.query(

                MachineInventory

            )

            .filter(

                MachineInventory.id == machine_id

            )

            .first()

        )

        if machine:

            machine.status = "AVAILABLE"

            machine.current_job_id = None

            machine.current_site = None

            machine.queue_count = 0

            print(

                f"Machine : {machine.machine_name}"

            )

            print(

                "Queue Empty"

            )

            print(

                "Machine Released"

            )

        db.commit()

        db.refresh(execution)

        sync_invoice_from_execution(

            db,

            execution

        )





    if execution.workflow_status == "EXECUTION_COMPLETED":

        update_customer_request_status(

            db,

            execution.customer_request_id,

            "EXECUTION_COMPLETED"

        )

    return execution