# ====================================
# IMPORTS
# ====================================

from typing import Optional

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PurchaseOrderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    enquiry_id: int
    file_name: str
    po_number: Optional[str] = None
    po_value: Optional[float] = None
    uploaded_by: Optional[str] = None
    uploaded_at: Optional[datetime] = None
