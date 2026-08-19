# ====================================
# IMPORTS
# ====================================

from datetime import datetime

from pydantic import BaseModel


# ====================================
# CHANGE ROW
# ====================================

class NotificationChangeSchema(BaseModel):

    field_name: str
    previous_value: str | None = None
    updated_value: str | None = None

    class Config:
        from_attributes = True


# ====================================
# NOTIFICATION
# ====================================

class NotificationSchema(BaseModel):

    id: int
    title: str
    module: str
    action: str

    user_id: int | None = None
    user_name: str
    user_role: str

    enquiry_id: int | None = None
    customer_name: str | None = None

    created_at: datetime
    is_read: bool = False

    is_important: bool = False
    remark: str | None = None
    is_approval: bool = False

    changes: list[NotificationChangeSchema] = []

    class Config:
        from_attributes = True


# ====================================
# MARK ALL READ REQUEST
# ====================================

class MarkAllReadSchema(BaseModel):

    user_id: int


# ====================================
# ACTOR
# Shared by any instrumented mutation's request payload - the acting
# user, sourced from the frontend's AuthContext (there is no server-
# side auth to derive this from, see Phase 9 plan). Optional so
# existing callers that don't pass one yet keep working; record_change()
# just doesn't fire if it's missing.
# ====================================

class ActorSchema(BaseModel):

    user_id: int
    name: str
    role: str


# ====================================
# BUSINESS MASTER ACTION
# Shared request-body shape for the ~7 Business Masters DELETE
# endpoints, which take no body today - actor + remark are the only
# two things a delete needs beyond the path param.
# ====================================

class BusinessMasterActionSchema(BaseModel):

    actor: ActorSchema
    remark: str
