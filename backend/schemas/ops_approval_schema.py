# ====================================
# IMPORTS
# ====================================

from pydantic import BaseModel

from typing import Optional


# ====================================
# OPS APPROVAL SCHEMA
# ====================================

class OpsApprovalSchema(BaseModel):

    # ====================================
    # REFERENCES
    # ====================================

    customer_request_id: int

    sales_survey_id: int


    # ====================================
    # APPROVAL
    # ====================================

    job_doable: bool

    approval_notes: Optional[str] = None

    approved_by: Optional[int] = None


    # ====================================
    # CONFIG
    # ====================================

    class Config:

        from_attributes = True