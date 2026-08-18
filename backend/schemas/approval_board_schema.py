# ====================================
# IMPORTS
# ====================================

from datetime import datetime

from pydantic import BaseModel

from backend.schemas.notification_schema import ActorSchema


# ====================================
# APPROVAL CARD
# ====================================

class ApprovalCardSchema(

    BaseModel

):

    quote_id: int

    customer: str

    summary: str

    quote_value: float

    flag: str


    class Config:

        from_attributes = True


# ====================================
# COMMERCIAL APPROVAL DECISION
# ====================================

class CommercialApprovalDecisionSchema(BaseModel):

    # Phase 22: no typed "your name" field anymore - identity comes
    # purely from actor (the logged-in user).
    note: str

    final_approved_value: float | None = None

    enquiry_id: int | None = None

    actor: ActorSchema | None = None


class ApprovalHistoryRowSchema(BaseModel):

    id: int

    quote_id: int

    approval_status: str | None = None

    approved_by: str | None = None

    approval_date: datetime | None = None

    note: str | None = None

    class Config:

        from_attributes = True