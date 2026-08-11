# ====================================
# IMPORTS
# ====================================

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Numeric
from sqlalchemy import DateTime

from sqlalchemy.sql import func

from backend.database.tables import Base


# ====================================
# SERVICE CONFIGURATION
# Machine day-rate by service config code (e.g. SC-AQUA).
# ====================================

class ServiceConfiguration(Base):

    __tablename__ = "service_configurations"

    id = Column(Integer, primary_key=True, index=True)

    code = Column(String(30), unique=True, nullable=False)
    name = Column(String(150), nullable=False)
    rate_per_day = Column(Numeric(12, 2), nullable=False)

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


# ====================================
# DEWATERING METHOD
# method_key matches what OpsSelection.dewatering_method_min/max store.
# ====================================

class DewateringMethod(Base):

    __tablename__ = "dewatering_methods"

    id = Column(Integer, primary_key=True, index=True)

    method_key = Column(String(30), unique=True, nullable=False)
    method_name = Column(String(150), nullable=False)
    rate_per_m3 = Column(Numeric(12, 2), nullable=False)
    best_for = Column(String(255))
    review_trigger = Column(String(255))

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


# ====================================
# ACCESSORY
# Matched by name against each Deployment Plan's accessories_plan
# entries to build the itemized quote add-on.
# ====================================

class Accessory(Base):

    __tablename__ = "accessories"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(150), unique=True, nullable=False)
    unit = Column(String(50), default="per job")
    rate = Column(Numeric(12, 2), nullable=False)

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


# ====================================
# COMMERCIAL RULES
# Single-row config table - the flat rates/percentages every quote
# is built from.
# ====================================

class CommercialRules(Base):

    __tablename__ = "commercial_rules"

    id = Column(Integer, primary_key=True, index=True)

    mobilisation_rate = Column(Numeric(12, 2), nullable=False)
    setup_rate = Column(Numeric(12, 2), nullable=False)
    demob_rate = Column(Numeric(12, 2), nullable=False)

    overhead_pct = Column(Numeric(5, 4), nullable=False)
    margin_pct = Column(Numeric(5, 4), nullable=False)
    contingency_pct = Column(Numeric(5, 4), nullable=False)

    documentation_buffer = Column(Numeric(12, 2), nullable=False)
    access_support_buffer = Column(Numeric(12, 2), nullable=False)

    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


# ====================================
# CUSTOMER CATEGORY
# Per-category margin override - falls back to CommercialRules.margin_pct
# when a customer's category has no row here.
# ====================================

class CustomerCategory(Base):

    __tablename__ = "customer_categories"

    id = Column(Integer, primary_key=True, index=True)

    category = Column(String(100), unique=True, nullable=False)
    margin_pct = Column(Numeric(5, 4), nullable=False)

    created_at = Column(DateTime, server_default=func.now())
