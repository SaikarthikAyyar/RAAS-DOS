from pydantic import BaseModel

from typing import Optional


class CustomerRequestSchema(BaseModel):

    company_name: str

    plant_site_location: str

    contact_person: str

    urgency: str

    service_requirement_type: str

    observed_material: str

    approx_length_dia: Optional[float] = None

    approx_width: Optional[float] = None

    approx_depth: Optional[float] = None

    access_opening_type: Optional[str] = None

    can_place_equipment_nearby: Optional[bool] = None

    quote_basis: Optional[str] = None

    pain_point: Optional[str] = None

    attachments: Optional[str] = None