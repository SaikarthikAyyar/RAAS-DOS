# ====================================
# IMPORTS
# ====================================

from datetime import date, timedelta

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.services.invoice_dashboard_service import (
    get_kpi_summary,
    get_machine_list,
    get_revenue_forecast,
    get_deployment_timeline
)


router = APIRouter(prefix="/invoice-dashboard", tags=["Invoice Dashboard"])


@router.get("/kpi")
def kpi_summary(db: Session = Depends(get_db)):
    return get_kpi_summary(db)


@router.get("/machines")
def machine_list(db: Session = Depends(get_db)):
    return get_machine_list(db)


# start/end are real, user-chosen dates (a genuine date-range control
# on the frontend, not a fixed preset the backend resolves) - defaults
# only cover the case of a first page load before the user has picked
# anything.

@router.get("/revenue/{machine_inventory_id}")
def revenue_forecast(
    machine_inventory_id: int,
    start: date = None,
    end: date = None,
    db: Session = Depends(get_db)
):

    range_start = start or date.today()
    range_end = end or (range_start + timedelta(days=90))

    try:
        return get_revenue_forecast(db, machine_inventory_id, range_start, range_end)
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error))


@router.get("/deployment/{machine_inventory_id}")
def deployment_timeline(
    machine_inventory_id: int,
    start: date = None,
    end: date = None,
    db: Session = Depends(get_db)
):

    range_start = start or date.today()
    range_end = end or (range_start + timedelta(days=90))

    try:
        return get_deployment_timeline(db, machine_inventory_id, range_start, range_end)
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error))
