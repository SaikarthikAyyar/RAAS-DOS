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

        nature_of_job=payload.nature_of_job,


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
# UPDATE CUSTOMER REQUEST
# Mirrors create_customer field-for-field, applied to an existing row
# instead of a new one - lets the Customer Request Edit page reuse the
# exact same payload shape the create flow already sends.
# ====================================

def update_customer_request(

        db,

        customer,

        payload

):

    customer.company_name = payload.company_name
    customer.plant_site_location = payload.plant_site_location
    customer.contact_person = payload.contact_person
    customer.contact_number = payload.contact_number
    customer.nearest_city_hub = payload.nearest_city_hub
    customer.urgency = payload.urgency
    customer.existing_asset = payload.existing_asset
    customer.lead_source = payload.lead_source
    customer.client_contact_email = payload.client_contact_email
    customer.estimated_volume = payload.estimated_volume
    customer.division = payload.division
    customer.department = payload.department
    customer.asset_name = payload.asset_name
    customer.asset_type = payload.asset_type
    customer.service_requirement_type = payload.service_requirement_type
    customer.observed_material = payload.observed_material
    customer.estimated_quantity_known = payload.estimated_quantity_known
    customer.tank_type = payload.tank_type
    customer.approx_length_dia = payload.approx_length_dia
    customer.approx_width = payload.approx_width
    customer.approx_depth = payload.approx_depth
    customer.access_opening_type = payload.access_opening_type
    customer.can_place_equipment_nearby = payload.can_place_equipment_nearby
    customer.quote_basis = payload.quote_basis
    customer.pain_point = payload.pain_point
    customer.cleaning_date = payload.cleaning_date
    customer.cleaning_frequency = payload.cleaning_frequency
    customer.nature_of_job = payload.nature_of_job

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