from typing import List

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.administrationPartners_schema import (
    AdministrationPartnerCreate,
    AdministrationPartnerUpdate,
    AdministrationPartnerResponse,
)

from backend.services.administrationPartners_service import (
    get_all_partners,
    get_partner_by_id,
    create_partner,
    update_partner,
    toggle_partner_status,
    delete_partner,
)


api = APIRouter(

    prefix="/administration/partners",

    tags=[

        "Administration - Partners"

    ]

)


# ==========================================================
# GET ALL PARTNERS
# ==========================================================

@api.get(

    "",

    response_model=List[AdministrationPartnerResponse]

)
def api_get_all_partners(

    db: Session = Depends(get_db)

):

    print(

        "\n========== ADMINISTRATION PARTNERS =========="

    )

    print(

        "[API] GET ALL PARTNERS"

    )

    partners = get_all_partners(

        db

    )

    print(

        "[API] Returning partners.\n"

    )

    return partners


# ==========================================================
# GET PARTNER
# ==========================================================

@api.get(

    "/{partner_id}",

    response_model=AdministrationPartnerResponse

)
def api_get_partner(

    partner_id: int,

    db: Session = Depends(get_db)

):

    print(

        f"\n[API] GET PARTNER {partner_id}"

    )

    partner = get_partner_by_id(

        partner_id,

        db

    )

    if not partner:

        print(

            "[API] Partner not found."

        )

        raise HTTPException(

            status_code=404,

            detail="Partner not found"

        )

    print(

        "[API] Returning partner.\n"

    )

    return partner


# ==========================================================
# CREATE PARTNER
# ==========================================================

@api.post(

    "",

    response_model=AdministrationPartnerResponse

)
def api_create_partner(

    payload: AdministrationPartnerCreate,

    db: Session = Depends(get_db)

):

    print(

        "\n[API] CREATE PARTNER"

    )

    try:

        partner = create_partner(

            payload,

            db

        )

        return partner

    except ValueError as error:

        raise HTTPException(

            status_code=400,

            detail=str(error)

        )

    print(

        "[API] Partner created.\n"

    )

    return partner


# ==========================================================
# UPDATE PARTNER
# ==========================================================

@api.put(

    "/{partner_id}",

    response_model=AdministrationPartnerResponse

)
def api_update_partner(

    partner_id: int,

    payload: AdministrationPartnerUpdate,

    db: Session = Depends(get_db)

):

    print(

        f"\n[API] UPDATE PARTNER {partner_id}"

    )

    partner = update_partner(

        partner_id,

        payload,

        db

    )

    if not partner:

        print(

            "[API] Partner not found."

        )

        raise HTTPException(

            status_code=404,

            detail="Partner not found"

        )

    print(

        "[API] Update successful.\n"

    )

    return partner


# ==========================================================
# TOGGLE PARTNER STATUS
# ==========================================================

@api.patch(

    "/{partner_id}/toggle",

    response_model=AdministrationPartnerResponse

)
def api_toggle_partner(

    partner_id: int,

    db: Session = Depends(get_db)

):

    print(

        f"\n[API] TOGGLE PARTNER {partner_id}"

    )

    partner = toggle_partner_status(

        partner_id,

        db

    )

    if not partner:

        raise HTTPException(

            status_code=404,

            detail="Partner not found"

        )

    print(

        "[API] Toggle complete.\n"

    )

    return partner


# ==========================================================
# DELETE PARTNER
# ==========================================================

@api.delete(

    "/{partner_id}"

)
def api_delete_partner(

    partner_id: int,

    db: Session = Depends(get_db)

):

    print(

        f"\n[API] DELETE PARTNER {partner_id}"

    )

    success = delete_partner(

        partner_id,

        db

    )

    if not success:

        raise HTTPException(

            status_code=404,

            detail="Partner not found"

        )

    print(

        "[API] Delete successful.\n"

    )

    return {

        "message":

        "Partner deleted successfully"

    }