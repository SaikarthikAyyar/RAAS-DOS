# ====================================
# IMPORTS
# ====================================

from sqlalchemy import Column
from sqlalchemy import BigInteger
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Date
from sqlalchemy import ForeignKey
from sqlalchemy import TIMESTAMP
from sqlalchemy import text

from backend.database.tables import Base


# ====================================
# MACHINE SCHEDULE
# ====================================

class MachineSchedule(Base):

    __tablename__ = "machine_schedule"

    id = Column(
        BigInteger,
        primary_key=True,
        index=True
    )

    machine_id = Column(
        BigInteger,
        ForeignKey("machine_inventory.id"),
        nullable=False
    )

    job_creation_id = Column(
        BigInteger,
        ForeignKey("job_creations.id"),
        nullable=False
    )

    queue_position = Column(
        Integer,
        nullable=False
    )

    site_location = Column(
        String(200),
        nullable=False
    )

    planned_start = Column(
        Date,
        nullable=False
    )

    planned_completion = Column(
        Date,
        nullable=False
    )

    actual_start = Column(
        Date,
        nullable=True
    )

    actual_completion = Column(
        Date,
        nullable=True
    )

    schedule_status = Column(
        String(50),
        default="QUEUED"
    )

    created_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )

    updated_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )