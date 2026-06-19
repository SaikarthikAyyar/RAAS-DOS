# ====================================
# IMPORTS
# ====================================

from pydantic import BaseModel


# ====================================
# QUOTE SCHEMA
# ====================================

class QuoteSchema(

    BaseModel

):

    customer_id: int

    ops_selection_id: int

    dewatering_assessment_id: int