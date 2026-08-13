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
    update_asset_profile,
    set_asset_survey_profile,
    get_enquiry_by_customer_request,
    set_follow_up,
    list_linked_enquiries
)

from backend.repositories.notification_repository import record_change, record_business_master_change


# ====================================
# SURVEY -> ASSET PROFILE WRITE-BACK
# The second of the two write-backs the Asset record receives
# (the first is at Customer Request submission, via
# resolve_or_create_asset/update_asset_profile). Site/geometry/
# access/pump fields that Sales Survey confirms in person, scoped to
# match the Asset.profile column's own reserved intent ("geometry/
# access/pump fields"). No-op if this Customer Request's Enquiry has
# no linked asset (e.g. a request with no existing-asset match).
# ====================================

SURVEY_PROFILE_FIELDS = [
    # Material / site condition
    "material_category", "tank_type", "sludge_hardness", "debris_level",
    "water_visibility", "hazard_level",
    # Geometry / access
    "tank_length", "tank_width", "tank_depth",
    "opening_length", "opening_width", "opening_height",
    "height_from_ground", "drop_to_floor", "setup_distance",
    "vertical_lift", "hose_distance", "access_path_width",
    "access_support", "customer_support", "access_type", "equipment_nearby",
    "scaffolding_needed", "crane_available", "tank_location", "setup_complexity",
    # Safety / utilities
    "power_available", "water_available", "air_supply_available",
    "confined_space", "ventilation_required", "gas_testing_required",
    "ehs_restriction", "power_distance",
    # Pump / discharge
    "abrasiveness", "ph_condition", "pump_power_source",
    "discharge_medium", "disposal_route", "disposal_responsibility",
    "discharge_point_distance"
]


def sync_asset_profile_from_survey(
        db,
        survey,
        actor=None,
        enquiry=None
):
    enquiry = enquiry or get_enquiry_by_customer_request(db, survey.customer_request_id)

    if not enquiry or not enquiry.asset_id:
        return None

    asset = get_asset(db, enquiry.asset_id)

    if not asset:
        return None

    profile_dict = {
        field: getattr(survey, field)
        for field in SURVEY_PROFILE_FIELDS
    }

    profile_dict["last_survey_id"] = survey.id

    profile_dict["last_survey_date"] = (
        survey.survey_date.isoformat() if survey.survey_date else None
    )

    before_profile = dict(asset.profile or {})

    updated_asset = set_asset_survey_profile(db, asset, profile_dict)

    if actor:

        changes = []

        for field in SURVEY_PROFILE_FIELDS:

            before = before_profile.get(field)
            after = profile_dict.get(field)

            if before != after:
                changes.append({"field": field, "before": before, "after": after})

        if changes:

            record_change(
                db=db,
                module="Business Masters",
                action="UPDATE",
                actor_user_id=actor["user_id"],
                actor_name=actor["name"],
                actor_role=actor["role"],
                enquiry_id=enquiry.id,
                customer_name=enquiry.customer_name,
                title=f"{actor['name']} updated the asset profile for {enquiry.customer_name or 'Unknown'} via Sales Survey",
                changes=changes
            )

    return updated_asset


# ====================================
# ASSET DETAIL (single asset - for the Enquiry Workspace's
# Asset Profile card, shown before a Sales Survey has ever been
# submitted for an enquiry linked to a known asset)
# ====================================

def get_asset_detail_request(
        db,
        asset_id
):
    asset = get_asset(db, asset_id)

    if not asset:
        return None

    return {
        "id": asset.id,
        "division": asset.division,
        "plant": asset.plant,
        "department": asset.department,
        "name": asset.name,
        "asset_type": asset.asset_type,
        "cleaning_frequency": asset.cleaning_frequency,
        "next_due": asset.next_due.isoformat() if asset.next_due else None,
        "last_verified": asset.last_verified.isoformat() if asset.last_verified else None,
        "verified_by": asset.verified_by,
        "observed_material": asset.observed_material,
        "access_opening_type": asset.access_opening_type,
        "can_place_equipment_nearby": asset.can_place_equipment_nearby,
        "pain_point": asset.pain_point
    }

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
    already_existed = get_customer_by_company_name(db, payload.company_name) is not None

    customer = create_customer(db, payload)

    if not already_existed:

        record_business_master_change(
            db=db,
            module="Business Masters",
            action="CREATE",
            actor_user_id=payload.actor.user_id,
            actor_name=payload.actor.name,
            actor_role=payload.actor.role,
            title=f"{payload.actor.name} created customer '{customer.company_name}' in Business Masters",
            changes=[
                {"field": "company_name", "before": None, "after": customer.company_name},
                {"field": "category", "before": None, "after": customer.category},
                {"field": "industry", "before": None, "after": customer.industry},
                {"field": "region", "before": None, "after": customer.region}
            ],
            remark=payload.remark
        )

    return customer


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
            "customer_id": asset.customer_id,
            "division": asset.division,
            "plant": asset.plant,
            "department": asset.department,
            "name": asset.name,
            "asset_type": asset.asset_type,
            "cleaning_frequency": asset.cleaning_frequency,
            "last_cleaned": asset.last_cleaned.isoformat() if asset.last_cleaned else None,
            "next_due": asset.next_due.isoformat() if asset.next_due else None,
            "last_verified": asset.last_verified.isoformat() if asset.last_verified else None,
            "verified_by": asset.verified_by,
            "observed_material": asset.observed_material,
            "access_opening_type": asset.access_opening_type,
            "can_place_equipment_nearby": asset.can_place_equipment_nearby,
            "pain_point": asset.pain_point,
            "profile": asset.profile,
            "created_at": asset.created_at
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
        "created_at": customer.created_at,
        "updated_at": customer.updated_at,
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
    customer = get_customer(db, customer_id)

    contact = add_contact(db, customer_id, payload)

    record_business_master_change(
        db=db,
        module="Business Masters",
        action="CREATE",
        actor_user_id=payload.actor.user_id,
        actor_name=payload.actor.name,
        actor_role=payload.actor.role,
        title=(
            f"{payload.actor.name} added contact '{contact.name}' to "
            f"{customer.company_name if customer else 'a customer'} in Business Masters"
        ),
        changes=[
            {"field": "name", "before": None, "after": contact.name},
            {"field": "designation", "before": None, "after": contact.designation},
            {"field": "email", "before": None, "after": contact.email},
            {"field": "phone", "before": None, "after": contact.phone}
        ],
        remark=payload.remark
    )

    return contact


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

    customer_before = get_customer(db, customer_id)

    before_date = customer_before.next_follow_up_date if customer_before else None
    before_owner = customer_before.next_follow_up_owner if customer_before else None
    before_note = customer_before.next_follow_up_note if customer_before else None

    customer = set_follow_up(db, customer_id, payload_with_parsed_date)

    if customer:

        changes = []

        if before_date != customer.next_follow_up_date:
            changes.append({"field": "next_follow_up_date", "before": before_date, "after": customer.next_follow_up_date})

        if before_owner != customer.next_follow_up_owner:
            changes.append({"field": "next_follow_up_owner", "before": before_owner, "after": customer.next_follow_up_owner})

        if before_note != customer.next_follow_up_note:
            changes.append({"field": "next_follow_up_note", "before": before_note, "after": customer.next_follow_up_note})

        if changes:

            record_business_master_change(
                db=db,
                module="Business Masters",
                action="UPDATE",
                actor_user_id=payload.actor.user_id,
                actor_name=payload.actor.name,
                actor_role=payload.actor.role,
                title=f"{payload.actor.name} updated the follow-up for {customer.company_name} in Business Masters",
                changes=changes,
                remark=payload.remark
            )

    return customer


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
            ])),
            "division": asset.division,
            "plant": asset.plant,
            "department": asset.department,
            "name": asset.name,
            "asset_type": asset.asset_type,
            "cleaning_frequency": asset.cleaning_frequency,
            "observed_material": asset.observed_material,
            "access_opening_type": asset.access_opening_type,
            "can_place_equipment_nearby": asset.can_place_equipment_nearby,
            "pain_point": asset.pain_point
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
        cleaning_frequency,
        observed_material=None,
        access_opening_type=None,
        can_place_equipment_nearby=None,
        pain_point=None
):
    if asset_id:
        asset = get_asset(db, asset_id)

        if asset:
            return update_asset_profile(
                db, asset, asset_type, cleaning_frequency,
                observed_material, access_opening_type,
                can_place_equipment_nearby, pain_point
            )

        return None

    if not (plant and name):
        return None

    division = division or "Main"

    department = department or "General"

    existing = find_asset_by_path(db, customer_id, division, plant, department, name)

    if existing:
        return update_asset_profile(
            db, existing, asset_type, cleaning_frequency,
            observed_material, access_opening_type,
            can_place_equipment_nearby, pain_point
        )

    return create_asset(
        db,
        customer_id,
        division,
        plant,
        department,
        name,
        asset_type,
        cleaning_frequency,
        observed_material,
        access_opening_type,
        can_place_equipment_nearby,
        pain_point
    )
