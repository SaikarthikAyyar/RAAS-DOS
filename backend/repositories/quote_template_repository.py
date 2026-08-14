# ====================================
# IMPORTS
# ====================================

from backend.models.quote_template import QuoteTemplate, QuoteTemplateVariable


# ====================================
# TEMPLATES
# ====================================

def get_all_templates(db):
    return db.query(QuoteTemplate).order_by(QuoteTemplate.name).all()


def get_template_by_id(db, template_id):
    return db.query(QuoteTemplate).filter(QuoteTemplate.id == template_id).first()


def get_active_template(db):
    return db.query(QuoteTemplate).filter(QuoteTemplate.active.is_(True)).first()


def create_template(db, data):
    variables_data = data.pop("variables", [])

    row = QuoteTemplate(**data)
    db.add(row)
    db.flush()

    for var in variables_data:
        db.add(QuoteTemplateVariable(quote_template_id=row.id, **var))

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
    return db.query(QuoteTemplateVariable).filter(QuoteTemplateVariable.id == variable_id).first()


def add_variable(db, template_id, data):
    row = QuoteTemplateVariable(quote_template_id=template_id, **data)
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


def delete_variable(db, variable):
    db.delete(variable)
    db.commit()
