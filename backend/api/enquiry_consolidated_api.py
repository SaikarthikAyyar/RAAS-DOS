# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.enquiry_consolidated_schema import (

    EnquiryDashboardQuery,

    EnquiryConsolidatedListResponse,

    EnquiryConsolidatedDetail,

    EnquiryLifecycleResponse,

    EnquiryDeleteResponse,

    ModuleReferenceUpdateRequest,

    SetStageRequest,

    RequestApprovalSchema,

    RequestOpsReviewSchema

)

from backend.services import enquiry_consolidated_service as service


# ====================================
# API
# ====================================

router = APIRouter(

    prefix="/enquiry-consolidated",

    tags=["Consolidated Enquiry"]

)


# ====================================
# GET DASHBOARD
# ====================================

@router.get(

    "",

    response_model=EnquiryConsolidatedListResponse

)

def get_enquiries(

    query: EnquiryDashboardQuery = Depends(),

    db: Session = Depends(get_db)

):

    return service.get_enquiries(

        db,

        query

    )


# ====================================
# GET ENQUIRY
# ====================================

@router.get(

    "/{enquiry_id}",

    response_model=EnquiryConsolidatedDetail

)

def get_enquiry(

    enquiry_id: int,

    db: Session = Depends(get_db)

):

    return service.get_enquiry(

        db,

        enquiry_id

    )

# ====================================
# UPDATE MODULE REFERENCE
# ====================================

@router.put(

    "/{enquiry_id}/module-reference",

    response_model=EnquiryLifecycleResponse

)

def update_module_reference(

    enquiry_id: int,

    payload: ModuleReferenceUpdateRequest,

    db: Session = Depends(get_db)

):

    return service.update_module_reference(

        db,

        enquiry_id,

        payload.reference_field,

        payload.reference_id

    )

# ====================================
# ARCHIVE
# ====================================

@router.put(

    "/{enquiry_id}/archive",

    response_model=EnquiryLifecycleResponse

)

def archive_enquiry(

    enquiry_id: int,

    db: Session = Depends(get_db)

):

    return service.archive_enquiry(

        db,

        enquiry_id

    )


# ====================================
# RESTORE
# ====================================

@router.put(

    "/{enquiry_id}/restore",

    response_model=EnquiryLifecycleResponse

)

def restore_enquiry(

    enquiry_id: int,

    db: Session = Depends(get_db)

):

    return service.restore_enquiry(

        db,

        enquiry_id

    )


# ====================================
# LOST
# ====================================

@router.put(

    "/{enquiry_id}/lost",

    response_model=EnquiryLifecycleResponse

)

def mark_enquiry_lost(

    enquiry_id: int,

    db: Session = Depends(get_db)

):

    return service.mark_enquiry_lost(

        db,

        enquiry_id

    )


# ====================================
# CLOSE
# ====================================

@router.put(

    "/{enquiry_id}/close",

    response_model=EnquiryLifecycleResponse

)

def close_enquiry(

    enquiry_id: int,

    db: Session = Depends(get_db)

):

    return service.close_enquiry(

        db,

        enquiry_id

    )


# ====================================
# DELETE
# ====================================

@router.delete(

    "/{enquiry_id}",

    response_model=EnquiryDeleteResponse

)

def delete_enquiry(

    enquiry_id: int,

    db: Session = Depends(get_db)

):

    return service.delete_enquiry(

        db,

        enquiry_id

    )

@router.post(
    "/{enquiry_id}/create-survey"
)
def create_survey_branch(

    enquiry_id:int,

    db:Session=Depends(get_db)

):

    return service.create_survey_branch(

        db,

        enquiry_id

    )


# ====================================
# REQUEST OPS REVIEW
# ====================================

@router.put(
    "/{enquiry_id}/request-ops-review"
)
def request_ops_review(
    enquiry_id: int,
    payload: RequestOpsReviewSchema = RequestOpsReviewSchema(),
    db: Session = Depends(get_db)
):

    return service.request_ops_review(
        db,
        enquiry_id,
        payload.actor
    )


# ====================================
# APPROVAL STANDING
# For the frontend to pre-disable Approve/Send-back/Reject buttons
# before the user even attempts an action - resolves this enquiry's
# hub (via its Sales Survey's nearest_hub) and reports whether the
# given user holds real hub_approvers standing for each gate.
# ====================================

@router.get(
    "/{enquiry_id}/approval-standing"
)
def get_approval_standing(
    enquiry_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    return service.get_enquiry_approval_standing_request(
        db,
        enquiry_id,
        user_id
    )


# ====================================
# REQUEST APPROVAL (Phase 27)
# The "please review this" ping - notifies every real hub-approver for
# the given gate, no state change of its own. Available on every tab
# that has a real approval gate (Ops Review, Quote & Commercial,
# Commercial Approval).
# ====================================

@router.post(
    "/{enquiry_id}/request-approval"
)
def post_request_approval(
    enquiry_id: int,
    payload: RequestApprovalSchema,
    db: Session = Depends(get_db)
):

    return service.request_approval_request(
        db,
        enquiry_id,
        payload.approval_type,
        payload.actor
    )


# ====================================
# SET STAGE
# ====================================

@router.put(
    "/{enquiry_id}/stage"
)
def set_stage(
    enquiry_id: int,
    payload: SetStageRequest,
    db: Session = Depends(get_db)
):

    return service.set_stage(
        db,
        enquiry_id,
        payload.stage
    )


# ====================================
# ADVANCE TO AT LEAST
# ====================================

@router.put(
    "/{enquiry_id}/stage-at-least"
)
def advance_to_stage_at_least(
    enquiry_id: int,
    payload: SetStageRequest,
    db: Session = Depends(get_db)
):

    return service.advance_to_stage_at_least(
        db,
        enquiry_id,
        payload.stage
    )