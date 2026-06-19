# ====================================
# IMPORTS
# ====================================

from pydantic import BaseModel


# ====================================
# APPROVAL SCHEMA
# ====================================

class ApprovalSchema(

    BaseModel

):


    quote_id: int


    approval_decision: bool


    approved_by: str