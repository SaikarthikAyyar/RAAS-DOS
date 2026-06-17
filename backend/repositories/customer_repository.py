from sqlalchemy.orm import Session

from backend.models.customer_requests import CustomerRequest


def create_customer(

        db: Session,

        payload

):

    customer = CustomerRequest(

        company_name=payload.company_name,

        plant_site_location=payload.plant_site_location,

        contact_person=payload.contact_person,

        urgency=payload.urgency,

        service_requirement_type=payload.service_requirement_type,

        observed_material=payload.observed_material,

        approx_length_dia=payload.approx_length_dia,

        approx_width=payload.approx_width,

        approx_depth=payload.approx_depth,

        access_opening_type=payload.access_opening_type,

        can_place_equipment_nearby=payload.can_place_equipment_nearby,

        quote_basis=payload.quote_basis,

        pain_point=payload.pain_point,

        attachments=payload.attachments,

        status="REQUESTED"

    )

    db.add(customer)

    db.commit()

    db.refresh(customer)

    return customer