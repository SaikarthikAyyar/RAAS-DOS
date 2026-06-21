# ====================================
# IMPORTS
# ====================================

from backend.repositories.sales_survey_repository import (

    create_sales_survey

)


# ====================================
# CREATE SALES SURVEY
# ====================================

def create_sales_survey_request(

        db,

        payload

):

    return create_sales_survey(

        db,

        payload

    )