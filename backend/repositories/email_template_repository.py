# ====================================
# IMPORTS
# ====================================

from backend.models.email_template import EmailTemplate, EmailTemplateVariable


# ====================================
# TEMPLATES
# ====================================

def get_all_templates(db):
    return db.query(EmailTemplate).order_by(EmailTemplate.name).all()


def get_template_by_id(db, template_id):
    return db.query(EmailTemplate).filter(EmailTemplate.id == template_id).first()


def get_template_by_name(db, name):
    return db.query(EmailTemplate).filter(EmailTemplate.name == name).first()


def create_template(db, data):
    variables_data = data.pop("variables", [])

    row = EmailTemplate(**data)
    db.add(row)
    db.flush()

    for var in variables_data:
        db.add(EmailTemplateVariable(email_template_id=row.id, **var))

    db.commit()
    db.refresh(row)
    return row


def update_template(db, template, data):
    for field, value in data.items():
        setattr(template, field, value)
    db.commit()
    db.refresh(template)
    return template


def delete_template(db, template):
    db.delete(template)
    db.commit()


# ====================================
# VARIABLES
# ====================================

def get_variable_by_id(db, variable_id):
    return db.query(EmailTemplateVariable).filter(EmailTemplateVariable.id == variable_id).first()


def add_variable(db, template_id, data):
    row = EmailTemplateVariable(email_template_id=template_id, **data)
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def update_variable(db, variable, data):
    for field, value in data.items():
        setattr(variable, field, value)
    db.commit()
    db.refresh(variable)
    return variable


def unset_other_recipient_flags(db, template_id, keep_variable_id):
    (
        db.query(EmailTemplateVariable)
        .filter(
            EmailTemplateVariable.email_template_id == template_id,
            EmailTemplateVariable.id != keep_variable_id
        )
        .update({EmailTemplateVariable.is_recipient_field: False})
    )
    db.commit()


def delete_variable(db, variable):
    db.delete(variable)
    db.commit()
