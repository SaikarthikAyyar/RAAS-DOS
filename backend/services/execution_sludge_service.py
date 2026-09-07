# ====================================
# EXECUTION SLUDGE PROGRESS SERVICE
# Real daily sludge-output tracking for Job Execution (Phase 2) - see
# backend/utils/sludge_progress.py for the verified formulas and the
# persistent memory note "project-execution-sludge-progress-methods"
# for the full derivation. A day's calculated sludge output IS that
# day's contribution to Execution.total_output - total_output for a
# SLUDGE_LOG execution is the live-recomputed sum of every daily log's
# sludge_output_m3, not a one-time incremental add, so correcting any
# reading at any time always keeps the total honest with no separate
# "finalize"/"reopen" step ever needed.
# ====================================

from datetime import datetime, date

from fastapi import HTTPException

from sqlalchemy.exc import IntegrityError

from backend.models.execution import Execution
from backend.models.execution_sludge_daily_log import ExecutionSludgeDailyLog
from backend.models.execution_sludge_reading import ExecutionSludgeReading
from backend.models.sales_survey import SalesSurvey

from backend.utils.sludge_volume import resolve_sludge_volume
from backend.utils.sludge_progress import compute_daily_log

from backend.services.execution_service import (
    compute_phase2_progress,
    sync_invoice_from_execution
)


VALID_METHODS = ("FLOW_METER", "SETTLING")


# ====================================
# START A NEW DAY
# ====================================

def start_daily_log(db, execution_id, log_date, method, start_tf=None):

    execution = db.query(Execution).filter(Execution.id == execution_id).first()

    if execution is None:
        raise HTTPException(status_code=404, detail="Execution not found.")

    if method not in VALID_METHODS:
        raise HTTPException(
            status_code=422,
            detail="Method must be either FLOW_METER or SETTLING."
        )

    # An execution already carrying real manual output (typed under
    # the plain MANUAL mode) can never switch into calculated tracking
    # part-way through - the two would double-count into the same
    # total_output with no way to tell which portion came from which
    # mechanism. Mode flips to SLUDGE_LOG automatically below on this
    # execution's very first real daily log, and stays that way for
    # good.
    existing_logs = (
        db.query(ExecutionSludgeDailyLog)
        .filter(ExecutionSludgeDailyLog.execution_id == execution_id)
        .count()
    )

    if (
        existing_logs == 0
        and execution.progress_tracking_mode == "MANUAL"
        and (execution.total_output or 0) > 0
    ):
        raise HTTPException(
            status_code=422,
            detail=(
                "This execution already has manually-entered output recorded. "
                "Real sludge-reading tracking can only be used on an execution "
                "with no prior manual output, to avoid double-counting."
            )
        )

    if start_tf is None:

        previous_log = (
            db.query(ExecutionSludgeDailyLog)
            .filter(ExecutionSludgeDailyLog.execution_id == execution_id)
            .order_by(ExecutionSludgeDailyLog.log_date.desc())
            .first()
        )

        if previous_log is None or previous_log.end_tf is None:
            raise HTTPException(
                status_code=422,
                detail=(
                    "Start TF is required for the first day (or when the "
                    "previous day's End TF hasn't been entered yet)."
                )
            )

        start_tf = previous_log.end_tf

    daily_log = ExecutionSludgeDailyLog(
        execution_id=execution_id,
        log_date=log_date,
        method=method,
        start_tf=start_tf
    )

    db.add(daily_log)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=422,
            detail="A daily log already exists for this execution on that date."
        )

    db.refresh(daily_log)

    if execution.progress_tracking_mode != "SLUDGE_LOG":
        execution.progress_tracking_mode = "SLUDGE_LOG"
        db.commit()

    _recompute_day(db, daily_log)

    return _serialize_daily_log(daily_log)


# ====================================
# LIST / GET DAILY LOGS
# ====================================

def list_daily_logs(db, execution_id):

    logs = (
        db.query(ExecutionSludgeDailyLog)
        .filter(ExecutionSludgeDailyLog.execution_id == execution_id)
        .order_by(ExecutionSludgeDailyLog.log_date.desc())
        .all()
    )

    return [_serialize_daily_log(log) for log in logs]


def get_daily_log(db, daily_log_id):

    daily_log = _require_daily_log(db, daily_log_id)

    readings = (
        db.query(ExecutionSludgeReading)
        .filter(ExecutionSludgeReading.daily_log_id == daily_log.id)
        .order_by(ExecutionSludgeReading.recorded_at)
        .all()
    )

    return _serialize_daily_log(daily_log, readings=[_serialize_reading(r) for r in readings])


# ====================================
# UPDATE DAY-LEVEL FIELDS (End TF / pump minutes / flask volume)
# ====================================

def update_daily_log(db, daily_log_id, end_tf=None, total_sludge_pump_minutes=None, flask_volume_ml=None):

    daily_log = _require_daily_log(db, daily_log_id)

    if end_tf is not None:
        daily_log.end_tf = end_tf

    if total_sludge_pump_minutes is not None:
        daily_log.total_sludge_pump_minutes = total_sludge_pump_minutes

    if flask_volume_ml is not None:
        daily_log.flask_volume_ml = flask_volume_ml

    db.commit()

    _recompute_day(db, daily_log)

    return get_daily_log(db, daily_log_id)


# ====================================
# READINGS - always editable regardless of source (MANUAL or DEVICE)
# ====================================

def add_reading(db, daily_log_id, tf_reading, fr_reading=None, settled_sludge_volume_ml=None, source="MANUAL", recorded_by=None):

    daily_log = _require_daily_log(db, daily_log_id)

    _validate_reading_fields(daily_log.method, fr_reading, settled_sludge_volume_ml)

    reading = ExecutionSludgeReading(
        daily_log_id=daily_log_id,
        tf_reading=tf_reading,
        fr_reading=fr_reading,
        settled_sludge_volume_ml=settled_sludge_volume_ml,
        source=source or "MANUAL",
        recorded_by=recorded_by
    )

    db.add(reading)
    db.commit()
    db.refresh(reading)

    _recompute_day(db, daily_log)

    return _serialize_reading(reading)


def update_reading(db, reading_id, tf_reading=None, fr_reading=None, settled_sludge_volume_ml=None, recorded_by=None):

    reading = db.query(ExecutionSludgeReading).filter(ExecutionSludgeReading.id == reading_id).first()

    if reading is None:
        raise HTTPException(status_code=404, detail="Reading not found.")

    # Deliberately no check on reading.source anywhere in this function
    # - a DEVICE-sourced reading is exactly as editable as a MANUAL one,
    # forever, per direct instruction. Correcting a bad value must never
    # require anything special just because a machine (rather than a
    # person) originally wrote it.
    if tf_reading is not None:
        reading.tf_reading = tf_reading

    if fr_reading is not None:
        reading.fr_reading = fr_reading

    if settled_sludge_volume_ml is not None:
        reading.settled_sludge_volume_ml = settled_sludge_volume_ml

    if recorded_by is not None:
        reading.recorded_by = recorded_by

    reading.updated_at = datetime.utcnow()

    db.commit()

    daily_log = _require_daily_log(db, reading.daily_log_id)

    _recompute_day(db, daily_log)

    return _serialize_reading(reading)


def delete_reading(db, reading_id):

    reading = db.query(ExecutionSludgeReading).filter(ExecutionSludgeReading.id == reading_id).first()

    if reading is None:
        raise HTTPException(status_code=404, detail="Reading not found.")

    daily_log_id = reading.daily_log_id

    db.delete(reading)
    db.commit()

    daily_log = _require_daily_log(db, daily_log_id)

    _recompute_day(db, daily_log)

    return {"message": "deleted"}


# ====================================
# INTERNAL HELPERS
# ====================================

def _require_daily_log(db, daily_log_id):

    daily_log = (
        db.query(ExecutionSludgeDailyLog)
        .filter(ExecutionSludgeDailyLog.id == daily_log_id)
        .first()
    )

    if daily_log is None:
        raise HTTPException(status_code=404, detail="Daily sludge log not found.")

    return daily_log


def _validate_reading_fields(method, fr_reading, settled_sludge_volume_ml):

    if method == "FLOW_METER" and fr_reading is None:
        raise HTTPException(
            status_code=422,
            detail="FR reading is required for a Flow Meter method day."
        )

    if method == "SETTLING" and settled_sludge_volume_ml is None:
        raise HTTPException(
            status_code=422,
            detail="Settled sludge volume is required for a Sample Collection method day."
        )


def _recompute_day(db, daily_log):

    readings = (
        db.query(ExecutionSludgeReading)
        .filter(ExecutionSludgeReading.daily_log_id == daily_log.id)
        .order_by(ExecutionSludgeReading.recorded_at)
        .all()
    )

    reading_dicts = [
        {
            "tf_reading": r.tf_reading,
            "fr_reading": r.fr_reading,
            "settled_sludge_volume_ml": r.settled_sludge_volume_ml
        }
        for r in readings
    ]

    result = compute_daily_log(
        daily_log.method,
        daily_log.start_tf,
        daily_log.end_tf,
        reading_dicts,
        daily_log.total_sludge_pump_minutes,
        daily_log.flask_volume_ml
    )

    for key, value in result.items():
        setattr(daily_log, key, value)

    daily_log.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(daily_log)

    execution = db.query(Execution).filter(Execution.id == daily_log.execution_id).first()

    if execution is not None:
        _recompute_execution_totals(db, execution)


def _recompute_execution_totals(db, execution):

    logs = (
        db.query(ExecutionSludgeDailyLog)
        .filter(ExecutionSludgeDailyLog.execution_id == execution.id)
        .all()
    )

    total_output = sum((log.sludge_output_m3 or 0) for log in logs)

    today = date.today()
    today_log = next((log for log in logs if log.log_date == today), None)

    execution.total_output = total_output
    execution.today_output = (today_log.sludge_output_m3 or 0) if today_log else 0

    if execution.current_phase == "PHASE_2":

        survey = db.query(SalesSurvey).filter(SalesSurvey.id == execution.sales_survey_id).first()

        estimated_volume = resolve_sludge_volume(survey)

        progress = compute_phase2_progress(
            execution.total_output,
            estimated_volume,
            execution.execution_progress
        )

        execution.execution_progress = round(min(progress, 100))

    execution.last_updated = datetime.utcnow()

    db.commit()
    db.refresh(execution)

    sync_invoice_from_execution(db, execution)


def _serialize_daily_log(daily_log, readings=None):

    result = {
        "id": daily_log.id,
        "execution_id": daily_log.execution_id,
        "log_date": daily_log.log_date,
        "method": daily_log.method,
        "start_tf": daily_log.start_tf,
        "end_tf": daily_log.end_tf,
        "total_sludge_pump_minutes": daily_log.total_sludge_pump_minutes,
        "flask_volume_ml": daily_log.flask_volume_ml,
        "avg_fr": daily_log.avg_fr,
        "fr_per_minute": daily_log.fr_per_minute,
        "total_sludge_pumping_estimate_m3": daily_log.total_sludge_pumping_estimate_m3,
        "total_tf_m3": daily_log.total_tf_m3,
        "pct_sludge": daily_log.pct_sludge,
        "pct_water": daily_log.pct_water,
        "sludge_output_m3": daily_log.sludge_output_m3,
        "water_output_m3": daily_log.water_output_m3,
        "status": "COMPLETE" if daily_log.sludge_output_m3 is not None else "PENDING"
    }

    if readings is not None:
        result["readings"] = readings

    return result


def _serialize_reading(reading):

    return {
        "id": reading.id,
        "daily_log_id": reading.daily_log_id,
        "recorded_at": reading.recorded_at,
        "tf_reading": reading.tf_reading,
        "fr_reading": reading.fr_reading,
        "settled_sludge_volume_ml": reading.settled_sludge_volume_ml,
        "source": reading.source,
        "recorded_by": reading.recorded_by
    }
