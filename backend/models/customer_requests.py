from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import Boolean

from backend.database.tables import Base


class CustomerRequest(Base):

    __tablename__ = "customer_requests"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    company_name = Column(
        String(150)
    )

    plant_site_location = Column(
        String(150)
    )

    contact_person = Column(
        String(150)
    )

    urgency = Column(
        String(50)
    )

    service_requirement_type = Column(
        String(150)
    )

    observed_material = Column(
        String(150)
    )

    approx_length_dia = Column(
        Float
    )

    approx_width = Column(
        Float
    )

    approx_depth = Column(
        Float
    )

    access_opening_type = Column(
        String(100)
    )

    can_place_equipment_nearby = Column(
        Boolean
    )

    quote_basis = Column(
        String(150)
    )

    pain_point = Column(
        String
    )

    attachments = Column(
        String
    )

    status = Column(
        String(50)
    )