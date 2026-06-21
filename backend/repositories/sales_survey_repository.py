# ====================================
# IMPORTS
# ====================================

import logging

from backend.models.sales_survey import SalesSurvey


# ====================================
# LOGGER
# ====================================

logger = logging.getLogger(__name__)


# ====================================
# CREATE SALES SURVEY
# ====================================

def create_sales_survey(

        db,

        payload

):

    logger.warning(

        f"Creating Sales Survey for Customer Request ID: {payload.customer_request_id}"

    )


    survey = SalesSurvey(


        # ====================================
        # CUSTOMER CONNECTION
        # ====================================

        customer_request_id=

        payload.customer_request_id,


        # ====================================
        # SECTION A
        # ====================================

        survey_date=

        payload.survey_date,


        # ====================================
        # SECTION B
        # ====================================

        material_category=

        payload.material_category,


        consistency=

        payload.consistency,


        bulk_density=

        payload.bulk_density,


        hazard_level=

        payload.hazard_level,


        estimated_volume=

        payload.estimated_volume,


        # ====================================
        # SECTION C
        # ====================================

        opening_length=

        payload.opening_length,


        opening_width=

        payload.opening_width,


        height_from_ground=

        payload.height_from_ground,


        drop_to_floor=

        payload.drop_to_floor,


        setup_distance=

        payload.setup_distance,


        vertical_lift=

        payload.vertical_lift,


        hose_distance=

        payload.hose_distance,


        access_path_width=

        payload.access_path_width,


        scaffolding_needed=

        payload.scaffolding_needed=="Yes",


        crane_available=

        payload.crane_available=="Yes",


        # ====================================
        # SECTION D
        # ====================================

        power_available=

        payload.power_available,


        water_available=

        payload.water_available=="Yes",


        confined_space=

        payload.confined_space=="Yes",


        ventilation_required=

        payload.ventilation_required=="Yes",


        gas_testing_required=

        payload.gas_testing_required=="Yes",


        ehs_restriction=

        payload.ehs_restriction,


        # ====================================
        # SECTION G
        # ====================================

        customer_pain_point=

        payload.customer_pain_point,


        # ====================================
        # STATUS
        # ====================================

        status=

        "SURVEY_COMPLETED"

    )


    db.add(

        survey

    )


    db.commit()


    db.refresh(

        survey

    )


    return survey