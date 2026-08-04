# ====================================
# IMPORTS
# ====================================

from sqlalchemy import func

from backend.models.customer_master import Customer, CustomerContact
from backend.models.asset import Asset
from backend.models.customer_requests import CustomerRequest
from backend.models.enquiry import Enquiry


# ====================================
# LIST CUSTOMERS
# ====================================

def list_customers(
        db
):
    return (
        db.query(
            Customer
        )
        .order_by(
            Customer.company_name
        )
        .all()
    )


# ====================================
# COUNT ASSETS FOR A CUSTOMER
# ====================================

def count_assets(
        db,
        customer_id
):
    return (
        db.query(
            func.count(Asset.id)
        )
        .filter(
            Asset.customer_id == customer_id
        )
        .scalar()
    ) or 0


# ====================================
# GET CUSTOMER BY ID
# ====================================

def get_customer(
        db,
        customer_id
):
    return (
        db.query(
            Customer
        )
        .filter(
            Customer.id == customer_id
        )
        .first()
    )


# ====================================
# GET CUSTOMER BY COMPANY NAME
# ====================================

def get_customer_by_company_name(
        db,
        company_name
):
    return (
        db.query(
            Customer
        )
        .filter(
            Customer.company_name.ilike(company_name)
        )
        .first()
    )


# ====================================
# CREATE CUSTOMER
# ====================================

def create_customer(
        db,
        payload
):
    customer = Customer(
        company_name=payload.company_name,
        category=payload.category,
        industry=payload.industry,
        region=payload.region,
        gst_number=payload.gst_number,
        owner=payload.owner
    )

    db.add(customer)
    db.commit()
    db.refresh(customer)

    return customer


# ====================================
# CREATE CUSTOMER (MINIMAL - auto-vivified from Customer Request,
# mirrors findOrCreateAssetPath()'s inline customer creation)
# ====================================

def create_customer_minimal(
        db,
        company_name,
        owner=None
):
    customer = Customer(
        company_name=company_name,
        category="Standard Industrial",
        owner=owner
    )

    db.add(customer)
    db.commit()
    db.refresh(customer)

    return customer


# ====================================
# CONTACTS
# ====================================

def list_contacts(
        db,
        customer_id
):
    return (
        db.query(
            CustomerContact
        )
        .filter(
            CustomerContact.customer_id == customer_id
        )
        .order_by(
            CustomerContact.id
        )
        .all()
    )


def add_contact(
        db,
        customer_id,
        payload
):
    contact = CustomerContact(
        customer_id=customer_id,
        name=payload.name,
        designation=payload.designation,
        email=payload.email,
        phone=payload.phone
    )

    db.add(contact)
    db.commit()
    db.refresh(contact)

    return contact


# ====================================
# ASSETS ON FILE
# ====================================

def list_assets(
        db,
        customer_id
):
    return (
        db.query(
            Asset
        )
        .filter(
            Asset.customer_id == customer_id
        )
        .order_by(
            Asset.id
        )
        .all()
    )


# ====================================
# GET ASSET BY ID
# ====================================

def get_asset(
        db,
        asset_id
):
    return (
        db.query(
            Asset
        )
        .filter(
            Asset.id == asset_id
        )
        .first()
    )


# ====================================
# FIND ASSET BY DIVISION/PLANT/DEPARTMENT/NAME
# Mirrors findOrCreateAssetPath()'s lookup half - the "find" part.
# ====================================

def find_asset_by_path(
        db,
        customer_id,
        division,
        plant,
        department,
        name
):
    return (
        db.query(
            Asset
        )
        .filter(
            Asset.customer_id == customer_id,
            Asset.division == division,
            Asset.plant == plant,
            Asset.department == department,
            Asset.name == name
        )
        .first()
    )


# ====================================
# CREATE ASSET
# Mirrors makeAsset() - frequency alone drives no computed next_due
# here (unlike the wireframe's freqDays lookup); left null until the
# Survey-linked profile pass computes it for real.
# ====================================

def create_asset(
        db,
        customer_id,
        division,
        plant,
        department,
        name,
        asset_type,
        cleaning_frequency
):
    asset = Asset(
        customer_id=customer_id,
        division=division,
        plant=plant,
        department=department,
        name=name,
        asset_type=asset_type,
        cleaning_frequency=cleaning_frequency
    )

    db.add(asset)
    db.commit()
    db.refresh(asset)

    return asset


# ====================================
# NEXT FOLLOW-UP
# ====================================

def set_follow_up(
        db,
        customer_id,
        payload
):
    customer = get_customer(
        db,
        customer_id
    )

    if not customer:
        return None

    customer.next_follow_up_date = payload.date
    customer.next_follow_up_owner = payload.owner
    customer.next_follow_up_note = payload.note

    db.commit()
    db.refresh(customer)

    return customer


# ====================================
# LINKED ENQUIRIES
# Matched by company name against customer_requests, since Enquiry
# does not yet carry a customer_id (a later pass links these
# directly). Read-only display join, not a foreign key.
# ====================================

def list_linked_enquiries(
        db,
        company_name
):
    return (
        db.query(
            Enquiry
        )
        .join(
            CustomerRequest,
            Enquiry.customer_request_id == CustomerRequest.id
        )
        .filter(
            CustomerRequest.company_name.ilike(company_name)
        )
        .order_by(
            Enquiry.id.desc()
        )
        .all()
    )
