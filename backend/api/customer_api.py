# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter

from fastapi import Depends

from fastapi import HTTPException

from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.customer_schema import CustomerRequestSchema

from backend.services.customer_service import (

    get_all_customers

)

from backend.services.customer_service import (

    get_sales_prefill,

    get_customers_service

)

from backend.services.customer_service import create_customer_request

from backend.models.customer_requests import CustomerRequest

from backend.services.customer_takeaway_service import (

    build_customer_takeaways

)

from backend.services.customer_service import (

    get_sales_prefill

)

from backend.services.customer_service import (
    search_customer
)


# ====================================
# ROUTER
# ====================================

router = APIRouter()


# ====================================
# CREATE CUSTOMER REQUEST
# ====================================

# ====================================
# CREATE CUSTOMER REQUEST
# ====================================

@router.post("/customer-request")
def customer_request(
        payload: CustomerRequestSchema,
        db: Session = Depends(get_db)
):
    customer = create_customer_request(
        db,
        payload
    )

    return customer


# ====================================
# GET CUSTOMER REQUEST
# ====================================

@router.get("/customer-request/{customer_id}")

def get_customer_request(

        customer_id: int,

        db: Session = Depends(get_db)

):

    customer = db.query(

        CustomerRequest

    ).filter(

        CustomerRequest.id == customer_id

    ).first()


    if not customer:

        raise HTTPException(

            status_code=404,

            detail="Customer Request not found"

        )


    return customer


# ====================================
# CUSTOMER SUMMARY
# ====================================

@router.get(

    "/customer-request/{customer_id}/summary"

)

def customer_summary(

        customer_id: int,

        db: Session = Depends(get_db)

):

    customer = db.query(

        CustomerRequest

    ).filter(

        CustomerRequest.id == customer_id

    ).first()


    if not customer:

        raise HTTPException(

            status_code=404,

            detail="Customer Request not found"

        )


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


    uploads = (

        f"{customer.photo_count} photos, "

        f"{customer.video_count} videos, "

        f"{customer.layout_count} layouts"

    )


    return {

        "customer": customer.company_name,

        "location": customer.plant_site_location,

        "urgency": customer.urgency,

        "service_requirement": customer.service_requirement_type,

        "material": customer.observed_material,

        "dimensions": dimensions,

        "uploads": uploads,

        "status": customer.status

    }

# ====================================
# CUSTOMER TAKEAWAYS
# ====================================

@router.get(

    "/customer-request/{customer_id}/takeaways"

)

def customer_takeaways(

        customer_id: int,

        db: Session = Depends(get_db)

):

    output = build_customer_takeaways(

        db,

        customer_id

    )


    if not output:

        raise HTTPException(

            status_code=404,

            detail="Customer Request not found"

        )


    return output

# ====================================
# SALES SURVEY PREFILL
# ====================================

@router.get(

    "/customer-request/{customer_request_id}/sales-prefill"

)

def sales_prefill(

        customer_request_id: int,

        db: Session = Depends(get_db)

):

    return get_sales_prefill(

        db,

        customer_request_id

    )

# ====================================
# CUSTOMER LIST
# ====================================

@router.get(

    "/customers"

)

def customers(

        db:Session=Depends(

            get_db

        )

):

    return get_all_customers(

        db

    )

# ====================================
# GET ALL CUSTOMERS
# ====================================

@router.get(

    "/customers"

)

def customers(

        db:Session=Depends(

            get_db

        )

):

    return get_customers_service(

        db

    )

# ====================================
# SEARCH CUSTOMER
# ====================================

@router.get(

    "/customer-search"

)

def customer_search(

        company_name: str,

        db: Session = Depends(get_db)

):

    return search_customer(

        db,

        company_name

    )


