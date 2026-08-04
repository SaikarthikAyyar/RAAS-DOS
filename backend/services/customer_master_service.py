# ====================================
# IMPORTS
# ====================================

from datetime import date, datetime

from backend.repositories.customer_master_repository import (
    list_customers,
    count_assets,
    get_customer,
    get_customer_by_company_name,
    create_customer,
    create_customer_minimal,
    list_contacts,
    add_contact,
    list_assets,
    get_asset,
    find_asset_by_path,
    create_asset,
    set_follow_up,
    list_linked_enquiries
)

from backend.models.techno_commercial_quote import Quote


# ====================================
# FOLLOW-UP BUCKET
# Mirrors the wireframe's followUpBucket()/pillForFU(): overdue,
# today, or upcoming, based on day-diff against today.
# ====================================

def _follow_up_bucket(
        follow_up_date
):
    if not follow_up_date:
        return None

    diff = (follow_up_date - date.today()).days

    if diff < 0:
        return "overdue"

    if diff == 0:
        return "today"

    return "upcoming"


# ====================================
# LIST CUSTOMERS
# ====================================

def list_customers_request(
        db
):
    customers = list_customers(db)

    items = []

    for customer in customers:

        items.append({
            "id": customer.id,
            "company_name": customer.company_name,
            "category": customer.category,
            "industry": customer.industry,
            "region": customer.region,
            "owner": customer.owner,
            "assets_count": count_assets(db, customer.id),
            "next_follow_up_date": (
                customer.next_follow_up_date.isoformat()
                if customer.next_follow_up_date else None
            ),
            "next_follow_up_note": customer.next_follow_up_note,
            "follow_up_bucket": _follow_up_bucket(customer.next_follow_up_date)
        })

    return items


# ====================================
# CREATE CUSTOMER
# ====================================

def create_customer_request(
        db,
        payload
):
    return create_customer(db, payload)


# ====================================
# CUSTOMER DETAIL (360)
# ====================================

def get_customer_detail_request(
        db,
        customer_id
):
    customer = get_customer(db, customer_id)

    if not customer:
        return None

    contacts = list_contacts(db, customer_id)

    assets = [
        {
            "id": asset.id,
            "division": asset.division,
            "plant": asset.plant,
            "department": asset.department,
            "name": asset.name,
            "asset_type": asset.asset_type,
            "cleaning_frequency": asset.cleaning_frequency,
            "next_due": asset.next_due.isoformat() if asset.next_due else None,
            "last_verified": asset.last_verified.isoformat() if asset.last_verified else None,
            "verified_by": asset.verified_by
        }
        for asset in list_assets(db, customer_id)
    ]

    linked_enquiries = []

    for enquiry in list_linked_enquiries(db, customer.company_name):

        value = None

        if enquiry.quote_id:

            quote = (
                db.query(Quote)
                .filter(Quote.id == enquiry.quote_id)
                .first()
            )

            if quote:
                value = quote.final_approved_value or quote.combined_budgetary_value_max

        linked_enquiries.append({
            "id": enquiry.id,
            "stage": enquiry.stage,
            "status": enquiry.status,
            "value": value,
            "created_at": enquiry.created_at
        })

    return {
        "id": customer.id,
        "company_name": customer.company_name,
        "category": customer.category,
        "industry": customer.industry,
        "region": customer.region,
        "gst_number": customer.gst_number,
        "owner": customer.owner,
        "assets_count": len(assets),
        "next_follow_up_date": (
            customer.next_follow_up_date.isoformat()
            if customer.next_follow_up_date else None
        ),
        "next_follow_up_owner": customer.next_follow_up_owner,
        "next_follow_up_note": customer.next_follow_up_note,
        "follow_up_bucket": _follow_up_bucket(customer.next_follow_up_date),
        "contacts": contacts,
        "assets": assets,
        "linked_enquiries": linked_enquiries
    }


# ====================================
# ADD CONTACT
# ====================================

def add_contact_request(
        db,
        customer_id,
        payload
):
    return add_contact(db, customer_id, payload)


# ====================================
# SET FOLLOW-UP
# ====================================

def set_follow_up_request(
        db,
        customer_id,
        payload
):
    parsed_date = datetime.strptime(payload.date, "%Y-%m-%d").date()

    payload_with_parsed_date = payload.model_copy(
        update={"date": parsed_date}
    )

    return set_follow_up(db, customer_id, payload_with_parsed_date)


# ====================================
# LIST A CUSTOMER'S ASSETS (lightweight - for the
# "Existing asset" dropdown on Customer Request, mirrors
# siteOptionsForCustomer())
# ====================================

def list_customer_assets_request(
        db,
        customer_id
):
    return [
        {
            "id": asset.id,
            "label": " → ".join(filter(None, [
                asset.division, asset.plant, asset.department, asset.name
            ]))
        }
        for asset in list_assets(db, customer_id)
    ]


# ====================================
# RESOLVE OR CREATE CUSTOMER
# Mirrors the customer half of findOrCreateAssetPath(): use the
# picked customer_id if one was resolved client-side, otherwise
# look up (or auto-create) by company name.
# ====================================

def resolve_or_create_customer(
        db,
        customer_id,
        company_name
):
    if customer_id:

        customer = get_customer(db, customer_id)

        if customer:
            return customer

    customer = get_customer_by_company_name(db, company_name)

    if customer:
        return customer

    return create_customer_minimal(db, company_name)


# ====================================
# RESOLVE OR CREATE ASSET
# Mirrors findOrCreateAssetPath(): an existing asset_id wins outright;
# otherwise an asset is only created when both Plant and Asset name
# are given (matches submitNewEnquiry()'s `plantName && newAssetName`
# guard) - anything less is just "new site", no asset record.
# ====================================

def resolve_or_create_asset(
        db,
        customer_id,
        asset_id,
        division,
        plant,
        department,
        name,
        asset_type,
        cleaning_frequency
):
    if asset_id:
        return get_asset(db, asset_id)

    if not (plant and name):
        return None

    division = division or "Main"

    department = department or "General"

    existing = find_asset_by_path(db, customer_id, division, plant, department, name)

    if existing:
        return existing

    return create_asset(
        db,
        customer_id,
        division,
        plant,
        department,
        name,
        asset_type,
        cleaning_frequency
    )
