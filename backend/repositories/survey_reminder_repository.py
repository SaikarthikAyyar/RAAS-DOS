# ====================================
# IMPORTS
# ====================================

from datetime import datetime, timezone

from backend.models.survey_reminder import SurveyReminder


# ====================================
# CREATE
# ====================================

def create_reminder(db, enquiry_id, set_by_user_id, set_by_name, threshold_seconds, stage_at_set):

    reminder = SurveyReminder(

        enquiry_id=enquiry_id,
        set_by_user_id=set_by_user_id,
        set_by_name=set_by_name,
        threshold_seconds=threshold_seconds,
        stage_at_set=stage_at_set

    )

    db.add(reminder)
    db.commit()
    db.refresh(reminder)

    return reminder


# ====================================
# GET ACTIVE (for one enquiry)
# ====================================

def get_active_reminder_for_enquiry(db, enquiry_id):

    return (
        db.query(SurveyReminder)
        .filter(
            SurveyReminder.enquiry_id == enquiry_id,
            SurveyReminder.fired_at.is_(None),
            SurveyReminder.cancelled_at.is_(None)
        )
        .order_by(SurveyReminder.created_at.desc())
        .first()
    )


# ====================================
# CANCEL ACTIVE (stage-change auto-cancel, or a manual Cancel click)
# ====================================

def cancel_active_reminders_for_enquiry(db, enquiry_id):

    active = (
        db.query(SurveyReminder)
        .filter(
            SurveyReminder.enquiry_id == enquiry_id,
            SurveyReminder.fired_at.is_(None),
            SurveyReminder.cancelled_at.is_(None)
        )
        .all()
    )

    for reminder in active:
        reminder.cancelled_at = datetime.now(timezone.utc)

    if active:
        db.commit()

    return len(active)


# ====================================
# GET ALL ACTIVE (for the sweep)
# ====================================

def get_all_active_reminders(db):

    return (
        db.query(SurveyReminder)
        .filter(
            SurveyReminder.fired_at.is_(None),
            SurveyReminder.cancelled_at.is_(None)
        )
        .all()
    )


# ====================================
# MARK FIRED
# ====================================

def mark_fired(db, reminder):

    reminder.fired_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(reminder)

    return reminder
