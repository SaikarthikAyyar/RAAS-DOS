# ====================================
# IMPORTS
# ====================================

from typing import Optional, List

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


# ====================================
# OPS OVERRIDE SCHEMA
# ====================================

class OpsOverrideSchema(BaseModel):

    override_machine: str

    override_reason: str


# ====================================
# DEPLOYMENT PLAN SCHEMA
# ====================================

class CrewRoleSchema(BaseModel):

    role: str

    qty_min: int

    qty_max: int


class AccessoryPlanSchema(BaseModel):

    name: str

    needed: str


class DeploymentPlanSchema(BaseModel):

    mobilisation_days: int

    setup_days: int

    execution_days: int

    demob_days: int

    crew_plan: List[CrewRoleSchema] = []

    accessories_plan: List[AccessoryPlanSchema] = []

    dewatering_method_min: Optional[str] = None

    dewatering_method_max: Optional[str] = None


# ====================================
# OPS REVIEW DECISION SCHEMA
# ====================================

class OpsReviewDecisionSchema(BaseModel):

    status: str

    reviewed_by: str

    review_note: Optional[str] = None
