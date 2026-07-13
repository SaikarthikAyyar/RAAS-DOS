# ====================================
# IMPORTS
# ====================================

from typing import Optional

from pydantic import BaseModel


# ====================================
# OPS SELECTOR INPUT SCHEMA
# ====================================

class OpsSelectorSchema(BaseModel):

    



    sales_survey_id: int

    ops_engine_version: Optional[str] = None

    doability: Optional[str] = None

    service_configuration: Optional[str] = None

    recommended_machine: Optional[str] = None

    pump_hose_package: Optional[str] = None

    accessories: Optional[str] = None

    recommended_package: Optional[str] = None

    mobilisation_days: Optional[int] = None

    setup_days: Optional[int] = None

    execution_days: Optional[int] = None

    demob_days: Optional[int] = None

    total_job_days: Optional[int] = None

    manpower_required: Optional[int] = None

    approval_gate: Optional[str] = None

    internal_next_action: Optional[str] = None

    selection_reason: Optional[str] = None