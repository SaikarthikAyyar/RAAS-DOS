# ====================================
# IMPORTS
# ====================================

import base64

from backend.utils.template_rendering import substitute_tokens

from backend.repositories.email_template_repository import (
    get_all_templates,
    get_template_by_id,
    get_template_by_name,
    create_template,
    update_template,
    delete_template,
    get_variable_by_id,
    add_variable,
    update_variable,
    unset_other_recipient_flags,
    delete_variable
)

from backend.services.email_relay_client import post_to_relay

from backend.repositories.notification_repository import record_business_master_change


# ====================================
# RENDER
# Mirrors the wireframe's fillTemplate() - {word} tokens, leaves an
# unmatched token as literal text rather than crashing if a variable
# value wasn't supplied.
# ====================================

def render_template(subject, body, variable_values):

    return (
        substitute_tokens(subject, variable_values),
        substitute_tokens(body, variable_values)
    )


# ====================================
# TEMPLATES
# ====================================

def list_templates_request(db):
    return get_all_templates(db)


def get_template_request(db, template_id):
    return get_template_by_id(db, template_id)


def create_template_request(db, payload):

    row = create_template(db, payload.model_dump(exclude={"actor", "remark"}))

    record_business_master_change(
        db=db,
        module="Business Masters",
        action="CREATE",
        actor_user_id=payload.actor.user_id,
        actor_name=payload.actor.name,
        actor_role=payload.actor.role,
        title=f"{payload.actor.name} created email template '{row.name}' in Business Masters",
        changes=[
            {"field": "name", "before": None, "after": row.name},
            {"field": "use_case", "before": None, "after": row.use_case},
            {"field": "subject", "before": None, "after": row.subject},
            {"field": "is_active", "before": None, "after": row.is_active}
        ],
        remark=payload.remark
    )

    return row


def update_template_request(db, template_id, payload):

    template = get_template_by_id(db, template_id)

    if template is None:
        raise ValueError("Email template not found.")

    tracked_fields = ("name", "use_case", "subject", "body", "is_active")

    before_values = {field: getattr(template, field) for field in tracked_fields}

    data = payload.model_dump(exclude_unset=True, exclude={"actor", "remark"})

    row = update_template(db, template, data)

    changes = [
        {"field": field, "before": before_values[field], "after": getattr(row, field)}
        for field in tracked_fields
        if field in data and before_values[field] != getattr(row, field)
    ]

    if changes:

        record_business_master_change(
            db=db,
            module="Business Masters",
            action="UPDATE",
            actor_user_id=payload.actor.user_id,
            actor_name=payload.actor.name,
            actor_role=payload.actor.role,
            title=f"{payload.actor.name} updated email template '{row.name}' in Business Masters",
            changes=changes,
            remark=payload.remark
        )

    return row


def delete_template_request(db, template_id, actor, remark):

    template = get_template_by_id(db, template_id)

    if template is None:
        raise ValueError("Email template not found.")

    title = f"{actor.name} deleted email template '{template.name}' from Business Masters"

    changes = [{"field": "name", "before": template.name, "after": None}]

    delete_template(db, template)

    record_business_master_change(
        db=db,
        module="Business Masters",
        action="DELETE",
        actor_user_id=actor.user_id,
        actor_name=actor.name,
        actor_role=actor.role,
        title=title,
        changes=changes,
        remark=remark
    )


# ====================================
# VARIABLES
# ====================================

def add_variable_request(db, template_id, payload):

    template = get_template_by_id(db, template_id)

    if template is None:
        raise ValueError("Email template not found.")

    data = payload.model_dump(exclude={"actor", "remark"})

    row = add_variable(db, template_id, data)

    if row.is_recipient_field:
        unset_other_recipient_flags(db, template_id, row.id)

    record_business_master_change(
        db=db,
        module="Business Masters",
        action="CREATE",
        actor_user_id=payload.actor.user_id,
        actor_name=payload.actor.name,
        actor_role=payload.actor.role,
        title=f"{payload.actor.name} added variable '{row.key}' to email template '{template.name}' in Business Masters",
        changes=[
            {"field": "key", "before": None, "after": row.key},
            {"field": "label", "before": None, "after": row.label}
        ],
        remark=payload.remark
    )

    return row


def update_variable_request(db, template_id, variable_id, payload):

    variable = get_variable_by_id(db, variable_id)

    if variable is None or variable.email_template_id != template_id:
        raise ValueError("Email template variable not found.")

    template = get_template_by_id(db, template_id)

    tracked_fields = ("key", "label", "is_recipient_field", "sort_order")

    before_values = {field: getattr(variable, field) for field in tracked_fields}

    data = payload.model_dump(exclude_unset=True, exclude={"actor", "remark"})

    row = update_variable(db, variable, data)

    if row.is_recipient_field:
        unset_other_recipient_flags(db, template_id, row.id)

    changes = [
        {"field": field, "before": before_values[field], "after": getattr(row, field)}
        for field in tracked_fields
        if field in data and before_values[field] != getattr(row, field)
    ]

    if changes:

        record_business_master_change(
            db=db,
            module="Business Masters",
            action="UPDATE",
            actor_user_id=payload.actor.user_id,
            actor_name=payload.actor.name,
            actor_role=payload.actor.role,
            title=f"{payload.actor.name} updated variable '{row.key}' on email template '{template.name}' in Business Masters",
            changes=changes,
            remark=payload.remark
        )

    return row


def delete_variable_request(db, template_id, variable_id, actor, remark):

    variable = get_variable_by_id(db, variable_id)

    if variable is None or variable.email_template_id != template_id:
        raise ValueError("Email template variable not found.")

    template = get_template_by_id(db, template_id)

    title = f"{actor.name} removed variable '{variable.key}' from email template '{template.name}' in Business Masters"

    changes = [{"field": "key", "before": variable.key, "after": None}]

    delete_variable(db, variable)

    record_business_master_change(
        db=db,
        module="Business Masters",
        action="DELETE",
        actor_user_id=actor.user_id,
        actor_name=actor.name,
        actor_role=actor.role,
        title=title,
        changes=changes,
        remark=remark
    )


# ====================================
# RENDER / SEND (interactive - raises on failure, the caller is a
# live admin action and should see the error)
# ====================================

def render_template_request(db, template_id, variable_values):

    template = get_template_by_id(db, template_id)

    if template is None:
        raise ValueError("Email template not found.")

    subject, body = render_template(template.subject, template.body, variable_values)

    return {"subject": subject, "body": body}


def send_template_email(

    db,
    template_id,
    variable_values,
    subject_override=None,
    body_override=None,
    attachment_filename=None,
    attachment_bytes=None

):

    template = get_template_by_id(db, template_id)

    if template is None:
        raise ValueError("Email template not found.")

    variable_values = variable_values or {}

    recipient_variable = next(
        (v for v in template.variables if v.is_recipient_field),
        None
    )

    if recipient_variable is None:
        raise ValueError("This template has no variable marked as the recipient field.")

    to_email = variable_values.get(recipient_variable.key)

    if not to_email:
        raise ValueError(f"'{recipient_variable.label}' is required to send this email.")

    subject, body = render_template(template.subject, template.body, variable_values)

    subject = subject_override if subject_override is not None else subject
    body = body_override if body_override is not None else body

    attachment = None

    if attachment_bytes:

        attachment = {
            "filename": attachment_filename,
            "contentBase64": base64.b64encode(attachment_bytes).decode("ascii")
        }

    post_to_relay(to_email, subject, body, attachment=attachment)


# ====================================
# AUTOMATIC SEND - USER ACCOUNT CREATED
# Called right after a new User row is created (Administration -> Users
# -> Add User, and the public /signup endpoint). Never raises - a
# missing/inactive template or a relay failure must not block account
# creation, matching the pre-existing "email is a side effect, not a
# precondition" posture from email_service.py::send_welcome_email.
# ====================================

def send_user_account_email(db, receiver_email, user_name, user_role, user_password):

    template = get_template_by_name(db, "User Account Created")

    if template is None or not template.is_active:
        print("[EmailTemplateService] 'User Account Created' template missing/inactive, skipping auto-send")
        return

    variable_values = {
        "receiver_email": receiver_email,
        "user_name": user_name,
        "user_role": user_role,
        "user_password": user_password
    }

    try:
        subject, body = render_template(template.subject, template.body, variable_values)
        post_to_relay(receiver_email, subject, body, from_tag="noreply")
        print(f"[EmailTemplateService] Welcome email sent to {receiver_email}")

    except Exception as error:
        print(f"[EmailTemplateService] Failed to send welcome email to {receiver_email}: {error}")
