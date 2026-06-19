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