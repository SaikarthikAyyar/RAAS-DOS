# ====================================
# IMPORTS
# ====================================

from datetime import date

from pydantic import BaseModel


# ====================================
# INVOICE SCHEMA
# ====================================

class InvoiceSchema(

    BaseModel

):

    job_creation_id: int

    generated_job_id: str

    customer_request_id: int

    invoice_status: str

    execution_phase: str

    execution_progress: float

    customer_visible_status: str

    planned_start: date | None = None

    estimated_completion: date | None = None

    actual_completion: date | None = None

    delay_days: int

    machine_status: str

    machine_name: str | None = None

    machine_code: str | None = None

    machine_location: str | None = None

    personnel_status: str

    personnel_json: list = []

    transport_status: str

    gps_location: str | None = None

    destination: str | None = None

    distance_remaining_km: float

    eta_minutes: int

    current_activity: str

    live_execution_log: list = []

    class Config:

        from_attributes = True