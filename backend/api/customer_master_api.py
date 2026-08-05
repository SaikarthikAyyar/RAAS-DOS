# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.customer_master_schema import (
    CustomerCreateSchema,
    CustomerListItemSchema,
    CustomerListResponse,
    CustomerDetailSchema,
    ContactCreateSchema,
    ContactSchema,
    FollowUpSchema,
    AssetOptionListResponse,
    AssetSchema
)

from backend.services.customer_master_service import (
    list_customers_request,
    create_customer_request,
    get_customer_detail_request,
    add_contact_request,
    set_follow_up_request,
    list_customer_assets_request,
    get_asset_detail_request
)

# ====================================
# ROUTER
# ====================================

router = APIRouter()


# ====================================
# LIST CUSTOMERS
# ====================================

@router.get(
    "/business-master/customers",
    response_model=CustomerListResponse
)
def list_customers(
        db: Session = Depends(get_db)
):
    return {
        "items": list_customers_request(db)
    }


# ====================================
# CREATE CUSTOMER
# ====================================

@router.post(
    "/business-master/customers",
    response_model=CustomerListItemSchema
)
def create_customer(
        payload: CustomerCreateSchema,
        db: Session = Depends(get_db)
):
    customer = create_customer_request(db, payload)

    return {
        "id": customer.id,
        "company_name": customer.company_name,
        "category": customer.category,
        "industry": customer.industry,
        "region": customer.region,
        "owner": customer.owner,
        "assets_count": 0,
        "next_follow_up_date": None,
        "next_follow_up_note": None,
        "follow_up_bucket": None
    }


# ====================================
# CUSTOMER DETAIL (360)
# ====================================

@router.get(
    "/business-master/customers/{customer_id}",
    response_model=CustomerDetailSchema
)
def get_customer_detail(
        customer_id: int,
        db: Session = Depends(get_db)
):
    detail = get_customer_detail_request(db, customer_id)

    if not detail:
        raise HTTPException(
            status_code=404,
            detail="Customer not found."
        )

    return detail


# ====================================
# LIST A CUSTOMER'S ASSETS (lightweight - for the
# "Existing asset" dropdown on Customer Request)
# ====================================

@router.get(
    "/business-master/customers/{customer_id}/assets",
    response_model=AssetOptionListResponse
)
def list_customer_assets(
        customer_id: int,
        db: Session = Depends(get_db)
):
    return {
        "items": list_customer_assets_request(db, customer_id)
    }


# ====================================
# ASSET DETAIL (single asset - for the Enquiry Workspace's
# Asset Profile card)
# ====================================

@router.get(
    "/business-master/assets/{asset_id}",
    response_model=AssetSchema
)
def get_asset_detail(
        asset_id: int,
        db: Session = Depends(get_db)
):
    asset = get_asset_detail_request(db, asset_id)

    if not asset:
        raise HTTPException(
            status_code=404,
            detail="Asset not found."
        )

    return asset


# ====================================
# ADD CONTACT
# ====================================

@router.post(
    "/business-master/customers/{customer_id}/contacts",
    response_model=ContactSchema
)
def add_contact(
        customer_id: int,
        payload: ContactCreateSchema,
        db: Session = Depends(get_db)
):
    return add_contact_request(db, customer_id, payload)


# ====================================
# SET / UPDATE NEXT FOLLOW-UP
# ====================================

@router.put(
    "/business-master/customers/{customer_id}/follow-up",
    response_model=CustomerListItemSchema
)
def set_follow_up(
        customer_id: int,
        payload: FollowUpSchema,
        db: Session = Depends(get_db)
):
    customer = set_follow_up_request(db, customer_id, payload)

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found."
        )

    return {
        "id": customer.id,
        "company_name": customer.company_name,
        "category": customer.category,
        "industry": customer.industry,
        "region": customer.region,
        "owner": customer.owner,
        "assets_count": 0,
        "next_follow_up_date": (
            customer.next_follow_up_date.isoformat()
            if customer.next_follow_up_date else None
        ),
        "next_follow_up_note": customer.next_follow_up_note,
        "follow_up_bucket": None
    }
