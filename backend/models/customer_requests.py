from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from backend.database.tables import Base


class CustomerRequest(Base):

    __tablename__ = "customer_requests"

    id = Column(
        Integer,
        primary_key=True
    )

    company_name = Column(
        String
    )

    contact_person = Column(
        String
    )

    contact_email = Column(
        String
    )

    contact_phone = Column(
        String
    )

    site_location = Column(
        String
    )

    project_start = Column(
        String
    )

    project_end = Column(
        String
    )

    service_required = Column(
        String
    )

    priority = Column(
        String
    )

    description = Column(
        String
    )

    status = Column(
        String
    )