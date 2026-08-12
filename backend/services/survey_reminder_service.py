# ====================================
# IMPORTS
# ====================================

from datetime import datetime, timezone

from fastapi import HTTPException, status

from backend.models.enquiry import Enquiry
from backend.models.notification import Notification

from backend.repositories import survey_reminder_repository as repository

from backend.schemas.survey_reminder_schema import SurveyReminderStatus


# ====================================
# PRIVATE
# ====================================

def _get_enquiry_or_404(db, enquiry_id):

    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()

    if not enquiry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Enquiry not found.")

    return enquiry


def _format_threshold(seconds):

    hours = seconds / 3600

    if hours >= 1 and hours == int(hours):
        return f"{int(hours)}h"

    if seconds >= 60 and seconds % 60 == 0:
        return f"{int(seconds // 60)}m"

    return f"{int(seconds)}s"


# ====================================
# SET REMINDER
# Only settable while the enquiry is actually in Survey stage. Setting
# a new one replaces any existing active one for this enquiry.
# ====================================

def set_reminder(db, enquiry_id, payload):

    enquiry = _get_enquiry_or_404(db, enquiry_id)

    if enquiry.stage != "SALES_SURVEY":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A Survey Reminder can only be set while the enquiry is in the Survey stage."
        )

    repository.cancel_active_reminders_for_enquiry(db, enquiry_id)

    repository.create_reminder(
        db,
        enquiry_id=enquiry_id,
        set_by_user_id=payload.set_by_user_id,
        set_by_name=payload.set_by_name,
        threshold_seconds=payload.threshold_seconds,
        stage_at_set=enquiry.stage
    )

    return get_reminder_status(db, enquiry_id)


# ====================================
# CANCEL REMINDER
# ====================================

def cancel_reminder(db, enquiry_id):

    cancelled_count = repository.cancel_active_reminders_for_enquiry(db, enquiry_id)

    return {"cancelled": cancelled_count > 0}


# ====================================
# GET STATUS
# remaining_seconds is a plain countdown against created_at - not the
# enquiry's aging value.
# ====================================

def get_reminder_status(db, enquiry_id):

    reminder = repository.get_active_reminder_for_enquiry(db, enquiry_id)

    if not reminder:
        return SurveyReminderStatus(active=False)

    now = datetime.now(timezone.utc)

    created_at = reminder.created_at
    if created_at.tzinfo is None:
        created_at = created_at.replace(tzinfo=timezone.utc)

    elapsed_seconds = (now - created_at).total_seconds()
    remaining_seconds = max(0, reminder.threshold_seconds - elapsed_seconds)

    return SurveyReminderStatus(
        active=True,
        threshold_seconds=reminder.threshold_seconds,
        remaining_seconds=remaining_seconds,
        set_by_name=reminder.set_by_name,
        created_at=reminder.created_at
    )


# ====================================
# SWEEP DUE REMINDERS
# Called from notification_service.py::list_unread_request() on every
# bell-icon poll (every ~30s, from any logged-in user's browser tab) -
# piggybacking on infrastructure that already runs reliably instead of
# standing up a new backend scheduler. Firing is purely
# created_at-relative; this never reads aging/stage_entered_at to
# decide whether a reminder is due.
# ====================================

def sweep_due_reminders(db):

    now = datetime.now(timezone.utc)

    for reminder in repository.get_all_active_reminders(db):

        created_at = reminder.created_at
        if created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=timezone.utc)

        elapsed_seconds = (now - created_at).total_seconds()

        if elapsed_seconds < reminder.threshold_seconds:
            continue

        enquiry = db.query(Enquiry).filter(Enquiry.id == reminder.enquiry_id).first()

        if not enquiry:
            repository.mark_fired(db, reminder)
            continue

        threshold_display = _format_threshold(reminder.threshold_seconds)

        notification = Notification(

            title=f"Enquiry #{enquiry.id} - {enquiry.customer_name or 'Unknown'}: still in Survey stage, "
                  f"{threshold_display} after your reminder",
            module="Sales Survey",
            action="REMINDER",
            user_id=reminder.set_by_user_id,
            user_name=reminder.set_by_name,
            user_role="",
            enquiry_id=enquiry.id,
            customer_name=enquiry.customer_name,
            recipient_user_id=reminder.set_by_user_id

        )

        db.add(notification)

        repository.mark_fired(db, reminder)
