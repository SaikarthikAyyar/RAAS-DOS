# ====================================
# IMPORTS
# ====================================

import logging

from backend.models.sales_survey import SalesSurvey

from backend.models.customer_requests import CustomerRequest


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

        plant_site_location=

        payload.plant_site_location,


        # ====================================
        # SECTION B
        # ====================================

        


        material_category=

        payload.material_category,





        bulk_density=

        payload.bulk_density,


        hazard_level=

        payload.hazard_level,

        cleaning_date=

        payload.cleaning_date,


        cleaning_frequency=

        payload.cleaning_frequency,


        sludge_hardness=

        payload.sludge_hardness,


        debris_level=

        payload.debris_level,


        water_visibility=

        payload.water_visibility,

        pumpable=
        payload.pumpable,

        large_object_type=
        payload.large_object_type,

        ph_min=
        payload.ph_min,

        ph_max=
        payload.ph_max,

        flow_after_agitation=
        payload.flow_after_agitation,


        estimated_volume=

        payload.estimated_volume,

        average_output=

        payload.average_output,

        temperature_range=

        payload.temperature_range,

        sample_available=
        payload.sample_available,


        # ====================================
        # SECTION C
        # ====================================

        job_type=payload.job_type,

        tank_type=payload.tank_type,

        tank_length=payload.tank_length,

        tank_width=payload.tank_width,

        tank_depth=payload.tank_depth,


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

        access_support=
        payload.access_support,

        customer_support=
        payload.customer_support,


        # ====================================
        # SECTION D
        # ====================================

        power_available=

        payload.power_available,


        water_available=

        payload.water_available=="Yes",

        air_supply_available=
        payload.air_supply_available,


        confined_space=

        payload.confined_space=="Yes",


        ventilation_required=

        payload.ventilation_required=="Yes",


        gas_testing_required=

        payload.gas_testing_required=="Yes",


        ehs_restriction=

        payload.ehs_restriction,

        # ====================================
        # SECTION E
        # ====================================        

        discharge_pit_dimension=

        payload.discharge_pit_dimension,

        discharge_medium=
        payload.discharge_medium,

        disposal_route=
        payload.disposal_route,

        disposal_responsibility=
        payload.disposal_responsibility,

        discharge_point_distance=
        payload.discharge_point_distance,

        hose_route_bends=
        payload.hose_route_bends,


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


# ====================================
# GET SALES SURVEY
# ====================================

def get_sales_survey_by_id(

        db,

        sales_survey_id

):

    return (

        db.query(

            SalesSurvey

        )

        .filter(

            SalesSurvey.id ==

            sales_survey_id

        )

        .first()

    )


# ====================================
# LIST SALES SURVEYS
# ====================================

def list_sales_surveys(

        db

):

    surveys = (

        db.query(

            SalesSurvey,

            CustomerRequest

        )

        .join(

            CustomerRequest,

            SalesSurvey.customer_request_id ==

            CustomerRequest.id

        )

        .all()

    )


    return [

        {

            "id":

                survey.id,

            "customer_request_id":

                survey.customer_request_id,

            "company_name":

                customer.company_name,

            "plant_site_location":

                survey.plant_site_location

        }

        for survey,

        customer

        in surveys

    ]


