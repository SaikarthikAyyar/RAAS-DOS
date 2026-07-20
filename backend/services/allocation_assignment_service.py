# ====================================
# IMPORTS
# ====================================

from backend.models.machine_inventory import MachineInventory
from backend.models.personnel import Personnel
from backend.models.job_creation import JobCreation

from backend.services.enquiry_service import EnquiryService
from backend.services.status_service import update_customer_request_status

from backend.services.execution_service import (

    create_execution_request

)

# ====================================
# IMPORTS
# ====================================

from backend.services.allocation_service import get_allocation_dashboard

from backend.models.machine_schedule import MachineSchedule

from backend.services.invoice_service import (
    get_invoice_by_job_request,
    update_invoice_request
)

# ====================================
# ALLOCATE RESOURCES
# ====================================

def allocate_resources(

    db,
    payload,

    job_id,

    machine_ids,

    personnel_ids,

    site_location

):

    job = (

        db.query(

            JobCreation

        )

        .filter(

            JobCreation.id == job_id

        )

        .first()

    )

    if job is None:

        raise ValueError(

            "Job not found."

        )

    # ====================================
    # CREATE MACHINE SCHEDULE
    # ====================================

    for machine_id in machine_ids:

        machine = (

            db.query(

                MachineInventory

            )

            .filter(

                MachineInventory.id == machine_id

            )

            .first()

        )

        if machine is None:

            continue

        queue_position = (

            db.query(

                MachineSchedule

            )

            .filter(

                MachineSchedule.machine_id == machine.id

            )

            .count()

        ) + 1

        schedule = MachineSchedule(

            machine_id=machine.id,

            job_creation_id=job.id,

            queue_position=queue_position,

            site_location=site_location,

            planned_start=payload.planned_start,

            planned_completion=payload.planned_completion,

            schedule_status="QUEUED"

        )

        db.add(schedule)

        machine.queue_count += 1

        db.flush()
        db.refresh(machine)



    # ====================================
    # ALLOCATE PERSONNEL
    # ====================================

# ====================================
# ALLOCATE PERSONNEL
# ====================================

    for personnel_id in personnel_ids:

        person = (

            db.query(

                Personnel

            )

            .filter(

                Personnel.id == personnel_id

            )

            .first()

        )

        if person is None:

            continue

        if not person.documents_verified:

            raise ValueError(

                f"{person.full_name} documents are not verified."

            )

        person.current_job_id = job.id

        person.current_location = site_location

        person.availablity_status = "ALLOCATED"

    # ====================================
    # UPDATE JOB
    # ====================================

    # ====================================
# UPDATE JOB SCHEDULE
# ====================================

    job.planned_start = payload.planned_start

    job.planned_completion = payload.planned_completion

    job.workflow_status = "EXECUTION_READY"

    db.commit()

    db.refresh(job)


    # ====================================
    # UPDATE INVOICE
    # ====================================

    invoice = get_invoice_by_job_request(

        db,

        job.id

    )

    if invoice is not None:

        invoice.planned_start = payload.planned_start

        invoice.estimated_completion = payload.planned_completion

        invoice.customer_visible_status = "Resources Scheduled"

        invoice.execution_phase = "ALLOCATION"

        invoice.current_activity = "Machines and Personnel Scheduled"

        update_invoice_request(

            db,

            invoice

        )

    # ====================================
    # CREATE EXECUTION ENQUIRY
    # ====================================



    update_customer_request_status(

        db,

        job.customer_request_id,

        "EXECUTION_READY"

    )

    # ====================================
    # CREATE EXECUTION
    # ====================================



    print(

        "[Workflow] Creating Execution"

    )

    create_execution_request(

        db,

        job.id

    )

    return job





# ====================================
# LOAD ALLOCATION
# ====================================

def get_allocation_request(

    db,

    job_id

):

    print(

        "\n========== ALLOCATION SERVICE =========="

    )

    print(

        f"Loading Job : {job_id}"

    )

    allocation = get_allocation_dashboard(

        db,

        job_id

    )

    print(

        "========================================\n"

    )

    return allocation