# ====================================
# IMPORTS
# ====================================

from backend.repositories.sales_survey_repository import (

    create_sales_survey,

    update_sales_survey

)

from backend.repositories.sales_survey_repository import (

    get_sales_survey_by_id,

    list_sales_surveys

)


from backend.repositories.sales_survey_repository import (
    get_surveys_by_customer_request,
    get_sales_survey_by_customer_and_id
)

from backend.models.customer_requests import CustomerRequest

from backend.services.enquiry_consolidated_service import (
    update_module_reference
)





# ====================================
# CREATE SALES SURVEY
# ====================================

def create_sales_survey_request(

        db,

        payload

):

    if payload.sales_survey_id:

        print("[Workflow] Updating Existing Survey")

        return update_sales_survey(

            db,

            payload.sales_survey_id,

            payload

        )

    print("[Workflow] Creating New Survey")

    return create_sales_survey(

        db,

        payload

    )


# ====================================
# GET SALES SURVEY
# ====================================

def get_sales_survey_request(

        db,

        sales_survey_id

):

    return get_sales_survey_by_id(

        db,

        sales_survey_id

    )


# ====================================
# GET CUSTOMER SURVEY
# ====================================

def get_customer_survey_request(

        db,

        customer_request_id,

        sales_survey_id

):

    print("\n========== SALES SURVEY SERVICE ==========")

    print(f"[Service] Loading Survey : {sales_survey_id}")


    survey = get_sales_survey_by_customer_and_id(

        db,

        customer_request_id,

        sales_survey_id

    )


    if not survey:

        print("[Service] Survey Not Found")

        return None


    customer = (

        db.query(

            CustomerRequest

        )

        .filter(

            CustomerRequest.id == customer_request_id

        )

        .first()

    )


    print(

        f"[Service] Customer Loaded : {customer.company_name}"

    )


    response = {


        "id":

        survey.id,


        # ====================================
        # SECTION A
        # ====================================

        "customer":{

            "company_name":

            customer.company_name,

            "plant_site_location":

            survey.plant_site_location
            or
            customer.plant_site_location,

            "contact_person":

            customer.contact_person,

            "contact_number":

            customer.contact_number,

            "nearest_hub":

            survey.nearest_hub
            or
            customer.nearest_city_hub,

            "urgency":

            survey.urgency
            or
            customer.urgency,

            "survey_date":

            survey.survey_date.isoformat()
            if survey.survey_date
            else None,

            "surveyed_by":

            survey.surveyed_by,

            "survey_trigger":

            survey.survey_trigger,

            "repeat_potential":

            survey.repeat_potential,

            "tentative_start_date":

            survey.tentative_start_date.isoformat()
            if survey.tentative_start_date
            else None,

            "tentative_end_date":

            survey.tentative_end_date.isoformat()
            if survey.tentative_end_date
            else None,

        },


        # ====================================
        # SECTION B
        # ====================================

        "job":{

            "job_type":

            survey.job_type,

            "material_category":

            survey.material_category,

            "cleaning_date":

            survey.cleaning_date.isoformat()
            if survey.cleaning_date
            else None,

            "cleaning_frequency":

            survey.cleaning_frequency,

            "sludge_hardness":

            survey.sludge_hardness,

            "debris_level":

            survey.debris_level,

            "water_visibility":

            survey.water_visibility,

            "bulk_density":

            survey.bulk_density,

            "pumpable":

            survey.pumpable,

            "large_object_type":

            survey.large_object_type,

            "hazard_level":

            survey.hazard_level,

            "ph_min":

            survey.ph_min,

            "ph_max":

            survey.ph_max,

            "flow_after_agitation":

            survey.flow_after_agitation,

            "temperature_range":

            survey.temperature_range,

            "sample_available":

            survey.sample_available,

            "abrasiveness":

            survey.abrasiveness,

            "permit_required":

            "Yes" if survey.permit_required else "No",

            "flowability":

            survey.flowability

        },


        # ====================================
        # SECTION C
        # ====================================

        "geometry":{

            "tank_type":

            survey.tank_type,

            "length_dia":

            survey.tank_length,

            "width":

            survey.tank_width,

            "sludge_depth":

            survey.tank_depth,

            "estimated_volume":

            survey.estimated_volume,

            "average_output":

            survey.average_output,

            "opening_length":

            survey.opening_length,

            "opening_width":

            survey.opening_width,

            "height_from_ground":

            survey.height_from_ground,

            "drop_to_floor":

            survey.drop_to_floor,

            "setup_distance":

            survey.setup_distance,

            "vertical_lift":

            survey.vertical_lift,

            "hose_distance":

            survey.hose_distance,

            "access_path_width":

            survey.access_path_width,

            "access_support":

            survey.access_support,

            "customer_support":

            survey.customer_support,

            "access_type":

            survey.access_type,

            "equipment_nearby":

            survey.equipment_nearby,

            "scaffolding_needed":

            "Yes" if survey.scaffolding_needed else "No",

            "crane_available":

            "Yes" if survey.crane_available else "No",

            "opening_height":

            survey.opening_height,

            "tank_location":

            survey.tank_location,

            "setup_complexity":

            survey.setup_complexity

        },


        # ====================================
        # SECTION D
        # ====================================

        "safety":{

            "power_available":

            survey.power_available,

            "water_available":

            "Yes" if survey.water_available else "No",

            "air_supply_available":

            survey.air_supply_available,

            "confined_space":

            "Yes" if survey.confined_space else "No",

            "ventilation_required":

            "Yes" if survey.ventilation_required else "No",

            "gas_testing_required":

            "Yes" if survey.gas_testing_required else "No",

            "ehs_restriction":

            survey.ehs_restriction,

            "power_distance":

            survey.power_distance,

        },


        # ====================================
        # SECTION E
        # ====================================

        "pump":{

            "discharge_pit_dimension":

            survey.discharge_pit_dimension,

            "discharge_medium":

            survey.discharge_medium,

            "disposal_route":

            survey.disposal_route,

            "disposal_responsibility":

            survey.disposal_responsibility,

            "discharge_point_distance":

            survey.discharge_point_distance,

            "hose_route_bends":

            survey.hose_route_bends,

            "target_flow":

            survey.target_flow,

            "suction_depth":

            survey.suction_depth,

            "discharge_distance":

            survey.discharge_distance,

            "discharge_height":

            survey.discharge_height,

            "debris_present":

            "Yes" if survey.debris_present else "No",

            "ph_condition":

            survey.ph_condition,

            "pump_power_source":

            survey.pump_power_source,

            "pump_risk":

            survey.pump_risk,

            "effective_work_hours":

            survey.effective_work_hours

        },


        # ====================================
        # SECTION F
        # ====================================

        "dewatering":{

            "dewatering_required":

            survey.dewatering_required,

            "dewatering_volume":

            survey.dewatering_volume,

            "inlet_moisture":

            survey.inlet_moisture,

            "target_final_moisture":

            survey.target_final_moisture,

            "expected_final_form":

            survey.expected_final_form,

            "visible_free_water":

            survey.visible_free_water,

            "natural_settling":

            survey.natural_settling,

            "oily_emulsified":

            "Yes" if survey.oily_emulsified else "No",

            "space_available":

            survey.space_available,

            "filtrate_route":

            "Yes" if survey.filtrate_route else "No",

            "moisture_guarantee":

            "Yes" if survey.moisture_guarantee else "No",

            "cake_handling_scope":

            survey.cake_handling_scope,

            "filtrate_route_detail":

            survey.filtrate_route_detail,

            "polymer_allowed":

            survey.polymer_allowed,

            "commitment":

            survey.commitment

        },


        # ====================================
        # SECTION G
        # ====================================

        "insights":{

            "customer_pain":

            survey.customer_pain_point,

            "shutdown_window":

            survey.shutdown_window,

            "completion_deadline":

            survey.completion_deadline.isoformat()
            if survey.completion_deadline
            else None,

            "current_method":

            survey.current_method,

            "budget_known":

            "Yes" if survey.budget_known else "No",

            "budget_estimate":

            survey.budget_estimate,

            "decision_maker":

            survey.decision_maker,

            "billing_address":

            survey.billing_address

        }

    }


    print(

        "[Service] Survey Response Constructed"

    )


    return response



# ====================================
# LIST SALES SURVEYS
# ====================================

def list_sales_surveys_request(

        db

):

    return list_sales_surveys(

        db

    )


# ====================================
# LIST CUSTOMER SURVEYS
# ====================================

def list_customer_surveys_request(
        db,
        customer_request_id
):

    print("\n========== SALES SURVEY SERVICE ==========")
    print(f"[Service] Loading Surveys for Customer: {customer_request_id}")

    return get_surveys_by_customer_request(
        db,
        customer_request_id
    )





