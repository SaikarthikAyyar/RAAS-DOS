from typing import List

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.administrationUsers_schema import (
    AdministrationUserCreate,
    AdministrationUserUpdate,
    AdministrationUserResponse,
)

from backend.services.administrationUsers_service import (
    get_all_users,
    get_user_by_id,
    create_user,
    update_user,
    toggle_user_status,
    delete_user,
)


api = APIRouter(
    prefix="/administration/users",
    tags=["Administration - Users"],
)


# ==========================================================
# GET ALL USERS
# ==========================================================

@api.get(
    "",
    response_model=List[AdministrationUserResponse],
)
def api_get_all_users(
    db: Session = Depends(get_db),
):

    print("\n========== ADMINISTRATION USERS ==========")
    print("[API] GET ALL USERS")

    users = get_all_users(db)

    print("[API] Returning users.\n")

    return users


# ==========================================================
# GET USER
# ==========================================================

@api.get(
    "/{user_id}",
    response_model=AdministrationUserResponse,
)
def api_get_user(
    user_id: int,
    db: Session = Depends(get_db),
):

    print(f"\n[API] GET USER {user_id}")

    user = get_user_by_id(user_id, db)

    if not user:

        print("[API] User not found.")

        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    print("[API] Returning user.\n")

    return user


# ==========================================================
# CREATE USER
# ==========================================================

@api.post(
    "",
    response_model=AdministrationUserResponse,
)
def api_create_user(
    payload: AdministrationUserCreate,
    db: Session = Depends(get_db),
):

    print("\n[API] CREATE USER")

    user = create_user(payload, db)

    print("[API] User created.\n")

    return user


# ==========================================================
# UPDATE USER
# ==========================================================

@api.put(
    "/{user_id}",
    response_model=AdministrationUserResponse,
)
def api_update_user(
    user_id: int,
    payload: AdministrationUserUpdate,
    db: Session = Depends(get_db),
):

    print(f"\n[API] UPDATE USER {user_id}")

    user = update_user(
        user_id,
        payload,
        db,
    )

    if not user:

        print("[API] User not found.")

        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    print("[API] Update successful.\n")

    return user


# ==========================================================
# TOGGLE ACTIVE
# ==========================================================

@api.patch(
    "/{user_id}/toggle",
    response_model=AdministrationUserResponse,
)
def api_toggle_user(
    user_id: int,
    db: Session = Depends(get_db),
):

    print(f"\n[API] TOGGLE USER {user_id}")

    user = toggle_user_status(
        user_id,
        db,
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    print("[API] Toggle complete.\n")

    return user


# ==========================================================
# DELETE USER
# ==========================================================

@api.delete("/{user_id}")
def api_delete_user(
    user_id: int,
    db: Session = Depends(get_db),
):

    print(f"\n[API] DELETE USER {user_id}")

    success = delete_user(
        user_id,
        db,
    )

    if not success:

        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    print("[API] Delete successful.\n")

    return {
        "message": "User deleted successfully"
    }