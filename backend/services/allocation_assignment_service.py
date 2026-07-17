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
    # ALLOCATE MACHINES
    # ====================================

# ====================================
# ALLOCATE MACHINES
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

        if machine.status != "AVAILABLE":

            raise ValueError(

                f"{machine.machine_name} is already allocated."

            )

        machine.current_job_id = job.id

        machine.status = "ALLOCATED"

        machine.site_location = site_location

        machine.allocated_start = payload.planned_start

        machine.allocated_completion = payload.planned_completion

        machine.estimated_arrival = payload.planned_start

        machine.next_available_date = payload.planned_completion

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

        person.allocation_status = "ALLOCATED"

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