# ====================================
# IMPORTS
# ====================================

from sqlalchemy import func

from backend.models.customer_master import Customer, CustomerContact
from backend.models.asset import Asset
from backend.models.customer_requests import CustomerRequest
from backend.models.enquiry import Enquiry


# ====================================
# NORMALIZE COMPANY NAME
# Trims + collapses whitespace runs (str.split() with no args does
# both), then uppercases only each word's first character - not
# .title()/.capitalize(), which lowercase everything after the first
# letter and would mangle real acronym-style customer names already
# in the data (NTPC NNTPS, JSW Steel, ACC, GAIL Pipelines) into
# nonsense like "Ntpc Nntps".
# ====================================

def normalize_company_name(
        name
):
    if not name:
        return name

    words = name.split()

    return " ".join(
        w[0].upper() + w[1:] if w else w
        for w in words
    )


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
    normalized = normalize_company_name(company_name)

    return (
        db.query(
            Customer
        )
        .filter(
            Customer.company_name.ilike(normalized)
        )
        .first()
    )


# ====================================
# CREATE CUSTOMER
# Finds-or-creates by normalized name first, matching
# resolve_or_create_customer()'s established pattern - this path
# (the Business Masters "New customer" modal) previously had no
# dedup check at all, so a repeat submission would silently insert
# a duplicate row.
# ====================================

def create_customer(
        db,
        payload
):
    normalized_name = normalize_company_name(payload.company_name)

    existing = get_customer_by_company_name(db, normalized_name)

    if existing:
        return existing

    customer = Customer(
        company_name=normalized_name,
        category=payload.category,
        industry=payload.industry,
        region=payload.region,
        gst_number=payload.gst_number,
        owner=payload.owner,
        owner_user_id=payload.owner_user_id or payload.actor.user_id,
        created_by_user_id=payload.actor.user_id
    )

    db.add(customer)
    db.commit()
    db.refresh(customer)

    return customer


# ====================================
# UPDATE CUSTOMER OWNER (Account Owner reassignment - created_by_user_id
# is never touched here, it is permanent from creation)
# ====================================

def update_customer_owner(
        db,
        customer,
        owner_user_id
):
    customer.owner_user_id = owner_user_id

    db.commit()
    db.refresh(customer)

    return customer


# ====================================
# UPDATE CUSTOMER (full edit - company_name/category/industry/
# region/gst_number only; owner_user_id has its own dedicated
# reassignment flow, created_by_user_id is permanent)
# ====================================

def update_customer(
        db,
        customer,
        payload
):
    customer.company_name = normalize_company_name(payload.company_name)
    customer.category = payload.category
    customer.industry = payload.industry
    customer.region = payload.region
    customer.gst_number = payload.gst_number

    db.commit()
    db.refresh(customer)

    return customer


# ====================================
# DELETE CUSTOMER
# Contacts have no other FK pointing at them, so they're cascaded
# here directly - assets/linked enquiries are NOT cascaded (the
# service layer blocks the delete entirely if either exist, since
# both are real records other parts of the app depend on).
# ====================================

def delete_customer(
        db,
        customer
):
    (
        db.query(CustomerContact)
        .filter(CustomerContact.customer_id == customer.id)
        .delete()
    )

    db.delete(customer)
    db.commit()

    return True


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
        company_name=normalize_company_name(company_name),
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


def get_contact(
        db,
        contact_id
):
    return (
        db.query(
            CustomerContact
        )
        .filter(
            CustomerContact.id == contact_id
        )
        .first()
    )


def delete_contact(
        db,
        contact
):
    db.delete(contact)
    db.commit()


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
        cleaning_frequency,
        observed_material=None,
        access_opening_type=None,
        can_place_equipment_nearby=None,
        pain_point=None
):
    asset = Asset(
        customer_id=customer_id,
        division=division,
        plant=plant,
        department=department,
        name=name,
        asset_type=asset_type,
        cleaning_frequency=cleaning_frequency,
        observed_material=observed_material,
        access_opening_type=access_opening_type,
        can_place_equipment_nearby=can_place_equipment_nearby,
        pain_point=pain_point
    )

    db.add(asset)
    db.commit()
    db.refresh(asset)

    return asset


# ====================================
# ENQUIRIES LINKED TO AN ASSET
# Used to block asset deletion - Enquiry.asset_id has no ON DELETE
# CASCADE, so an asset still referenced by a real enquiry must never
# be removed out from under it.
# ====================================

def get_enquiries_by_asset(
        db,
        asset_id
):
    return (
        db.query(
            Enquiry
        )
        .filter(
            Enquiry.asset_id == asset_id
        )
        .all()
    )


# ====================================
# DELETE ASSET
# ====================================

def delete_asset(
        db,
        asset
):
    db.delete(asset)
    db.commit()

    return True


# ====================================
# UPDATE ASSET PROFILE
# Keeps a reused asset's mutable site-profile fields current with
# whatever was just submitted, instead of leaving them frozen at
# first creation - these fields are expected to drift over time
# (material on site, access changes, etc), unlike the structural
# division/plant/department/name identity of the asset.
# ====================================

def update_asset_profile(
        db,
        asset,
        asset_type,
        cleaning_frequency,
        observed_material,
        access_opening_type,
        can_place_equipment_nearby,
        pain_point
):
    if asset_type:
        asset.asset_type = asset_type

    if cleaning_frequency:
        asset.cleaning_frequency = cleaning_frequency

    if observed_material:
        asset.observed_material = observed_material

    if access_opening_type:
        asset.access_opening_type = access_opening_type

    if can_place_equipment_nearby is not None:
        asset.can_place_equipment_nearby = can_place_equipment_nearby

    if pain_point:
        asset.pain_point = pain_point

    db.commit()
    db.refresh(asset)

    return asset


# ====================================
# SURVEY PROFILE
# Second write-back point (the first is update_asset_profile above,
# from Customer Request) - merges the site/geometry/access/pump
# fields learned during a Sales Survey onto the linked Asset's
# `profile` JSONB column, so the site's profile keeps accumulating
# across both stages of the workflow.
# ====================================

def set_asset_survey_profile(
        db,
        asset,
        profile_dict
):
    asset.profile = profile_dict

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
# ENQUIRY BY CUSTOMER REQUEST
# Resolves the asset linked to a given Customer Request (via its
# Enquiry row's asset_id) - used to find which Asset a Sales Survey's
# profile write-back should land on, since SalesSurvey only carries
# customer_request_id, not asset_id directly.
# ====================================

def get_enquiry_by_customer_request(
        db,
        customer_request_id
):
    return (
        db.query(
            Enquiry
        )
        .filter(
            Enquiry.customer_request_id == customer_request_id
        )
        .first()
    )


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
