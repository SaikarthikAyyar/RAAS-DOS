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


        service_requirement_type=

        payload.service_requirement_type,

        observed_material=

        payload.observed_material,

        estimated_quantity_known=

        payload.estimated_quantity_known,


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