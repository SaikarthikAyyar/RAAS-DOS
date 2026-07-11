# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.techno_commercial_quote_schema import (
    QuoteCreateSchema,
    QuoteResponseSchema
)

from backend.services.techno_commercial_quote_service import (
    create_quote_request,
    get_quote_preview_request
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