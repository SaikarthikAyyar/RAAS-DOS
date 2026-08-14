# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.repositories.quote_release_document_repository import (
    get_quote_release_document,
    get_latest_quote_release_document_by_quote
)


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
# Sending the finished quote release email now goes through the
# Email Templates system (its seeded "Quote Release" template) - see
# email_template_api.py's /send route, which gained multipart
# attachment support for exactly this - rather than a separate
# quote-release-specific send path.
# ====================================
