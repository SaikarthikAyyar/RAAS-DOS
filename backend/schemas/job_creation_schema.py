# ====================================
# IMPORTS
# ====================================

from typing import Optional

from pydantic import BaseModel


# ====================================
# JOB CREATION SCHEMA
# ====================================

class JobCreationSchema(BaseModel):

    approval_board_id: int

    customer_request_id: Optional[int] = None

    sales_survey_id: Optional[int] = None

    ops_selection_id: Optional[int] = None

    generated_job_id: Optional[str] = None

    planned_start: Optional[str] = None

    planned_completion: Optional[str] = None

    customer_visible_status: Optional[str] = None

    approved_service_configuration: Optional[str] = None

    approved_machine: Optional[str] = None

    approved_pump_package: Optional[str] = None

    approved_accessories: Optional[str] = None

    manpower_json: Optional[dict] = None

    readiness_json: Optional[dict] = None

    workflow_status: Optional[str] = None