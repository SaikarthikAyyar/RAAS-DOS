# ====================================
# IMPORTS
# ====================================

from typing import Optional
from datetime import date

from pydantic import BaseModel, ConfigDict

from backend.schemas.notification_schema import ActorSchema


# ====================================
# PERSONNEL DOCUMENT
# ====================================

class PersonnelDocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    personnel_id: int
    document_name: str
    document_type: str
    file_path: str
    verification_status: Optional[str] = None
    valid_till: Optional[date] = None


class PersonnelDocumentUpdate(BaseModel):
    document_type: Optional[str] = None
    valid_till: Optional[date] = None
    actor: ActorSchema
    remark: str


# ====================================
# PERSONNEL
# employee_code/designation match the real, already-seeded Personnel
# table (Phase 20's Allocation module) - this is CRUD for an existing
# table, not a new one.
# ====================================

class PersonnelCreate(BaseModel):
    employee_code: str
    full_name: str
    phone_number: Optional[str] = None
    current_location: Optional[str] = None
    designation: str
    skill: Optional[str] = None
    actor: ActorSchema
    remark: str


class PersonnelUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    current_location: Optional[str] = None
    designation: Optional[str] = None
    skill: Optional[str] = None
    actor: ActorSchema
    remark: str


class PersonnelResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    employee_code: str
    full_name: str
    phone_number: Optional[str] = None
    current_location: Optional[str] = None
    designation: str
    skill: Optional[str] = None
    availability_status: Optional[str] = None
    documents_verified: Optional[bool] = None
    documents: list[PersonnelDocumentResponse] = []
