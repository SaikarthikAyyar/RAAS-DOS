from datetime import datetime
from typing import Optional

from pydantic import BaseModel
from pydantic import ConfigDict


# ==========================================================
# CREATE
# ==========================================================

class AdministrationRoleCreate(BaseModel):

    name: str

    role_type: str

    description: Optional[str] = None

    is_active: bool = True


# ==========================================================
# UPDATE
# ==========================================================

class AdministrationRoleUpdate(BaseModel):

    name: Optional[str] = None

    role_type: Optional[str] = None

    description: Optional[str] = None

    is_active: Optional[bool] = None


# ==========================================================
# RESPONSE
# ==========================================================

class AdministrationRoleResponse(BaseModel):

    model_config = ConfigDict(

        from_attributes=True

    )

    id: int

    name: str

    role_type: str

    description: Optional[str]

    is_active: bool

    created_at: datetime

    updated_at: datetime