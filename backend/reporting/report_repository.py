# ====================================
# IMPORTS
# ====================================

from sqlalchemy.orm import Session

from backend.models.customer_requests import CustomerRequest
from backend.models.sales_survey import SalesSurvey
from backend.models.customer_media import CustomerMedia


# ====================================
# GET CUSTOMER REQUEST
# ====================================

def get_customer_request(
    db: Session,
    customer_request_id: int
):

    return (
        db.query(CustomerRequest)
        .filter(
            CustomerRequest.id == customer_request_id
        )
        .first()
    )


# ====================================
# GET SALES SURVEY
# ====================================

def get_sales_survey(
    db: Session,
    customer_request_id: int
):

    return (
        db.query(SalesSurvey)
        .filter(
            SalesSurvey.customer_request_id ==
            customer_request_id
        )
        .first()
    )


# ====================================
# GET CUSTOMER MEDIA
# ====================================

def get_customer_media(
    db: Session,
    customer_request_id: int
):

    return (
        db.query(CustomerMedia)
        .filter(
            CustomerMedia.customer_request_id ==
            customer_request_id
        )
        .all()
    )