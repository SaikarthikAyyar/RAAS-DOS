from sqlalchemy.orm import Session

from backend.models.users import User
from backend.models.partners import Partner

from backend.schemas.administrationPartners_schema import (
    AdministrationPartnerCreate,
    AdministrationPartnerUpdate,
)


# ==========================================================
# GET ALL PARTNERS
# ==========================================================

def get_all_partners(
    db: Session,
):

    print(
        "[Administration Partners Service] -> Fetching all partners..."
    )

    partners = (

        db.query(Partner)

        .order_by(

            Partner.id

        )

        .all()

    )

    print(

        f"[Administration Partners Service] -> {len(partners)} partners fetched."

    )

    return partners


# ==========================================================
# GET PARTNER BY ID
# ==========================================================

def get_partner_by_id(
    partner_id: int,
    db: Session,
):

    print(

        f"[Administration Partners Service] -> Fetching partner {partner_id}"

    )

    partner = (

        db.query(Partner)

        .filter(

            Partner.id == partner_id

        )

        .first()

    )

    if partner:

        print(

            "[Administration Partners Service] -> Partner found."

        )

    else:

        print(

            "[Administration Partners Service] -> Partner not found."

        )

    return partner


# ==========================================================
# CREATE PARTNER
# ==========================================================

def create_partner(

    payload,

    db: Session,

):

    print(

        "[Administration Partners Service] -> Creating Partner..."

    )

    # ==========================================
    # FIND CORRESPONDING USER
    # ==========================================

    user = (

        db.query(User)

        .filter(

            User.email == payload.email

        )

        .first()

    )

    if not user:

        raise ValueError(

            "Partner user does not exist."

        )

    if user.role.lower() != "partner":

        raise ValueError(

            "Selected user is not a partner."

        )

    # ==========================================
    # PREVENT DUPLICATE PARTNER RECORD
    # ==========================================

    existing = (

        db.query(Partner)

        .filter(

            Partner.user_id == user.id

        )

        .first()

    )

    if existing:

        raise ValueError(

            "Partner record already exists."

        )

    # ==========================================
    # CREATE PARTNER
    # ==========================================

    partner = Partner(

        user_id=user.id,

        partner_firm_name=payload.partner_firm_name,

        primary_contact=payload.primary_contact,

        email=payload.email,

        phone=payload.phone,

        commission_percentage=payload.commission_percentage,

        linked_customer_company_record=payload.linked_customer_company_record,

        is_active=payload.is_active,

    )

    db.add(

        partner

    )

    db.commit()

    db.refresh(

        partner

    )

    print(

        "[Administration Partners Service] -> Partner Created."

    )

    return partner


# ==========================================================
# UPDATE PARTNER
# ==========================================================

def update_partner(

    partner_id: int,

    payload: AdministrationPartnerUpdate,

    db: Session,

):

    print(

        f"[Administration Partners Service] -> Updating partner {partner_id}"

    )

    partner = (

        db.query(Partner)

        .filter(

            Partner.id == partner_id

        )

        .first()

    )

    if not partner:

        print(

            "[Administration Partners Service] -> Partner not found."

        )

        return None

    update_data = payload.model_dump(

        exclude_unset=True

    )

    for field, value in update_data.items():

        setattr(

            partner,

            field,

            value,

        )

        print(

            f"      Updated {field} -> {value}"

        )

    db.commit()

    db.refresh(

        partner

    )

    print(

        "[Administration Partners Service] -> Update completed."

    )

    return partner


# ==========================================================
# TOGGLE STATUS
# ==========================================================

def toggle_partner_status(

    partner_id: int,

    db: Session,

):

    print(

        f"[Administration Partners Service] -> Toggling partner {partner_id}"

    )

    partner = (

        db.query(Partner)

        .filter(

            Partner.id == partner_id

        )

        .first()

    )

    if not partner:

        print(

            "[Administration Partners Service] -> Partner not found."

        )

        return None

    partner.is_active = not partner.is_active

    db.commit()

    db.refresh(

        partner

    )

    print(

        f"[Administration Partners Service] -> Active = {partner.is_active}"

    )

    return partner


# ==========================================================
# DELETE PARTNER
# ==========================================================

def delete_partner(

    partner_id: int,

    db: Session,

):

    print(

        f"[Administration Partners Service] -> Deleting partner {partner_id}"

    )

    partner = (

        db.query(Partner)

        .filter(

            Partner.id == partner_id

        )

        .first()

    )

    if not partner:

        print(

            "[Administration Partners Service] -> Partner not found."

        )

        return False

    db.delete(

        partner

    )

    db.commit()

    print(

        "[Administration Partners Service] -> Partner deleted."

    )

    return True