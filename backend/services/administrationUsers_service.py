from sqlalchemy.orm import Session

from backend.models.users import User
from backend.schemas.administrationUsers_schema import (
    AdministrationUserCreate,
    AdministrationUserUpdate,
)
from backend.services.email_service import send_welcome_email
from backend.repositories.notification_repository import record_change

# Excluded from change-tracking - we don't want plaintext password
# values (old or new) ever written into the audit trail.
NOTIFICATION_EXCLUDED_FIELDS = {"password", "actor"}


# ==========================================================
# GET ALL USERS
# ==========================================================

def get_all_users(db: Session):

    print("[Administration Users Service] -> Fetching all users...")

    users = db.query(User).order_by(User.id).all()

    print(f"[Administration Users Service] -> {len(users)} users fetched.")

    return users


# ==========================================================
# GET USER BY ID
# ==========================================================

def get_user_by_id(user_id: int, db: Session):

    print(f"[Administration Users Service] -> Fetching user ID {user_id}")

    user = db.query(User).filter(User.id == user_id).first()

    if user:

        print(
            f"[Administration Users Service] -> User found : {user.name}"
        )

    else:

        print(
            "[Administration Users Service] -> User not found."
        )

    return user


# ==========================================================
# CREATE USER
# ==========================================================

def create_user(
    payload: AdministrationUserCreate,
    db: Session,
):

    print("[Administration Users Service] -> Creating new user...")

    new_user = User(

        name=payload.name,

        email=payload.email,

        password=payload.password,

        role=payload.role,

        is_active=payload.is_active,

    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    print(

        f"[Administration Users Service] -> User created successfully. ID = {new_user.id}"

    )

    send_welcome_email(

        new_user.email,

        new_user.name,

        new_user.role,

        payload.password,

    )

    return new_user


# ==========================================================
# UPDATE USER
# ==========================================================

def update_user(
    user_id: int,
    payload: AdministrationUserUpdate,
    db: Session,
):

    print(f"[Administration Users Service] -> Updating user {user_id}")

    user = db.query(User).filter(User.id == user_id).first()

    if not user:

        print("[Administration Users Service] -> User not found.")

        return None

    update_data = payload.model_dump(exclude_unset=True)

    actor = update_data.pop("actor", None)

    # Do not overwrite password if it was left blank
    if "password" in update_data and (
        update_data["password"] is None or
        update_data["password"].strip() == ""
    ):
        del update_data["password"]

    changes = []

    for field, value in update_data.items():

        before = getattr(user, field, None)

        setattr(user, field, value)

        print(f"Updated {field} -> {value}")

        if field not in NOTIFICATION_EXCLUDED_FIELDS and before != value:

            changes.append({
                "field": field,
                "before": before,
                "after": value
            })

    db.commit()

    db.refresh(user)

    print("[Administration Users Service] -> Update completed.")

    if actor and changes:

        record_change(
            db=db,
            module="Administration",
            action="UPDATE",
            actor_user_id=actor["user_id"],
            actor_name=actor["name"],
            actor_role=actor["role"],
            enquiry_id=None,
            customer_name=None,
            title=f"{actor['name']} updated {user.name}'s {', '.join(c['field'] for c in changes)} in Administration",
            changes=changes
        )

    return user


# ==========================================================
# TOGGLE USER STATUS
# ==========================================================

def toggle_user_status(
    user_id: int,
    db: Session,
):

    print(f"[Administration Users Service] -> Toggling status for {user_id}")

    user = db.query(User).filter(User.id == user_id).first()

    if not user:

        print("[Administration Users Service] -> User not found.")

        return None

    user.is_active = not user.is_active

    db.commit()

    db.refresh(user)

    print(

        f"[Administration Users Service] -> User Active = {user.is_active}"

    )

    return user


# ==========================================================
# DELETE USER
# ==========================================================

def delete_user(
    user_id: int,
    db: Session,
):

    print(f"[Administration Users Service] -> Deleting user {user_id}")

    user = db.query(User).filter(User.id == user_id).first()

    if not user:

        print("[Administration Users Service] -> User not found.")

        return False

    db.delete(user)

    db.commit()

    print("[Administration Users Service] -> User deleted.")

    return True