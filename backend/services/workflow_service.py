# ====================================
# IMPORTS
# ====================================

from fastapi import HTTPException, status

from backend.models.enquiry import Enquiry

from enum import Enum


# ====================================
# WORKFLOW STAGES
# ====================================

class WorkflowStage(str, Enum):

    SALES_SURVEY = "SALES_SURVEY"

    OPS_REVIEW = "OPS_REVIEW"

    QUOTE = "QUOTE"

    JOB_CREATION = "JOB_CREATION"

    EXECUTION = "EXECUTION"

    COMPLETED = "COMPLETED"


# ====================================
# WORKFLOW ORDER
# ====================================

WORKFLOW_ORDER = [

    WorkflowStage.SALES_SURVEY,

    WorkflowStage.OPS_REVIEW,

    WorkflowStage.QUOTE,

    WorkflowStage.JOB_CREATION,

    WorkflowStage.EXECUTION,

    WorkflowStage.COMPLETED

]


# ====================================
# PRIVATE
# ====================================

def _get_enquiry(

    db,

    customer_request_id

):

    enquiry = (

        db.query(

            Enquiry

        )

        .filter(

            Enquiry.customer_request_id == customer_request_id

        )

        .first()

    )

    if not enquiry:

        raise HTTPException(

            status_code=status.HTTP_404_NOT_FOUND,

            detail="Enquiry not found."

        )

    return enquiry


# ====================================
# UPDATE STAGE
# ====================================

def update_stage(

    db,

    customer_request_id,

    stage

):

    print("\n========================================")
    print("[WORKFLOW] UPDATE STAGE")
    print(f"[WORKFLOW] Customer Request : {customer_request_id}")
    print(f"[WORKFLOW] New Stage        : {stage}")

    enquiry = _get_enquiry(

        db,

        customer_request_id

    )

    enquiry.stage = stage

    db.commit()

    db.refresh(

        enquiry

    )

    print("[WORKFLOW] Stage Updated")
    print("========================================\n")

    return enquiry


# ====================================
# NEXT STAGE
# ====================================

def advance_to_next_stage(

    db,

    customer_request_id

):

    enquiry = _get_enquiry(

        db,

        customer_request_id

    )

    try:

        current_index = WORKFLOW_ORDER.index(

            enquiry.stage

        )

    except ValueError:

        raise HTTPException(

            status_code=status.HTTP_400_BAD_REQUEST,

            detail="Current workflow stage is invalid."

        )

    if current_index >= len(

        WORKFLOW_ORDER

    ) - 1:

        return enquiry

    next_stage = WORKFLOW_ORDER[

        current_index + 1

    ]

    return update_stage(

        db,

        customer_request_id,

        next_stage

    )