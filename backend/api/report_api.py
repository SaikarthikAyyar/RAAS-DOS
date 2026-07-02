# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.reporting.report_service import (
    build_report_service
)

# ====================================
# ROUTER
# ====================================

router = APIRouter()

# ====================================
# REPORT PDF
# ====================================

@router.get("/report/{customer_request_id}")

def report(
    customer_request_id: int,
    db: Session = Depends(get_db)
):

    pdf = build_report_service(
        db,
        customer_request_id
    )

    if pdf is None:

        raise HTTPException(
            status_code=404,
            detail="Customer Request not found"
        )

    return StreamingResponse(
        pdf,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            f'inline; filename="Survey_{customer_request_id}.pdf"'
        }
    )