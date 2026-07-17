from sqlalchemy import (
    Column,
    BigInteger,
    String,
    Date,
    ForeignKey,
    TIMESTAMP,
    text
)

from backend.database.tables import Base


class MachineInventory(Base):

    __tablename__ = "machine_inventory"

    id = Column(
        BigInteger,
        primary_key=True,
        index=True
    )

    machine_code = Column(
        String(50),
        nullable=False
    )

    machine_name = Column(
        String(200),
        nullable=False
    )

    asset_number = Column(
        String(50),
        unique=True,
        nullable=False
    )

    status = Column(
        String(50),
        server_default="AVAILABLE"
    )

    current_job_id = Column(
        BigInteger,
        ForeignKey("job_creations.id"),
        nullable=True
    )

    site_location = Column(
        String(200),
        server_default="Warehouse"
    )

    allocated_start = Column(Date)

    allocated_completion = Column(Date)

    estimated_arrival = Column(Date)

    next_available_date = Column(Date)

    remarks = Column(String(500))

    created_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )

    updated_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )