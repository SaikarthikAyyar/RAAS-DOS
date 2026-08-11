# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.business_masters_pricing_schema import (
    AccessoryCreate,
    AccessoryUpdate,
    AccessoryResponse
)

from backend.services.business_masters_pricing_service import (
    list_accessories_request,
    create_accessory_request,
    update_accessory_request,
    delete_accessory_request
)


api = APIRouter(tags=["Accessories"])


@api.get("/accessories", response_model=list[AccessoryResponse])
def list_accessories(db: Session = Depends(get_db)):
    return list_accessories_request(db)


@api.post("/accessories", response_model=AccessoryResponse)
def create_accessory(payload: AccessoryCreate, db: Session = Depends(get_db)):
    return create_accessory_request(db, payload)


@api.put("/accessories/{accessory_id}", response_model=AccessoryResponse)
def update_accessory(accessory_id: int, payload: AccessoryUpdate, db: Session = Depends(get_db)):
    result = update_accessory_request(db, accessory_id, payload)
    if not result:
        raise HTTPException(status_code=404, detail="Accessory not found.")
    return result


@api.delete("/accessories/{accessory_id}")
def delete_accessory(accessory_id: int, db: Session = Depends(get_db)):
    result = delete_accessory_request(db, accessory_id)
    if not result:
        raise HTTPException(status_code=404, detail="Accessory not found.")
    return {"success": True}
