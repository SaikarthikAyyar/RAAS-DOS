# ====================================
# IMPORTS
# ====================================

from dataclasses import dataclass
from dataclasses import field


# ====================================
# CUSTOMER
# ====================================

@dataclass
class CustomerReport:

    company_name: str | None = None

    plant_site_location: str | None = None

    contact_person: str | None = None

    contact_number: str | None = None

    nearest_city_hub: str | None = None

    urgency: str | None = None


# ====================================
# REQUIREMENT
# ====================================

@dataclass
class RequirementReport:

    service_requirement_type: str | None = None

    observed_material: str | None = None

    estimated_quantity_known: str | None = None

    tank_type: str | None = None

    approx_length_dia: float | None = None

    approx_width: float | None = None

    approx_depth: float | None = None

    access_opening_type: str | None = None

    can_place_equipment_nearby: bool | None = None

    quote_basis: str | None = None

    pain_point: str | None = None


# ====================================
# COMPUTATIONS
# ====================================

@dataclass
class ComputationReport:

    tank_volume: float | None = None

    sludge_volume: float | None = None

    working_volume: float | None = None

    surface_area: float | None = None

    estimated_duration: float | None = None

    estimated_manpower: int | None = None

    pump_capacity: float | None = None

    dewatering_required: bool | None = None

# ====================================
# SAFETY
# ====================================

@dataclass
class SafetyReport:

    # --------------------------------
    # SECTION C
    # --------------------------------

    opening_length: float | None = None

    opening_width: float | None = None

    height_from_ground: float | None = None

    drop_to_floor: float | None = None

    setup_distance: float | None = None

    vertical_lift: float | None = None

    hose_distance: float | None = None

    access_path_width: float | None = None

    scaffolding_needed: bool | None = None

    crane_available: bool | None = None


    # --------------------------------
    # SECTION D
    # --------------------------------

    power_available: str | None = None

    water_available: bool | None = None

    confined_space: bool | None = None

    ventilation_required: bool | None = None

    gas_testing_required: bool | None = None

    ehs_restriction: str | None = None


# ====================================
# MEDIA
# ====================================

@dataclass
class MediaReport:

    photos: list = field(default_factory=list)

    videos: list = field(default_factory=list)

    layouts: list = field(default_factory=list)


# ====================================
# METADATA
# ====================================

@dataclass
class MetadataReport:

    customer_request_id: int | None = None

    sales_survey_id: int | None = None

    generated_by: str | None = None

    generated_time: str | None = None

    version: str = "1.0"


# ====================================
# COMPLETE REPORT
# ====================================

@dataclass
class ReportData:

    customer: CustomerReport = field(default_factory=CustomerReport)

    requirement: RequirementReport = field(default_factory=RequirementReport)

    computations: ComputationReport = field(default_factory=ComputationReport)

    safety: SafetyReport = field(default_factory=SafetyReport)

    media: MediaReport = field(default_factory=MediaReport)

    metadata: MetadataReport = field(default_factory=MetadataReport)