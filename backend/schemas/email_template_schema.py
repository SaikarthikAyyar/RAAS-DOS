# ====================================
# IMPORTS
# ====================================

from typing import Optional

from pydantic import BaseModel, ConfigDict


# ====================================
# VARIABLES
# ====================================

class EmailTemplateVariableCreate(BaseModel):
    key: str
    label: str
    is_recipient_field: bool = False
    sort_order: int = 0


class EmailTemplateVariableUpdate(BaseModel):
    key: Optional[str] = None
    label: Optional[str] = None
    is_recipient_field: Optional[bool] = None
    sort_order: Optional[int] = None


class EmailTemplateVariableResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email_template_id: int
    key: str
    label: str
    is_recipient_field: bool
    sort_order: int


# ====================================
# TEMPLATES
# ====================================

class EmailTemplateCreate(BaseModel):
    name: str
    use_case: str
    subject: str
    body: str = ""
    is_active: bool = True
    variables: list[EmailTemplateVariableCreate] = []


class EmailTemplateUpdate(BaseModel):
    name: Optional[str] = None
    use_case: Optional[str] = None
    subject: Optional[str] = None
    body: Optional[str] = None
    is_active: Optional[bool] = None


class EmailTemplateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    use_case: str
    subject: str
    body: str
    is_active: bool
    variables: list[EmailTemplateVariableResponse]


# ====================================
# RENDER / SEND
# ====================================

class EmailTemplateRenderRequest(BaseModel):
    variable_values: dict[str, str] = {}


class EmailTemplateRenderResponse(BaseModel):
    subject: str
    body: str


class EmailTemplateSendRequest(BaseModel):
    variable_values: dict[str, str] = {}
    subject_override: Optional[str] = None
    body_override: Optional[str] = None
