# ====================================
# IMPORTS
# ====================================

from pydantic import BaseModel

from typing import Optional


# ====================================
# SALES SURVEY SCHEMA
# ====================================

class SalesSurveySchema(BaseModel):


    # ====================================
    # CONNECTION
    # ====================================

    customer_request_id:int


    # ====================================
    # SECTION A
    # ====================================

    survey_date:Optional[str]=None


    # ====================================
    # SECTION B
    # ====================================

    material_category:Optional[str]=None

    consistency:Optional[str]=None

    bulk_density:Optional[float]=None

    hazard_level:Optional[str]=None


    # ====================================
    # SECTION C
    # ====================================

    estimated_volume:Optional[float]=None

    opening_length:Optional[float]=None

    opening_width:Optional[float]=None

    height_from_ground:Optional[float]=None

    drop_to_floor:Optional[float]=None

    setup_distance:Optional[float]=None

    vertical_lift:Optional[float]=None

    hose_distance:Optional[float]=None

    access_path_width:Optional[float]=None

    scaffolding_needed:Optional[str]=None

    crane_available:Optional[str]=None


    # ====================================
    # SECTION D
    # ====================================

    power_available:Optional[str]=None

    water_available:Optional[str]=None

    confined_space:Optional[str]=None

    ventilation_required:Optional[str]=None

    gas_testing_required:Optional[str]=None

    ehs_restriction:Optional[str]=None

    power_distance:Optional[float]=None


    # ====================================
    # SECTION G
    # ====================================

    customer_pain_point:Optional[str]=None


    # ====================================
    # STATUS
    # ====================================

    status:Optional[str]="SURVEY_COMPLETED"