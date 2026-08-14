# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.machines_pumps_schema import (
    MachineCreate,
    MachineUpdate,
    MachineResponse
)

from backend.schemas.notification_schema import BusinessMasterActionSchema

from backend.services.machine_service import (
    list_machines_request,
    create_machine_request,
    update_machine_request,
    delete_machine_request
)


api = APIRouter(tags=["Machines"])


@api.get("/machines", response_model=list[MachineResponse])
def list_machines(db: Session = Depends(get_db)):
    return list_machines_request(db)


@api.post("/machines", response_model=MachineResponse)
def create_machine(payload: MachineCreate, db: Session = Depends(get_db)):
    return create_machine_request(db, payload)


@api.put("/machines/{machine_id}", response_model=MachineResponse)
def update_machine(machine_id: int, payload: MachineUpdate, db: Session = Depends(get_db)):
    result = update_machine_request(db, machine_id, payload)
    if not result:
        raise HTTPException(status_code=404, detail="Machine not found.")
    return result


@api.delete("/machines/{machine_id}")
def delete_machine(machine_id: int, payload: BusinessMasterActionSchema, db: Session = Depends(get_db)):
    result = delete_machine_request(db, machine_id, payload.actor, payload.remark)
    if not result:
        raise HTTPException(status_code=404, detail="Machine not found.")
    return {"success": True}
