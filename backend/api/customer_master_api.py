# ====================================
# IMPORTS
# ====================================

from datetime import date

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi.responses import StreamingResponse

from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.customer_master_schema import (
    CustomerCreateSchema,
    CustomerListItemSchema,
    CustomerListResponse,
    CustomerDetailSchema,
    CustomerOwnerUpdateSchema,
    CustomerUpdateSchema,
    ContactCreateSchema,
    ContactSchema,
    FollowUpSchema,
    AssetOptionListResponse,
    AssetSchema,
    AssetUpdateSchema
)

from backend.schemas.notification_schema import BusinessMasterActionSchema

from backend.reporting.customer_360_xlsx import build_customer_360_workbook_bytes
from backend.reporting.business_masters_export_xlsx import build_customers_report_workbook_bytes

from backend.services.customer_master_service import (
    list_customers_request,
    create_customer_request,
    build_customer_list_item,
    update_customer_owner_request,
    update_customer_request,
    delete_customer_request,
    update_asset_request,
    delete_asset_request,
    delete_contact_request,
    build_customers_report,
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

    return build_customer_list_item(db, customer)


# ====================================
# REASSIGN ACCOUNT OWNER
# ====================================

@router.patch(
    "/business-master/customers/{customer_id}/owner",
    response_model=CustomerListItemSchema
)
def update_customer_owner(
        customer_id: int,
        payload: CustomerOwnerUpdateSchema,
        db: Session = Depends(get_db)
):
    customer = update_customer_owner_request(db, customer_id, payload)

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found."
        )

    return build_customer_list_item(db, customer)


# ====================================
# UPDATE CUSTOMER (full edit)
# ====================================

@router.put(
    "/business-master/customers/{customer_id}",
    response_model=CustomerListItemSchema
)
def update_customer(
        customer_id: int,
        payload: CustomerUpdateSchema,
        db: Session = Depends(get_db)
):
    customer = update_customer_request(db, customer_id, payload)

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found."
        )

    return build_customer_list_item(db, customer)


# ====================================
# DELETE CUSTOMER
# ====================================

@router.delete(
    "/business-master/customers/{customer_id}"
)
def delete_customer(
        customer_id: int,
        payload: BusinessMasterActionSchema,
        db: Session = Depends(get_db)
):
    try:
        result = delete_customer_request(db, customer_id, payload.actor, payload.remark)

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )

    if result == "not_found":
        raise HTTPException(
            status_code=404,
            detail="Customer not found."
        )

    return {"success": True}


# ====================================
# CUSTOMERS REPORT (3-sheet Excel export - Summary/Assets/Contacts)
# ====================================

@router.get(
    "/business-master/customers-report"
)
def get_customers_report(
        db: Session = Depends(get_db)
):
    report = build_customers_report(db)

    buffer = build_customers_report_workbook_bytes(report)

    filename = f"Customers_Report_{date.today().isoformat()}.xlsx"

    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


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
# CUSTOMER 360 EXPORT (styled .xlsx, server-side - the client-side
# SheetJS build every other export in this app uses can't apply cell
# fills/fonts/merges at all, so this one is generated with openpyxl
# instead, same fix already used for the Fleet Forecast export)
# ====================================

@router.get(
    "/business-master/customers/{customer_id}/export"
)
def export_customer_360(
        customer_id: int,
        db: Session = Depends(get_db)
):
    buffer, company_name = build_customer_360_workbook_bytes(db, customer_id)

    if buffer is None:
        raise HTTPException(
            status_code=404,
            detail="Customer not found."
        )

    safe_name = (company_name or "Customer").replace(" ", "_")
    filename = f"{safe_name}_360_Export_{date.today().isoformat()}.xlsx"

    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


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
# UPDATE ASSET (division/plant/department/name)
# ====================================

@router.put(
    "/business-master/assets/{asset_id}",
    response_model=AssetSchema
)
def update_asset(
        asset_id: int,
        payload: AssetUpdateSchema,
        db: Session = Depends(get_db)
):
    asset = update_asset_request(db, asset_id, payload)

    if not asset:
        raise HTTPException(
            status_code=404,
            detail="Asset not found."
        )

    return asset


# ====================================
# DELETE ASSET
# ====================================

@router.delete(
    "/business-master/assets/{asset_id}"
)
def delete_asset(
        asset_id: int,
        payload: BusinessMasterActionSchema,
        db: Session = Depends(get_db)
):
    try:
        result = delete_asset_request(db, asset_id, payload.actor, payload.remark)

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )

    if result == "not_found":
        raise HTTPException(
            status_code=404,
            detail="Asset not found."
        )

    return {"success": True}


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
# DELETE CONTACT
# ====================================

@router.delete(
    "/business-master/customers/{customer_id}/contacts/{contact_id}"
)
def delete_contact(
        customer_id: int,
        contact_id: int,
        payload: BusinessMasterActionSchema,
        db: Session = Depends(get_db)
):
    result = delete_contact_request(db, contact_id, payload.actor, payload.remark)

    if result == "not_found":
        raise HTTPException(
            status_code=404,
            detail="Contact not found."
        )

    return {"success": True}


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
