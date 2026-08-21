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
# GST SETTINGS
# Single-row config, same pattern as CommercialRules - always id=1.
# ====================================

class GstSettings(Base):

    __tablename__ = "gst_settings"

    id = Column(Integer, primary_key=True)

    rate = Column(Numeric(5, 2), nullable=False)
    treatment = Column(String(255), nullable=False)

    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
