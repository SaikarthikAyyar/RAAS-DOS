# ====================================
# IMPORTS
# ====================================

import re

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


# ====================================
# RENDER
# Mirrors the wireframe's fillTemplate() - {word} tokens, leaves an
# unmatched token as literal text rather than crashing if a variable
# value wasn't supplied.
# ====================================

def render_template(subject, body, variable_values):

    variable_values = variable_values or {}

    def substitute(text):
        return re.sub(
            r"\{(\w+)\}",
            lambda match: str(variable_values.get(match.group(1), match.group(0))),
            text
        )

    return substitute(subject), substitute(body)


# ====================================
# TEMPLATES
# ====================================

def list_templates_request(db):
    return get_all_templates(db)


def get_template_request(db, template_id):
    return get_template_by_id(db, template_id)


def create_template_request(db, payload):
    return create_template(db, payload.model_dump())


def update_template_request(db, template_id, payload):

    template = get_template_by_id(db, template_id)

    if template is None:
        raise ValueError("Email template not found.")

    data = payload.model_dump(exclude_unset=True)

    return update_template(db, template, data)


def delete_template_request(db, template_id):

    template = get_template_by_id(db, template_id)

    if template is None:
        raise ValueError("Email template not found.")

    delete_template(db, template)


# ====================================
# VARIABLES
# ====================================

def add_variable_request(db, template_id, payload):

    template = get_template_by_id(db, template_id)

    if template is None:
        raise ValueError("Email template not found.")

    data = payload.model_dump()

    row = add_variable(db, template_id, data)

    if row.is_recipient_field:
        unset_other_recipient_flags(db, template_id, row.id)

    return row


def update_variable_request(db, template_id, variable_id, payload):

    variable = get_variable_by_id(db, variable_id)

    if variable is None or variable.email_template_id != template_id:
        raise ValueError("Email template variable not found.")

    data = payload.model_dump(exclude_unset=True)

    row = update_variable(db, variable, data)

    if row.is_recipient_field:
        unset_other_recipient_flags(db, template_id, row.id)

    return row


def delete_variable_request(db, template_id, variable_id):

    variable = get_variable_by_id(db, variable_id)

    if variable is None or variable.email_template_id != template_id:
        raise ValueError("Email template variable not found.")

    delete_variable(db, variable)


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


def send_template_email(db, template_id, variable_values, subject_override=None, body_override=None):

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

    post_to_relay(to_email, subject, body)


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
