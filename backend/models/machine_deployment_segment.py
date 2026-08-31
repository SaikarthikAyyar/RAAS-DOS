# ====================================
# IMPORTS
# ====================================

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import BigInteger
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import TIMESTAMP
from sqlalchemy import ForeignKey
from sqlalchemy import text

from backend.database.tables import Base


# ====================================
# MACHINE DEPLOYMENT SEGMENT (Phase 39)
# One row per continuous state a machine has genuinely been in -
# opened/closed automatically at the exact phase-transition moments
# that already exist (Start Current Phase / Complete Current Phase),
# never a separate user action. This is real, historical fact - it
# never contains the future by construction; upcoming/planned segments
# are synthesized live from FleetSchedule at read time instead (see
# invoice_dashboard_service.py), never written here.
# ====================================

class MachineDeploymentSegment(Base):

    __tablename__ = "machine_deployment_segments"

    id = Column(Integer, primary_key=True, index=True)

    machine_inventory_id = Column(
        BigInteger,
        ForeignKey("machine_inventory.id"),
        nullable=False
    )

    # NULL for an AVAILABLE (idle, not on any job) segment.
    execution_id = Column(
        BigInteger,
        ForeignKey("executions.id"),
        nullable=True
    )

    # MOBILISATION_TRANSIT | ON_SITE | DEMOBILISATION_TRANSIT | AVAILABLE
    segment_type = Column(String(30), nullable=False)

    start_latitude = Column(Float, nullable=True)
    start_longitude = Column(Float, nullable=True)
    end_latitude = Column(Float, nullable=True)
    end_longitude = Column(Float, nullable=True)

    # Reverse-geocoded once, at segment-creation time - never recomputed.
    place_name = Column(String(255), nullable=True)

    # Snapshotted (e.g. "Tata Steel - Redmud C Pond Cleaning") so this
    # never needs a live join back through Execution/Enquiry later.
    purpose_label = Column(String(255), nullable=True)

    started_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("now()")
    )

    # NULL = this is the machine's current, still-open segment.
    ended_at = Column(TIMESTAMP(timezone=True), nullable=True)
