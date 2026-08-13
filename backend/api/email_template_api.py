# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.email_template_schema import (
    EmailTemplateCreate,
    EmailTemplateUpdate,
    EmailTemplateResponse,
    EmailTemplateVariableCreate,
    EmailTemplateVariableUpdate,
    EmailTemplateVariableResponse,
    EmailTemplateRenderRequest,
    EmailTemplateRenderResponse,
    EmailTemplateSendRequest
)

from backend.schemas.notification_schema import BusinessMasterActionSchema

from backend.services.email_template_service import (
    list_templates_request,
    get_template_request,
    create_template_request,
    update_template_request,
    delete_template_request,
    add_variable_request,
    update_variable_request,
    delete_variable_request,
    render_template_request,
    send_template_email
)


api = APIRouter(prefix="/email-templates", tags=["Email Templates"])


# ====================================
# TEMPLATES
# ====================================

@api.get("", response_model=list[EmailTemplateResponse])
def list_templates(db: Session = Depends(get_db)):
    return list_templates_request(db)


@api.get("/{template_id}", response_model=EmailTemplateResponse)
def get_template(template_id: int, db: Session = Depends(get_db)):
    return get_template_request(db, template_id)


@api.post("", response_model=EmailTemplateResponse)
def create_template(payload: EmailTemplateCreate, db: Session = Depends(get_db)):
    return create_template_request(db, payload)


@api.patch("/{template_id}", response_model=EmailTemplateResponse)
def update_template(template_id: int, payload: EmailTemplateUpdate, db: Session = Depends(get_db)):
    return update_template_request(db, template_id, payload)


@api.delete("/{template_id}")
def delete_template(template_id: int, payload: BusinessMasterActionSchema, db: Session = Depends(get_db)):
    delete_template_request(db, template_id, payload.actor, payload.remark)
    return {"success": True}


# ====================================
# VARIABLES
# ====================================

@api.post("/{template_id}/variables", response_model=EmailTemplateVariableResponse)
def add_variable(template_id: int, payload: EmailTemplateVariableCreate, db: Session = Depends(get_db)):
    return add_variable_request(db, template_id, payload)


@api.patch("/{template_id}/variables/{variable_id}", response_model=EmailTemplateVariableResponse)
def update_variable(template_id: int, variable_id: int, payload: EmailTemplateVariableUpdate, db: Session = Depends(get_db)):
    return update_variable_request(db, template_id, variable_id, payload)


@api.delete("/{template_id}/variables/{variable_id}")
def delete_variable(template_id: int, variable_id: int, payload: BusinessMasterActionSchema, db: Session = Depends(get_db)):
    delete_variable_request(db, template_id, variable_id, payload.actor, payload.remark)
    return {"success": True}


# ====================================
# RENDER / SEND
# ====================================

@api.post("/{template_id}/render", response_model=EmailTemplateRenderResponse)
def render_template(template_id: int, payload: EmailTemplateRenderRequest, db: Session = Depends(get_db)):
    return render_template_request(db, template_id, payload.variable_values)


@api.post("/{template_id}/send")
def send_template(template_id: int, payload: EmailTemplateSendRequest, db: Session = Depends(get_db)):
    send_template_email(
        db,
        template_id,
        payload.variable_values,
        payload.subject_override,
        payload.body_override
    )
    return {"success": True}
