# ====================================
# EXECUTION SLUDGE PROGRESS API
# Real daily sludge-output tracking for Job Execution (Phase 2).
# Gated client-side only (hasTask("enquiry-tab-execution",
# "record_sludge_output")), matching every other action on this tab -
# no server-side auth, consistent with this app's current trust model.
# ====================================

from datetime import date

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.execution_sludge_schema import (
    DailyLogCreateSchema,
    DailyLogUpdateSchema,
    ReadingCreateSchema,
    ReadingUpdateSchema
)

from backend.services.execution_sludge_service import (
    start_daily_log,
    list_daily_logs,
    get_daily_log,
    update_daily_log,
    add_reading,
    update_reading,
    delete_reading,
    export_execution_sludge_log
)


router = APIRouter()


@router.post("/execution/{execution_id}/sludge-logs")
def create_daily_log(execution_id: int, payload: DailyLogCreateSchema, db: Session = Depends(get_db)):

    return start_daily_log(
        db,
        execution_id,
        payload.log_date,
        payload.method,
        payload.start_tf
    )


@router.get("/execution/{execution_id}/sludge-logs")
def list_execution_daily_logs(execution_id: int, db: Session = Depends(get_db)):

    return list_daily_logs(db, execution_id)


@router.get("/execution/{execution_id}/sludge-logs/export")
def export_execution_daily_logs(execution_id: int, db: Session = Depends(get_db)):

    buffer = export_execution_sludge_log(db, execution_id)

    filename = f"Execution_{execution_id}_Sludge_Output_{date.today().isoformat()}.xlsx"

    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.get("/execution/sludge-logs/{daily_log_id}")
def get_execution_daily_log(daily_log_id: int, db: Session = Depends(get_db)):

    return get_daily_log(db, daily_log_id)


@router.put("/execution/sludge-logs/{daily_log_id}")
def update_execution_daily_log(daily_log_id: int, payload: DailyLogUpdateSchema, db: Session = Depends(get_db)):

    return update_daily_log(
        db,
        daily_log_id,
        payload.end_tf,
        payload.total_sludge_pump_minutes
    )


@router.post("/execution/sludge-logs/{daily_log_id}/readings")
def create_reading(daily_log_id: int, payload: ReadingCreateSchema, db: Session = Depends(get_db)):

    return add_reading(
        db,
        daily_log_id,
        payload.tf_reading,
        payload.fr_reading,
        payload.settled_sludge_volume_ml,
        payload.flask_volume_ml,
        payload.source,
        payload.recorded_by
    )


@router.put("/execution/sludge-readings/{reading_id}")
def update_sludge_reading(reading_id: int, payload: ReadingUpdateSchema, db: Session = Depends(get_db)):

    return update_reading(
        db,
        reading_id,
        payload.tf_reading,
        payload.fr_reading,
        payload.settled_sludge_volume_ml,
        payload.flask_volume_ml,
        payload.recorded_by
    )


@router.delete("/execution/sludge-readings/{reading_id}")
def delete_sludge_reading(reading_id: int, db: Session = Depends(get_db)):

    return delete_reading(db, reading_id)
