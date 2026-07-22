# ====================================
# IMPORTS
# ====================================

from sqlalchemy import (
    Column,
    BigInteger,
    String,
    Float,
    Date,
    Boolean,
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

    execution_progress = Column(
        BigInteger,
        default=0
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

    delay_days = Column(
        BigInteger,
        default=0
    )

    remarks = Column(
        String(1000)
    )

    current_activity = Column(
        String(300),
        nullable=True
    )

    transport_status = Column(
        String(100),
        server_default="WAITING"
    )

    invoice_synced = Column(
        String(20),
        server_default="YES"
    )

    # ====================================
    # LIVE GPS
    # ====================================

    latitude = Column(
        Float,
        nullable=True
    )

    longitude = Column(
        Float,
        nullable=True
    )

    speed_kmph = Column(
        Float,
        default=0
    )

    heading = Column(
        Float,
        default=0
    )

    altitude = Column(
        Float,
        default=0
    )

    accuracy_meters = Column(
        Float,
        default=0
    )

    gps_timestamp = Column(
        TIMESTAMP,
        nullable=True
    )

    last_update_source = Column(
        String(30),
        default="OPS"
    )

    # ====================================
    # LIVE EXECUTION
    # ====================================

    eta_minutes = Column(
        BigInteger,
        default=0
    )

    distance_remaining_km = Column(
        Float,
        default=0
    )

    today_output = Column(
        Float,
        default=0
    )

    total_output = Column(
        Float,
        default=0
    )

    daily_target = Column(
        Float,
        default=0
    )

    output_unit = Column(
        String(20),
        default="m³"
    )

    proof_uploaded = Column(
        Boolean,
        default=False
    )

    last_updated = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
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