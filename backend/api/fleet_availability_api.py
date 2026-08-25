# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.services.fleet_availability_service import (
    get_fleet_availability_overview_request,
    build_forecast_request
)

from backend.reporting.fleet_forecast_xlsx import build_forecast_workbook_bytes


api = APIRouter(tags=["Fleet Availability"])


@api.get("/fleet-availability/overview")
def get_overview(db: Session = Depends(get_db)):
    return get_fleet_availability_overview_request(db)


@api.get("/fleet-availability/forecast")
def get_forecast(weeks: int = Query(13, ge=1, le=26), db: Session = Depends(get_db)):
    return build_forecast_request(db, weeks)


@api.get("/fleet-availability/forecast/export")
def export_forecast(weeks: int = Query(13, ge=1, le=26), db: Session = Depends(get_db)):

    buffer = build_forecast_workbook_bytes(db, weeks)

    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=Fleet_3Month_Forecast.xlsx"}
    )
