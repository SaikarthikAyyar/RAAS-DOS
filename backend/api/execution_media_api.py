# ====================================
# EXECUTION MEDIA API
# Mirrors customer_media_api.py's shape (upload + list), scoped to an
# execution instead of a customer request. Uploading is gated
# client-side only (hasTask("enquiry-tab-execution", "upload_media"),
# admin-only for now, matching every other action on this tab) - this
# route itself has no server-side auth, consistent with the rest of
# this app's current trust model. The GET route is what the read-only
# Customer Portal view also calls - same data, no write path exposed
# to it at all.
# ====================================

from typing import List, Optional

from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.services.execution_media_service import save_media, get_media, delete_media


router = APIRouter()


@router.post("/execution/{execution_id}/media")
async def upload_execution_media(

    execution_id: int,
    photos: List[UploadFile] = File(default=[]),
    videos: List[UploadFile] = File(default=[]),
    uploaded_by: Optional[str] = Form(default=None),
    db: Session = Depends(get_db)

):

    return await save_media(db, execution_id, photos, videos, uploaded_by)


@router.get("/execution/{execution_id}/media")
def list_execution_media(

    execution_id: int,
    db: Session = Depends(get_db)

):

    return get_media(db, execution_id)


@router.delete("/execution/media/{media_id}")
def remove_execution_media(

    media_id: int,
    db: Session = Depends(get_db)

):

    return delete_media(db, media_id)
