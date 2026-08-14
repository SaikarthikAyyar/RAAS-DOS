# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.quote_template_schema import (
    QuoteTemplateCreate,
    QuoteTemplateUpdate,
    QuoteTemplateResponse,
    QuoteTemplateVariableCreate,
    QuoteTemplateVariableUpdate,
    QuoteTemplateVariableResponse
)

from backend.schemas.notification_schema import BusinessMasterActionSchema

from backend.services.quote_template_service import (
    list_templates_request,
    get_template_request,
    create_template_request,
    update_template_request,
    delete_template_request,
    add_variable_request,
    update_variable_request,
    delete_variable_request
)

from backend.services.quote_release_service import generate_quote_template_preview_docx


api = APIRouter(prefix="/quote-templates", tags=["Quote Templates"])


# ====================================
# TEMPLATES
# ====================================

@api.get("", response_model=list[QuoteTemplateResponse])
def list_templates(db: Session = Depends(get_db)):
    return list_templates_request(db)


@api.get("/{template_id}", response_model=QuoteTemplateResponse)
def get_template(template_id: int, db: Session = Depends(get_db)):
    return get_template_request(db, template_id)


@api.post("", response_model=QuoteTemplateResponse)
def create_template(payload: QuoteTemplateCreate, db: Session = Depends(get_db)):
    return create_template_request(db, payload)


@api.patch("/{template_id}", response_model=QuoteTemplateResponse)
def update_template(template_id: int, payload: QuoteTemplateUpdate, db: Session = Depends(get_db)):
    return update_template_request(db, template_id, payload)


@api.delete("/{template_id}")
def delete_template(template_id: int, payload: BusinessMasterActionSchema, db: Session = Depends(get_db)):
    delete_template_request(db, template_id, payload.actor, payload.remark)
    return {"success": True}


# ====================================
# PREVIEW (generate a real .docx from this template's current body,
# using sample data for {tank_machine_table}/{commercial_table} -
# no enquiry/quote context needed. Streamed straight to the browser
# with Content-Disposition: attachment so it downloads immediately.)
# ====================================

@api.get("/{template_id}/preview")
def preview_template(template_id: int, db: Session = Depends(get_db)):

    template = get_template_request(db, template_id)

    if template is None:
        raise HTTPException(status_code=404, detail="Quote template not found.")

    buffer = generate_quote_template_preview_docx(template)

    safe_name = "".join(c if c.isalnum() else "_" for c in template.name)
    filename = f"Quote_Template_Preview_{safe_name}.docx"

    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )


# ====================================
# VARIABLES
# ====================================

@api.post("/{template_id}/variables", response_model=QuoteTemplateVariableResponse)
def add_variable(template_id: int, payload: QuoteTemplateVariableCreate, db: Session = Depends(get_db)):
    return add_variable_request(db, template_id, payload)


@api.patch("/{template_id}/variables/{variable_id}", response_model=QuoteTemplateVariableResponse)
def update_variable(template_id: int, variable_id: int, payload: QuoteTemplateVariableUpdate, db: Session = Depends(get_db)):
    return update_variable_request(db, template_id, variable_id, payload)


@api.delete("/{template_id}/variables/{variable_id}")
def delete_variable(template_id: int, variable_id: int, payload: BusinessMasterActionSchema, db: Session = Depends(get_db)):
    delete_variable_request(db, template_id, variable_id, payload.actor, payload.remark)
    return {"success": True}
