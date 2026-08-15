# ====================================
# IMPORTS
# ====================================

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.models.enquiry import Enquiry

from backend.repositories.quote_release_document_repository import (
    get_quote_release_document,
    get_latest_quote_release_document_by_quote
)

from backend.services.quote_release_service import generate_quote_release_docx

from backend.services.workflow_service import WORKFLOW_ORDER, WorkflowStage


router = APIRouter()


# ====================================
# LOOKUP (by quote - so the download link stays available on the
# Commercial Approval card indefinitely, not just in the moment right
# after the accept-decision response)
# ====================================

@router.get("/quotes/{quote_id}/quote-release-document")
def get_quote_release_document_for_quote(quote_id: int, db: Session = Depends(get_db)):

    document = get_latest_quote_release_document_by_quote(db, quote_id)

    if document is None:
        return None

    return {
        "id": document.id,
        "file_name": document.file_name,
        "created_at": document.created_at
    }


# ====================================
# DOWNLOAD
# ====================================

@router.get("/quote-release-documents/{document_id}/download")
def download_quote_release_document(document_id: int, db: Session = Depends(get_db)):

    document = get_quote_release_document(db, document_id)

    if document is None:
        raise HTTPException(status_code=404, detail="Quote release document not found.")

    return FileResponse(
        document.file_path,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename=document.file_name
    )


# ====================================
# GENERATE (from the Quotes module) - lets a real quote already at
# QUOTE_RELEASED stage (or any later stage - a release stays valid
# once reached) get its release document generated/regenerated on
# demand, streamed straight back for immediate browser download. Calls
# the exact same generate_quote_release_docx() the Commercial Approval
# Accept flow uses - no separate content-generation path, so the
# active Quote Template (edited only from Business Masters -> Quote
# Templates) is the sole source of the document's structure; this
# endpoint only supplies which enquiry's real data to assign into it.
# ====================================

@router.get("/quotes/{quote_id}/generate-quote-release")
def generate_quote_release_for_quote(

    quote_id: int,
    generated_by: Optional[str] = None,
    db: Session = Depends(get_db)

):

    enquiry = db.query(Enquiry).filter(Enquiry.quote_id == quote_id).first()

    if enquiry is None:
        raise HTTPException(status_code=422, detail="No enquiry is currently linked to this quote.")

    try:
        current_index = WORKFLOW_ORDER.index(enquiry.stage)
    except ValueError:
        current_index = -1

    quote_released_index = WORKFLOW_ORDER.index(WorkflowStage.QUOTE_RELEASED.value)

    if current_index < quote_released_index:
        raise HTTPException(
            status_code=422,
            detail="This enquiry must reach Quote Released stage before a quote release document can be generated."
        )

    try:
        document = generate_quote_release_docx(db, quote_id, enquiry.id, generated_by or "Quotes Module")
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error))

    return FileResponse(
        document.file_path,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename=document.file_name
    )


# ====================================
# Sending the finished quote release email now goes through the
# Email Templates system (its seeded "Quote Release" template) - see
# email_template_api.py's /send route, which gained multipart
# attachment support for exactly this - rather than a separate
# quote-release-specific send path.
# ====================================
