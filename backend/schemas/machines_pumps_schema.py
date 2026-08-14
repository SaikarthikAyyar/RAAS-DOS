# ====================================
# IMPORTS
# ====================================

from typing import Optional

from pydantic import BaseModel, ConfigDict

from backend.schemas.notification_schema import ActorSchema


# ====================================
# MACHINE
# ====================================

class MachineCreate(BaseModel):
    code: str
    name: str
    service_configuration: Optional[str] = None
    power_type: Optional[str] = None
    minimum_width: Optional[float] = None
    minimum_height: Optional[float] = None
    base_output_per_day: Optional[float] = None
    base_output_basis: Optional[str] = None
    recommended_max_volume: Optional[float] = None
    pump_package: Optional[str] = None
    hose_size: Optional[str] = None
    preferred_job_types: list[str] = []
    preferred_materials: list[str] = []
    debris_tolerance: Optional[str] = None
    setup_complexity: Optional[str] = None
    crew: Optional[int] = None
    approval_gate: Optional[str] = None
    accessories: list[str] = []
    description: Optional[str] = None
    rate: Optional[float] = None
    material_construction: Optional[str] = None
    max_operating_temp: Optional[float] = None
    hazard_rating: Optional[str] = None
    max_vertical_lift: Optional[float] = None
    crane_required: Optional[str] = None
    vehicle: Optional[str] = None
    vehicle_payload: Optional[str] = None
    dims: Optional[str] = None
    weight: Optional[str] = None
    hubs_available: list[str] = []
    active: bool = True
    compatible_pump_ids: list[int] = []
    actor: ActorSchema
    remark: str


class MachineUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    service_configuration: Optional[str] = None
    power_type: Optional[str] = None
    minimum_width: Optional[float] = None
    minimum_height: Optional[float] = None
    base_output_per_day: Optional[float] = None
    base_output_basis: Optional[str] = None
    recommended_max_volume: Optional[float] = None
    pump_package: Optional[str] = None
    hose_size: Optional[str] = None
    preferred_job_types: Optional[list[str]] = None
    preferred_materials: Optional[list[str]] = None
    debris_tolerance: Optional[str] = None
    setup_complexity: Optional[str] = None
    crew: Optional[int] = None
    approval_gate: Optional[str] = None
    accessories: Optional[list[str]] = None
    description: Optional[str] = None
    rate: Optional[float] = None
    material_construction: Optional[str] = None
    max_operating_temp: Optional[float] = None
    hazard_rating: Optional[str] = None
    max_vertical_lift: Optional[float] = None
    crane_required: Optional[str] = None
    vehicle: Optional[str] = None
    vehicle_payload: Optional[str] = None
    dims: Optional[str] = None
    weight: Optional[str] = None
    hubs_available: Optional[list[str]] = None
    active: Optional[bool] = None
    compatible_pump_ids: Optional[list[int]] = None
    actor: ActorSchema
    remark: str


class MachineResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    code: str
    name: str
    service_configuration: Optional[str] = None
    power_type: Optional[str] = None
    minimum_width: Optional[float] = None
    minimum_height: Optional[float] = None
    base_output_per_day: Optional[float] = None
    base_output_basis: Optional[str] = None
    recommended_max_volume: Optional[float] = None
    pump_package: Optional[str] = None
    hose_size: Optional[str] = None
    preferred_job_types: list[str] = []
    preferred_materials: list[str] = []
    debris_tolerance: Optional[str] = None
    setup_complexity: Optional[str] = None
    crew: Optional[int] = None
    approval_gate: Optional[str] = None
    accessories: list[str] = []
    description: Optional[str] = None
    rate: Optional[float] = None
    material_construction: Optional[str] = None
    max_operating_temp: Optional[float] = None
    hazard_rating: Optional[str] = None
    max_vertical_lift: Optional[float] = None
    crane_required: Optional[str] = None
    vehicle: Optional[str] = None
    vehicle_payload: Optional[str] = None
    dims: Optional[str] = None
    weight: Optional[str] = None
    hubs_available: list[str] = []
    active: bool
    compatible_pump_codes: list[str] = []


# ====================================
# PUMP
# ====================================

class PumpCreate(BaseModel):
    code: str
    name: str
    hp: Optional[float] = None
    phase: Optional[str] = None
    voltage: Optional[str] = None
    peak_current: Optional[str] = None
    density_range: Optional[str] = None
    flow_rate: Optional[float] = None
    type: Optional[str] = None
    max_suction_lift: Optional[float] = None
    max_discharge_head: Optional[float] = None
    max_solids_size: Optional[float] = None
    hazard_rating: Optional[str] = None
    power_source: Optional[str] = None
    active: bool = True
    actor: ActorSchema
    remark: str


class PumpUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    hp: Optional[float] = None
    phase: Optional[str] = None
    voltage: Optional[str] = None
    peak_current: Optional[str] = None
    density_range: Optional[str] = None
    flow_rate: Optional[float] = None
    type: Optional[str] = None
    max_suction_lift: Optional[float] = None
    max_discharge_head: Optional[float] = None
    max_solids_size: Optional[float] = None
    hazard_rating: Optional[str] = None
    power_source: Optional[str] = None
    active: Optional[bool] = None
    actor: ActorSchema
    remark: str


class PumpResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    code: str
    name: str
    hp: Optional[float] = None
    phase: Optional[str] = None
    voltage: Optional[str] = None
    peak_current: Optional[str] = None
    density_range: Optional[str] = None
    flow_rate: Optional[float] = None
    type: Optional[str] = None
    max_suction_lift: Optional[float] = None
    max_discharge_head: Optional[float] = None
    max_solids_size: Optional[float] = None
    hazard_rating: Optional[str] = None
    power_source: Optional[str] = None
    active: bool

