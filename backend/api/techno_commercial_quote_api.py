# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter
from fastapi import Depends

from typing import Optional

from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.techno_commercial_quote_schema import (
    QuoteCreateSchema,
    QuoteResponseSchema,
    QuoteCommercialDecisionSchema,
    InternalExtraSchema,
    ValidTillSchema,
    RequestRevisionFlagSchema,
    QuoteListResponse
)

from backend.services.hub_approval_service import ApprovalVerificationError

from backend.services.techno_commercial_quote_service import (
    approve_quote_by_customer,
    create_quote_request,
    get_quote_preview_request,
    request_quote_revision,
    record_quote_commercial_decision_request,
    get_quote_history_request,
    update_internal_extra_request,
    update_valid_till_request,
    flag_quote_revision_requested_request,
    list_quotes_request
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

    response_model=Optional[QuoteResponseSchema]

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
# QUOTE & COMMERCIAL GATE DECISION (Phase 22)
# The real, hub-gated, stage-advancing decision for the Quote &
# Commercial tab - replaces the retired Techno-Commercial standalone
# approval. Verification (stage + hub standing) and the stage move
# both happen inside record_quote_commercial_decision_request, in one
# atomic call.
# ====================================

@router.put(

    "/quote/{quote_id}/commercial-review"

)
def put_quote_commercial_decision(

    quote_id: int,

    payload: QuoteCommercialDecisionSchema,

    db: Session = Depends(get_db)

):

    from fastapi import HTTPException

    try:

        return record_quote_commercial_decision_request(

            db,

            quote_id,

            payload.status,

            payload.note,

            payload.actor,

            payload.enquiry_id

        )

    except ApprovalVerificationError as e:

        raise HTTPException(status_code=403, detail=str(e))

    except ValueError as e:

        raise HTTPException(

            status_code=404,

            detail=str(e)

        )


# ====================================
# QUOTE & COMMERCIAL TAB
# ====================================

@router.get(

    "/quote/history/{ops_selection_id}",

    response_model=list[QuoteResponseSchema]

)
def get_quote_history(

    ops_selection_id: int,

    db: Session = Depends(get_db)

):

    return get_quote_history_request(

        db,

        ops_selection_id

    )


@router.put(

    "/quote/{quote_id}/internal-extra",

    response_model=QuoteResponseSchema

)
def put_internal_extra(

    quote_id: int,

    payload: InternalExtraSchema,

    db: Session = Depends(get_db)

):

    from fastapi import HTTPException

    try:

        return update_internal_extra_request(

            db,

            quote_id,

            payload.enabled,

            payload.amount,

            payload.note

        )

    except ValueError as e:

        raise HTTPException(status_code=404, detail=str(e))


@router.put(

    "/quote/{quote_id}/valid-till",

    response_model=QuoteResponseSchema

)
def put_valid_till(

    quote_id: int,

    payload: ValidTillSchema,

    db: Session = Depends(get_db)

):

    from fastapi import HTTPException

    try:

        return update_valid_till_request(

            db,

            quote_id,

            payload.valid_till

        )

    except ValueError as e:

        raise HTTPException(status_code=404, detail=str(e))



@router.post(

    "/quote/{quote_id}/request-revision",

    response_model=QuoteResponseSchema

)
def post_request_revision_flag(

    quote_id: int,

    payload: RequestRevisionFlagSchema,

    db: Session = Depends(get_db)

):

    from fastapi import HTTPException

    try:

        return flag_quote_revision_requested_request(

            db,

            quote_id,

            payload.requested_by

        )

    except ValueError as e:

        raise HTTPException(status_code=404, detail=str(e))


# ====================================
# QUOTES MODULE
# ====================================

@router.get(

    "/quotes",

    response_model=QuoteListResponse

)
def get_quotes_list(

    status: str | None = None,

    search: str | None = None,

    page: int = 1,

    page_size: int = 20,

    db: Session = Depends(get_db)

):

    items, total = list_quotes_request(

        db,

        status,

        search,

        page,

        page_size

    )

    return {

        "items": items,

        "total": total,

        "page": page,

        "page_size": page_size

    }