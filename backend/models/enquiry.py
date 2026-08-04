from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Boolean
from sqlalchemy import DateTime

from sqlalchemy.sql import func

from sqlalchemy.dialects.postgresql import JSONB

from backend.database.tables import Base


class Enquiry(Base):

    __tablename__ = "enquiries"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # ====================================
    # WORKFLOW REFERENCES
    # ====================================

    customer_request_id = Column(
        Integer,
        nullable=False
    )

    sales_survey_id = Column(
        Integer,
        nullable=True
    )

    ops_selector_id = Column(
        Integer,
        nullable=True
    )

    dewatering_assessment_id = Column(
        Integer,
        nullable=True
    )

    quote_id = Column(
        Integer,
        nullable=True
    )

    approval_board_id = Column(
        Integer,
        nullable=True
    )

    job_creation_id = Column(
        Integer,
        nullable=True
    )

    execution_id = Column(
        Integer,
        nullable=True
    )

    # ====================================
    # BUSINESS MASTER LINKAGE
    # ====================================

    customer_id = Column(
        Integer,
        nullable=True
    )

    asset_id = Column(
        Integer,
        nullable=True
    )

    customer_name = Column(
        String(150),
        nullable=True
    )

    nature = Column(
        String(50),
        nullable=True
    )

    # ====================================
    # ROUTING
    # ====================================

    sender_role = Column(String(50))

    receiver_role = Column(String(50))

    requested_task = Column(String(100))

    current_module = Column(String(100))

    workflow_status = Column(
        String(50),
        default="PENDING"
    )

    completed = Column(
        Boolean,
        default=False
    )

    # ====================================
    # CONSOLIDATED ENQUIRY
    # ====================================

    status = Column(
        String(30),
        nullable=False,
        default="OPEN"
    )

    stage = Column(
        String(100),
        nullable=False,
        default="CUSTOMER_REQUEST"
    )

    owner_role = Column(
        String(50),
        nullable=True
    )

    owner_user_id = Column(
        Integer,
        nullable=True
    )

    closed_at = Column(
        DateTime,
        nullable=True
    )

    # ====================================
    # SNAPSHOT
    # ====================================

    payload = Column(JSONB)

    created_by = Column(Integer)

    created_at = Column(
        DateTime,
        server_default=func.now()
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now()
    )