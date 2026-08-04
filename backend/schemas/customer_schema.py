# ====================================
# IMPORTS
# ====================================

from pydantic import BaseModel

from typing import Optional

from datetime import date


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
    # ENQUIRY DETAILS (EXTENDED)
    # ====================================

    existing_asset: Optional[str] = None

    lead_source: Optional[str] = None

    client_contact_email: Optional[str] = None

    estimated_volume: Optional[float] = None

    division: Optional[str] = None

    department: Optional[str] = None

    asset_name: Optional[str] = None

    asset_type: Optional[str] = None

    nature_of_job: str

    # ====================================
    # BUSINESS MASTER LINKAGE
    # Set when the frontend resolved an existing Customer/Asset via
    # the datalist/dropdown - matches submitNewEnquiry()'s customer
    # and existing-asset picks. Left null for a brand new
    # customer/asset, which gets auto-created server-side.
    # ====================================

    customer_id: Optional[int] = None

    asset_id: Optional[int] = None


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

    cleaning_date: date

    cleaning_frequency: str