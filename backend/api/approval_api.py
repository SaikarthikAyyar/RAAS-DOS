# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter

from fastapi import Depends

from sqlalchemy.orm import Session

from backend.database.connection import (

    get_db

)

from backend.schemas.approval_schema import (

    ApprovalSchema

)

from backend.services.approval_service import (

    create_approval_decision

)


# ====================================
# ROUTER
# ====================================

router = APIRouter()


# ====================================
# APPROVAL ENDPOINT
# ====================================

@router.post(

    "/approval"

)

def approval(

    payload: ApprovalSchema,

    db: Session = Depends(

        get_db

    )

):


    data = (

        create_approval_decision(

            db,

            payload

        )

    )


    return {

        "id": data.id,

        "approval_status": data.approval_status,

        "next_action": data.next_action

    }