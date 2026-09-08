# ====================================
# EXECUTION SLUDGE PROGRESS SCHEMAS
# ====================================

from datetime import date, datetime

from pydantic import BaseModel


# ====================================
# START A NEW DAY
# start_tf is optional - resolved server-side from the previous day's
# end_tf when not given (TF never resets), only required explicitly on
# an execution's very first day.
# ====================================

class DailyLogCreateSchema(BaseModel):

    log_date: date

    method: str  # FLOW_METER | SETTLING

    start_tf: float | None = None


# ====================================
# UPDATE DAY-LEVEL FIELDS
# sludge_output_m3 and every other cached/computed field are
# deliberately NOT accepted here - they're always derived server-side
# from these raw inputs plus the day's readings, never typed by hand.
# ====================================

class DailyLogUpdateSchema(BaseModel):

    end_tf: float | None = None

    total_sludge_pump_minutes: float | None = None


# ====================================
# READINGS
# tf_reading is always required (both methods). fr_reading/
# settled_sludge_volume_ml are validated server-side against the
# day's own method. flask_volume_ml is required alongside
# settled_sludge_volume_ml for a Settling reading - captured per
# reading (not once for the whole day) since different flask sizes may
# genuinely be used sample to sample. source defaults to MANUAL - ready
# for a future machine-signal ingestion path to set DEVICE instead,
# through this exact same schema/endpoint.
# ====================================

class ReadingCreateSchema(BaseModel):

    tf_reading: float

    fr_reading: float | None = None

    settled_sludge_volume_ml: float | None = None

    flask_volume_ml: float | None = None

    source: str | None = "MANUAL"

    recorded_by: str | None = None


class ReadingUpdateSchema(BaseModel):

    tf_reading: float | None = None

    fr_reading: float | None = None

    settled_sludge_volume_ml: float | None = None

    flask_volume_ml: float | None = None

    recorded_by: str | None = None
