# ====================================
# IMPORTS
# ====================================

from pydantic import BaseModel, ConfigDict

from typing import Optional

from datetime import date

from backend.schemas.notification_schema import ActorSchema


# ====================================
# CREATE/UPDATE RESPONSE
# Minimal response for POST /sales-survey - the frontend needs a real
# `id` back (to link it onto the Enquiry as sales_survey_id) rather
# than the `{}` FastAPI produces trying to auto-serialize the raw
# SQLAlchemy ORM object with no response_model at all.
# ====================================

class SalesSurveyCreateResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    customer_request_id: int
    status: Optional[str] = None


# ====================================
# SALES SURVEY SCHEMA
# ====================================

class SalesSurveySchema(BaseModel):


    # ====================================
    # CONNECTION
    # ====================================

    customer_request_id:int
    sales_survey_id: int | None = None
    actor: Optional[ActorSchema] = None


    # ====================================
    # SECTION A
    # ====================================

    survey_date: date | None

    plant_site_location: str

    nearest_hub: Optional[str] = None

    urgency: Optional[str] = None

    surveyed_by: Optional[str] = None

    survey_trigger: Optional[str] = None

    repeat_potential: Optional[str] = None

    tentative_start_date: Optional[str] = None

    tentative_end_date: Optional[str] = None


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
    material_ph_condition: Optional[str] = None
    flow_after_agitation: Optional[str] = None

    temperature_range: Optional[str] = None

    sample_available: Optional[str] = None

    abrasiveness: Optional[str] = None

    permit_required: Optional[str] = None

    flowability: Optional[str] = None


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

    access_type: Optional[str] = None

    equipment_nearby: Optional[str] = None

    tank_location: Optional[str] = None

    setup_complexity: Optional[str] = None


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

    power_distance: Optional[float] = None


    # ====================================
    # SECTION E
    # ====================================

    discharge_pit_dimension: Optional[str] = None

    discharge_medium: Optional[str] = None

    disposal_route: Optional[str] = None

    disposal_responsibility: Optional[str] = None

    discharge_point_distance: Optional[float] = None

    hose_route_bends: Optional[int] = None

    target_flow: Optional[float] = None

    suction_depth: Optional[float] = None

    discharge_distance: Optional[float] = None

    discharge_height: Optional[float] = None

    debris_present: Optional[str] = None

    ph_condition: Optional[str] = None

    pump_power_source: Optional[str] = None

    pump_risk: Optional[str] = None

    effective_work_hours: Optional[float] = None


    # ====================================
    # SECTION F
    # ====================================

    dewatering_required: Optional[str] = None

    dewatering_volume: Optional[float] = None

    inlet_moisture: Optional[float] = None

    target_final_moisture: Optional[float] = None

    expected_final_form: Optional[str] = None

    visible_free_water: Optional[str] = None

    natural_settling: Optional[str] = None

    oily_emulsified: Optional[str] = None

    space_available: Optional[str] = None

    filtrate_route: Optional[str] = None

    moisture_guarantee: Optional[str] = None

    cake_handling_scope: Optional[str] = None

    filtrate_route_detail: Optional[str] = None

    polymer_allowed: Optional[str] = None

    commitment: Optional[str] = None


    # ====================================
    # SECTION G
    # ====================================

    customer_pain_point:Optional[str]=None

    shutdown_window: Optional[str] = None

    completion_deadline: Optional[str] = None

    current_method: Optional[str] = None

    budget_known: Optional[str] = None

    budget_estimate: Optional[float] = None

    decision_maker: Optional[str] = None

    billing_address: Optional[str] = None


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
    survey_date:  date | None
    surveyed_by: Optional[str] = None
    survey_trigger: Optional[str] = None
    repeat_potential: Optional[str] = None
    tentative_start_date: Optional[str] = None
    tentative_end_date: Optional[str] = None


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
    material_ph_condition: Optional[str] = None
    flow_after_agitation: Optional[str]
    temperature_range: Optional[str]
    sample_available: Optional[str]
    abrasiveness: Optional[str] = None
    permit_required: Optional[str] = None
    flowability: Optional[str] = None


class GeometrySection(BaseModel):
    tank_type: Optional[str]
    length_dia: Optional[float]
    width: Optional[float]
    sludge_depth: Optional[float]
    estimated_volume: Optional[float]
    average_output: Optional[float]
    opening_length: Optional[float]
    opening_width: Optional[float]
    opening_height: Optional[float]
    height_from_ground: Optional[float]
    drop_to_floor: Optional[float]
    setup_distance: Optional[float]
    vertical_lift: Optional[float]
    hose_distance: Optional[float]
    access_path_width: Optional[float]
    access_support: Optional[str]
    customer_support: Optional[str]
    access_type: Optional[str]
    equipment_nearby: Optional[str]
    scaffolding_needed: Optional[str]
    crane_available: Optional[str]
    tank_location: Optional[str] = None
    setup_complexity: Optional[str] = None


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
    target_flow: Optional[float]
    suction_depth: Optional[float]
    discharge_distance: Optional[float]
    discharge_height: Optional[float]
    debris_present: Optional[str]
    ph_condition: Optional[str]
    pump_power_source: Optional[str]
    pump_risk: Optional[str] = None
    effective_work_hours: Optional[float] = None


class DewateringSection(BaseModel):
    dewatering_required: Optional[str]
    dewatering_volume: Optional[float]
    inlet_moisture: Optional[float]
    target_final_moisture: Optional[float]
    expected_final_form: Optional[str]
    visible_free_water: Optional[str]
    natural_settling: Optional[str]
    oily_emulsified: Optional[str]
    space_available: Optional[str]
    filtrate_route: Optional[str]
    moisture_guarantee: Optional[str]
    cake_handling_scope: Optional[str]
    filtrate_route_detail: Optional[str] = None
    polymer_allowed: Optional[str] = None
    commitment: Optional[str] = None


class InsightSection(BaseModel):
    customer_pain: Optional[str]
    shutdown_window: Optional[str]
    completion_deadline: Optional[str]
    current_method: Optional[str] = None
    budget_known: Optional[str] = None
    budget_estimate: Optional[float] = None
    decision_maker: Optional[str] = None
    billing_address: Optional[str] = None


class SalesSurveyResponseSchema(BaseModel):
    id: int
    customer: CustomerSection
    job: JobSection
    geometry: GeometrySection
    safety: SafetySection
    pump: PumpSection
    dewatering: DewateringSection
    insights: InsightSection
