from datetime import datetime
from typing import Optional

from pydantic import BaseModel
from pydantic import ConfigDict


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