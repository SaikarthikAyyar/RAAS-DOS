from sqlalchemy.orm import Session

from backend.models.users import User
from backend.schemas.signup_schema import SignupSchema
from backend.services.email_service import send_welcome_email


# ==========================================================
# SIGNUP
# Public self-registration - role is always "sales_executive",
# never taken from the request payload (SignupSchema doesn't even
# declare a role field, so there's nothing for a client to override).
# ==========================================================

def signup_user(payload: SignupSchema, db: Session):

    print("[Signup Service] -> Creating new self-signup user...")

    new_user = User(
        name=payload.name,
        email=payload.email,
        password=payload.password,
        role="sales_executive",
        is_active=True,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    print(f"[Signup Service] -> User created successfully. ID = {new_user.id}")

    send_welcome_email(
        new_user.email,
        new_user.name,
        new_user.role,
        payload.password,
    )

    return new_user
