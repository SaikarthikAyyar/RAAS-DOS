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