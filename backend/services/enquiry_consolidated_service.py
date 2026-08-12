# ====================================
# IMPORTS
# ====================================

from datetime import datetime

from fastapi import HTTPException, status

from backend.repositories import enquiry_consolidated_repository as repository

from backend.schemas.enquiry_consolidated_schema import (
    EnquiryConsolidatedListResponse,
    EnquiryConsolidatedDetail,
    EnquiryLifecycleResponse,
    EnquiryDeleteResponse,
    EnquiryStatus,
)

from backend.services.enquiry_service import EnquiryService

from backend.services.workflow_service import (
    advance_to_next_stage,
    update_stage,
    advance_stage_at_least
)

from backend.models.techno_commercial_quote import Quote

from backend.utils.aging import compute_aging_seconds, aging_seconds_to_days_display
from backend.utils.value_display import compute_value_display


# ====================================
# ATTACH AGING + VALUE
# Both are computed live (never stored/cached) - matches the
# wireframe's own daysInStage(), which recomputes at render time
# rather than keeping a background job in sync. Attached as plain
# Python attributes (not real ORM columns) so EnquiryConsolidatedListItem's
# from_attributes=True picks them up via getattr, same as any other field.
# ====================================

def _attach_aging_and_value(db, enquiries):

    quote_ids = [e.quote_id for e in enquiries if e.quote_id]

    quotes_by_id = {}

    if quote_ids:

        quotes = db.query(Quote).filter(Quote.id.in_(quote_ids)).all()

        quotes_by_id = {q.id: q for q in quotes}

    for enquiry in enquiries:

        aging_seconds = compute_aging_seconds(enquiry.stage_entered_at)

        enquiry.aging_seconds = int(aging_seconds)
        enquiry.aging_display = aging_seconds_to_days_display(aging_seconds)

        quote = quotes_by_id.get(enquiry.quote_id) if enquiry.quote_id else None

        enquiry.value_display = compute_value_display(quote)

    return enquiries

# ====================================
# PRIVATE
# ====================================

def _get_enquiry_or_404(

        db,

        enquiry_id

):

    print("\n========================================")
    print("[SERVICE] Fetching Enquiry")
    print(f"[SERVICE] Enquiry ID : {enquiry_id}")

    enquiry = repository.get_enquiry(

        db,

        enquiry_id

    )

    if not enquiry:

        print("[SERVICE] Enquiry NOT FOUND")
        print("========================================\n")

        raise HTTPException(

            status_code=status.HTTP_404_NOT_FOUND,

            detail="Enquiry not found."

        )

    print("[SERVICE] Enquiry Found")
    print(f"[SERVICE] Status : {enquiry.status}")
    print(f"[SERVICE] Stage  : {enquiry.stage}")
    print("========================================\n")

    return enquiry


# ====================================
# GET ENQUIRIES
# ====================================

def get_enquiries(

        db,

        query

):

    print("\n========================================")
    print("[SERVICE] GET ENQUIRIES")
    print(f"[SERVICE] Status Filter : {query.status}")
    print(f"[SERVICE] Search        : {query.search}")
    print(f"[SERVICE] Page          : {query.page}")
    print(f"[SERVICE] Page Size     : {query.page_size}")

    enquiries = repository.get_enquiries(

        db,

        query.status,

        query.search,

        query.page,

        query.page_size

    )

    total = repository.count_enquiries(

        db,

        query.status,

        query.search

    )

    enquiries = _attach_aging_and_value(db, enquiries)

    print(f"[SERVICE] Rows Returned : {len(enquiries)}")
    print(f"[SERVICE] Total Records : {total}")
    print("========================================\n")

    return EnquiryConsolidatedListResponse(

        items=enquiries,

        total=total,

        page=query.page,

        page_size=query.page_size

    )


# ====================================
# GET ENQUIRY
# ====================================

def get_enquiry(

        db,

        enquiry_id

):

    print("\n========================================")
    print("[SERVICE] GET ENQUIRY")

    enquiry = _get_enquiry_or_404(

        db,

        enquiry_id

    )

    print("[SERVICE] Returning Detail")
    print("========================================\n")

    return EnquiryConsolidatedDetail.model_validate(

        enquiry

    )

# ====================================
# UPDATE MODULE REFERENCE
# ====================================

def update_module_reference(

        db,

        enquiry_id,

        reference_field,

        reference_id

):

    print("\n========================================")
    print("[SERVICE] UPDATE MODULE REFERENCE")
    print(f"[SERVICE] Enquiry ID      : {enquiry_id}")
    print(f"[SERVICE] Reference Field : {reference_field}")
    print(f"[SERVICE] Reference ID    : {reference_id}")

    enquiry = _get_enquiry_or_404(

        db,

        enquiry_id

    )

    if not hasattr(

        enquiry,

        reference_field

    ):

        raise HTTPException(

            status_code=status.HTTP_400_BAD_REQUEST,

            detail=f"Invalid reference field: {reference_field}"

        )

    setattr(

        enquiry,

        reference_field,

        reference_id

    )

    db.commit()

    db.refresh(

        enquiry

    )

    print("[SERVICE] Module Reference Updated")
    print("========================================\n")

    return EnquiryLifecycleResponse(

        success=True,

        message="Enquiry updated successfully.",

        enquiry=enquiry

    )

def create_survey_branch(
    db,
    enquiry_id
):

    enquiry = get_enquiry(
        db,
        enquiry_id
    )

    return EnquiryService.create_customer_request_enquiry(

        db,

        enquiry.customer_request_id,

        {}
    )

# ====================================
# REQUEST OPS REVIEW
# ====================================

def request_ops_review(
    db,
    enquiry_id
):

    return advance_to_next_stage(
        db,
        enquiry_id
    )


# ====================================
# SET STAGE
# (used by "Send back to Sales" on the
# Ops Review decision card - reverts the
# stage rather than advancing it)
# ====================================

def set_stage(
    db,
    enquiry_id,
    stage
):

    return update_stage(
        db,
        enquiry_id,
        stage.value if hasattr(stage, "value") else stage
    )


# ====================================
# ADVANCE TO AT LEAST
# (used by "Approve & Send to X" actions
# that may be triggered on an enquiry that
# has already moved further than X - moves
# forward only, never backward, unlike
# set_stage above)
# ====================================

def advance_to_stage_at_least(
    db,
    enquiry_id,
    stage
):

    return advance_stage_at_least(
        db,
        enquiry_id,
        stage.value if hasattr(stage, "value") else stage
    )

# ====================================
# ARCHIVE
# ====================================

def archive_enquiry(

        db,

        enquiry_id

):

    print("\n========================================")
    print("[SERVICE] ARCHIVE ENQUIRY")

    enquiry = _get_enquiry_or_404(

        db,

        enquiry_id

    )

    print(f"[SERVICE] Current Status : {enquiry.status}")

    if enquiry.status != EnquiryStatus.OPEN:

        print("[SERVICE] Validation FAILED")
        print("========================================\n")

        raise HTTPException(

            status_code=status.HTTP_400_BAD_REQUEST,

            detail="Only OPEN enquiries can be archived."

        )

    print("[SERVICE] Validation PASSED")

    enquiry = repository.update_enquiry_status(

        db,

        enquiry,

        EnquiryStatus.ARCHIVED,

        enquiry.closed_at

    )

    print(f"[SERVICE] New Status : {enquiry.status}")
    print("[SERVICE] Archive Successful")
    print("========================================\n")

    return EnquiryLifecycleResponse(

        success=True,

        message="Enquiry archived successfully.",

        enquiry=enquiry

    )


# ====================================
# RESTORE
# ====================================

def restore_enquiry(

        db,

        enquiry_id

):

    print("\n========================================")
    print("[SERVICE] RESTORE ENQUIRY")

    enquiry = _get_enquiry_or_404(

        db,

        enquiry_id

    )

    print(f"[SERVICE] Current Status : {enquiry.status}")

    if enquiry.status not in [

        EnquiryStatus.ARCHIVED,

        EnquiryStatus.LOST

    ]:

        print("[SERVICE] Validation FAILED")
        print("========================================\n")

        raise HTTPException(

            status_code=status.HTTP_400_BAD_REQUEST,

            detail="Only LOST or ARCHIVED enquiries can be restored."

        )

    print("[SERVICE] Validation PASSED")

    enquiry = repository.update_enquiry_status(

        db,

        enquiry,

        EnquiryStatus.OPEN,

        enquiry.closed_at

    )

    print(f"[SERVICE] New Status : {enquiry.status}")
    print("[SERVICE] Restore Successful")
    print("========================================\n")

    return EnquiryLifecycleResponse(

        success=True,

        message="Enquiry restored successfully.",

        enquiry=enquiry

    )


# ====================================
# LOST
# ====================================

def mark_enquiry_lost(

        db,

        enquiry_id

):

    print("\n========================================")
    print("[SERVICE] MARK ENQUIRY LOST")

    enquiry = _get_enquiry_or_404(

        db,

        enquiry_id

    )

    print(f"[SERVICE] Current Status : {enquiry.status}")

    if enquiry.status != EnquiryStatus.OPEN:

        print("[SERVICE] Validation FAILED")
        print("========================================\n")

        raise HTTPException(

            status_code=status.HTTP_400_BAD_REQUEST,

            detail="Only OPEN enquiries can be marked as LOST."

        )

    print("[SERVICE] Validation PASSED")

    enquiry = repository.update_enquiry_status(

        db,

        enquiry,

        EnquiryStatus.LOST,

        enquiry.closed_at

    )

    print(f"[SERVICE] New Status : {enquiry.status}")
    print("[SERVICE] Lost Successful")
    print("========================================\n")

    return EnquiryLifecycleResponse(

        success=True,

        message="Enquiry marked as LOST.",

        enquiry=enquiry

    )


# ====================================
# CLOSE
# ====================================

def close_enquiry(

        db,

        enquiry_id

):

    print("\n========================================")
    print("[SERVICE] CLOSE ENQUIRY")

    enquiry = _get_enquiry_or_404(

        db,

        enquiry_id

    )

    print(f"[SERVICE] Current Status : {enquiry.status}")

    if enquiry.status != EnquiryStatus.OPEN:

        print("[SERVICE] Validation FAILED")
        print("========================================\n")

        raise HTTPException(

            status_code=status.HTTP_400_BAD_REQUEST,

            detail="Only OPEN enquiries can be closed."

        )

    print("[SERVICE] Validation PASSED")

    enquiry = repository.update_enquiry_status(

        db,

        enquiry,

        EnquiryStatus.CLOSED,

        datetime.utcnow()

    )

    print(f"[SERVICE] New Status : {enquiry.status}")
    print(f"[SERVICE] Closed At : {enquiry.closed_at}")
    print("[SERVICE] Close Successful")
    print("========================================\n")

    return EnquiryLifecycleResponse(

        success=True,

        message="Enquiry closed successfully.",

        enquiry=enquiry

    )


# ====================================
# DELETE
# ====================================

def delete_enquiry(

        db,

        enquiry_id

):

    print("\n========================================")
    print("[SERVICE] DELETE ENQUIRY")

    enquiry = _get_enquiry_or_404(

        db,

        enquiry_id

    )

    print(f"[SERVICE] Deleting ID : {enquiry.id}")
    print(f"[SERVICE] Status      : {enquiry.status}")

    repository.delete_enquiry(

        db,

        enquiry

    )

    print("[SERVICE] Delete Successful")
    print("========================================\n")

    return EnquiryDeleteResponse(

        success=True,

        message="Enquiry deleted successfully."

    )