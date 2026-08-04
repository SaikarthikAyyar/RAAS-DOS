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

from backend.services.customer_master_service import (

    resolve_or_create_customer,

    resolve_or_create_asset

)


# ====================================
# CREATE CUSTOMER REQUEST
# No duplicate-active-request guard - matches submitNewEnquiry() in
# the wireframe, which places no restriction on how many enquiries a
# customer (or asset) can have open at once.
# ====================================

status="REQUEST_CREATED"

def create_customer_request(

        db,

        payload

):

    customer_request = create_customer(

        db,

        payload

    )

    customer = resolve_or_create_customer(

        db,

        payload.customer_id,

        payload.company_name

    )

    asset = resolve_or_create_asset(

        db,

        customer.id,

        payload.asset_id,

        payload.division,

        payload.plant_site_location,

        payload.department,

        payload.asset_name,

        payload.asset_type,

        payload.cleaning_frequency

    )

    enquiry_payload = {

        # ====================================
        # WORKFLOW
        # ====================================

        "customer_request_id": customer_request.id,

        "status": customer_request.status,


        # ====================================
        # CUSTOMER
        # ====================================

        "company_name": customer_request.company_name,

        "contact_person": customer_request.contact_person,

        "client_contact_email": customer_request.client_contact_email,

        "plant_site_location": customer_request.plant_site_location,

        "nearest_city_hub": customer_request.nearest_city_hub,

        "division": customer_request.division,

        "department": customer_request.department,


        "client_contact_email": customer_request.client_contact_email,
        "lead_source": customer_request.lead_source,
        "division": customer_request.division,
        "department": customer_request.department,

        # ====================================
        # ASSET
        # ====================================

        "existing_asset": customer_request.existing_asset,

        "asset_name": customer_request.asset_name,

        "asset_type": customer_request.asset_type,


        # ====================================
        # JOB
        # ====================================

        "service_requirement_type": customer_request.service_requirement_type,

        "observed_material": customer_request.observed_material,

        "tank_type": customer_request.tank_type,

        "estimated_volume": customer_request.estimated_volume,

        "urgency": customer_request.urgency,

        "lead_source": customer_request.lead_source,

        "cleaning_date": (
            customer_request.cleaning_date.isoformat()
            if customer_request.cleaning_date
            else None
        )

    }

    print("\n========== ENQUIRY ==========")
    print("Creating Customer Request enquiry")
    print(enquiry_payload)

    EnquiryService.create_customer_request_enquiry(

        db=db,

        customer_request_id=customer_request.id,

        payload=enquiry_payload,

        customer_id=customer.id,

        asset_id=asset.id if asset else None,

        customer_name=customer.company_name,

        nature=payload.nature_of_job

    )

    print("Customer Request enquiry created")
    print("=============================\n")

    db.refresh(customer_request)

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

            customer.tank_type,


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