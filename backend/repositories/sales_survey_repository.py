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

        nearest_hub=payload.nearest_hub,

        urgency=payload.urgency,

        surveyed_by=payload.surveyed_by,

        survey_trigger=payload.survey_trigger,

        repeat_potential=payload.repeat_potential,

        tentative_start_date=payload.tentative_start_date,

        tentative_end_date=payload.tentative_end_date,


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

        material_ph_condition=
        payload.material_ph_condition,

        flow_after_agitation=
        payload.flow_after_agitation,


        estimated_volume=

        payload.estimated_volume,

        sludge_volume=

        payload.sludge_volume,

        average_output=

        payload.average_output,

        temperature_range=

        payload.temperature_range,

        sample_available=
        payload.sample_available,

        abrasiveness=
        payload.abrasiveness,

        permit_required=
        payload.permit_required=="Yes",

        flowability=
        payload.flowability,


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

        opening_height=
        payload.opening_height,

        access_type=
        payload.access_type,

        equipment_nearby=
        payload.equipment_nearby,

        tank_location=
        payload.tank_location,

        setup_complexity=
        payload.setup_complexity,


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

        power_distance=
        payload.power_distance,

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

        target_flow=
        payload.target_flow,

        suction_depth=
        payload.suction_depth,

        discharge_distance=
        payload.discharge_distance,

        discharge_height=
        payload.discharge_height,

        debris_present=
        payload.debris_present=="Yes",

        ph_condition=
        payload.ph_condition,

        pump_power_source=
        payload.pump_power_source,

        pump_risk=
        payload.pump_risk,

        effective_work_hours=
        payload.effective_work_hours,


        # ====================================
        # SECTION F
        # ====================================

        dewatering_required=
        payload.dewatering_required,

        dewatering_volume=
        payload.dewatering_volume,

        inlet_moisture=
        payload.inlet_moisture,

        target_final_moisture=
        payload.target_final_moisture,

        expected_final_form=
        payload.expected_final_form,

        visible_free_water=
        payload.visible_free_water,

        natural_settling=
        payload.natural_settling,

        oily_emulsified=
        payload.oily_emulsified=="Yes",

        space_available=
        payload.space_available,

        filtrate_route=
        payload.filtrate_route=="Yes",

        moisture_guarantee=
        payload.moisture_guarantee=="Yes",

        cake_handling_scope=
        payload.cake_handling_scope,

        filtrate_route_detail=
        payload.filtrate_route_detail,

        polymer_allowed=
        payload.polymer_allowed,

        commitment=
        payload.commitment,


        # ====================================
        # SECTION G
        # ====================================

        customer_pain_point=

        payload.customer_pain_point,

        shutdown_window=
        payload.shutdown_window,

        completion_deadline=
        payload.completion_deadline,

        current_method=
        payload.current_method,

        budget_known=
        payload.budget_known=="Yes",

        budget_estimate=
        payload.budget_estimate,

        decision_maker=
        payload.decision_maker,

        billing_address=
        payload.billing_address,


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
# UPDATE SALES SURVEY
# ====================================

def update_sales_survey(

        db,

        sales_survey_id,

        payload

):

    survey = (

        db.query(

            SalesSurvey

        )

        .filter(

            SalesSurvey.id == sales_survey_id

        )

        .first()

    )

    if not survey:

        return None

    # ====================================
    # SECTION A
    # ====================================

    survey.survey_date = payload.survey_date

    survey.plant_site_location = payload.plant_site_location

    survey.nearest_hub = payload.nearest_hub

    survey.urgency = payload.urgency

    survey.surveyed_by = payload.surveyed_by

    survey.survey_trigger = payload.survey_trigger

    survey.repeat_potential = payload.repeat_potential

    survey.tentative_start_date = payload.tentative_start_date

    survey.tentative_end_date = payload.tentative_end_date


    # ====================================
    # SECTION B
    # ====================================

    survey.material_category = payload.material_category

    survey.bulk_density = payload.bulk_density

    survey.hazard_level = payload.hazard_level

    survey.cleaning_date = payload.cleaning_date

    survey.cleaning_frequency = payload.cleaning_frequency

    survey.sludge_hardness = payload.sludge_hardness

    survey.debris_level = payload.debris_level

    survey.water_visibility = payload.water_visibility

    survey.pumpable = payload.pumpable

    survey.large_object_type = payload.large_object_type

    survey.ph_min = payload.ph_min

    survey.ph_max = payload.ph_max

    survey.material_ph_condition = payload.material_ph_condition

    survey.flow_after_agitation = payload.flow_after_agitation

    survey.estimated_volume = payload.estimated_volume

    survey.sludge_volume = payload.sludge_volume

    survey.average_output = payload.average_output

    survey.temperature_range = payload.temperature_range

    survey.sample_available = payload.sample_available

    survey.abrasiveness = payload.abrasiveness

    survey.permit_required = payload.permit_required == "Yes"

    survey.flowability = payload.flowability


    # ====================================
    # SECTION C
    # ====================================

    survey.job_type = payload.job_type

    survey.tank_type = payload.tank_type

    survey.tank_length = payload.tank_length

    survey.tank_width = payload.tank_width

    survey.tank_depth = payload.tank_depth

    survey.opening_length = payload.opening_length

    survey.opening_width = payload.opening_width

    survey.height_from_ground = payload.height_from_ground

    survey.drop_to_floor = payload.drop_to_floor

    survey.setup_distance = payload.setup_distance

    survey.vertical_lift = payload.vertical_lift

    survey.hose_distance = payload.hose_distance

    survey.access_path_width = payload.access_path_width

    survey.scaffolding_needed = payload.scaffolding_needed == "Yes"

    survey.crane_available = payload.crane_available == "Yes"

    survey.access_support = payload.access_support

    survey.customer_support = payload.customer_support

    survey.opening_height = payload.opening_height

    survey.access_type = payload.access_type

    survey.equipment_nearby = payload.equipment_nearby

    survey.tank_location = payload.tank_location

    survey.setup_complexity = payload.setup_complexity


    # ====================================
    # SECTION D
    # ====================================

    survey.power_available = payload.power_available

    survey.water_available = payload.water_available == "Yes"

    survey.air_supply_available = payload.air_supply_available

    survey.confined_space = payload.confined_space == "Yes"

    survey.ventilation_required = payload.ventilation_required == "Yes"

    survey.gas_testing_required = payload.gas_testing_required == "Yes"

    survey.ehs_restriction = payload.ehs_restriction

    survey.power_distance = payload.power_distance


    # ====================================
    # SECTION E
    # ====================================

    survey.discharge_pit_dimension = payload.discharge_pit_dimension

    survey.discharge_medium = payload.discharge_medium

    survey.disposal_route = payload.disposal_route

    survey.disposal_responsibility = payload.disposal_responsibility

    survey.discharge_point_distance = payload.discharge_point_distance

    survey.hose_route_bends = payload.hose_route_bends

    survey.target_flow = payload.target_flow

    survey.suction_depth = payload.suction_depth

    survey.discharge_distance = payload.discharge_distance

    survey.discharge_height = payload.discharge_height

    survey.debris_present = payload.debris_present == "Yes"

    survey.ph_condition = payload.ph_condition

    survey.pump_power_source = payload.pump_power_source

    survey.pump_risk = payload.pump_risk

    survey.effective_work_hours = payload.effective_work_hours


    # ====================================
    # SECTION F
    # ====================================

    survey.dewatering_required = payload.dewatering_required

    survey.dewatering_volume = payload.dewatering_volume

    survey.inlet_moisture = payload.inlet_moisture

    survey.target_final_moisture = payload.target_final_moisture

    survey.expected_final_form = payload.expected_final_form

    survey.visible_free_water = payload.visible_free_water

    survey.natural_settling = payload.natural_settling

    survey.oily_emulsified = payload.oily_emulsified == "Yes"

    survey.space_available = payload.space_available

    survey.filtrate_route = payload.filtrate_route == "Yes"

    survey.moisture_guarantee = payload.moisture_guarantee == "Yes"

    survey.cake_handling_scope = payload.cake_handling_scope

    survey.filtrate_route_detail = payload.filtrate_route_detail

    survey.polymer_allowed = payload.polymer_allowed

    survey.commitment = payload.commitment


    # ====================================
    # SECTION G
    # ====================================

    survey.customer_pain_point = payload.customer_pain_point

    survey.shutdown_window = payload.shutdown_window

    survey.completion_deadline = payload.completion_deadline

    survey.current_method = payload.current_method

    survey.budget_known = payload.budget_known == "Yes"

    survey.budget_estimate = payload.budget_estimate

    survey.decision_maker = payload.decision_maker

    survey.billing_address = payload.billing_address


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

# ====================================
# GET SURVEYS BY CUSTOMER REQUEST
# ====================================

def get_surveys_by_customer_request(
        db,
        customer_request_id
):

    print("\n========== SALES SURVEY REPOSITORY ==========")
    print(f"[Repository] Loading surveys for Customer Request: {customer_request_id}")

    surveys = (
        db.query(SalesSurvey)
        .filter(
            SalesSurvey.customer_request_id == customer_request_id
        )
        .order_by(SalesSurvey.id.asc())
        .all()
    )

    print(f"[Repository] Surveys Found: {len(surveys)}")

    return [
        {
            "id": survey.id,
            "status": survey.status
        }
        for survey in surveys
    ]


# ====================================
# GET SURVEY BY CUSTOMER + SURVEY
# ====================================

def get_sales_survey_by_customer_and_id(
        db,
        customer_request_id,
        sales_survey_id
):

    print("\n========== SALES SURVEY REPOSITORY ==========")
    print(f"[Repository] Customer Request : {customer_request_id}")
    print(f"[Repository] Survey ID        : {sales_survey_id}")

    survey = (
        db.query(SalesSurvey)
        .filter(
            SalesSurvey.customer_request_id == customer_request_id,
            SalesSurvey.id == sales_survey_id
        )
        .first()
    )

    if survey:
        print("[Repository] Survey Found")
    else:
        print("[Repository] Survey Not Found")

    return survey
