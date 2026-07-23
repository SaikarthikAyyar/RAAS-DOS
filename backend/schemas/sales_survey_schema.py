# ====================================
# IMPORTS
# ====================================

from pydantic import BaseModel

from typing import Optional


# ====================================
# SALES SURVEY SCHEMA
# ====================================

class SalesSurveySchema(BaseModel):


    # ====================================
    # CONNECTION
    # ====================================

    customer_request_id:int


    # ====================================
    # SECTION A
    # ====================================

    survey_date:Optional[str]=None

    plant_site_location: str


    # ====================================
    # SECTION B
    # ====================================

    material_category:Optional[str]=None

    job_type: Optional[str] = None



    bulk_density:Optional[float]=None

    hazard_level:Optional[str]=None

    cleaning_date: Optional[str] = None

    cleaning_frequency: Optional[str] = None

    sludge_hardness: Optional[str] = None

    debris_level: Optional[str] = None

    water_visibility: Optional[str] = None

    pumpable: Optional[str] = None

    average_output: Optional[float] = None

    large_object_type: Optional[str] = None
    ph_min: Optional[float] = None
    ph_max: Optional[float] = None
    flow_after_agitation: Optional[str] = None

    temperature_range: Optional[str] = None

    sample_available: Optional[str] = None


    # ====================================
    # SECTION C
    # ====================================

    estimated_volume:Optional[float]=None

    tank_type: Optional[str] = None

    tank_length: Optional[float] = None

    tank_width: Optional[float] = None

    tank_depth: Optional[float] = None


    opening_length:Optional[float]=None

    opening_width:Optional[float]=None

    height_from_ground:Optional[float]=None

    drop_to_floor:Optional[float]=None

    setup_distance:Optional[float]=None

    vertical_lift:Optional[float]=None

    hose_distance:Optional[float]=None

    access_path_width:Optional[float]=None

    scaffolding_needed:Optional[str]=None

    crane_available:Optional[str]=None

    opening_height: Optional[float] = None

    access_support: Optional[str] = None

    customer_support: Optional[str] = None


    # ====================================
    # SECTION D
    # ====================================

    power_available:Optional[str]=None

    water_available:Optional[str]=None

    air_supply_available: Optional[str] = None

    confined_space:Optional[str]=None

    ventilation_required:Optional[str]=None

    gas_testing_required:Optional[str]=None

    ehs_restriction:Optional[str]=None

    power_distance:Optional[float]=None

    # ====================================
    # SECTION E
    # ====================================

    discharge_pit_dimension: Optional[str] = None

    discharge_medium: Optional[str] = None

    disposal_route: Optional[str] = None

    disposal_responsibility: Optional[str] = None

    discharge_point_distance: Optional[float] = None

    hose_route_bends: Optional[int] = None


    # ====================================
    # SECTION G
    # ====================================

    customer_pain_point:Optional[str]=None


    # ====================================
    # STATUS
    # ====================================

    status:Optional[str]="SURVEY_COMPLETED"




class CustomerSection(BaseModel):
    company_name: Optional[str]
    plant_site_location: Optional[str]
    contact_person: Optional[str]
    contact_number: Optional[str]
    nearest_hub: Optional[str]
    urgency: Optional[str]
    survey_date: Optional[str]


class JobSection(BaseModel):
    job_type: Optional[str]
    material_category: Optional[str]
    cleaning_date: Optional[str]
    cleaning_frequency: Optional[str]
    sludge_hardness: Optional[str]
    debris_level: Optional[str]
    water_visibility: Optional[str]
    bulk_density: Optional[float]
    pumpable: Optional[str]
    large_object_type: Optional[str]
    hazard_level: Optional[str]
    ph_min: Optional[float]
    ph_max: Optional[float]
    flow_after_agitation: Optional[str]
    temperature_range: Optional[str]
    sample_available: Optional[str]


class GeometrySection(BaseModel):
    tank_type: Optional[str]
    length_dia: Optional[float]
    width: Optional[float]
    sludge_depth: Optional[float]
    estimated_volume: Optional[float]
    average_output: Optional[float]
    opening_length: Optional[float]
    opening_width: Optional[float]
    height_from_ground: Optional[float]
    drop_to_floor: Optional[float]
    setup_distance: Optional[float]
    vertical_lift: Optional[float]
    hose_distance: Optional[float]
    access_path_width: Optional[float]
    access_support: Optional[str]
    customer_support: Optional[str]


class SafetySection(BaseModel):
    power_available: Optional[str]
    water_available: Optional[str]
    air_supply_available: Optional[str]
    confined_space: Optional[str]
    ventilation_required: Optional[str]
    gas_testing_required: Optional[str]
    ehs_restriction: Optional[str]
    power_distance: Optional[float]


class PumpSection(BaseModel):
    discharge_pit_dimension: Optional[str]
    discharge_medium: Optional[str]
    disposal_route: Optional[str]
    disposal_responsibility: Optional[str]
    discharge_point_distance: Optional[float]
    hose_route_bends: Optional[int]


class DewateringSection(BaseModel):
    pass


class InsightSection(BaseModel):
    customer_pain: Optional[str]


class SalesSurveyResponseSchema(BaseModel):
    id: int
    customer: CustomerSection
    job: JobSection
    geometry: GeometrySection
    safety: SafetySection
    pump: PumpSection
    dewatering: DewateringSection
    insights: InsightSection