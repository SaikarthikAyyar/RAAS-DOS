# ====================================
# IMPORTS
# ====================================

from typing import Optional

from pydantic import BaseModel


# ====================================
# QUEUE ROW
# One shape shared by all 4 Reviews & Approvals queues - "metric" is
# whatever's most relevant per gate (aging days, quote range, or a
# short status phrase).
# ====================================

class ReviewQueueRow(BaseModel):

    enquiry_id: int
    customer_name: Optional[str] = None
    hub: Optional[str] = None
    owner: Optional[str] = None
    metric: Optional[str] = None
