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
    update_customer,
    update_customer_owner,
    delete_customer,
    list_contacts,
    add_contact,
    get_contact,
    delete_contact,
    list_assets,
    get_asset,
    find_asset_by_path,
    create_asset,
    update_asset,
    update_asset_profile,
    delete_asset,
    get_enquiries_by_asset,
    set_asset_survey_profile,
    get_enquiry_by_customer_request,
    set_follow_up,
    list_linked_enquiries
)

from backend.repositories.notification_repository import record_change, record_business_master_change

from backend.models.users import User


# ====================================
# USER NAME LOOKUP
# One query for every customer list/detail read, rather than one
# per row - resolves owner_user_id/created_by_user_id into display
# names for the "Account Owner"/"Created By" fields.
# ====================================

def _user_name_map(db):
    return {
        user.id: user.name
        for user in db.query(User).all()
    }


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

# Mirrors frontend/src/data/surveyProfileFields.js's SURVEY_PROFILE_FIELDS
# exactly (same keys, same section split, "customer"/"job" groups first
# since those are new this pass) - kept in sync by hand since the two
# run in different languages. Deliberately excludes setup_distance,
# ph_condition, disposal_route (real SalesSurvey columns with no input
# anywhere in the actual form - see that file's header comment) and
# excludes survey_trigger/tentative_start_date/tentative_end_date from
# Section A (explicitly asked to be left out) and plant_site_location
# (a read-only Section A display field sourced from the asset itself,
# not a real survey input).
SURVEY_PROFILE_FIELDS = [
    # Section A - Customer/Opportunity
    "nearest_hub", "urgency", "survey_date", "surveyed_by", "repeat_potential",
    # Section B - Job/Sludge
    "cleaning_date", "material_ph_condition", "sample_available", "temperature_range",
    # Section B - Sludge Details
    "material_category", "tank_type", "sludge_hardness", "debris_level",
    "water_visibility", "hazard_level",
    # Section C - Geometry
    "tank_length", "tank_width", "tank_depth",
    "opening_length", "opening_width", "opening_height",
    "height_from_ground", "drop_to_floor",
    "vertical_lift", "hose_distance", "access_path_width",
    "access_support", "customer_support", "access_type", "equipment_nearby",
    "scaffolding_needed", "crane_available", "tank_location", "setup_complexity",
    # Section D - Safety / utilities
    "power_available", "water_available", "air_supply_available",
    "confined_space", "ventilation_required", "gas_testing_required",
    "ehs_restriction", "power_distance",
    # Section E - Pump / discharge
    "abrasiveness", "pump_power_source",
    "discharge_medium", "disposal_responsibility",
    "discharge_point_distance", "suction_depth", "discharge_distance",
    "discharge_pit_dimension",
    # Section G - Customer Insights
    "customer_pain_point", "shutdown_window", "current_method",
    "budget_estimate", "decision_maker"
]

# Section F - Dewatering. Conditional: only synced into the profile
# when this survey's own dewatering_required == "Yes" - when "No" (or
# unset), none of these 15 keys are written at all, not even a "No"
# for dewatering_required itself. set_asset_survey_profile() replaces
# the whole profile dict wholesale (not a merge), so simply omitting
# these keys from profile_dict is what makes a later "No" survey
# correctly clear out any dewatering data an earlier "Yes" survey left
# behind, rather than leaving it stale.
DEWATERING_PROFILE_FIELDS = [
    "dewatering_required", "dewatering_volume", "inlet_moisture",
    "target_final_moisture", "expected_final_form", "visible_free_water",
    "natural_settling", "oily_emulsified", "space_available",
    "filtrate_route", "moisture_guarantee", "cake_handling_scope",
    "filtrate_route_detail", "polymer_allowed", "commitment"
]


def _profile_safe_value(value):
    # Date/datetime columns (survey_date, cleaning_date, ...) aren't
    # JSON-serializable as-is into a JSONB column - isoformat() them,
    # same treatment last_survey_date already got before this pass.
    if hasattr(value, "isoformat"):
        return value.isoformat()
    return value


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

    all_fields = list(SURVEY_PROFILE_FIELDS)

    if survey.dewatering_required == "Yes":
        all_fields += DEWATERING_PROFILE_FIELDS

    profile_dict = {
        field: _profile_safe_value(getattr(survey, field))
        for field in all_fields
    }

    profile_dict["last_survey_id"] = survey.id

    profile_dict["last_survey_date"] = (
        survey.survey_date.isoformat() if survey.survey_date else None
    )

    before_profile = dict(asset.profile or {})

    updated_asset = set_asset_survey_profile(db, asset, profile_dict)

    if actor:

        changes = []

        changed_fields = set(before_profile.keys()) | set(profile_dict.keys())

        for field in changed_fields:

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
# ASSET PROFILE -> SALES SURVEY PREFILL
# The read side of SURVEY_PROFILE_FIELDS/sync_asset_profile_from_survey
# above - maps a saved Asset.profile blob (keyed by SalesSurvey column
# names) back into the {job, geometry, safety, pump} shape
# get_sales_prefill() returns, so a repeat survey at a known asset
# starts pre-filled with the site's last recorded details instead of
# asking the field team to re-measure everything from scratch. Field
# names differ in a few places between the SalesSurvey model (used to
# build the stored profile) and the Sales Survey form's own section
# field keys (used here) - tank_length/tank_width/tank_depth become
# geometry.length_dia/width/sludge_depth; everything else matches 1:1.
# ====================================

PROFILE_FIELD_MAP = {
    "material_category": ("job", "material_category"),
    "sludge_hardness": ("job", "sludge_hardness"),
    "debris_level": ("job", "debris_level"),
    "water_visibility": ("job", "water_visibility"),
    "hazard_level": ("job", "hazard_level"),
    "abrasiveness": ("job", "abrasiveness"),

    "tank_type": ("geometry", "tank_type"),
    "tank_length": ("geometry", "length_dia"),
    "tank_width": ("geometry", "width"),
    "tank_depth": ("geometry", "sludge_depth"),
    "opening_length": ("geometry", "opening_length"),
    "opening_width": ("geometry", "opening_width"),
    "opening_height": ("geometry", "opening_height"),
    "height_from_ground": ("geometry", "height_from_ground"),
    "drop_to_floor": ("geometry", "drop_to_floor"),
    "setup_distance": ("geometry", "setup_distance"),
    "vertical_lift": ("geometry", "vertical_lift"),
    "hose_distance": ("geometry", "hose_distance"),
    "access_path_width": ("geometry", "access_path_width"),
    "access_support": ("geometry", "access_support"),
    "customer_support": ("geometry", "customer_support"),
    "access_type": ("geometry", "access_type"),
    "equipment_nearby": ("geometry", "equipment_nearby"),
    "scaffolding_needed": ("geometry", "scaffolding_needed"),
    "crane_available": ("geometry", "crane_available"),
    "tank_location": ("geometry", "tank_location"),
    "setup_complexity": ("geometry", "setup_complexity"),

    "power_available": ("safety", "power_available"),
    "water_available": ("safety", "water_available"),
    "air_supply_available": ("safety", "air_supply_available"),
    "confined_space": ("safety", "confined_space"),
    "ventilation_required": ("safety", "ventilation_required"),
    "gas_testing_required": ("safety", "gas_testing_required"),
    "ehs_restriction": ("safety", "ehs_restriction"),
    "power_distance": ("safety", "power_distance"),

    "ph_condition": ("pump", "ph_condition"),
    "pump_power_source": ("pump", "pump_power_source"),
    "discharge_medium": ("pump", "discharge_medium"),
    "disposal_route": ("pump", "disposal_route"),
    "disposal_responsibility": ("pump", "disposal_responsibility"),
    "discharge_point_distance": ("pump", "discharge_point_distance"),
}


# Real Boolean columns on SalesSurvey - the live survey path
# (sales_survey_service.py's own "safety"/"geometry" builders)
# converts each of these to a "Yes"/"No" string before display rather
# than passing the raw boolean through; matched here so a repeat
# survey's prefilled values render identically to a submitted one.
BOOLEAN_PROFILE_FIELDS = {
    "water_available", "confined_space", "ventilation_required",
    "gas_testing_required", "scaffolding_needed", "crane_available"
}


def build_prefill_from_asset_profile(profile):

    sections = {"job": {}, "geometry": {}, "safety": {}, "pump": {}}

    if not profile:
        return sections

    for profile_field, (section, prefill_key) in PROFILE_FIELD_MAP.items():

        value = profile.get(profile_field)

        if value is None:
            continue

        if profile_field in BOOLEAN_PROFILE_FIELDS:
            value = "Yes" if value else "No"

        sections[section][prefill_key] = value

    return sections


def get_asset_for_customer_request(db, customer_request_id):

    enquiry = get_enquiry_by_customer_request(db, customer_request_id)

    if not enquiry or not enquiry.asset_id:
        return None

    return get_asset(db, enquiry.asset_id)


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
        "customer_id": asset.customer_id,
        "division": asset.division,
        "plant": asset.plant,
        "department": asset.department,
        "name": asset.name,
        "asset_type": asset.asset_type,
        "cleaning_frequency": asset.cleaning_frequency,
        "observed_material": asset.observed_material,
        "access_opening_type": asset.access_opening_type,
        "can_place_equipment_nearby": asset.can_place_equipment_nearby,
        "pain_point": asset.pain_point,
        "profile": asset.profile,
        "created_at": asset.created_at
    }

from backend.models.techno_commercial_quote import Quote

from backend.models.enquiry import Enquiry

from backend.models.asset import Asset

from backend.models.customer_requests import CustomerRequest

from backend.models.customer_master import CustomerContact

from backend.services.workflow_service import WorkflowStage, WORKFLOW_ORDER

from backend.utils.job_on import compute_job_on


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
# CUSTOMER -> LIST ITEM DICT
# Shared row-builder - used by list_customers_request (many rows) and
# by the create-customer API route (one row, the just-created customer).
# ====================================

def build_customer_list_item(db, customer, user_names=None):

    user_names = user_names if user_names is not None else _user_name_map(db)

    return {
        "id": customer.id,
        "company_name": customer.company_name,
        "category": customer.category,
        "industry": customer.industry,
        "region": customer.region,
        "owner": customer.owner,
        "owner_user_id": customer.owner_user_id,
        "owner_name": user_names.get(customer.owner_user_id),
        "created_by_user_id": customer.created_by_user_id,
        "created_by_name": user_names.get(customer.created_by_user_id),
        "assets_count": count_assets(db, customer.id),
        "next_follow_up_date": (
            customer.next_follow_up_date.isoformat()
            if customer.next_follow_up_date else None
        ),
        "next_follow_up_note": customer.next_follow_up_note,
        "follow_up_bucket": _follow_up_bucket(customer.next_follow_up_date)
    }


# ====================================
# LIST CUSTOMERS
# ====================================

def list_customers_request(
        db
):
    customers = list_customers(db)

    user_names = _user_name_map(db)

    return [
        build_customer_list_item(db, customer, user_names)
        for customer in customers
    ]


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
                {"field": "region", "before": None, "after": customer.region},
                {"field": "created_by", "before": None, "after": payload.actor.name}
            ],
            remark=payload.remark
        )

    return customer


# ====================================
# UPDATE CUSTOMER OWNER (Account Owner reassignment)
# ====================================

def update_customer_owner_request(
        db,
        customer_id,
        payload
):
    customer = get_customer(db, customer_id)

    if not customer:
        return None

    user_names = _user_name_map(db)

    before_name = user_names.get(customer.owner_user_id)
    after_name = user_names.get(payload.owner_user_id)

    updated = update_customer_owner(db, customer, payload.owner_user_id)

    if before_name != after_name:

        record_business_master_change(
            db=db,
            module="Business Masters",
            action="UPDATE",
            actor_user_id=payload.actor.user_id,
            actor_name=payload.actor.name,
            actor_role=payload.actor.role,
            title=f"{payload.actor.name} reassigned the Account Owner for '{updated.company_name}' in Business Masters",
            changes=[
                {"field": "owner", "before": before_name, "after": after_name}
            ],
            remark=payload.remark
        )

    return updated


# ====================================
# UPDATE CUSTOMER (full edit - admin-only, gated client-side)
# ====================================

def update_customer_request(
        db,
        customer_id,
        payload
):
    customer = get_customer(db, customer_id)

    if not customer:
        return None

    before = {
        "company_name": customer.company_name,
        "category": customer.category,
        "industry": customer.industry,
        "region": customer.region,
        "gst_number": customer.gst_number
    }

    updated = update_customer(db, customer, payload)

    changes = [
        {"field": field, "before": before_value, "after": getattr(updated, field)}
        for field, before_value in before.items()
        if before_value != getattr(updated, field)
    ]

    if changes:

        record_business_master_change(
            db=db,
            module="Business Masters",
            action="UPDATE",
            actor_user_id=payload.actor.user_id,
            actor_name=payload.actor.name,
            actor_role=payload.actor.role,
            title=f"{payload.actor.name} updated customer '{updated.company_name}' in Business Masters",
            changes=changes,
            remark=payload.remark
        )

    return updated


# ====================================
# DELETE CUSTOMER (admin-only, gated client-side)
# Blocked outright if the customer has any assets or linked
# enquiries on file - neither is cascaded, both are real records
# other parts of the app depend on (Enquiry.customer_id/asset_id
# have no ON DELETE CASCADE).
# ====================================

def delete_customer_request(
        db,
        customer_id,
        actor,
        remark
):
    customer = get_customer(db, customer_id)

    if not customer:
        return "not_found"

    if count_assets(db, customer_id) or list_linked_enquiries(db, customer.id, customer.company_name):

        raise ValueError(
            "Cannot delete a customer with assets or enquiries on file. Remove them first."
        )

    company_name = customer.company_name

    delete_customer(db, customer)

    record_business_master_change(
        db=db,
        module="Business Masters",
        action="DELETE",
        actor_user_id=actor.user_id,
        actor_name=actor.name,
        actor_role=actor.role,
        title=f"{actor.name} deleted customer '{company_name}' from Business Masters",
        changes=[{"field": "company_name", "before": company_name, "after": None}],
        remark=remark
    )

    return "deleted"


# ====================================
# UPDATE ASSET (division/plant/department/name)
# Every dependent module (Sales Survey's "Existing asset" picker,
# the Enquiry Workspace's Asset Profile card, this same Customer 360
# view/export) resolves this Asset row live on every read - there is
# no separate cached copy of these 4 fields anywhere else in the app
# for this update to fall out of sync with, so a straight in-place
# write is all "dependent modules must reflect this change" needs.
# ====================================

def update_asset_request(
        db,
        asset_id,
        payload
):
    asset = get_asset(db, asset_id)

    if not asset:
        return None

    before = {
        "division": asset.division,
        "plant": asset.plant,
        "department": asset.department,
        "name": asset.name
    }

    customer = get_customer(db, asset.customer_id) if asset.customer_id else None

    updated = update_asset(
        db, asset,
        payload.division, payload.plant, payload.department, payload.name
    )

    changes = [
        {"field": field, "before": before_value, "after": getattr(updated, field)}
        for field, before_value in before.items()
        if before_value != getattr(updated, field)
    ]

    if changes:

        record_business_master_change(
            db=db,
            module="Business Masters",
            action="UPDATE",
            actor_user_id=payload.actor.user_id,
            actor_name=payload.actor.name,
            actor_role=payload.actor.role,
            title=(
                f"{payload.actor.name} updated asset '{updated.name or 'Unnamed asset'}' "
                f"for {customer.company_name if customer else 'a customer'} in Business Masters"
            ),
            changes=changes,
            remark=payload.remark
        )

    return updated


# ====================================
# DELETE ASSET (admin-only, gated client-side)
# Blocked outright if any enquiry still references this asset -
# Enquiry.asset_id has no ON DELETE CASCADE.
# ====================================

def delete_asset_request(
        db,
        asset_id,
        actor,
        remark
):
    asset = get_asset(db, asset_id)

    if not asset:
        return "not_found"

    if get_enquiries_by_asset(db, asset_id):

        raise ValueError(
            "Cannot delete an asset with enquiries on file. Remove them first."
        )

    label = " → ".join(filter(None, [
        asset.division, asset.plant, asset.department, asset.name
    ])) or "Unnamed asset"

    customer = get_customer(db, asset.customer_id) if asset.customer_id else None

    delete_asset(db, asset)

    record_business_master_change(
        db=db,
        module="Business Masters",
        action="DELETE",
        actor_user_id=actor.user_id,
        actor_name=actor.name,
        actor_role=actor.role,
        title=(
            f"{actor.name} deleted asset '{label}' from "
            f"{customer.company_name if customer else 'a customer'} in Business Masters"
        ),
        changes=[{"field": "asset", "before": label, "after": None}],
        remark=remark
    )

    return "deleted"


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

    user_names = _user_name_map(db)

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
            "observed_material": asset.observed_material,
            "access_opening_type": asset.access_opening_type,
            "can_place_equipment_nearby": asset.can_place_equipment_nearby,
            "pain_point": asset.pain_point,
            "profile": asset.profile,
            "created_at": asset.created_at
        }
        for asset in list_assets(db, customer_id)
    ]

    assets_by_id = {a["id"]: a for a in assets}

    linked_enquiries = []

    for enquiry in list_linked_enquiries(db, customer.id, customer.company_name):

        value = None

        if enquiry.quote_id:

            quote = (
                db.query(Quote)
                .filter(Quote.id == enquiry.quote_id)
                .first()
            )

            if quote:
                value = quote.final_approved_value or quote.combined_budgetary_value_max

        asset = assets_by_id.get(enquiry.asset_id)

        customer_request = (
            db.query(CustomerRequest)
            .filter(CustomerRequest.id == enquiry.customer_request_id)
            .first()
        )

        job_on = compute_job_on(
            asset["plant"] if asset else None,
            asset["name"] if asset else None,
            customer_request.plant_site_location if customer_request else None
        )

        linked_enquiries.append({
            "id": enquiry.id,
            "stage": enquiry.stage,
            "status": enquiry.status,
            "value": value,
            "job_on": job_on,
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
        "owner_user_id": customer.owner_user_id,
        "owner_name": user_names.get(customer.owner_user_id),
        "created_by_user_id": customer.created_by_user_id,
        "created_by_name": user_names.get(customer.created_by_user_id),
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
# DELETE CONTACT
# ====================================

def delete_contact_request(
        db,
        contact_id,
        actor,
        remark
):
    contact = get_contact(db, contact_id)

    if not contact:
        return "not_found"

    customer = get_customer(db, contact.customer_id) if contact.customer_id else None

    label = contact.name or "Unnamed contact"

    delete_contact(db, contact)

    record_business_master_change(
        db=db,
        module="Business Masters",
        action="DELETE",
        actor_user_id=actor.user_id,
        actor_name=actor.name,
        actor_role=actor.role,
        title=(
            f"{actor.name} removed contact '{label}' from "
            f"{customer.company_name if customer else 'a customer'} in Business Masters"
        ),
        changes=[
            {"field": "name", "before": label, "after": None},
            {"field": "designation", "before": contact.designation, "after": None},
            {"field": "email", "before": contact.email, "after": None},
            {"field": "phone", "before": contact.phone, "after": None}
        ],
        remark=remark
    )

    return "deleted"


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


# ====================================
# CUSTOMERS REPORT (3-sheet Excel export for the Customers tab)
#
# Definitions confirmed with the user before building this:
# - "Closed job" = an enquiry whose stage reached COMPLETED (not the
#   separate manual "Close enquiry" lifecycle action, which can be
#   applied at any stage and would over-count unfinished jobs).
# - "Invoice value" - this app has no literal monetary invoice table;
#   it maps to Quote.final_approved_value, counted only once a quote
#   has actually been through Commercial Approval (blank/0 before
#   that - no fallback to the pre-approval budgetary range).
# - "Open enquiry" = stage is anywhere from Customer Request through
#   PO Received inclusive (WORKFLOW_ORDER indices 0-6); Job Creation/
#   Execution/Completed are not counted as open.
# - Sheet 2's per-asset "Enquiry Stage" = the stage of that asset's
#   currently-open enquiry (most recently created if more than one is
#   open at once); blank if none are open.
#
# Attribution caveat (not a bug, a real historical-data limit):
# Enquiry.customer_id/asset_id only exist and get populated from
# Phase 2 onward (2026-08-04) - any enquiry created before that has
# both null and cannot be attributed to a customer/asset here.
# ====================================

_OPEN_STAGE_VALUES = {
    stage.value for stage in WORKFLOW_ORDER[:WORKFLOW_ORDER.index(WorkflowStage.PO_RECEIVED) + 1]
}

_CLOSED_STAGE_VALUE = WorkflowStage.COMPLETED.value


def build_customers_report(
        db
):
    customers = list_customers(db)

    assets = (
        db.query(Asset)
        .order_by(Asset.id)
        .all()
    )

    enquiries = (
        db.query(Enquiry)
        .filter(Enquiry.customer_id.isnot(None))
        .all()
    )

    quote_ids = {
        enquiry.quote_id
        for enquiry in enquiries
        if enquiry.quote_id
    }

    quotes_by_id = {
        quote.id: quote
        for quote in (
            db.query(Quote).filter(Quote.id.in_(quote_ids)).all()
            if quote_ids else []
        )
    }

    user_names = _user_name_map(db)

    contacts_by_customer = {}

    for contact in db.query(CustomerContact).order_by(CustomerContact.id).all():
        contacts_by_customer.setdefault(contact.customer_id, []).append(contact)

    enquiries_by_customer = {}
    enquiries_by_asset = {}

    for enquiry in enquiries:

        enquiries_by_customer.setdefault(enquiry.customer_id, []).append(enquiry)

        if enquiry.asset_id:
            enquiries_by_asset.setdefault(enquiry.asset_id, []).append(enquiry)

    assets_by_customer = {}

    for asset in assets:
        assets_by_customer.setdefault(asset.customer_id, []).append(asset)

    def approved_value_sum(enquiry_list):

        total = 0.0
        found_any = False

        for enquiry in enquiry_list:

            quote = quotes_by_id.get(enquiry.quote_id)

            if quote and quote.final_approved_value is not None:
                total += float(quote.final_approved_value)
                found_any = True

        return total if found_any else None

    summary_rows = []
    asset_rows = []
    contact_rows = []

    for customer in customers:

        customer_enquiries = enquiries_by_customer.get(customer.id, [])

        account_manager = user_names.get(customer.owner_user_id)

        total_closed_jobs = sum(
            1 for e in customer_enquiries if e.stage == _CLOSED_STAGE_VALUE
        )

        summary_rows.append({
            "company": customer.company_name,
            "industry": customer.industry,
            "location": customer.region,
            "account_manager": account_manager,
            "total_enquiries": len(customer_enquiries),
            "total_closed_jobs": total_closed_jobs,
            "invoice_value": approved_value_sum(customer_enquiries)
        })

        customer_assets = assets_by_customer.get(customer.id, [])

        for asset in customer_assets:

            asset_enquiries = enquiries_by_asset.get(asset.id, [])

            closed = [e for e in asset_enquiries if e.stage == _CLOSED_STAGE_VALUE]
            open_ = [e for e in asset_enquiries if e.stage in _OPEN_STAGE_VALUES]

            active_stage = None

            if open_:
                latest_open = max(open_, key=lambda e: e.created_at or datetime.min)
                active_stage = latest_open.stage

            last_closed_date = None

            if closed:
                last_closed = max(closed, key=lambda e: e.stage_entered_at or datetime.min)
                last_closed_date = (
                    last_closed.stage_entered_at.date().isoformat()
                    if last_closed.stage_entered_at else None
                )

            asset_rows.append({
                "company_name": customer.company_name,
                "asset_name": asset.name,
                "closed_jobs_count": len(closed),
                "open_enquiries_count": len(open_),
                "enquiry_stage": active_stage,
                "last_closed_job_date": last_closed_date,
                "next_follow_up_date": (
                    customer.next_follow_up_date.isoformat()
                    if customer.next_follow_up_date else None
                ),
                "invoice_value": approved_value_sum(asset_enquiries),
                "account_manager": account_manager
            })

        customer_contacts = contacts_by_customer.get(customer.id, [])

        base_row = {
            "company_name": customer.company_name,
            "category": customer.category,
            "industry": customer.industry,
            "region": customer.region,
            "gst_number": customer.gst_number,
            "account_manager": account_manager
        }

        if not customer_contacts:

            contact_rows.append({
                **base_row,
                "poc_name": None,
                "poc_designation": None,
                "poc_email": None,
                "poc_phone": None
            })

        else:

            for contact in customer_contacts:

                contact_rows.append({
                    **base_row,
                    "poc_name": contact.name,
                    "poc_designation": contact.designation,
                    "poc_email": contact.email,
                    "poc_phone": contact.phone
                })

    return {
        "summary": summary_rows,
        "assets": asset_rows,
        "contacts": contact_rows
    }
