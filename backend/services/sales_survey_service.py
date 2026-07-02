# ====================================
# IMPORTS
# ====================================

from backend.repositories.sales_survey_repository import (

    create_sales_survey

)

from backend.repositories.sales_survey_repository import (

    get_sales_survey_by_id,

    list_sales_surveys

)
from backend.services.status_service import update_customer_request_status


# ====================================
# CREATE SALES SURVEY
# ====================================

def create_sales_survey_request(

        db,

        payload

):

    survey = create_sales_survey(

        db,

        payload

    )

    update_customer_request_status(

        db,

        survey.customer_request_id,

        "SURVEY_COMPLETED"

    )

    return survey


# ====================================
# GET SALES SURVEY
# ====================================

def get_sales_survey_request(

        db,

        sales_survey_id

):

    return get_sales_survey_by_id(

        db,

        sales_survey_id

    )



# ====================================
# LIST SALES SURVEYS
# ====================================

def list_sales_surveys_request(

        db

):

    return list_sales_surveys(

        db

    )





