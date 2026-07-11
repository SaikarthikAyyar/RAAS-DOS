# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.approval_board_schema import (
    ApprovalCardSchema
)

from backend.services.approval_board_service import (

    get_approval_board_request,

    approve_quote_request

)

# ====================================
# ROUTER
# ====================================

router = APIRouter()


# ====================================
# APPROVAL BOARD
# ====================================

@router.get(

    "/approval-board",

    response_model=list[ApprovalCardSchema]

)

def approval_board(

    db: Session = Depends(

        get_db

    )

):

    print(

        "\n========== APPROVAL API =========="

    )

    approvals = get_approval_board_request(

        db

    )

    print(

        "Returning",

        len(

            approvals

        ),

        "Approval Cards"

    )

    print(

        "=================================\n"

    )

    return approvals



# ====================================
# APPROVE QUOTE
# ====================================

@router.post(

    "/approval-board/approve/{quote_id}"

)

def approve_quote(

    quote_id: int,

    db: Session = Depends(

        get_db

    )

):

    print(

        "\n========== APPROVAL API =========="

    )

    print(

        "Approve Quote:",

        quote_id

    )

    approval = approve_quote_request(

        db,

        quote_id

    )

    print(

        "Approval Successful"

    )

    print(

        "=================================\n"

    )

    return {

        "message":

            "Approval Successful",

        "approval_id":

            approval.id

    }