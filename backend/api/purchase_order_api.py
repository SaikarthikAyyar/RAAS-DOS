# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import Optional
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.purchase_order_schema import PurchaseOrderResponse

from backend.services.purchase_order_service import (
    list_purchase_orders_request,
    upload_purchase_order_request,
    delete_purchase_order_request
)


router = APIRouter()


@router.get("/enquiries/{enquiry_id}/purchase-orders", response_model=list[PurchaseOrderResponse])
def list_purchase_orders(enquiry_id: int, db: Session = Depends(get_db)):
    return list_purchase_orders_request(db, enquiry_id)


@router.post("/enquiries/{enquiry_id}/purchase-orders", response_model=PurchaseOrderResponse)
async def upload_purchase_order(

    enquiry_id: int,
    file: UploadFile = File(...),
    uploaded_by: Optional[str] = Form(None),
    db: Session = Depends(get_db)

):

    try:

        return await upload_purchase_order_request(
            db, enquiry_id, file, uploaded_by
        )

    except ValueError as error:

        raise HTTPException(status_code=422, detail=str(error))


@router.delete("/purchase-orders/{po_id}")
def delete_purchase_order(po_id: int, db: Session = Depends(get_db)):

    try:

        delete_purchase_order_request(db, po_id)

    except ValueError as error:

        raise HTTPException(status_code=404, detail=str(error))

    return {"success": True}
