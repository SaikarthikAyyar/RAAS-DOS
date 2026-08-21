# ====================================
# IMPORTS
# ====================================

from pydantic import BaseModel, ConfigDict

from backend.schemas.notification_schema import ActorSchema


# ====================================
# GST SETTINGS
# Single-row config - GET/PUT only, no create/delete (matches
# CommercialRules' own single-row pattern).
# ====================================

class GstSettingsUpdate(BaseModel):
    rate: float
    treatment: str
    actor: ActorSchema
    remark: str


class GstSettingsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    rate: float
    treatment: str
