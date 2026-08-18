# ====================================
# IMPORTS
# ====================================

from datetime import datetime, timezone

from fastapi import HTTPException, status

from backend.models.enquiry import Enquiry

from backend.repositories.survey_reminder_repository import cancel_active_reminders_for_enquiry

from enum import Enum


# ====================================
# WORKFLOW STAGES
# ====================================

class WorkflowStage(str, Enum):

    CUSTOMER_REQUEST = "CUSTOMER_REQUEST"

    SALES_SURVEY = "SALES_SURVEY"

    OPS_REVIEW = "OPS_REVIEW"

    QUOTE_COMMERCIAL_REVIEW = "QUOTE_COMMERCIAL_REVIEW"

    COMMERCIAL_APPROVAL = "COMMERCIAL_APPROVAL"

    QUOTE_RELEASED = "QUOTE_RELEASED"

    PO_RECEIVED = "PO_RECEIVED"

    JOB_CREATION = "JOB_CREATION"

    EXECUTION = "EXECUTION"

    COMPLETED = "COMPLETED"


# ====================================
# WORKFLOW ORDER
# 10 stages, matching the RAAS DOS
# wireframe's STAGES array.
# ====================================

WORKFLOW_ORDER = [

    WorkflowStage.CUSTOMER_REQUEST,

    WorkflowStage.SALES_SURVEY,

    WorkflowStage.OPS_REVIEW,

    WorkflowStage.QUOTE_COMMERCIAL_REVIEW,

    WorkflowStage.COMMERCIAL_APPROVAL,

    WorkflowStage.QUOTE_RELEASED,

    WorkflowStage.PO_RECEIVED,

    WorkflowStage.JOB_CREATION,

    WorkflowStage.EXECUTION,

    WorkflowStage.COMPLETED

]


# ====================================
# PRIVATE
# ====================================

def _get_enquiry(

    db,

    enquiry_id

):

    enquiry = (

        db.query(

            Enquiry

        )

        .filter(

            Enquiry.id == enquiry_id

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

    enquiry_id,

    stage

):

    print("\n========================================")
    print("[WORKFLOW] UPDATE STAGE")
    print(f"[WORKFLOW] Enquiry ID       : {enquiry_id}")
    print(f"[WORKFLOW] New Stage        : {stage}")

    enquiry = _get_enquiry(

        db,

        enquiry_id

    )

    previous_stage = enquiry.stage

    enquiry.stage = stage

    enquiry.stage_entered_at = datetime.now(timezone.utc)

    db.commit()

    db.refresh(

        enquiry

    )

    print("[WORKFLOW] Stage Updated")

    # A reminder can only ever be created while stage == SALES_SURVEY, so
    # any real stage change means "left the stage the reminder was
    # watching" - cancel it regardless of which stage it's now moving to.
    if previous_stage != stage:

        cancelled_count = cancel_active_reminders_for_enquiry(db, enquiry_id)

        if cancelled_count:
            print(f"[WORKFLOW] Cancelled {cancelled_count} active Survey Reminder(s) on stage change")

    print("========================================\n")

    return enquiry


# ====================================
# NEXT STAGE
# ====================================

def advance_to_next_stage(

    db,

    enquiry_id

):

    enquiry = _get_enquiry(

        db,

        enquiry_id

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

        enquiry_id,

        next_stage


    )


# ====================================
# ADVANCE, NEVER REGRESS
# For callers that may run repeatedly on
# an enquiry that has already moved past
# their stage (e.g. re-saving Ops Selector
# or re-approving a quote) - only moves the
# stage forward, never backward.
# ====================================

def advance_stage_at_least(

    db,

    enquiry_id,

    target_stage

):

    enquiry = _get_enquiry(

        db,

        enquiry_id

    )

    try:

        current_index = WORKFLOW_ORDER.index(

            enquiry.stage

        )

    except ValueError:

        current_index = -1

    target_index = WORKFLOW_ORDER.index(

        target_stage

    )

    if target_index <= current_index:

        return enquiry

    return update_stage(

        db,

        enquiry_id,

        target_stage

    )