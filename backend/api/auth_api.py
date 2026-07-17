# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter

from fastapi import Depends

from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.user_schema import (

    LoginSchema,

    LoginResponseSchema

)

from backend.services.auth_service import (

    login_request

)


# ====================================
# ROUTER
# ====================================

router = APIRouter()


# ====================================
# LOGIN
# ====================================

@router.post(

    "/login",

    response_model=LoginResponseSchema

)

def login(

    payload: LoginSchema,

    db: Session = Depends(

        get_db

    )

):

    print("\n========== AUTH API ==========")

    print("[API] Login Request Received")

    print(f"[API] Email : {payload.email}")

    return login_request(

        db,

        payload.email,

        payload.password

    )