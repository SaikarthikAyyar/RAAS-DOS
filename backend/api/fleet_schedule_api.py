# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.fleet_schedule_schema import (
    BookFleetUnitSchema,
    RescheduleFleetSchedule,
    CancelFleetSchedule,
    FleetScheduleResponse
)

from backend.services.fleet_schedule_service import (
    book_fleet_unit_request,
    list_fleet_unit_queue_request,
    list_schedules_for_job_request,
    reschedule_fleet_schedule_request,
    cancel_fleet_schedule_request
)


api = APIRouter(tags=["Fleet Schedule"])


@api.post("/fleet-schedule", response_model=FleetScheduleResponse)
def book_fleet_unit(payload: BookFleetUnitSchema, db: Session = Depends(get_db)):
    try:
        return book_fleet_unit_request(db, payload)
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error))


@api.get("/fleet-schedule/fleet-unit/{fleet_unit_id}", response_model=list[FleetScheduleResponse])
def list_fleet_unit_queue(fleet_unit_id: int, db: Session = Depends(get_db)):
    return list_fleet_unit_queue_request(db, fleet_unit_id)


@api.get("/fleet-schedule/job/{job_id}", response_model=list[FleetScheduleResponse])
def list_schedules_for_job(job_id: int, db: Session = Depends(get_db)):
    return list_schedules_for_job_request(db, job_id)


@api.put("/fleet-schedule/{schedule_id}", response_model=FleetScheduleResponse)
def reschedule_fleet_schedule(schedule_id: int, payload: RescheduleFleetSchedule, db: Session = Depends(get_db)):
    try:
        return reschedule_fleet_schedule_request(db, schedule_id, payload)
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error))


@api.delete("/fleet-schedule/{schedule_id}")
def cancel_fleet_schedule(schedule_id: int, payload: CancelFleetSchedule, db: Session = Depends(get_db)):
    try:
        cancel_fleet_schedule_request(db, schedule_id)
        return {"success": True}
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error))
