# ====================================
# IMPORTS
# ====================================

from typing import Optional

from datetime import datetime

from pydantic import BaseModel, ConfigDict

from backend.schemas.notification_schema import ActorSchema


class PurchaseOrderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    enquiry_id: int
    file_name: str
    po_number: Optional[str] = None
    po_value: Optional[float] = None
    uploaded_by: Optional[str] = None
    uploaded_at: Optional[datetime] = None


# ====================================
# DELETE - the route takes no body today (bare DELETE); this adds one
# so the delete can be attributed to a real actor for notifications,
# same "DELETE gets a body" precedent Phase 15 established for
# Business Masters deletes.
# ====================================

class PurchaseOrderDeleteSchema(BaseModel):

    actor: Optional[ActorSchema] = None
