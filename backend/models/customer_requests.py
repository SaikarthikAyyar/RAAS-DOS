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
        String
    )

    plant_site_location = Column(
        String
    )

    contact_person = Column(
        String
    )

    urgency = Column(
        String
    )

    service_requirement_type = Column(
        String
    )

    observed_material = Column(
        String
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
        String
    )

    can_place_equipment_nearby = Column(
        Boolean
    )

    quote_basis = Column(
        String
    )

    pain_point = Column(
        String
    )

    attachments = Column(
        String
    )

    status = Column(
        String,
        default="REQUESTED"
    )