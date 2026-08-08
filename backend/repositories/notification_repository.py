# ====================================
# IMPORTS
# ====================================

from datetime import timedelta

from backend.models.notification import Notification, NotificationChange, NotificationRead


# ====================================
# DATE-RANGE HELPER
# date_to arrives as a bare date parsed to midnight (e.g. "2026-08-08"
# -> 2026-08-08T00:00:00), so a naive `<=` comparison excludes every
# notification created later that same day. Bumping to the start of
# the next day and comparing with `<` makes date_to inclusive of its
# whole day.
# ====================================

def _end_of_day_exclusive(date_to):
    return date_to + timedelta(days=1)


# ====================================
# RECORD CHANGE
# Shared entry point every instrumented mutation calls after diffing
# old vs new field values. One Notification row + one
# NotificationChange row per entry in `changes`. CREATE uses
# before=None per field, DELETE uses after=None per field - one
# mechanism for all three action types.
# ====================================

def record_change(

        db,
        module,
        action,
        actor_user_id,
        actor_name,
        actor_role,
        enquiry_id,
        customer_name,
        title,
        changes

):

    if not changes:
        return None

    notification = Notification(

        title=title,
        module=module,
        action=action,
        user_id=actor_user_id,
        user_name=actor_name,
        user_role=actor_role,
        enquiry_id=enquiry_id,
        customer_name=customer_name

    )

    db.add(notification)
    db.flush()

    for change in changes:

        db.add(NotificationChange(

            notification_id=notification.id,
            field_name=change["field"],
            previous_value=(
                str(change["before"]) if change.get("before") is not None else None
            ),
            updated_value=(
                str(change["after"]) if change.get("after") is not None else None
            )

        ))

    db.commit()
    db.refresh(notification)

    return notification


# ====================================
# LIST NOTIFICATIONS (Audit Trail module)
# Filtered by date range only, newest first, with is_read computed
# per the requesting user.
# ====================================

def list_notifications(db, date_from, date_to, user_id):

    query = db.query(Notification)

    if date_from:
        query = query.filter(Notification.created_at >= date_from)

    if date_to:
        query = query.filter(Notification.created_at < _end_of_day_exclusive(date_to))

    notifications = query.order_by(Notification.created_at.desc()).all()

    read_ids = set()

    if user_id and notifications:

        notification_ids = [n.id for n in notifications]

        read_rows = (
            db.query(NotificationRead.notification_id)
            .filter(
                NotificationRead.user_id == user_id,
                NotificationRead.notification_id.in_(notification_ids)
            )
            .all()
        )

        read_ids = {row[0] for row in read_rows}

    result = []

    for notification in notifications:

        changes = (
            db.query(NotificationChange)
            .filter(NotificationChange.notification_id == notification.id)
            .all()
        )

        result.append({
            "notification": notification,
            "changes": changes,
            "is_read": notification.id in read_ids
        })

    return result


# ====================================
# LIST UNREAD (bell icon)
# ====================================

def list_unread(db, user_id, date_from=None, date_to=None, limit=50):

    read_subquery = (
        db.query(NotificationRead.notification_id)
        .filter(NotificationRead.user_id == user_id)
        .subquery()
    )

    query = (
        db.query(Notification)
        .filter(Notification.id.notin_(read_subquery))
    )

    if date_from:
        query = query.filter(Notification.created_at >= date_from)

    if date_to:
        query = query.filter(Notification.created_at < _end_of_day_exclusive(date_to))

    notifications = (
        query
        .order_by(Notification.created_at.desc())
        .limit(limit)
        .all()
    )

    return notifications


# ====================================
# MARK ALL READ (fires when the Audit Trail module mounts)
# ====================================

def mark_all_read(db, user_id):

    unread = list_unread(db, user_id, limit=10000)

    for notification in unread:

        db.add(NotificationRead(

            notification_id=notification.id,
            user_id=user_id

        ))

    db.commit()

    return len(unread)


# ====================================
# EXPORT DATA
# All notifications (+ their changes) in the given date range, for
# the per-case Excel export - grouping into sheets happens in the
# service layer, this just returns the flat filtered set.
# ====================================

def get_export_data(db, date_from, date_to):

    query = db.query(Notification)

    if date_from:
        query = query.filter(Notification.created_at >= date_from)

    if date_to:
        query = query.filter(Notification.created_at < _end_of_day_exclusive(date_to))

    notifications = query.order_by(Notification.created_at.asc()).all()

    result = []

    for notification in notifications:

        changes = (
            db.query(NotificationChange)
            .filter(NotificationChange.notification_id == notification.id)
            .all()
        )

        result.append({
            "notification": notification,
            "changes": changes
        })

    return result
