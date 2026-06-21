# ====================================
# IMPORTS
# ====================================

from backend.models.customer_requests import CustomerRequest


# ====================================
# BUILD CUSTOMER TAKEAWAYS
# ====================================

def build_customer_takeaways(

        db,

        customer_id

):

    customer = db.query(

        CustomerRequest

    ).filter(

        CustomerRequest.id == customer_id

    ).first()


    if not customer:

        return None


    equipment_possible = "No"


    if customer.can_place_equipment_nearby:

        equipment_possible = "Yes"


    dimensions = "Unknown"


    if (

        customer.approx_length_dia

        and

        customer.approx_width

        and

        customer.approx_depth

    ):

        dimensions = (

            f"{customer.approx_length_dia}m x "

            f"{customer.approx_width}m x "

            f"{customer.approx_depth}m"

        )


    return {

        "customer": customer.company_name,

        "job": customer.service_requirement_type,

        "material": customer.observed_material,

        "site_size": dimensions,

        "access": customer.access_opening_type,

        "equipment_possible": equipment_possible,

        "priority": customer.urgency,

        "action": "Ready for Sales Survey"

    }