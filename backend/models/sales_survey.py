# ====================================
# IMPORTS
# ====================================

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import ForeignKey

from backend.database.tables import Base


# ====================================
# SALES SURVEY TABLE
# ====================================

class SalesSurvey(Base):

    __tablename__ = "sales_surveys"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    customer_request_id = Column(
        Integer,
        ForeignKey(
            "customer_requests.id"
        )
    )

    job_type = Column(
        String(100)
    )

    sludge_type = Column(
        String(100)
    )

    volume = Column(
        Float
    )

    output_target = Column(
        String(100)
    )

    access_type = Column(
        String(100)
    )

    vertical_lift = Column(
        Float
    )

    hose_distance = Column(
        Float
    )

    safety_notes = Column(
        String
    )

    status = Column(
        String(50)
    )