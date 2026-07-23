# ====================================
# IMPORTS
# ====================================

from datetime import date, datetime

from pydantic import BaseModel


# ====================================
# CREATE EXECUTION
# ====================================

class ExecutionSchema(BaseModel):

    job_creation_id: int

    customer_request_id: int

    sales_survey_id: int

    workflow_status: str = "READY"

    current_phase: str = "PHASE_1"

    execution_progress: int = 0

    phase_1_status: str = "PENDING"

    phase_2_status: str = "PENDING"

    phase_3_status: str = "PENDING"

    site_location: str | None = None

    planned_start: date | None = None

    estimated_completion: date | None = None

    actual_completion: date | None = None

    delay_days: int = 0

    remarks: str | None = None

    current_activity: str | None = None

    transport_status: str = "WAITING"


    invoice_synced: str = "YES"

    # ====================================
    # LIVE GPS
    # ====================================

    latitude: float | None = None

    longitude: float | None = None

    speed_kmph: float = 0

    heading: float = 0

    altitude: float = 0

    accuracy_meters: float = 0

    gps_timestamp: datetime | None = None

    last_update_source: str = "OPS"

    # ====================================
    # LIVE EXECUTION
    # ====================================

    eta_minutes: int = 0

    distance_remaining_km: float = 0

    today_output: float = 0

    total_output: float = 0

    daily_target: float = 0

    output_unit: str = "m³"

    proof_uploaded: bool = False

    class Config:

        from_attributes = True