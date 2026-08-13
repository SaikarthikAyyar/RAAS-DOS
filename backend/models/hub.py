# ====================================
# IMPORTS
# ====================================

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime

from sqlalchemy.sql import func

from backend.database.tables import Base


# ====================================
# HUB
# hub_name must match the values in the existing nearestHubs lookup
# list. ops_owner/techno_approver drive the "Owner" column on the
# Reviews & Approvals module's Ops Review / Techno-Commercial queues.
# ====================================

class Hub(Base):

    __tablename__ = "hubs"

    id = Column(Integer, primary_key=True, index=True)

    hub_name = Column(String(150), unique=True, nullable=False)
    region = Column(String(50))
    ops_owner = Column(String(150))
    techno_approver = Column(String(150))

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
