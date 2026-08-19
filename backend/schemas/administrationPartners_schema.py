from datetime import datetime
from typing import Optional

from pydantic import BaseModel, field_validator
from pydantic import ConfigDict

from backend.utils.contact_validation import validate_phone_format, validate_email_format


# ==========================================================
# CREATE
# ==========================================================

class AdministrationPartnerCreate(BaseModel):



    partner_firm_name: str

    primary_contact: str

    email: str

    phone: str

    commission_percentage: float = 5.0

    linked_customer_company_record: Optional[str] = None

    is_active: bool = True

    @field_validator("email")
    @classmethod
    def validate_email(cls, value):
        return validate_email_format(value)

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value):
        return validate_phone_format(value)


# ==========================================================
# UPDATE
# ==========================================================

class AdministrationPartnerUpdate(BaseModel):

    partner_firm_name: Optional[str] = None

    primary_contact: Optional[str] = None

    email: Optional[str] = None

    phone: Optional[str] = None

    commission_percentage: Optional[float] = None

    linked_customer_company_record: Optional[str] = None

    is_active: Optional[bool] = None

    @field_validator("email")
    @classmethod
    def validate_email(cls, value):
        return validate_email_format(value)

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value):
        return validate_phone_format(value)


# ==========================================================
# RESPONSE
# ==========================================================

class AdministrationPartnerResponse(BaseModel):

    model_config = ConfigDict(

        from_attributes=True

    )

    id: int

    user_id: int

    partner_firm_name: str

    primary_contact: str

    email: str

    phone: str

    commission_percentage: float

    linked_customer_company_record: Optional[str]

    is_active: bool

    created_at: datetime

    updated_at: datetime