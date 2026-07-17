# ====================================
# IMPORTS
# ====================================

from backend.repositories.customer_repository import (

    create_customer,
    get_customers

)

from backend.models.customer_requests import (

    CustomerRequest

)

from backend.services.enquiry_service import EnquiryService

from fastapi import HTTPException


# ====================================
# CREATE CUSTOMER REQUEST
# ====================================

status="REQUEST_CREATED"

def create_customer_request(

        db,

        payload

):

    existing = (

        db.query(

            CustomerRequest

        ).filter(

            CustomerRequest.company_name == payload.company_name,

            CustomerRequest.status != "COMPLETED"

        ).first()

    )

    if existing:

        raise HTTPException(

            status_code=409,

            detail={

                "message": "An active Customer Request already exists.",

                "customer_request_id": existing.id,

                "company_name": existing.company_name,

                "status": existing.status

            }

        )

    customer_request = create_customer(

        db,

        payload

    )

    enquiry_payload = {

        "customer_request_id": customer_request.id,

        "company_name": customer_request.company_name,

        "contact_person": customer_request.contact_person,

        "cleaning_date": (
            customer_request.cleaning_date.isoformat()
            if customer_request.cleaning_date
            else None
        ),

        "plant_site_location": customer_request.plant_site_location,

        "status": customer_request.status

    }

    print("\n========== ENQUIRY ==========")
    print("Creating Customer Request enquiry")
    print(enquiry_payload)

    EnquiryService.create_customer_request_enquiry(

        db=db,

        customer_request_id=customer_request.id,

        payload=enquiry_payload

    )

    print("Customer Request enquiry created")
    print("=============================\n")

    return customer_request


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


            "plant_site_location":

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

            customer.observed_material,

            "cleaning_date":

            customer.cleaning_date,

            "cleaning_frequency":

            customer.cleaning_frequency

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

# ====================================
# SEARCH CUSTOMER
# ====================================

def search_customer(

        db,

        company_name

):

    customer = (

        db.query(

            CustomerRequest

        ).filter(

            CustomerRequest.company_name.ilike(company_name)

        ).first()

    )

    if not customer:

        return None

    return {

        "customer_request_id": customer.id,

        "company_name": customer.company_name,

        "status": customer.status

    }

# ====================================
# GET CUSTOMERS
# ====================================

def get_customers_service(

        db

):

    return get_customers(

        db

    )