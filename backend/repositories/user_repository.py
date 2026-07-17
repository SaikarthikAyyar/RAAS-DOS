# ====================================
# IMPORTS
# ====================================

from sqlalchemy.orm import Session

from backend.models.users import User


# ====================================
# GET USER BY EMAIL
# ====================================

def get_user_by_email(
        db: Session,
        email: str
):

    print("\n========== USER REPOSITORY ==========")
    print(f"[Repository] Searching Email : {email}")

    user = (
        db.query(User)
        .filter(
            User.email == email
        )
        .first()
    )

    if user:

        print(
            f"[Repository] User Found : {user.name}"
        )

    else:

        print(
            "[Repository] User Not Found"
        )

    return user


# ====================================
# GET USER BY ID
# ====================================

def get_user_by_id(
        db: Session,
        user_id: int
):

    print("\n========== USER REPOSITORY ==========")
    print(f"[Repository] User ID : {user_id}")

    user = (
        db.query(User)
        .filter(
            User.id == user_id
        )
        .first()
    )

    if user:

        print(
            f"[Repository] User Found : {user.name}"
        )

    else:

        print(
            "[Repository] User Not Found"
        )

    return user


# ====================================
# LIST USERS
# ====================================

def list_users(
        db: Session
):

    print("\n========== USER REPOSITORY ==========")
    print("[Repository] Loading Users")

    users = (
        db.query(User)
        .order_by(User.id)
        .all()
    )

    print(
        f"[Repository] Users Loaded : {len(users)}"
    )

    return users