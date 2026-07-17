# ====================================
# IMPORTS
# ====================================

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Boolean
from sqlalchemy import ForeignKey

from backend.database.tables import Base


# ====================================
# OPS APPROVAL
# ====================================

class OpsApproval(Base):

    __tablename__ = "ops_approvals"

    # ====================================
    # PRIMARY KEY
    # ====================================

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # ====================================
    # REFERENCES
    # ====================================

    customer_request_id = Column(
        Integer,
        ForeignKey("customer_requests.id"),
        nullable=False
    )

    sales_survey_id = Column(
        Integer,
        ForeignKey("sales_surveys.id"),
        nullable=False
    )

    # ====================================
    # APPROVAL
    # ====================================

    job_doable = Column(
        Boolean,
        nullable=False
    )

    approval_notes = Column(
        String
    )

    approved_by = Column(
        Integer
    )

    # ====================================
    # WORKFLOW
    # ====================================

    status = Column(
        String(50),
        default="APPROVED"
    )