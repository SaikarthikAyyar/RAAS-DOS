# ====================================
# IMPORTS
# ====================================

from pydantic import BaseModel


# ====================================
# CREATE
# ====================================

class QuoteCreateSchema(BaseModel):

    ops_selection_id: int

    dewatering_assessment_id: int | None = None

    cleaning_quote_min: float | None = None

    cleaning_quote_max: float | None = None

    dewatering_addon_min: float | None = None

    dewatering_addon_max: float | None = None

    combined_budgetary_value_min: float | None = None

    combined_budgetary_value_max: float | None = None




# ====================================
# RESPONSE
# ====================================

class QuoteResponseSchema(

    BaseModel

):

    id: int

    customer_request_id:int

    ops_selection_id: int



    recommended_machine: str

    service_configuration: str

    pump_hose_package: str

    approval_gate: str

    mobilisation_cost_min: float
    mobilisation_cost_max: float

    setup_cost_min: float
    setup_cost_max: float

    execution_cost_min: float
    execution_cost_max: float

    pump_addon_cost_min: float
    pump_addon_cost_max: float

    documentation_buffer: float

    access_support_buffer: float

    direct_cost_min: float
    direct_cost_max: float

    overhead_cost_min: float
    overhead_cost_max: float

    contingency_cost_min: float
    contingency_cost_max: float

    margin_percentage: float

    margin_value_min: float
    margin_value_max: float

    cleaning_quote_min: float
    cleaning_quote_max: float

    dewatering_method: str

    dewatering_addon_min: float
    dewatering_addon_max: float

    combined_budgetary_value_min: float
    combined_budgetary_value_max: float

    techno_status: str | None = None

    techno_approved_by: str | None = None

    techno_approved_date: str | None = None

    techno_note: str | None = None



    class Config:

        from_attributes = True


# ====================================
# TECHNO-COMMERCIAL APPROVAL DECISION
# ====================================

class TechnoApprovalDecisionSchema(BaseModel):

    status: str

    approved_by: str

    note: str | None = None
