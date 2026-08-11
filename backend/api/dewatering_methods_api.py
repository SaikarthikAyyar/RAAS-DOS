# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.business_masters_pricing_schema import (
    DewateringMethodCreate,
    DewateringMethodUpdate,
    DewateringMethodResponse
)

from backend.services.business_masters_pricing_service import (
    list_dewatering_methods_request,
    create_dewatering_method_request,
    update_dewatering_method_request,
    delete_dewatering_method_request
)


api = APIRouter(tags=["Dewatering Methods"])


@api.get("/dewatering-methods", response_model=list[DewateringMethodResponse])
def list_dewatering_methods(db: Session = Depends(get_db)):
    return list_dewatering_methods_request(db)


@api.post("/dewatering-methods", response_model=DewateringMethodResponse)
def create_dewatering_method(payload: DewateringMethodCreate, db: Session = Depends(get_db)):
    return create_dewatering_method_request(db, payload)


@api.put("/dewatering-methods/{method_id}", response_model=DewateringMethodResponse)
def update_dewatering_method(method_id: int, payload: DewateringMethodUpdate, db: Session = Depends(get_db)):
    result = update_dewatering_method_request(db, method_id, payload)
    if not result:
        raise HTTPException(status_code=404, detail="Dewatering method not found.")
    return result


@api.delete("/dewatering-methods/{method_id}")
def delete_dewatering_method(method_id: int, db: Session = Depends(get_db)):
    result = delete_dewatering_method_request(db, method_id)
    if not result:
        raise HTTPException(status_code=404, detail="Dewatering method not found.")
    return {"success": True}
