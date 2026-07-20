# ====================================
# IMPORTS
# ====================================

from datetime import date

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

    class Config:

        from_attributes = True