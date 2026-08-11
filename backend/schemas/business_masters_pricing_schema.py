# ====================================
# IMPORTS
# ====================================

from typing import Optional

from pydantic import BaseModel, ConfigDict


# ====================================
# SERVICE CONFIGURATION
# ====================================

class ServiceConfigurationCreate(BaseModel):
    code: str
    name: str
    rate_per_day: float


class ServiceConfigurationUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    rate_per_day: Optional[float] = None


class ServiceConfigurationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    code: str
    name: str
    rate_per_day: float


# ====================================
# DEWATERING METHOD
# ====================================

class DewateringMethodCreate(BaseModel):
    method_key: str
    method_name: str
    rate_per_m3: float
    best_for: Optional[str] = None
    review_trigger: Optional[str] = None


class DewateringMethodUpdate(BaseModel):
    method_key: Optional[str] = None
    method_name: Optional[str] = None
    rate_per_m3: Optional[float] = None
    best_for: Optional[str] = None
    review_trigger: Optional[str] = None


class DewateringMethodResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    method_key: str
    method_name: str
    rate_per_m3: float
    best_for: Optional[str] = None
    review_trigger: Optional[str] = None


# ====================================
# ACCESSORY
# ====================================

class AccessoryCreate(BaseModel):
    name: str
    unit: Optional[str] = "per job"
    rate: float


class AccessoryUpdate(BaseModel):
    name: Optional[str] = None
    unit: Optional[str] = None
    rate: Optional[float] = None


class AccessoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    unit: str
    rate: float


# ====================================
# COMMERCIAL RULES (single row)
# ====================================

class CommercialRulesUpdate(BaseModel):
    mobilisation_rate: float
    setup_rate: float
    demob_rate: float
    overhead_pct: float
    margin_pct: float
    contingency_pct: float
    documentation_buffer: float
    access_support_buffer: float


class CommercialRulesResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    mobilisation_rate: float
    setup_rate: float
    demob_rate: float
    overhead_pct: float
    margin_pct: float
    contingency_pct: float
    documentation_buffer: float
    access_support_buffer: float


# ====================================
# CUSTOMER CATEGORY
# ====================================

class CustomerCategoryCreate(BaseModel):
    category: str
    margin_pct: float


class CustomerCategoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    category: str
    margin_pct: float
