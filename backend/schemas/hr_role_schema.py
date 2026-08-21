# ====================================
# IMPORTS
# ====================================

from typing import Optional

from pydantic import BaseModel, ConfigDict

from backend.schemas.notification_schema import ActorSchema


# ====================================
# HR ROLE
# ====================================

class HrRoleCreate(BaseModel):
    role: str
    day_rate: float
    actor: ActorSchema
    remark: str


class HrRoleUpdate(BaseModel):
    role: Optional[str] = None
    day_rate: Optional[float] = None
    actor: ActorSchema
    remark: str


class HrRoleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    role: str
    day_rate: float
