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

from backend.services.sales_survey_service import (

    get_sales_survey_request,

    list_sales_surveys_request

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





