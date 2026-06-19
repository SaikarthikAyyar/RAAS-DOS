# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter

from fastapi import Depends

from backend.database.connection import get_db

from backend.schemas.sales_survey_schema import SalesSurveySchema

from backend.services.sales_survey_service import (
    create_sales_survey_request
)


# ====================================
# ROUTER
# ====================================

router = APIRouter()


# ====================================
# CREATE SALES SURVEY
# ====================================

@router.post("/sales-survey")

def sales_survey(

        payload: SalesSurveySchema,

        db=Depends(get_db)

):

    try:

        survey = create_sales_survey_request(

            db,

            payload

        )

        return {

            "success": True,

            "data": survey

        }

    except Exception as e:

        print("\n\nERROR OCCURRED\n")

        print(type(e))

        print(e)

        raise e