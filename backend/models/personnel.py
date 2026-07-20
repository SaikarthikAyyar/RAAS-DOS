from sqlalchemy import (
    Column,
    BigInteger,
    String,
    Boolean,
    ForeignKey,
    TIMESTAMP,
    text
)

from backend.database.tables import Base


class Personnel(Base):

    __tablename__ = "personnel"

    id = Column(
        BigInteger,
        primary_key=True,
        index=True
    )

    employee_code = Column(
        String(30),
        unique=True,
        nullable=False
    )

    full_name = Column(
        String(100),
        nullable=False
    )

    phone_number = Column(
        String(20)
    )

    current_location = Column(
        String(100),
        server_default="Head Office"
    )

    designation = Column(
        String(100),
        nullable=False
    )

    skill = Column(
        String(100)
    )

    current_job_id = Column(
        BigInteger,
        ForeignKey("job_creations.id"),
        nullable=True
    )

    assigned_role = Column(
        String(100),
        nullable=True
    )

    current_invoice_id = Column(
        BigInteger,
        nullable=True
    )

    current_gps = Column(
        String(100),
        nullable=True
    )

    availability_status = Column(
        String(50),
        server_default="AVAILABLE"
    )




    documents_verified = Column(
        Boolean,
        server_default="false"
    )

    created_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )

    updated_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )