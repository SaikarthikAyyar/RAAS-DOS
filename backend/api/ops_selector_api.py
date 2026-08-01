# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter

from fastapi import Depends


from backend.database.connection import get_db

from backend.schemas.ops_selector_schema import (

    OpsSelectorSchema,

    OpsOverrideSchema,

    DeploymentPlanSchema,

    OpsReviewDecisionSchema

)

from backend.services.ops_selector_service import (

    create_ops_selection_request

)

from backend.services.sales_survey_service import (

    list_sales_surveys_request

)

from backend.services.ops_selector_service import (

    get_ops_selection_preview,

    get_ops_selection_scoring,

    save_ops_override,

    save_deployment_plan,

    save_ops_review_decision

)

from fastapi import HTTPException

from backend.repositories.ops_selector_repository import (

    get_ops_selection

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


# ====================================
# GET OPS SELECTION BY ID
# ====================================
# NOTE: registered after /ops-selector/surveys and
# /ops-selector/prefill/{sales_survey_id} so those more
# specific paths are not shadowed by {ops_selector_id}.

@router.get(

    "/ops-selector/{ops_selector_id}"

)

def get_ops_selection_by_id(

        ops_selector_id: int,

        db=Depends(get_db)

):

    ops = get_ops_selection(

        db,

        ops_selector_id

    )

    if not ops:

        raise HTTPException(

            status_code=404,

            detail="Ops Selection not found."

        )

    return ops


# ====================================
# MACHINE SCORING TABLE
# ====================================

@router.get(

    "/ops-selector/{ops_selector_id}/scoring"

)

def get_ops_scoring(

        ops_selector_id: int,

        db=Depends(get_db)

):

    try:

        return get_ops_selection_scoring(

            db,

            ops_selector_id

        )

    except ValueError as e:

        raise HTTPException(

            status_code=404,

            detail=str(e)

        )


# ====================================
# SAVE DEPLOYMENT PLAN
# ====================================

@router.put(

    "/ops-selector/{ops_selector_id}/deployment-plan"

)

def put_deployment_plan(

        ops_selector_id: int,

        payload: DeploymentPlanSchema,

        db=Depends(get_db)

):

    try:

        return save_deployment_plan(

            db,

            ops_selector_id,

            payload

        )

    except ValueError as e:

        raise HTTPException(

            status_code=404,

            detail=str(e)

        )


# ====================================
# SAVE HUMAN OVERRIDE
# ====================================

@router.put(

    "/ops-selector/{ops_selector_id}/override"

)

def put_ops_override(

        ops_selector_id: int,

        payload: OpsOverrideSchema,

        db=Depends(get_db)

):

    try:

        return save_ops_override(

            db,

            ops_selector_id,

            payload.override_machine,

            payload.override_reason

        )

    except ValueError as e:

        raise HTTPException(

            status_code=404,

            detail=str(e)

        )


# ====================================
# SAVE OPS REVIEW DECISION
# ====================================

@router.put(

    "/ops-selector/{ops_selector_id}/review"

)

def put_ops_review_decision(

        ops_selector_id: int,

        payload: OpsReviewDecisionSchema,

        db=Depends(get_db)

):

    try:

        return save_ops_review_decision(

            db,

            ops_selector_id,

            payload.status,

            payload.reviewed_by,

            payload.review_note

        )

    except ValueError as e:

        raise HTTPException(

            status_code=404,

            detail=str(e)

        )

