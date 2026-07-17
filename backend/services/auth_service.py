# ====================================
# IMPORTS
# ====================================

from fastapi import HTTPException

from backend.repositories.user_repository import (
    get_user_by_email
)


# ====================================
# LOGIN
# ====================================

def login_request(
        db,
        email,
        password
):

    print("\n========== AUTH SERVICE ==========")
    print(f"[Service] Login Attempt : {email}")

    user = get_user_by_email(
        db,
        email
    )

    if not user:

        print("[Service] User Not Found")

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not user.is_active:

        print("[Service] User Disabled")

        raise HTTPException(
            status_code=403,
            detail="User account disabled"
        )

    if user.password != password:

        print("[Service] Invalid Password")

        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    print(
        f"[Service] Login Successful : {user.name}"
    )

    return {

        "id": user.id,

        "name": user.name,

        "email": user.email,

        "role": user.role,

        "is_active": user.is_active

    }