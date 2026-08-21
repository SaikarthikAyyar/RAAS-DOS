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
# HR ROLE
# Day-rate master (matches wireframe's bm.hr) - Personnel's own Role
# dropdown reads from this table, so it has a real downstream use
# even before any crew-cost wiring into the quote engine.
# ====================================

class HrRole(Base):

    __tablename__ = "hr_roles"

    id = Column(Integer, primary_key=True, index=True)

    role = Column(String(100), unique=True, nullable=False)
    day_rate = Column(Numeric(12, 2), nullable=False)

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
