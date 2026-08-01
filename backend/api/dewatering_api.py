# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter

from fastapi import Depends


from backend.database.connection import get_db

from backend.schemas.dewatering_schema import (

    DewateringSchema

)

from backend.services.dewatering_service import (

    create_dewatering_request

)

from fastapi import HTTPException

from backend.repositories.dewatering_repository import (

    get_dewatering_assessment_by_ops_selection

)


# ====================================
# ROUTER
# ====================================

router = APIRouter()


# ====================================
# CREATE DEWATERING ASSESSMENT
# ====================================

@router.post(

    "/dewatering"

)

def dewatering(

        payload: DewateringSchema,

        db=Depends(get_db)

):

    try:

        assessment = (

            create_dewatering_request(

                db,

                payload

            )

        )


        return {

            "id": assessment.id,

            "recommended_method":

            assessment.recommended_dewatering_method,

            "commitment":

            assessment.dewatering_commitment_decision

        }


    except Exception as e:

        print("\n\nERROR OCCURRED\n")

        print(type(e))

        print(e)

        raise e


# ====================================
# GET BY OPS SELECTION
# ====================================

@router.get(

    "/dewatering/by-ops-selection/{ops_selection_id}"

)

def get_dewatering_by_ops_selection(

        ops_selection_id: int,

        db=Depends(get_db)

):

    assessment = get_dewatering_assessment_by_ops_selection(

        db,

        ops_selection_id

    )

    if not assessment:

        raise HTTPException(

            status_code=404,

            detail="No dewatering assessment for this Ops Selection."

        )

    return assessment