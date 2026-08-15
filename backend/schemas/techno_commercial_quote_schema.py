# ====================================
# IMPORTS
# ====================================

from datetime import datetime

from pydantic import BaseModel


# ====================================
# CREATE
# ====================================

class QuoteCreateSchema(BaseModel):

    ops_selection_id: int

    created_by: str

    reason: str | None = None

    enquiry_id: int | None = None

    dewatering_assessment_id: int | None = None

    mobilisation_cost_min: float | None = None
    mobilisation_cost_max: float | None = None

    setup_cost_min: float | None = None
    setup_cost_max: float | None = None

    execution_cost_min: float | None = None
    execution_cost_max: float | None = None

    pump_addon_cost_min: float | None = None
    pump_addon_cost_max: float | None = None

    documentation_buffer: float | None = None

    access_support_buffer: float | None = None

    direct_cost_min: float | None = None
    direct_cost_max: float | None = None

    overhead_cost_min: float | None = None
    overhead_cost_max: float | None = None

    contingency_cost_min: float | None = None
    contingency_cost_max: float | None = None

    margin_percentage: float | None = None

    margin_value_min: float | None = None
    margin_value_max: float | None = None

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

    revision_number: int | None = None

    workflow_status: str | None = None

    created_on: datetime | None = None

    created_by: str | None = None

    revision_reason: str | None = None



    recommended_machine: str | None = None

    service_configuration: str | None = None

    pump_hose_package: str | None = None

    approval_gate: str | None = None

    mobilisation_cost_min: float | None = None
    mobilisation_cost_max: float | None = None

    setup_cost_min: float | None = None
    setup_cost_max: float | None = None

    execution_cost_min: float | None = None
    execution_cost_max: float | None = None

    pump_addon_cost_min: float | None = None
    pump_addon_cost_max: float | None = None

    documentation_buffer: float | None = None

    access_support_buffer: float | None = None

    direct_cost_min: float | None = None
    direct_cost_max: float | None = None

    overhead_cost_min: float | None = None
    overhead_cost_max: float | None = None

    contingency_cost_min: float | None = None
    contingency_cost_max: float | None = None

    margin_percentage: float | None = None

    margin_value_min: float | None = None
    margin_value_max: float | None = None

    cleaning_quote_min: float | None = None
    cleaning_quote_max: float | None = None

    dewatering_method: str | None = None

    dewatering_addon_min: float | None = None
    dewatering_addon_max: float | None = None

    combined_budgetary_value_min: float | None = None
    combined_budgetary_value_max: float | None = None

    techno_status: str | None = None

    techno_approved_by: str | None = None

    techno_approved_date: str | None = None

    techno_note: str | None = None

    internal_extra_enabled: bool | None = None

    internal_extra_amount: float | None = None

    internal_extra_note: str | None = None

    valid_till: str | None = None

    released: bool | None = None

    released_by: str | None = None

    released_date: str | None = None

    revision_requested: bool | None = None

    revision_requested_by: str | None = None

    revision_requested_date: str | None = None

    final_approved_value: float | None = None



    class Config:

        from_attributes = True


# ====================================
# TECHNO-COMMERCIAL APPROVAL DECISION
# ====================================

class TechnoApprovalDecisionSchema(BaseModel):

    status: str

    approved_by: str

    note: str | None = None


# ====================================
# QUOTE & COMMERCIAL TAB
# ====================================

class InternalExtraSchema(BaseModel):

    enabled: bool

    amount: float | None = None

    note: str | None = None


class ValidTillSchema(BaseModel):

    valid_till: str | None = None


class ReleaseQuoteSchema(BaseModel):

    released_by: str


class RequestRevisionFlagSchema(BaseModel):

    requested_by: str


# ====================================
# QUOTES MODULE (list all quotes)
# ====================================

class QuoteListItemSchema(BaseModel):

    id: int

    ops_selection_id: int

    customer_request_id: int

    customer_name: str | None = None

    enquiry_id: int | None = None

    enquiry_stage: str | None = None

    revision_number: int | None = None

    workflow_status: str | None = None

    status_label: str

    revision_requested: bool | None = None

    combined_budgetary_value_min: float | None = None

    combined_budgetary_value_max: float | None = None

    created_on: datetime | None = None

    class Config:

        from_attributes = True


class QuoteListResponse(BaseModel):

    items: list[QuoteListItemSchema]

    total: int

    page: int

    page_size: int
