# ====================================
# IMPORTS
# ====================================

from pydantic import BaseModel


# ====================================
# DEWATERING INPUT SCHEMA
# ====================================

class DewateringSchema(BaseModel):

    ops_selection_id: int

    particle_size_fines_behavior: str

    bulk_density: float

    flocculation_response: str

    ph_corrosiveness: float

    abrasiveness: str

    target_final_moisture_pct: float

    cake_handling_scope: str

    compliance_filtrate_restriction: str

    review_owner: str