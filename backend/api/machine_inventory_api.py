# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from backend.database.connection import get_db

from backend.schemas.machine_inventory_schema import (
    MachineInventoryCreate,
    MachineInventoryUpdate,
    MachineInventoryResponse
)

from backend.schemas.notification_schema import BusinessMasterActionSchema

from backend.services.machine_inventory_service import (
    list_machine_inventory_request,
    get_machine_inventory_request,
    create_machine_inventory_request,
    update_machine_inventory_request,
    delete_machine_inventory_request
)


api = APIRouter(tags=["Machine Inventory"])


@api.get("/machine-inventory", response_model=list[MachineInventoryResponse])
def list_machine_inventory(db: Session = Depends(get_db)):
    return list_machine_inventory_request(db)


@api.get("/machine-inventory/{machine_inventory_id}", response_model=MachineInventoryResponse)
def get_machine_inventory(machine_inventory_id: int, db: Session = Depends(get_db)):
    result = get_machine_inventory_request(db, machine_inventory_id)
    if not result:
        raise HTTPException(status_code=404, detail="Machine inventory unit not found.")
    return result


@api.post("/machine-inventory", response_model=MachineInventoryResponse)
def create_machine_inventory(payload: MachineInventoryCreate, db: Session = Depends(get_db)):

    try:
        return create_machine_inventory_request(db, payload)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=422, detail="Machine code or asset number already in use.")


@api.put("/machine-inventory/{machine_inventory_id}", response_model=MachineInventoryResponse)
def update_machine_inventory(machine_inventory_id: int, payload: MachineInventoryUpdate, db: Session = Depends(get_db)):

    try:
        result = update_machine_inventory_request(db, machine_inventory_id, payload)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=422, detail="Machine code or asset number already in use.")

    if not result:
        raise HTTPException(status_code=404, detail="Machine inventory unit not found.")

    return result


@api.delete("/machine-inventory/{machine_inventory_id}")
def delete_machine_inventory(machine_inventory_id: int, payload: BusinessMasterActionSchema, db: Session = Depends(get_db)):

    try:
        result = delete_machine_inventory_request(db, machine_inventory_id, payload.actor, payload.remark)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=422,
            detail="This unit is bundled into a Fleet Unit - remove or reassign that Fleet Unit first."
        )

    if not result:
        raise HTTPException(status_code=404, detail="Machine inventory unit not found.")

    return {"success": True}
