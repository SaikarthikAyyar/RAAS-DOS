# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.services.customer_live_order_service import (
    get_customer_live_order,
    get_customer_execution_ids
)

router = APIRouter()


# ====================================
# CUSTOMER IDS
# ====================================

@router.get("/customer/live-order/customers")
def customer_execution_ids(

    db: Session = Depends(get_db)

):

    return get_customer_execution_ids(db)


# ====================================
# CUSTOMER LIVE ORDER
# ====================================

@router.get("/customer/live-order")
def customer_live_order(

    customer_request_id: int,

    db: Session = Depends(get_db)

):

    return get_customer_live_order(

        db,

        customer_request_id

    )


# ====================================
# CUSTOMER IDS
# ====================================

@router.get("/customer/live-order/customers")
def customer_execution_ids(

    db: Session = Depends(get_db)

):

    return get_customer_execution_ids(db)