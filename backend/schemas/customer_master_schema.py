# ====================================
# IMPORTS
# ====================================

from datetime import datetime

from pydantic import BaseModel


# ====================================
# CREATE CUSTOMER
# ====================================

class CustomerCreateSchema(BaseModel):

    company_name: str

    category: str | None = "Standard Industrial"

    industry: str | None = None

    region: str | None = None

    gst_number: str | None = None

    owner: str | None = None


# ====================================
# CONTACT
# ====================================

class ContactCreateSchema(BaseModel):

    name: str

    designation: str | None = None

    email: str | None = None

    phone: str | None = None


class ContactSchema(BaseModel):

    id: int

    name: str | None = None

    designation: str | None = None

    email: str | None = None

    phone: str | None = None

    class Config:

        from_attributes = True


# ====================================
# ASSET OPTION (lightweight - for the "Existing asset" dropdown
# on Customer Request)
# ====================================

class AssetOptionSchema(BaseModel):

    id: int

    label: str

    division: str | None = None

    plant: str | None = None

    department: str | None = None

    name: str | None = None

    asset_type: str | None = None

    cleaning_frequency: str | None = None

    observed_material: str | None = None

    access_opening_type: str | None = None

    can_place_equipment_nearby: bool | None = None

    pain_point: str | None = None


class AssetOptionListResponse(BaseModel):

    items: list[AssetOptionSchema]


# ====================================
# ASSET ON FILE
# ====================================

class AssetSchema(BaseModel):

    id: int

    customer_id: int | None = None

    division: str | None = None

    plant: str | None = None

    department: str | None = None

    name: str | None = None

    asset_type: str | None = None

    cleaning_frequency: str | None = None

    next_due: str | None = None

    last_verified: str | None = None

    verified_by: str | None = None

    observed_material: str | None = None

    access_opening_type: str | None = None

    can_place_equipment_nearby: bool | None = None

    pain_point: str | None = None

    class Config:

        from_attributes = True


# ====================================
# LINKED ENQUIRY
# ====================================

class LinkedEnquirySchema(BaseModel):

    id: int

    stage: str

    status: str

    value: float | None = None

    created_at: datetime | None = None

    class Config:

        from_attributes = True


# ====================================
# NEXT FOLLOW-UP
# ====================================

class FollowUpSchema(BaseModel):

    date: str

    owner: str | None = None

    note: str | None = None


# ====================================
# LIST ITEM
# ====================================

class CustomerListItemSchema(BaseModel):

    id: int

    company_name: str

    category: str | None = None

    industry: str | None = None

    region: str | None = None

    owner: str | None = None

    assets_count: int = 0

    next_follow_up_date: str | None = None

    next_follow_up_note: str | None = None

    follow_up_bucket: str | None = None

    class Config:

        from_attributes = True


class CustomerListResponse(BaseModel):

    items: list[CustomerListItemSchema]


# ====================================
# DETAIL (360)
# ====================================

class CustomerDetailSchema(CustomerListItemSchema):

    gst_number: str | None = None

    next_follow_up_owner: str | None = None

    contacts: list[ContactSchema] = []

    assets: list[AssetSchema] = []

    linked_enquiries: list[LinkedEnquirySchema] = []
