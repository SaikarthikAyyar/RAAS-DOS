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