# ====================================
# IMPORTS
# ====================================

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Date
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey

from sqlalchemy.sql import func

from sqlalchemy.dialects.postgresql import JSONB

from backend.database.tables import Base


# ====================================
# ASSET (BUSINESS MASTER — CUSTOMER ASSET REGISTRY)
# ====================================

class Asset(Base):

    __tablename__ = "assets"

    # ====================================
    # PRIMARY KEY
    # ====================================

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    customer_id = Column(
        Integer,
        ForeignKey("customers.id"),
        nullable=False
    )

    # ====================================
    # HIERARCHY (Division -> Plant -> Department -> Asset)
    # ====================================

    division = Column(
        String(150)
    )

    plant = Column(
        String(150)
    )

    department = Column(
        String(150)
    )

    name = Column(
        String(150)
    )

    asset_type = Column(
        String(100)
    )

    # ====================================
    # CLEANING HISTORY
    # ====================================

    cleaning_frequency = Column(
        String(50)
    )

    last_cleaned = Column(
        Date
    )

    next_due = Column(
        Date
    )

    last_verified = Column(
        Date
    )

    verified_by = Column(
        String(150)
    )

    # ====================================
    # PROFILE
    # Geometry/access/pump fields, populated once Sales Survey
    # linkage exists (a later pass) - unused for now.
    # ====================================

    profile = Column(
        JSONB
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )
