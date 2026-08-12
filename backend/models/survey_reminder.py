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
# SURVEY REMINDER
# One row per pending/fired/cancelled reminder set on the Survey tab.
# threshold_seconds is a plain countdown from created_at - firing is
# never compared against the enquiry's aging value. Active = fired_at
# IS NULL AND cancelled_at IS NULL.
# ====================================

class SurveyReminder(Base):

    __tablename__ = "survey_reminders"

    id = Column(Integer, primary_key=True, index=True)

    enquiry_id = Column(Integer, ForeignKey("enquiries.id"), nullable=False)

    set_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    set_by_name = Column(String(150), nullable=False)

    threshold_seconds = Column(Integer, nullable=False)
    stage_at_set = Column(String(100), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    fired_at = Column(DateTime(timezone=True), nullable=True)
    cancelled_at = Column(DateTime(timezone=True), nullable=True)
