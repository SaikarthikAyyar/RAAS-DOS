from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class AdministrationUserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str
    is_active: bool = True


class AdministrationUserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None


class AdministrationUserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime