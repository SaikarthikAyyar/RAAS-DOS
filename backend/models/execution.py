# ====================================
# IMPORTS
# ====================================

from sqlalchemy import (
    Column,
    BigInteger,
    String,
    Date,
    TIMESTAMP,
    ForeignKey,
    text
)

from backend.database.tables import Base


# ====================================
# EXECUTION
# ====================================

class Execution(Base):

    __tablename__ = "executions"

    id = Column(
        BigInteger,
        primary_key=True,
        index=True
    )

    # ====================================
    # WORKFLOW REFERENCES
    # ====================================

    job_creation_id = Column(
        BigInteger,
        ForeignKey("job_creations.id"),
        nullable=False,
        unique=True
    )

    customer_request_id = Column(
        BigInteger,
        ForeignKey("customer_requests.id"),
        nullable=False
    )

    sales_survey_id = Column(
        BigInteger,
        ForeignKey("sales_surveys.id"),
        nullable=False
    )

    # ====================================
    # EXECUTION STATUS
    # ====================================

    workflow_status = Column(
        String(50),
        server_default="READY"
    )

    current_phase = Column(
        String(30),
        server_default="PHASE_1"
    )

    # ====================================
    # PHASE STATUS
    # ====================================

    phase_1_status = Column(
        String(30),
        server_default="PENDING"
    )

    phase_2_status = Column(
        String(30),
        server_default="PENDING"
    )

    phase_3_status = Column(
        String(30),
        server_default="PENDING"
    )

    # ====================================
    # SITE DETAILS
    # ====================================

    site_location = Column(
        String(200)
    )

    planned_start = Column(
        Date
    )

    estimated_completion = Column(
        Date
    )

    actual_completion = Column(
        Date
    )

    remarks = Column(
        String(1000)
    )

    # ====================================
    # AUDIT
    # ====================================

    created_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )

    updated_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )