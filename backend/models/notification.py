# ====================================
# IMPORTS
# ====================================

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import Boolean
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import UniqueConstraint

from sqlalchemy.sql import func

from backend.database.tables import Base


# ====================================
# NOTIFICATION
# One row per database change (create/update/delete), captured by
# record_change() in notification_repository.py.
# ====================================

class Notification(Base):

    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(Text, nullable=False)
    module = Column(String(100), nullable=False)
    action = Column(String(20), nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"))
    user_name = Column(String(150), nullable=False)
    user_role = Column(String(50), nullable=False)

    enquiry_id = Column(Integer, ForeignKey("enquiries.id"))
    customer_name = Column(String(150))

    # NULL = broadcast, visible to everyone (unchanged behavior for every
    # notification created before this column existed, and any new one
    # that doesn't set it). Set = visible only to that one user - used by
    # the Survey Reminder feature for a genuinely per-recipient alert.
    recipient_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Business Masters change notifications (Phase 15) - a third,
    # independent notification shape alongside the broadcast (above)
    # and targeted (recipient_user_id) ones. All three default to
    # False/NULL so every existing and future Type A/B row is
    # unaffected.
    is_important = Column(Boolean, nullable=False, default=False)
    remark = Column(Text, nullable=True)
    exclude_actor = Column(Boolean, nullable=False, default=False)

    # Phase 27: a real approval-gate decision (Approve/Reject/Sent back)
    # or a "Request Approval" ping - more specific than is_important,
    # and always paired with recipient_user_id set (one row per real
    # hub-approver for that gate), never broadcast.
    is_approval = Column(Boolean, nullable=False, default=False)

    created_at = Column(DateTime, server_default=func.now())


# ====================================
# NOTIFICATION CHANGE
# One row per changed field within a notification.
# ====================================

class NotificationChange(Base):

    __tablename__ = "notification_changes"

    id = Column(Integer, primary_key=True, index=True)

    notification_id = Column(
        Integer,
        ForeignKey("notifications.id", ondelete="CASCADE"),
        nullable=False
    )

    field_name = Column(String(150), nullable=False)
    previous_value = Column(Text)
    updated_value = Column(Text)


# ====================================
# NOTIFICATION READ
# Per-user read state - a row here means this user has seen this
# notification; absence means unread for that user.
# ====================================

class NotificationRead(Base):

    __tablename__ = "notification_reads"

    __table_args__ = (
        UniqueConstraint("notification_id", "user_id"),
    )

    id = Column(Integer, primary_key=True, index=True)

    notification_id = Column(
        Integer,
        ForeignKey("notifications.id", ondelete="CASCADE"),
        nullable=False
    )

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    read_at = Column(DateTime, server_default=func.now())
