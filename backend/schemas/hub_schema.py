# ====================================
# IMPORTS
# ====================================

from typing import Optional

from pydantic import BaseModel, ConfigDict

from backend.schemas.notification_schema import ActorSchema


# ====================================
# HUB
# ====================================

class HubCreate(BaseModel):
    hub_name: str
    region: Optional[str] = None
    ops_owner: Optional[str] = None
    techno_approver: Optional[str] = None
    actor: ActorSchema
    remark: str


class HubUpdate(BaseModel):
    hub_name: Optional[str] = None
    region: Optional[str] = None
    ops_owner: Optional[str] = None
    techno_approver: Optional[str] = None
    actor: ActorSchema
    remark: str


class HubResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    hub_name: str
    region: Optional[str] = None
    ops_owner: Optional[str] = None
    techno_approver: Optional[str] = None
