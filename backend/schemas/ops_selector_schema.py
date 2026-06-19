# ====================================
# IMPORTS
# ====================================

from pydantic import BaseModel


# ====================================
# OPS SELECTOR INPUT SCHEMA
# ====================================

class OpsSelectorSchema(BaseModel):

    sales_survey_id: int

    doability: str

    service_configuration: str

    recommended_machine: str

    pump_hose_package: str

    accessories: str

    recommended_package: str

    mobilisation_days: int

    setup_days: int

    execution_days: int

    demob_days: int

    manpower_required: int

    approval_gate: str

    internal_next_action: str