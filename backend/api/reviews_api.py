# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.reviews_schema import ReviewQueueRow

from backend.services.reviews_service import (
    get_ops_review_queue,
    get_techno_queue,
    get_quote_commercial_queue,
    get_commercial_queue
)


api = APIRouter(prefix="/reviews", tags=["Reviews & Approvals"])


@api.get("/ops-review", response_model=list[ReviewQueueRow])
def ops_review_queue(db: Session = Depends(get_db)):
    return get_ops_review_queue(db)


@api.get("/techno-commercial", response_model=list[ReviewQueueRow])
def techno_commercial_queue(db: Session = Depends(get_db)):
    return get_techno_queue(db)


@api.get("/quote-commercial", response_model=list[ReviewQueueRow])
def quote_commercial_queue(db: Session = Depends(get_db)):
    return get_quote_commercial_queue(db)


@api.get("/commercial-approval", response_model=list[ReviewQueueRow])
def commercial_approval_queue(db: Session = Depends(get_db)):
    return get_commercial_queue(db)
