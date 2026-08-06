from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.signup_schema import SignupSchema
from backend.schemas.administrationUsers_schema import AdministrationUserResponse

from backend.services.signup_service import signup_user


api = APIRouter(
    tags=["Signup"],
)


# ==========================================================
# SIGN UP
# Public account creation, locked to the Sales Executive role.
# ==========================================================

@api.post(
    "/signup",
    response_model=AdministrationUserResponse,
)
def api_signup(
    payload: SignupSchema,
    db: Session = Depends(get_db),
):

    print("\n[API] SIGNUP")

    user = signup_user(payload, db)

    print("[API] Signup complete.\n")

    return user
