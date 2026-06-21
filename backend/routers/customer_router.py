# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter

from fastapi import Depends

from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.services.customer_service import get_sales_prefill


# ====================================
# ROUTER
# ====================================

router = APIRouter()


# ====================================
# HEALTH CHECK
# ====================================

@router.get(

    "/customer"

)

def customer():

    return {

        "message":

        "customer router active"

    }


# ====================================
# SALES PREFILL
# ====================================

@router.get(

    "/customer-request/{customer_request_id}/sales-prefill"

)

def sales_prefill(

        customer_request_id:int,

        db:Session=Depends(

            get_db

        )

):

    return get_sales_prefill(

        db,

        customer_request_id

    )