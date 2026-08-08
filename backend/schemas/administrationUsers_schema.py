from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, field_validator

from backend.utils.email_validation import is_janyutech_email
from backend.schemas.notification_schema import ActorSchema


class AdministrationUserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str
    is_active: bool = True

    @field_validator("email")
    @classmethod
    def validate_janyutech_email(cls, value):
        if not is_janyutech_email(value):
            raise ValueError("Only @janyutech.com email addresses are allowed")
        return value


class AdministrationUserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
    actor: Optional[ActorSchema] = None


class AdministrationUserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime