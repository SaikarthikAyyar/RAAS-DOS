# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.business_masters_pricing_schema import (
    CommercialRulesUpdate,
    CommercialRulesResponse,
    CustomerCategoryCreate,
    CustomerCategoryResponse
)

from backend.services.business_masters_pricing_service import (
    get_commercial_rules_request,
    update_commercial_rules_request,
    list_customer_categories_request,
    create_customer_category_request,
    delete_customer_category_request
)


api = APIRouter(tags=["Commercial Rules"])


# ====================================
# COMMERCIAL RULES (single row)
# ====================================

@api.get("/commercial-rules", response_model=CommercialRulesResponse)
def get_commercial_rules(db: Session = Depends(get_db)):
    result = get_commercial_rules_request(db)
    if not result:
        raise HTTPException(status_code=404, detail="Commercial rules not configured yet.")
    return result


@api.put("/commercial-rules", response_model=CommercialRulesResponse)
def update_commercial_rules(payload: CommercialRulesUpdate, db: Session = Depends(get_db)):
    return update_commercial_rules_request(db, payload)


# ====================================
# CUSTOMER CATEGORIES
# ====================================

@api.get("/customer-categories", response_model=list[CustomerCategoryResponse])
def list_customer_categories(db: Session = Depends(get_db)):
    return list_customer_categories_request(db)


@api.post("/customer-categories", response_model=CustomerCategoryResponse)
def create_customer_category(payload: CustomerCategoryCreate, db: Session = Depends(get_db)):
    return create_customer_category_request(db, payload)


@api.delete("/customer-categories/{category_id}")
def delete_customer_category(category_id: int, db: Session = Depends(get_db)):
    result = delete_customer_category_request(db, category_id)
    if not result:
        raise HTTPException(status_code=404, detail="Customer category not found.")
    return {"success": True}
