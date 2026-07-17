# ====================================
# IMPORTS
# ====================================

from pydantic import BaseModel


# ====================================
# LOGIN REQUEST SCHEMA
# ====================================

class LoginSchema(BaseModel):

    email: str

    password: str


# ====================================
# LOGIN RESPONSE SCHEMA
# ====================================

class LoginResponseSchema(BaseModel):

    id: int

    name: str

    email: str

    role: str

    is_active: bool