# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.techno_commercial_quote_schema import (
    QuoteCreateSchema,
    QuoteResponseSchema,
    TechnoApprovalDecisionSchema
)

from backend.services.techno_commercial_quote_service import (
    approve_quote_by_customer,
    create_quote_request,
    get_quote_preview_request,
    request_quote_revision,
    save_techno_approval_decision
)

from backend.services.techno_commercial_quote_service import (

    get_quote_request

)

from backend.services.techno_commercial_quote_service import (

    list_quote_ops_request

)

# ====================================
# ROUTER
# ====================================

router = APIRouter()

# ====================================
# CREATE QUOTE
# ====================================

@router.post(

    "/quote",

    response_model=QuoteResponseSchema

)
def create_quote(

    payload: QuoteCreateSchema,

    db: Session = Depends(

        get_db

    )

):

    print(

        "\n========== QUOTE API =========="

    )

    print(

        "OPS Selection:",

        payload.ops_selection_id

    )

    print(

        "Dewatering:",

        payload.dewatering_assessment_id

    )

    quote = create_quote_request(

        db,

        payload

    )

    print(

        "Quote Created:",

        quote.id

    )

    print(

        "===============================\n"

    )

    return quote


# ====================================
# GET QUOTE
# ====================================

@router.get(

    "/quote/by-ops/{ops_selection_id}",

    response_model=QuoteResponseSchema

)

def get_quote(

    ops_selection_id: int,

    db: Session = Depends(

        get_db

    )

):

    return get_quote_request(

        db,

        ops_selection_id

    )


# ====================================
# LIST OPS SELECTIONS
# ====================================

@router.get(

    "/quote/ops"

)

def list_quote_ops(

    db: Session = Depends(

        get_db

    )

):

    return list_quote_ops_request(

        db

    )



@router.get("/quote/preview/{ops_selection_id}")
def preview_quote(
    ops_selection_id: int,
    db: Session = Depends(get_db)
):
    return get_quote_preview_request(db, ops_selection_id)


@router.post(

    "/quote/{quote_id}/approve"

)
def approve_customer_quote(

    quote_id: int,

    db: Session = Depends(get_db)

):

    return approve_quote_by_customer(

        db,

        quote_id

    )


@router.post(

    "/quote/{quote_id}/revision"

)
def request_revision(

    quote_id: int,

    db: Session = Depends(get_db)

):

    return request_quote_revision(

        db,

        quote_id

    )


# ====================================
# SAVE TECHNO-COMMERCIAL APPROVAL DECISION
# ====================================

@router.put(

    "/quote/{quote_id}/techno-approval"

)
def put_techno_approval(

    quote_id: int,

    payload: TechnoApprovalDecisionSchema,

    db: Session = Depends(get_db)

):

    try:

        return save_techno_approval_decision(

            db,

            quote_id,

            payload.status,

            payload.approved_by,

            payload.note

        )

    except ValueError as e:

        from fastapi import HTTPException

        raise HTTPException(

            status_code=404,

            detail=str(e)

        )