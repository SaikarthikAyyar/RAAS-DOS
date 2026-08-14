# ====================================
# IMPORTS
# ====================================

from backend.repositories.quote_template_repository import (
    get_all_templates,
    get_template_by_id,
    get_active_template,
    create_template,
    update_template,
    delete_template,
    get_variable_by_id,
    add_variable,
    update_variable,
    delete_variable
)

from backend.repositories.notification_repository import record_business_master_change


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
        title=f"{payload.actor.name} created quote template '{row.name}' in Business Masters",
        changes=[
            {"field": "name", "before": None, "after": row.name},
            {"field": "active", "before": None, "after": row.active}
        ],
        remark=payload.remark
    )

    return row


def update_template_request(db, template_id, payload):

    template = get_template_by_id(db, template_id)

    if template is None:
        raise ValueError("Quote template not found.")

    tracked_fields = ("name", "active", "body")

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
            title=f"{payload.actor.name} updated quote template '{row.name}' in Business Masters",
            changes=changes,
            remark=payload.remark
        )

    return row


def delete_template_request(db, template_id, actor, remark):

    template = get_template_by_id(db, template_id)

    if template is None:
        raise ValueError("Quote template not found.")

    title = f"{actor.name} deleted quote template '{template.name}' from Business Masters"

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
        raise ValueError("Quote template not found.")

    data = payload.model_dump(exclude={"actor", "remark"})

    row = add_variable(db, template_id, data)

    record_business_master_change(
        db=db,
        module="Business Masters",
        action="CREATE",
        actor_user_id=payload.actor.user_id,
        actor_name=payload.actor.name,
        actor_role=payload.actor.role,
        title=f"{payload.actor.name} added variable '{row.key}' to quote template '{template.name}' in Business Masters",
        changes=[
            {"field": "key", "before": None, "after": row.key},
            {"field": "label", "before": None, "after": row.label}
        ],
        remark=payload.remark
    )

    return row


def update_variable_request(db, template_id, variable_id, payload):

    variable = get_variable_by_id(db, variable_id)

    if variable is None or variable.quote_template_id != template_id:
        raise ValueError("Quote template variable not found.")

    template = get_template_by_id(db, template_id)

    tracked_fields = ("key", "label", "sort_order")

    before_values = {field: getattr(variable, field) for field in tracked_fields}

    data = payload.model_dump(exclude_unset=True, exclude={"actor", "remark"})

    row = update_variable(db, variable, data)

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
            title=f"{payload.actor.name} updated variable '{row.key}' on quote template '{template.name}' in Business Masters",
            changes=changes,
            remark=payload.remark
        )

    return row


def delete_variable_request(db, template_id, variable_id, actor, remark):

    variable = get_variable_by_id(db, variable_id)

    if variable is None or variable.quote_template_id != template_id:
        raise ValueError("Quote template variable not found.")

    template = get_template_by_id(db, template_id)

    title = f"{actor.name} removed variable '{variable.key}' from quote template '{template.name}' in Business Masters"

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
