# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.approval_board_schema import (
    ApprovalCardSchema,
    CommercialApprovalDecisionSchema,
    ApprovalHistoryRowSchema
)

from backend.services.approval_board_service import (

    get_approval_board_request,

    approve_quote_request

)

from backend.services.approval_board_service import (
    get_approval_board_by_quote_request
)

from backend.services.approval_board_service import (
    get_approval_history_request,
    record_commercial_approval_decision_request,
    send_back_commercial_approval_request
)

from backend.services.hub_approval_service import ApprovalVerificationError

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

# ====================================
# GET APPROVAL BY QUOTE
# ====================================

@router.get(

    "/approval-board/{quote_id}"

)

def approval_board_by_quote(

    quote_id: int,

    db: Session = Depends(get_db)

):

    return get_approval_board_by_quote_request(

        db,

        quote_id

    )


# ====================================
# COMMERCIAL APPROVAL TAB
# ====================================

@router.get(

    "/approval-board/history/{ops_selection_id}",

    response_model=list[ApprovalHistoryRowSchema]

)
def approval_history(

    ops_selection_id: int,

    db: Session = Depends(get_db)

):

    return get_approval_history_request(

        db,

        ops_selection_id

    )


@router.post(

    "/approval-board/decision/{quote_id}/{decision}"

)
def post_commercial_approval_decision(

    quote_id: int,

    decision: str,

    payload: CommercialApprovalDecisionSchema,

    db: Session = Depends(get_db)

):

    from fastapi import HTTPException

    try:

        result = record_commercial_approval_decision_request(

            db,

            quote_id,

            decision.upper(),

            payload.note,

            payload.final_approved_value,

            payload.enquiry_id,

            payload.actor

        )

        return {

            "message": "Decision recorded",

            "approval_id": result["approval"].id,

            "quote_release_document_id": result["quote_release_document_id"]

        }

    except ApprovalVerificationError as e:

        raise HTTPException(status_code=403, detail=str(e))

    except ValueError as e:

        raise HTTPException(status_code=400, detail=str(e))


# ====================================
# SEND BACK FOR REVIEW (Commercial Approval)
# ====================================

@router.post(

    "/approval-board/send-back/{quote_id}"

)
def post_send_back_commercial_approval(

    quote_id: int,

    payload: CommercialApprovalDecisionSchema,

    db: Session = Depends(get_db)

):

    from fastapi import HTTPException

    try:

        approval = send_back_commercial_approval_request(

            db,

            quote_id,

            payload.note,

            payload.enquiry_id,

            payload.actor

        )

        return {

            "message": "Sent back to Ops Review",

            "approval_id": approval.id

        }

    except ApprovalVerificationError as e:

        raise HTTPException(status_code=403, detail=str(e))

    except ValueError as e:

        raise HTTPException(status_code=400, detail=str(e))