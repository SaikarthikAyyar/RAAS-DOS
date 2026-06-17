from pydantic import BaseModel

from datetime import datetime


class CustomerModel(BaseModel):

    customer_id: int

    company_name: str

    plant_site_location: str

    contact_person: str

    created_at: datetime