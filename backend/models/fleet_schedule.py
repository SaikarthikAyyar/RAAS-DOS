# ====================================
# IMPORTS
# ====================================

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import BigInteger
from sqlalchemy import String
from sqlalchemy import Date
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime

from sqlalchemy.sql import func

from backend.database.tables import Base


# ====================================
# FLEET SCHEDULE
# Direct structural port of MachineSchedule (queue_position, real
# planned_start/planned_completion, schedule_status) at the Fleet
# Unit level - this is what fixes the personnel-dequeue bug, since
# booking a Fleet Unit books its machine AND crew together.
# ====================================

class FleetSchedule(Base):

    __tablename__ = "fleet_schedule"

    id = Column(Integer, primary_key=True, index=True)

    fleet_unit_id = Column(
        Integer,
        ForeignKey("fleet_units.id"),
        nullable=False
    )

    job_creation_id = Column(
        BigInteger,
        ForeignKey("job_creations.id"),
        nullable=False
    )

    execution_id = Column(
        BigInteger,
        ForeignKey("executions.id"),
        nullable=True
    )

    queue_position = Column(Integer, nullable=False)

    site_location = Column(String(255), nullable=False)

    planned_start = Column(Date, nullable=False)
    planned_completion = Column(Date, nullable=False)

    actual_start = Column(Date, nullable=True)
    actual_completion = Column(Date, nullable=True)

    schedule_status = Column(String(20), nullable=False, default="QUEUED")

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
