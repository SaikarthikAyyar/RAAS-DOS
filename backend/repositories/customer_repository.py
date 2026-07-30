# ====================================
# IMPORTS
# ====================================

from backend.models.customer_requests import CustomerRequest


# ====================================
# CREATE CUSTOMER
# ====================================

def create_customer(

        db,

        payload

):

    customer = CustomerRequest(

        company_name=

        payload.company_name,

        plant_site_location=

        payload.plant_site_location,

        contact_person=

        payload.contact_person,

        contact_number=

        payload.contact_number,

        nearest_city_hub=

        payload.nearest_city_hub,

        urgency=

        payload.urgency,

        existing_asset=
        payload.existing_asset,

        lead_source=
        payload.lead_source,

        client_contact_email=
        payload.client_contact_email,

        estimated_volume=
        payload.estimated_volume,

        division=
        payload.division,

        department=
        payload.department,

        asset_name=
        payload.asset_name,

        asset_type=
        payload.asset_type,

        service_requirement_type=

        payload.service_requirement_type,

        observed_material=

        payload.observed_material,

        estimated_quantity_known=

        payload.estimated_quantity_known,

        tank_type=
        payload.tank_type,

        approx_length_dia=

        payload.approx_length_dia,

        approx_width=

        payload.approx_width,

        approx_depth=

        payload.approx_depth,


        access_opening_type=

        payload.access_opening_type,

        can_place_equipment_nearby=

        payload.can_place_equipment_nearby,


        quote_basis=

        payload.quote_basis,

        pain_point=

        payload.pain_point,


        photo_count=

        payload.photo_count,

        video_count=

        payload.video_count,

        layout_count=

        payload.layout_count,

        cleaning_date=payload.cleaning_date,

        cleaning_frequency=payload.cleaning_frequency,


        status=

        payload.status

        

    )


    db.add(

        customer

    )


    db.commit()


    db.refresh(

        customer

    )


    return customer

# ====================================
# GET CUSTOMERS
# ====================================

def get_customers(

        db

):

    return db.query(

        CustomerRequest

    ).all()


# ====================================
# GET CUSTOMER
# ====================================

def get_customer(

        db,

        customer_request_id

):

    return (

        db.query(

            CustomerRequest

        )

        .filter(

            CustomerRequest.id ==

            customer_request_id

        )

        .first()

    )