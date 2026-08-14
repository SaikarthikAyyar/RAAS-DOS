# ====================================
# IMPORTS
# ====================================

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import Numeric
from sqlalchemy import Boolean
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import UniqueConstraint

from sqlalchemy.sql import func

from sqlalchemy.dialects.postgresql import JSONB

from backend.database.tables import Base


# ====================================
# MACHINE
# The type/spec catalog the Ops Engine scores against - distinct from
# machine_inventory (real physical fleet units for Allocation/Execution).
# ====================================

class Machine(Base):

    __tablename__ = "machines"

    id = Column(Integer, primary_key=True, index=True)

    code = Column(String(50), unique=True, nullable=False)
    name = Column(String(200), nullable=False)

    service_configuration = Column(String(30))
    power_type = Column(String(100))

    minimum_width = Column(Numeric)
    minimum_height = Column(Numeric)

    base_output_per_day = Column(Numeric)
    base_output_basis = Column(String(255))
    recommended_max_volume = Column(Numeric)

    pump_package = Column(String(150))
    hose_size = Column(String(100))

    preferred_job_types = Column(JSONB, default=list)
    preferred_materials = Column(JSONB, default=list)

    debris_tolerance = Column(String(30))
    setup_complexity = Column(String(30))
    crew = Column(Integer)
    approval_gate = Column(String(100))

    accessories = Column(JSONB, default=list)
    description = Column(Text)

    rate = Column(Numeric(12, 2))

    material_construction = Column(String(100))
    max_operating_temp = Column(Numeric)
    hazard_rating = Column(String(50))
    max_vertical_lift = Column(Numeric)
    crane_required = Column(String(10))

    vehicle = Column(String(150))
    vehicle_payload = Column(String(150))
    dims = Column(String(100))
    weight = Column(String(50))

    hubs_available = Column(JSONB, default=list)

    active = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


# ====================================
# PUMP
# Genuinely new catalog - previously only a flat descriptive string
# lived on each machine row, no real pump specs/selection existed.
# ====================================

class Pump(Base):

    __tablename__ = "pumps"

    id = Column(Integer, primary_key=True, index=True)

    code = Column(String(50), unique=True, nullable=False)
    name = Column(String(200), nullable=False)

    hp = Column(Numeric)
    phase = Column(String(30))
    voltage = Column(String(30))
    peak_current = Column(String(30))
    density_range = Column(String(100))
    flow_rate = Column(Numeric)
    type = Column(String(100))
    max_suction_lift = Column(Numeric)
    max_discharge_head = Column(Numeric)
    max_solids_size = Column(Numeric)
    hazard_rating = Column(String(50))
    power_source = Column(String(50))

    active = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


# ====================================
# MACHINE <-> PUMP COMPATIBILITY
# ====================================

class MachinePumpCompatibility(Base):

    __tablename__ = "machine_pump_compatibility"

    __table_args__ = (
        UniqueConstraint("machine_id", "pump_id", name="uq_machine_pump"),
    )

    id = Column(Integer, primary_key=True, index=True)

    machine_id = Column(Integer, ForeignKey("machines.id", ondelete="CASCADE"), nullable=False)
    pump_id = Column(Integer, ForeignKey("pumps.id", ondelete="CASCADE"), nullable=False)
