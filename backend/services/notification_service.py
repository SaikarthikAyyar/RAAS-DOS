# ====================================
# IMPORTS
# ====================================

from backend.repositories.notification_repository import (
    list_notifications,
    list_unread,
    mark_all_read,
    get_export_data
)

from backend.services.survey_reminder_service import sweep_due_reminders


# ====================================
# SERIALIZATION HELPERS
# ====================================

def _serialize_entry(entry):

    notification = entry["notification"]

    return {

        "id": notification.id,
        "title": notification.title,
        "module": notification.module,
        "action": notification.action,
        "user_id": notification.user_id,
        "user_name": notification.user_name,
        "user_role": notification.user_role,
        "enquiry_id": notification.enquiry_id,
        "customer_name": notification.customer_name,
        "created_at": notification.created_at,
        "is_read": entry.get("is_read", False),
        "is_important": notification.is_important,
        "remark": notification.remark,
        "changes": [
            {
                "field_name": change.field_name,
                "previous_value": change.previous_value,
                "updated_value": change.updated_value
            }
            for change in entry["changes"]
        ]

    }


def _serialize_notification_only(notification):

    return {

        "id": notification.id,
        "title": notification.title,
        "module": notification.module,
        "action": notification.action,
        "user_id": notification.user_id,
        "user_name": notification.user_name,
        "user_role": notification.user_role,
        "enquiry_id": notification.enquiry_id,
        "customer_name": notification.customer_name,
        "created_at": notification.created_at,
        "is_read": False,
        "is_important": notification.is_important,
        "remark": notification.remark,
        "changes": []

    }


# ====================================
# LIST (Audit Trail module)
# ====================================

def list_notifications_request(db, date_from, date_to, user_id):

    entries = list_notifications(db, date_from, date_to, user_id)

    return [_serialize_entry(entry) for entry in entries]


# ====================================
# UNREAD (bell icon)
# ====================================

def list_unread_request(db, user_id, date_from=None, date_to=None):

    # Every bell-icon poll (every ~30s, from any logged-in user) doubles
    # as the Survey Reminder feature's trigger - see backend/services/
    # survey_reminder_service.py::sweep_due_reminders for why this
    # piggybacks on existing polling infra instead of a new scheduler.
    sweep_due_reminders(db)

    notifications = list_unread(db, user_id, date_from=date_from, date_to=date_to)

    return [_serialize_notification_only(n) for n in notifications]


# ====================================
# MARK ALL READ
# ====================================

def mark_all_read_request(db, user_id):

    count = mark_all_read(db, user_id)

    return {"marked_read": count}


# ====================================
# EXPORT
# Groups the flat filtered notification set into one bucket per
# enquiry ("cases") plus a catch-all bucket for notifications with no
# enquiry_id ("other") - the frontend turns each bucket into one
# Excel sheet.
# ====================================

def export_notifications_request(db, date_from, date_to):

    entries = get_export_data(db, date_from, date_to)

    cases = {}

    other_rows = []

    for entry in entries:

        notification = entry["notification"]

        for change in entry["changes"]:

            row = {

                "user_name": notification.user_name,
                "user_role": notification.user_role,
                "module": notification.module,
                "field_name": change.field_name,
                "previous_value": change.previous_value,
                "updated_value": change.updated_value,
                "date": notification.created_at.isoformat() if notification.created_at else None

            }

            if notification.enquiry_id:

                key = notification.enquiry_id

                if key not in cases:

                    cases[key] = {

                        "enquiry_id": notification.enquiry_id,
                        "customer_name": notification.customer_name or "",
                        "rows": []

                    }

                cases[key]["rows"].append(row)

            else:

                other_rows.append(row)

    return {

        "cases": list(cases.values()),
        "other": other_rows

    }
