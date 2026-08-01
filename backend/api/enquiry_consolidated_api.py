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

    ModuleReferenceUpdateRequest

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
    db: Session = Depends(get_db)
):

    return service.request_ops_review(
        db,
        enquiry_id
    )