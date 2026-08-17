# ====================================
# IMPORTS
# ====================================

from typing import Optional

from pydantic import BaseModel, ConfigDict

from backend.schemas.notification_schema import ActorSchema


# ====================================
# USER REFERENCE (resolved approver display)
# ====================================

class UserRefSchema(BaseModel):
    id: int
    name: Optional[str] = None


# ====================================
# HUB
# ops_owner/techno_approver (free text) stay accepted for backward
# compatibility but are no longer written by the current UI - real
# approval standing is driven entirely by ops_owner_user_ids/
# techno_approver_user_ids below.
# ====================================

class HubCreate(BaseModel):
    hub_name: str
    region: Optional[str] = None
    ops_owner: Optional[str] = None
    techno_approver: Optional[str] = None
    ops_owner_user_ids: list[int] = []
    techno_approver_user_ids: list[int] = []
    actor: ActorSchema
    remark: str


class HubUpdate(BaseModel):
    hub_name: Optional[str] = None
    region: Optional[str] = None
    ops_owner: Optional[str] = None
    techno_approver: Optional[str] = None
    ops_owner_user_ids: Optional[list[int]] = None
    techno_approver_user_ids: Optional[list[int]] = None
    actor: ActorSchema
    remark: str


class HubResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    hub_name: str
    region: Optional[str] = None
    ops_owner: Optional[str] = None
    techno_approver: Optional[str] = None
    ops_owner_user_ids: list[int] = []
    ops_owners: list[UserRefSchema] = []
    techno_approver_user_ids: list[int] = []
    techno_approvers: list[UserRefSchema] = []
