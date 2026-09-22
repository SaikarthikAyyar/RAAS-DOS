# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.fleet_unit_schema import (
    FleetUnitResponse,
    FleetUnitCreate,
    FleetUnitUpdate,
    FleetUnitKitOptionsResponse
)

from backend.schemas.notification_schema import BusinessMasterActionSchema

from backend.services.fleet_unit_service import (
    list_fleet_units_request,
    get_fleet_unit_request,
    create_fleet_unit_request,
    update_fleet_unit_request,
    delete_fleet_unit_request,
    list_all_machines_request,
    get_kit_options_request,
    get_kit_options_for_machines_request
)


api = APIRouter(tags=["Fleet Units"])


@api.get("/fleet-units", response_model=list[FleetUnitResponse])
def list_fleet_units(db: Session = Depends(get_db)):
    return list_fleet_units_request(db)


@api.get("/fleet-units/support/machines")
def list_available_machines(db: Session = Depends(get_db)):
    return list_all_machines_request(db)


@api.get("/fleet-units/support/kit-options", response_model=FleetUnitKitOptionsResponse)
def get_kit_options_for_machines(
    machine_inventory_ids: list[int] = Query(...),
    job_id: int | None = None,
    db: Session = Depends(get_db)
):
    return get_kit_options_for_machines_request(db, machine_inventory_ids, job_id)


@api.get("/fleet-units/{fleet_unit_id}/kit-options", response_model=FleetUnitKitOptionsResponse)
def get_kit_options(fleet_unit_id: int, job_id: int | None = None, db: Session = Depends(get_db)):
    result = get_kit_options_request(db, fleet_unit_id, job_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Fleet unit not found.")
    return result


@api.get("/fleet-units/{fleet_unit_id}", response_model=FleetUnitResponse)
def get_fleet_unit(fleet_unit_id: int, db: Session = Depends(get_db)):
    result = get_fleet_unit_request(db, fleet_unit_id)
    if not result:
        raise HTTPException(status_code=404, detail="Fleet unit not found.")
    return result


@api.post("/fleet-units", response_model=FleetUnitResponse)
def create_fleet_unit(payload: FleetUnitCreate, db: Session = Depends(get_db)):
    try:
        return create_fleet_unit_request(db, payload)
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error))


@api.put("/fleet-units/{fleet_unit_id}", response_model=FleetUnitResponse)
def update_fleet_unit(fleet_unit_id: int, payload: FleetUnitUpdate, db: Session = Depends(get_db)):
    try:
        result = update_fleet_unit_request(db, fleet_unit_id, payload)
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error))
    if not result:
        raise HTTPException(status_code=404, detail="Fleet unit not found.")
    return result


@api.delete("/fleet-units/{fleet_unit_id}")
def delete_fleet_unit(fleet_unit_id: int, payload: BusinessMasterActionSchema, db: Session = Depends(get_db)):
    result = delete_fleet_unit_request(db, fleet_unit_id, payload.actor, payload.remark)
    if not result:
        raise HTTPException(status_code=404, detail="Fleet unit not found.")
    return {"success": True}
