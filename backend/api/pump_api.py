# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.machines_pumps_schema import (
    PumpCreate,
    PumpUpdate,
    PumpResponse
)

from backend.schemas.notification_schema import BusinessMasterActionSchema

from backend.services.pump_service import (
    list_pumps_request,
    create_pump_request,
    update_pump_request,
    delete_pump_request
)


api = APIRouter(tags=["Pumps"])


@api.get("/pumps", response_model=list[PumpResponse])
def list_pumps(db: Session = Depends(get_db)):
    return list_pumps_request(db)


@api.post("/pumps", response_model=PumpResponse)
def create_pump(payload: PumpCreate, db: Session = Depends(get_db)):
    return create_pump_request(db, payload)


@api.put("/pumps/{pump_id}", response_model=PumpResponse)
def update_pump(pump_id: int, payload: PumpUpdate, db: Session = Depends(get_db)):
    result = update_pump_request(db, pump_id, payload)
    if not result:
        raise HTTPException(status_code=404, detail="Pump not found.")
    return result


@api.delete("/pumps/{pump_id}")
def delete_pump(pump_id: int, payload: BusinessMasterActionSchema, db: Session = Depends(get_db)):
    result = delete_pump_request(db, pump_id, payload.actor, payload.remark)
    if not result:
        raise HTTPException(status_code=404, detail="Pump not found.")
    return {"success": True}
