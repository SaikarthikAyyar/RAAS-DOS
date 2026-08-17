# ====================================
# IMPORTS
# ====================================

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey

from sqlalchemy.sql import func

from backend.database.tables import Base


# ====================================
# HUB APPROVER
# One row per (hub, user, approval_type) - a user's real Ops Review or
# Techno-Commercial approval standing for that hub. Multiple users can
# hold the same approval_type for the same hub.
# ====================================

class HubApprover(Base):

    __tablename__ = "hub_approvers"

    id = Column(Integer, primary_key=True, index=True)

    hub_id = Column(Integer, ForeignKey("hubs.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    approval_type = Column(String(30), nullable=False)

    created_at = Column(DateTime, server_default=func.now())
