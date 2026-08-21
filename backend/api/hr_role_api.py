# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.hr_role_schema import HrRoleCreate, HrRoleUpdate, HrRoleResponse
from backend.schemas.notification_schema import BusinessMasterActionSchema

from backend.services.hr_role_service import (
    list_hr_roles_request,
    create_hr_role_request,
    update_hr_role_request,
    delete_hr_role_request
)


api = APIRouter(tags=["Human Resources"])


@api.get("/hr-roles", response_model=list[HrRoleResponse])
def list_hr_roles(db: Session = Depends(get_db)):
    return list_hr_roles_request(db)


@api.post("/hr-roles", response_model=HrRoleResponse)
def create_hr_role(payload: HrRoleCreate, db: Session = Depends(get_db)):
    return create_hr_role_request(db, payload)


@api.put("/hr-roles/{hr_role_id}", response_model=HrRoleResponse)
def update_hr_role(hr_role_id: int, payload: HrRoleUpdate, db: Session = Depends(get_db)):
    result = update_hr_role_request(db, hr_role_id, payload)
    if not result:
        raise HTTPException(status_code=404, detail="HR role not found.")
    return result


@api.delete("/hr-roles/{hr_role_id}")
def delete_hr_role(hr_role_id: int, payload: BusinessMasterActionSchema, db: Session = Depends(get_db)):
    result = delete_hr_role_request(db, hr_role_id, payload.actor, payload.remark)
    if not result:
        raise HTTPException(status_code=404, detail="HR role not found.")
    return {"success": True}
