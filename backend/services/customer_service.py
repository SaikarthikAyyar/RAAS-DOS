# ====================================
# IMPORTS
# ====================================

from backend.repositories.customer_repository import (

    create_customer

)

from backend.models.customer_requests import (

    CustomerRequest

)


# ====================================
# CREATE CUSTOMER REQUEST
# ====================================

def create_customer_request(

        db,

        payload

):

    return create_customer(

        db,

        payload

    )


# ====================================
# SALES SURVEY PREFILL
# ====================================

def get_sales_prefill(

        db,

        customer_request_id

):


    customer = db.query(

        CustomerRequest

    ).filter(

        CustomerRequest.id == customer_request_id

    ).first()


    # ====================================
    # CUSTOMER DOES NOT EXIST
    # ====================================

    if not customer:

        return {

            "customer": {},

            "job": {},

            "geometry": {},

            "pump": {},

            "dewatering": {},

            "insights": {}

        }


    # ====================================
    # RETURN SALES SURVEY STRUCTURE
    # ====================================

    return {


        # ====================================
        # SECTION A
        # ====================================

        "customer": {

            "company_name":

            customer.company_name,


            "site_address":

            customer.plant_site_location,


            "contact_person":

            customer.contact_person,


            "contact_number":

            customer.contact_number,


            "nearest_hub":

            customer.nearest_city_hub,


            "urgency":

            customer.urgency

        },


        # ====================================
        # SECTION B
        # ====================================

        "job": {

            "job_type":

            customer.service_requirement_type,


            "material_category":

            customer.observed_material

        },


        # ====================================
        # SECTION C
        # ====================================

        "geometry": {

            "tank_type":

            None,


            "length_dia":

            customer.approx_length_dia,


            "width":

            customer.approx_width,


            "sludge_depth":

            customer.approx_depth,


            "access_type":

            customer.access_opening_type,


            "equipment_nearby":

            (

                "Yes"

                if customer.can_place_equipment_nearby

                else

                "No"

            )

        },


        # ====================================
        # SECTION E
        # ====================================

        "pump": {},


        # ====================================
        # SECTION F
        # ====================================

        "dewatering": {},


        # ====================================
        # SECTION G
        # ====================================

        "insights": {

            "customer_pain":

            customer.pain_point

        }

    }

# ====================================
# GET ALL CUSTOMERS
# ====================================

def get_all_customers(

        db

):

    customers = db.query(

        CustomerRequest

    ).order_by(

        CustomerRequest.id.desc()

    ).all()


    return [

        {

            "id":

            customer.id,


            "company_name":

            customer.company_name

        }

        for customer in customers

    ]