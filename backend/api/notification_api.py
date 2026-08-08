# ====================================
# IMPORTS
# ====================================

from datetime import datetime

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.notification_schema import MarkAllReadSchema

from backend.services.notification_service import (
    list_notifications_request,
    list_unread_request,
    mark_all_read_request,
    export_notifications_request
)


api = APIRouter(tags=["Notifications"])


# ====================================
# LIST (Audit Trail module)
# ====================================

@api.get("/notifications")
def list_notifications(

        date_from: datetime | None = Query(None),
        date_to: datetime | None = Query(None),
        user_id: int | None = Query(None),
        db: Session = Depends(get_db)

):

    return list_notifications_request(db, date_from, date_to, user_id)


# ====================================
# UNREAD (bell icon)
# ====================================

@api.get("/notifications/unread")
def list_unread(

        user_id: int = Query(...),
        date_from: datetime | None = Query(None),
        date_to: datetime | None = Query(None),
        db: Session = Depends(get_db)

):

    return list_unread_request(db, user_id, date_from, date_to)


# ====================================
# MARK ALL READ
# ====================================

@api.post("/notifications/mark-all-read")
def mark_all_read(

        payload: MarkAllReadSchema,
        db: Session = Depends(get_db)

):

    return mark_all_read_request(db, payload.user_id)


# ====================================
# EXPORT
# ====================================

@api.get("/notifications/export")
def export_notifications(

        date_from: datetime | None = Query(None),
        date_to: datetime | None = Query(None),
        db: Session = Depends(get_db)

):

    return export_notifications_request(db, date_from, date_to)
