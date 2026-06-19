# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter

from fastapi import Depends

from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.quote_schema import QuoteSchema

from backend.services.quote_service import (

    create_quote_request

)


router = APIRouter()


# ====================================
# QUOTE API
# ====================================

@router.post(

    "/quote"

)

def create_quote_endpoint(

        payload: QuoteSchema,

        db: Session = Depends(

            get_db

        )

):


    quote = (

        create_quote_request(

            db,

            payload

        )

    )


    return {

        "id": quote.id,

        "final_quote":

        quote.final_quote_value

    }