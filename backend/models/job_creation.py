from sqlalchemy import (
    Column,
    BigInteger,
    String,
    Date,
    Text,
    TIMESTAMP,
    ForeignKey,
    text
)

from sqlalchemy.dialects.postgresql import JSONB

from backend.database.tables import Base


class JobCreation(Base):

    __tablename__ = "job_creations"

    id = Column(
        BigInteger,
        primary_key=True,
        index=True
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

    ops_selection_id = Column(
        BigInteger,
        ForeignKey("ops_selections.id"),
        nullable=False
    )

    approval_board_id = Column(
        BigInteger,
        ForeignKey("approval_boards.id"),
        nullable=False,
        unique=True
    )

    generated_job_id = Column(
        String(30),
        unique=True,
        nullable=False
    )

    planned_start = Column(Date)

    planned_completion = Column(Date)

    customer_visible_status = Column(
        String(50),
        server_default="Scheduled"
    )

    approved_service_configuration = Column(
        String(100)
    )

    approved_machine = Column(
        String(100)
    )

    approved_pump_package = Column(
        String(100)
    )

    approved_accessories = Column(Text)

    manpower_json = Column(JSONB)

    readiness_json = Column(JSONB)

    workflow_status = Column(
        String(50),
        server_default="DRAFT"
    )

    created_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )

    updated_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )