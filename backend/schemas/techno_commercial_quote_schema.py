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

    cleaning_quote: float | None = None

    dewatering_addon: float | None = None

    combined_budgetary_value: float | None = None




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

    mobilisation_cost: float

    setup_cost: float

    execution_cost: float

    pump_addon_cost: float

    documentation_buffer: float

    access_support_buffer: float

    overhead_cost: float

    contingency_cost: float

    margin_percentage: float

    margin_value: float

    cleaning_quote: float

    dewatering_method: str

    dewatering_addon: float

    combined_budgetary_value: float



    class Config:

        from_attributes = True