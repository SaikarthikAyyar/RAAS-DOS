# ====================================
# IMPORTS
# ====================================

from backend.repositories.sales_survey_repository import (

    create_sales_survey

)

from backend.repositories.sales_survey_repository import (

    get_sales_survey_by_id,

    list_sales_surveys

)
from backend.services.status_service import update_customer_request_status

from backend.repositories.sales_survey_repository import (
    get_surveys_by_customer_request,
    get_sales_survey_by_customer_and_id
)

from backend.models.customer_requests import CustomerRequest

from backend.services.enquiry_service import EnquiryService



# ====================================
# CREATE SALES SURVEY
# ====================================

def create_sales_survey_request(

        db,

        payload

):

    survey = create_sales_survey(

        db,

        payload

    )

    print("\n========== SALES SURVEY WORKFLOW ==========")
    print("[Workflow] Survey Saved")
    print(f"[Workflow] Survey ID : {survey.id}")
    print("[Workflow] Looking for incoming SALES enquiry")

    incoming = EnquiryService.get_received_enquiries(

        db,

        "SALES"

    )

    for enquiry in incoming:

        if enquiry.customer_request_id == survey.customer_request_id:

            print(f"[Workflow] Completing Enquiry {enquiry.id}")

            enquiry.completed = True

            enquiry.workflow_status = "COMPLETED"

            EnquiryService.update(

                db,

                enquiry

            )

            print("[Workflow] Incoming enquiry completed")

            break

    
    print("[Workflow] Creating OPS enquiry")

    payload = {

        "customer_request_id":

            survey.customer_request_id,

        "sales_survey_id":

            survey.id

    }

    EnquiryService.create_sales_survey_enquiry(

        db,

        survey.customer_request_id,

        survey.id,

        payload

    )

    print("[Workflow] OPS enquiry created")

    update_customer_request_status(

        db,

        survey.customer_request_id,

        "SURVEY_COMPLETED"

    )

    print("[Workflow] Customer Request Status Updated")

    return survey


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

            customer.nearest_city_hub,

            "urgency":

            customer.urgency,

            "survey_date":

            survey.survey_date

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

            survey.cleaning_date,

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

            survey.sample_available

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

            survey.customer_support

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
            survey.power_distance

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

            survey.hose_route_bends

        },


        # ====================================
        # SECTION F
        # ====================================

        "dewatering":{


        },


        # ====================================
        # SECTION G
        # ====================================

        "insights":{

            "customer_pain":

            survey.customer_pain_point

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





