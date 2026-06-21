# ====================================
# IMPORTS
# ====================================

from pydantic import BaseModel

from typing import Optional


# ====================================
# CUSTOMER REQUEST SCHEMA
# ====================================

class CustomerRequestSchema(BaseModel):


    # ====================================
    # CUSTOMER DETAILS
    # ====================================

    company_name: str

    plant_site_location: str

    contact_person: Optional[str] = None

    contact_number: Optional[str] = None

    nearest_city_hub: Optional[str] = None

    urgency: Optional[str] = None


    # ====================================
    # REQUIREMENT BASICS
    # ====================================

    service_requirement_type: Optional[str] = None

    observed_material: Optional[str] = None

    estimated_quantity_known: Optional[str] = None

    tank_type: Optional[str] = None


    # ====================================
    # DIMENSIONS
    # ====================================

    approx_length_dia: Optional[float] = None

    approx_width: Optional[float] = None

    approx_depth: Optional[float] = None


    # ====================================
    # ACCESS
    # ====================================

    access_opening_type: Optional[str] = None

    can_place_equipment_nearby: Optional[bool] = None


    # ====================================
    # COMMERCIAL
    # ====================================

    quote_basis: Optional[str] = None

    pain_point: Optional[str] = None


    # ====================================
    # MEDIA COUNTS
    # ====================================

    photo_count: Optional[int] = 0

    video_count: Optional[int] = 0

    layout_count: Optional[int] = 0


    # ====================================
    # WORKFLOW
    # ====================================

    status: Optional[str] = "REQUESTED"