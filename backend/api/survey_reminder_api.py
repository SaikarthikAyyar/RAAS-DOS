# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.survey_reminder_schema import SurveyReminderCreate, SurveyReminderStatus

from backend.services.survey_reminder_service import (
    set_reminder,
    cancel_reminder,
    get_reminder_status
)


api = APIRouter(tags=["Survey Reminders"])


# ====================================
# SET (create/replace)
# ====================================

@api.post("/survey-reminders/{enquiry_id}", response_model=SurveyReminderStatus)
def create_survey_reminder(enquiry_id: int, payload: SurveyReminderCreate, db: Session = Depends(get_db)):
    return set_reminder(db, enquiry_id, payload)


# ====================================
# CANCEL
# ====================================

@api.delete("/survey-reminders/{enquiry_id}")
def delete_survey_reminder(enquiry_id: int, db: Session = Depends(get_db)):
    return cancel_reminder(db, enquiry_id)


# ====================================
# STATUS
# ====================================

@api.get("/survey-reminders/{enquiry_id}", response_model=SurveyReminderStatus)
def read_survey_reminder(enquiry_id: int, db: Session = Depends(get_db)):
    return get_reminder_status(db, enquiry_id)
