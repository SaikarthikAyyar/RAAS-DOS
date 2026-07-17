# ====================================
# IMPORTS
# ====================================

from backend.models.execution import Execution


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

        actual_completion=
        payload.actual_completion,

        remarks=
        payload.remarks

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

    if execution.current_phase == "PHASE_1":

        execution.phase_1_status = "IN_PROGRESS"

    elif execution.current_phase == "PHASE_2":

        execution.phase_2_status = "IN_PROGRESS"

    elif execution.current_phase == "PHASE_3":

        execution.phase_3_status = "IN_PROGRESS"

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

    if execution.current_phase == "PHASE_1":

        execution.phase_1_status = "COMPLETED"

        execution.current_phase = "PHASE_2"

    elif execution.current_phase == "PHASE_2":

        execution.phase_2_status = "COMPLETED"

        execution.current_phase = "PHASE_3"

    elif execution.current_phase == "PHASE_3":

        execution.phase_3_status = "COMPLETED"

        execution.workflow_status = "EXECUTION_COMPLETED"

    db.commit()

    db.refresh(

        execution

    )

    return execution