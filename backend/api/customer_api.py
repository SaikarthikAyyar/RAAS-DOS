from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database.connection import get_db
from backend.schemas.customer_schema import CustomerRequestSchema
from backend.services.customer_service import create_customer_request

router = APIRouter()


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