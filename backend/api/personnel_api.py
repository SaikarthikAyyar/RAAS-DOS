# ====================================
# IMPORTS
# ====================================

from typing import Optional
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.personnel_schema import (
    PersonnelCreate,
    PersonnelUpdate,
    PersonnelResponse,
    PersonnelDocumentResponse,
    PersonnelDocumentUpdate
)

from backend.schemas.notification_schema import ActorSchema, BusinessMasterActionSchema

from backend.services.personnel_service import (
    list_personnel_request,
    create_personnel_request,
    update_personnel_request,
    delete_personnel_request,
    upload_document_request,
    update_document_request,
    delete_document_request
)


api = APIRouter(tags=["Personnel"])


# ====================================
# PERSONNEL
# ====================================

@api.get("/personnel", response_model=list[PersonnelResponse])
def list_personnel(db: Session = Depends(get_db)):
    return list_personnel_request(db)


@api.post("/personnel", response_model=PersonnelResponse)
def create_personnel(payload: PersonnelCreate, db: Session = Depends(get_db)):
    return create_personnel_request(db, payload)


@api.put("/personnel/{personnel_id}", response_model=PersonnelResponse)
def update_personnel(personnel_id: int, payload: PersonnelUpdate, db: Session = Depends(get_db)):
    result = update_personnel_request(db, personnel_id, payload)
    if not result:
        raise HTTPException(status_code=404, detail="Person not found.")
    return result


@api.delete("/personnel/{personnel_id}")
def delete_personnel(personnel_id: int, payload: BusinessMasterActionSchema, db: Session = Depends(get_db)):
    result = delete_personnel_request(db, personnel_id, payload.actor, payload.remark)
    if not result:
        raise HTTPException(status_code=404, detail="Person not found.")
    return {"success": True}


# ====================================
# PERSONNEL DOCUMENTS
# Real multipart file upload - same convention as PO uploads.
# ====================================

@api.post("/personnel/{personnel_id}/documents", response_model=PersonnelDocumentResponse)
async def upload_personnel_document(

    personnel_id: int,
    file: UploadFile = File(...),
    document_type: str = Form(...),
    valid_till: Optional[date] = Form(None),
    actor_user_id: int = Form(...),
    actor_name: str = Form(...),
    actor_role: str = Form(...),
    remark: str = Form(...),
    db: Session = Depends(get_db)

):

    try:

        actor = ActorSchema(user_id=actor_user_id, name=actor_name, role=actor_role)

        return await upload_document_request(db, personnel_id, file, document_type, valid_till, actor, remark)

    except ValueError as error:

        raise HTTPException(status_code=404, detail=str(error))


@api.put("/personnel-documents/{document_id}", response_model=PersonnelDocumentResponse)
def update_personnel_document(document_id: int, payload: PersonnelDocumentUpdate, db: Session = Depends(get_db)):
    result = update_document_request(db, document_id, payload)
    if not result:
        raise HTTPException(status_code=404, detail="Document not found.")
    return result


@api.delete("/personnel-documents/{document_id}")
def delete_personnel_document(document_id: int, payload: BusinessMasterActionSchema, db: Session = Depends(get_db)):
    result = delete_document_request(db, document_id, payload.actor, payload.remark)
    if not result:
        raise HTTPException(status_code=404, detail="Document not found.")
    return {"success": True}
