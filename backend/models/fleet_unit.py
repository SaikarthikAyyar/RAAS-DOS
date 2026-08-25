# ====================================
# IMPORTS
# ====================================

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import BigInteger
from sqlalchemy import String
from sqlalchemy import Boolean
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime
from sqlalchemy import UniqueConstraint

from sqlalchemy.sql import func

from backend.database.tables import Base


# ====================================
# FLEET UNIT
# Bundles one real machine_inventory row with a nominal crew
# (fleet_unit_personnel) and a home hub into one persistent, reusable
# entity - the booking target for Allocation/Fleet & Availability
# going forward. One Fleet Unit per real machine is the expected
# common case, not DB-enforced.
# ====================================

class FleetUnit(Base):

    __tablename__ = "fleet_units"

    id = Column(Integer, primary_key=True, index=True)

    fleet_code = Column(String(30), unique=True, nullable=False)
    fleet_name = Column(String(150), nullable=False)

    machine_inventory_id = Column(
        Integer,
        ForeignKey("machine_inventory.id"),
        nullable=False
    )

    hub_id = Column(Integer, ForeignKey("hubs.id"), nullable=True)

    active = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


# ====================================
# FLEET UNIT PERSONNEL
# The nominal crew bundled onto a Fleet Unit - booking the unit books
# every one of these people together (Phase 33 design decision).
# ====================================

class FleetUnitPersonnel(Base):

    __tablename__ = "fleet_unit_personnel"

    id = Column(Integer, primary_key=True, index=True)

    fleet_unit_id = Column(
        Integer,
        ForeignKey("fleet_units.id", ondelete="CASCADE"),
        nullable=False
    )

    personnel_id = Column(
        Integer,
        ForeignKey("personnel.id"),
        nullable=False
    )

    __table_args__ = (
        UniqueConstraint("fleet_unit_id", "personnel_id", name="uq_fleet_unit_personnel"),
    )
