from pydantic import BaseModel, field_validator

from backend.utils.email_validation import is_janyutech_email


# ====================================
# SIGNUP
# No `role` field - the public form can't submit one, it's fixed
# server-side to "sales_executive" in signup_service.py.
# ====================================

class SignupSchema(BaseModel):
    name: str
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_janyutech_email(cls, value):
        if not is_janyutech_email(value):
            raise ValueError("Only @janyutech.com email addresses are allowed")
        return value
