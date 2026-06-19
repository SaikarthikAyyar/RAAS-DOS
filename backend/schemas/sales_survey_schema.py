# ====================================
# IMPORTS
# ====================================

from pydantic import BaseModel

from typing import Optional


# ====================================
# SALES SURVEY INPUT SCHEMA
# ====================================

class SalesSurveySchema(BaseModel):

    customer_request_id: int

    job_type: str

    sludge_type: str

    volume: float

    output_target: str

    access_type: str

    vertical_lift: float

    hose_distance: float

    safety_notes: Optional[str] = None