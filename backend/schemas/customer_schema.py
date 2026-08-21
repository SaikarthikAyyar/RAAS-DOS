# ====================================
# IMPORTS
# ====================================

from pydantic import BaseModel, field_validator, model_validator

from typing import Optional

from datetime import date

from backend.utils.contact_validation import validate_phone_format, validate_email_format


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

    cleaning_date: Optional[date] = None

    cleaning_frequency: str


    # ====================================
    # FORMAT VALIDATION
    # Only rejects a non-empty, malformed value - both fields stay
    # optional (matches the frontend, which never flags an empty
    # contact_number/client_contact_email as an error).
    # ====================================

    @field_validator("contact_number")
    @classmethod
    def validate_contact_number(cls, value):
        return validate_phone_format(value)

    @field_validator("client_contact_email")
    @classmethod
    def validate_client_contact_email(cls, value):
        return validate_email_format(value)

    # cleaning_date is optional (not compulsory) but is a real Date
    # column - a blank date input sends "" rather than omitting the
    # field entirely, which Pydantic's date type would otherwise
    # reject outright. Coerce blank to None, same as Sales Survey's
    # identical fix.
    @field_validator("cleaning_date", mode="before")
    @classmethod
    def blank_cleaning_date_to_none(cls, value):
        if value == "":
            return None
        return value


    # ====================================
    # ASSET NAME REQUIRED FOR A NEW SITE
    # Plant + Asset Name together are exactly what resolve_or_create_asset
    # needs to actually create an Asset record - if neither an existing
    # asset was picked (asset_id) nor a real Asset Name was typed, the
    # resulting enquiry ends up with no linked asset at all, silently
    # breaking Sales Survey's later asset-profile write-back.
    # ====================================

    @model_validator(mode="after")
    def validate_asset_name_required_for_new_site(self):
        if not self.asset_id and not self.asset_name:
            raise ValueError(
                "asset_name is required when no existing asset is selected."
            )
        return self