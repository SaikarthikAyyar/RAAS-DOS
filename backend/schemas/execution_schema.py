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
    # ROUTE (Phase 1/3)
    # ====================================

    source_latitude: float | None = None

    source_longitude: float | None = None

    destination_latitude: float | None = None

    destination_longitude: float | None = None

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

    distance_to_cover_km: float = 0

    distance_travelled_km: float = 0

    today_output: float = 0

    total_output: float = 0

    daily_target: float = 0

    output_unit: str = "m³"

    proof_uploaded: bool = False

    class Config:

        from_attributes = True


# ====================================
# EXECUTION ROUTE UPDATE (Phase 1/3 - source/destination coordinates)
# distance_to_cover_km is recomputed server-side from these, never
# accepted directly.
# ====================================

class ExecutionRouteUpdateSchema(BaseModel):

    source_latitude: float | None = None

    source_longitude: float | None = None

    destination_latitude: float | None = None

    destination_longitude: float | None = None


# ====================================
# EXECUTION PROGRESS UPDATE
# ====================================

class ExecutionProgressUpdateSchema(BaseModel):

    latitude: float | None = None

    longitude: float | None = None

    speed_kmph: float | None = None

    heading: float | None = None

    altitude: float | None = None

    accuracy_meters: float | None = None

    gps_timestamp: datetime | None = None

    # eta_minutes and distance_travelled_km are deliberately NOT
    # accepted here - both are derived server-side from wherever
    # latitude/longitude (and speed, for ETA) land, exactly like
    # distance_to_cover_km already is from source/destination (see
    # set_execution_route below). Accepting them as separate typed
    # fields is what let a non-technical field user's position and
    # "how far I've come" drift apart into two disconnected numbers.

    # total_output is deliberately NOT accepted here either - it's
    # derived server-side by summing every today_output entry as it
    # arrives, never typed/overwritten by hand (same reasoning as
    # distance_to_cover_km above).

    today_output: float | None = None

    # daily_target: a fixed planning figure, settable once (while
    # still 0) and frozen after - see update_execution_progress.

    daily_target: float | None = None

    output_unit: str | None = None

    proof_uploaded: bool | None = None

    current_activity: str | None = None

    # transport_status is deliberately NOT accepted here either - it's
    # derived from the same distance figure above (WAITING/IN_TRANSIT/
    # REACHED), same reasoning as eta_minutes/distance_travelled_km.

    remarks: str | None = None