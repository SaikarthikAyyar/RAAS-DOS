# ====================================
# IMPORTS
# ====================================

from datetime import datetime

from pydantic import BaseModel


# ====================================
# CREATE REQUEST
# threshold_seconds is a plain countdown from creation - never compared
# against the enquiry's aging value, even if aging already exceeds it
# at set-time.
# ====================================

class SurveyReminderCreate(BaseModel):

    threshold_seconds: int
    set_by_user_id: int
    set_by_name: str


# ====================================
# STATUS RESPONSE
# ====================================

class SurveyReminderStatus(BaseModel):

    active: bool

    threshold_seconds: int | None = None
    remaining_seconds: float | None = None
    set_by_name: str | None = None
    created_at: datetime | None = None

    class Config:
        from_attributes = True
