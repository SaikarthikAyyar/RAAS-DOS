# ====================================
# IMPORTS
# ====================================

from fastapi import HTTPException

from backend.schemas.execution_schema import (
    ExecutionSchema
)

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

        phase_1_status="PENDING",

        phase_2_status="PENDING",

        phase_3_status="PENDING",

        site_location=None,

        planned_start=job.planned_start,

        estimated_completion=job.planned_completion,

        remarks=None

    )

    execution = create_execution(

        db,

        execution

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

    update_customer_request_status(

        db,

        job.customer_request_id,

        "EXECUTION_READY"

    )

    print(

        "[Workflow] Customer Status -> EXECUTION_READY"

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

    return start_phase(

        db,

        execution

    )


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

    if execution.workflow_status == "EXECUTION_COMPLETED":

        update_customer_request_status(

            db,

            execution.customer_request_id,

            "EXECUTION_COMPLETED"

        )

    return execution