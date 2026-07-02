# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter

from fastapi import Depends


from backend.database.connection import get_db

from backend.schemas.ops_selector_schema import (

    OpsSelectorSchema

)

from backend.services.ops_selector_service import (

    create_ops_selection_request

)

from backend.services.sales_survey_service import (

    list_sales_surveys_request

)

from backend.services.ops_selector_service import (

    get_ops_selection_preview

)

# ====================================
# ROUTER
# ====================================

router = APIRouter()


# ====================================
# CREATE OPS SELECTION
# ====================================

@router.post(

    "/ops-selector"

)

def ops_selector(

        payload: OpsSelectorSchema,

        db=Depends(get_db)

):

    try:

        ops = create_ops_selection_request(

            db,

            payload

        )

        return {

            "id": ops.id,

            "total_job_days": ops.total_job_days

        }

    except Exception as e:

        print("\n\nERROR OCCURRED\n")

        print(type(e))

        print(e)

        raise e


# ====================================
# LIST SALES SURVEYS
# ====================================

@router.get(
    "/ops-selector/surveys"
)
def list_ops_surveys(
        db=Depends(get_db)
):

    surveys = list_sales_surveys_request(db)

    return [

        {

            "id":

                survey["id"],

            "label":

                f"CR-{survey['customer_request_id']}"

                f" | "

                f"SS-{survey['id']}"

                f" | "

                f"{survey['plant_site_location']}"

        }

        for survey in surveys

    ]


# ====================================
# OPS PREVIEW
# ====================================

@router.get(

    "/ops-selector/prefill/{sales_survey_id}"

)

def get_ops_preview(

        sales_survey_id: int,

        db=Depends(get_db)

):

    return get_ops_selection_preview(

        db,

        sales_survey_id

    )
    

