# ====================================
# IMPORTS
# ====================================

from pydantic import BaseModel


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