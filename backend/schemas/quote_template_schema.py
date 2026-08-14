# ====================================
# IMPORTS
# ====================================

from typing import Optional

from pydantic import BaseModel, ConfigDict

from backend.schemas.notification_schema import ActorSchema


# ====================================
# VARIABLES
# ====================================

class QuoteTemplateVariableNested(BaseModel):
    key: str
    label: str
    sort_order: int = 0


class QuoteTemplateVariableCreate(BaseModel):
    key: str
    label: str
    sort_order: int = 0
    actor: ActorSchema
    remark: str


class QuoteTemplateVariableUpdate(BaseModel):
    key: Optional[str] = None
    label: Optional[str] = None
    sort_order: Optional[int] = None
    actor: ActorSchema
    remark: str


class QuoteTemplateVariableResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    quote_template_id: int
    key: str
    label: str
    sort_order: int


# ====================================
# TEMPLATES
# ====================================

class QuoteTemplateCreate(BaseModel):
    name: str
    active: bool = True
    body: str = ""
    variables: list[QuoteTemplateVariableNested] = []
    actor: ActorSchema
    remark: str


class QuoteTemplateUpdate(BaseModel):
    name: Optional[str] = None
    active: Optional[bool] = None
    body: Optional[str] = None
    actor: ActorSchema
    remark: str


class QuoteTemplateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    active: bool
    body: str
    variables: list[QuoteTemplateVariableResponse]
