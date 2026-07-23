# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter

from fastapi import Depends

from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.sales_survey_schema import SalesSurveySchema

from backend.services.sales_survey_service import (
    create_sales_survey_request
)

from backend.schemas.sales_survey_schema import SalesSurveyResponseSchema

from backend.services.sales_survey_service import (

    get_sales_survey_request,

    list_sales_surveys_request

)

from backend.services.sales_survey_service import (
    list_customer_surveys_request,
    get_customer_survey_request
)


# ====================================
# ROUTER
# ====================================

router = APIRouter()


# ====================================
# HEALTH CHECK
# ====================================

@router.get(

    "/sales-survey"

)

def sales_survey():

    return {

        "message":

        "sales survey router active"

    }


# ====================================
# CREATE SALES SURVEY
# ====================================

@router.post(

    "/sales-survey"

)

def create_survey(

        payload:SalesSurveySchema,

        db:Session=Depends(

            get_db

        )

):

    return create_sales_survey_request(

        db,

        payload

    )


# ====================================
# LIST SALES SURVEYS
# ====================================

@router.get(

    "/sales-surveys/list"

)

def list_sales_surveys(

        db=Depends(

            get_db

        )

):

    return list_sales_surveys_request(

        db

    )


# ====================================
# GET SALES SURVEY
# ====================================

@router.get(

    "/sales-surveys/{sales_survey_id}"

)

def get_sales_survey(

        sales_survey_id: int,

        db=Depends(

            get_db

        )

):

    return get_sales_survey_request(

        db,

        sales_survey_id

    )


# ====================================
# CUSTOMER SURVEYS
# ====================================

@router.get(
    "/sales-surveys/customer/{customer_request_id}"
)
def customer_surveys(
        customer_request_id: int,
        db: Session = Depends(get_db)
):

    print("\n========== SALES SURVEY API ==========")
    print(f"[API] Customer Request: {customer_request_id}")

    return list_customer_surveys_request(
        db,
        customer_request_id
    )


# ====================================
# CUSTOMER SURVEY
# ====================================

@router.get(
    "/sales-surveys/customer/{customer_request_id}/{sales_survey_id}",
    response_model=SalesSurveyResponseSchema
)
def customer_survey(
        customer_request_id: int,
        sales_survey_id: int,
        db: Session = Depends(get_db)
):

    print("\n========== SALES SURVEY API ==========")
    print(f"[API] Customer : {customer_request_id}")
    print(f"[API] Survey   : {sales_survey_id}")

    return get_customer_survey_request(
        db,
        customer_request_id,
        sales_survey_id
    )

