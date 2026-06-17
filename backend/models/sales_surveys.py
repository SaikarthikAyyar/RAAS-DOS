from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey

from backend.database.tables import Base


class SalesSurvey(Base):

    __tablename__ = "sales_surveys"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    job_id = Column(
        Integer,
        ForeignKey("jobs.id")
    )

    job_type = Column(
        String
    )

    sludge_type = Column(
        String
    )

    volume = Column(
        String
    )

    output_target = Column(
        String
    )

    access_type = Column(
        String
    )

    vertical_lift = Column(
        String
    )

    hose_distance = Column(
        String
    )

    safety = Column(
        String
    )