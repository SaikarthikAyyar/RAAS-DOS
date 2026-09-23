# ====================================
# IMPORTS
# ====================================

from backend.models.machines_pumps import Machine
from backend.models.business_masters_pricing import Accessory

from backend.repositories.business_masters_pricing_repository import (
    list_service_configurations,
    get_service_configuration,
    create_service_configuration,
    update_service_configuration,
    delete_service_configuration,
    build_service_configuration_dict,
    machine_ids_for_service_configuration,
    accessory_ids_for_service_configuration,
    set_service_configuration_machines,
    set_service_configuration_accessories,
    list_dewatering_methods,
    get_dewatering_method,
    create_dewatering_method,
    update_dewatering_method,
    delete_dewatering_method,
    list_accessories,
    get_accessory,
    create_accessory,
    update_accessory,
    delete_accessory,
    get_commercial_rules,
    update_commercial_rules,
    list_customer_categories,
    get_customer_category,
    create_customer_category,
    delete_customer_category
)

from backend.repositories.notification_repository import record_business_master_change


# ====================================
# DIFF HELPER
# Compares only the fields actually present in the incoming payload
# (exclude_unset) against the row's prior values - matches the
# established diffing convention used elsewhere (Administration,
# Sales Survey).
# ====================================

def _diff_fields(before_row, payload, field_names):

    changes = []

    for field in field_names:

        before = getattr(before_row, field)
        after = getattr(payload, field)

        if before != after:
            changes.append({"field": field, "before": before, "after": after})

    return changes


# ====================================
# MACHINE / ACCESSORY LABELS (for change records)
# ====================================

def _machine_codes_label(db, machine_ids):

    if not machine_ids:
        return ""

    rows = db.query(Machine).filter(Machine.id.in_(machine_ids)).order_by(Machine.code).all()

    return ", ".join(m.code for m in rows)


def _accessory_names_label(db, accessory_ids):

    if not accessory_ids:
        return ""

    rows = db.query(Accessory).filter(Accessory.id.in_(accessory_ids)).order_by(Accessory.name).all()

    return ", ".join(a.name for a in rows)


# ====================================
# SERVICE CONFIGURATIONS
# ====================================

def list_service_configurations_request(db):
    return [build_service_configuration_dict(db, row) for row in list_service_configurations(db)]


def create_service_configuration_request(db, payload):

    row = create_service_configuration(db, payload)

    set_service_configuration_machines(db, row, payload.machine_ids)
    set_service_configuration_accessories(db, row.id, payload.accessory_ids)

    changes = [
        {"field": "code", "before": None, "after": row.code},
        {"field": "name", "before": None, "after": row.name},
        {"field": "rate_per_day", "before": None, "after": row.rate_per_day}
    ]

    if payload.machine_ids:
        changes.append({"field": "machines", "before": None, "after": _machine_codes_label(db, payload.machine_ids)})

    if payload.accessory_ids:
        changes.append({"field": "accessories", "before": None, "after": _accessory_names_label(db, payload.accessory_ids)})

    record_business_master_change(
        db=db,
        module="Business Masters",
        action="CREATE",
        actor_user_id=payload.actor.user_id,
        actor_name=payload.actor.name,
        actor_role=payload.actor.role,
        title=f"{payload.actor.name} created Service Configuration '{row.code}' in Business Masters",
        changes=changes,
        remark=payload.remark
    )

    return build_service_configuration_dict(db, row)


def update_service_configuration_request(db, config_id, payload):

    before = get_service_configuration(db, config_id)

    if not before:
        return None

    fields_sent = [f for f in ("code", "name", "rate_per_day") if f in payload.model_fields_set]

    changes = _diff_fields(before, payload, fields_sent)

    machines_changed = "machine_ids" in payload.model_fields_set
    accessories_changed = "accessory_ids" in payload.model_fields_set

    before_machine_ids = machine_ids_for_service_configuration(db, before.code) if machines_changed else None
    before_accessory_ids = accessory_ids_for_service_configuration(db, config_id) if accessories_changed else None

    row = update_service_configuration(db, config_id, payload)

    # Machine reassignment uses the row's own (possibly just-renamed)
    # code, matching how machines actually resolve to this config today.
    if machines_changed:
        set_service_configuration_machines(db, row, payload.machine_ids)

    if accessories_changed:
        set_service_configuration_accessories(db, config_id, payload.accessory_ids)

    if machines_changed:
        before_label = _machine_codes_label(db, before_machine_ids)
        after_label = _machine_codes_label(db, payload.machine_ids)
        if before_label != after_label:
            changes.append({"field": "machines", "before": before_label or None, "after": after_label or None})

    if accessories_changed:
        before_label = _accessory_names_label(db, before_accessory_ids)
        after_label = _accessory_names_label(db, payload.accessory_ids)
        if before_label != after_label:
            changes.append({"field": "accessories", "before": before_label or None, "after": after_label or None})

    if changes:

        record_business_master_change(
            db=db,
            module="Business Masters",
            action="UPDATE",
            actor_user_id=payload.actor.user_id,
            actor_name=payload.actor.name,
            actor_role=payload.actor.role,
            title=f"{payload.actor.name} updated Service Configuration '{row.code}' in Business Masters",
            changes=changes,
            remark=payload.remark
        )

    return build_service_configuration_dict(db, row)


def delete_service_configuration_request(db, config_id, actor, remark):

    row = get_service_configuration(db, config_id)

    if not row:
        return False

    title = f"{actor.name} deleted Service Configuration '{row.code}' from Business Masters"

    changes = [{"field": "code", "before": row.code, "after": None}]

    success = delete_service_configuration(db, config_id)

    if success:

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

    return success


# ====================================
# DEWATERING METHODS
# ====================================

def list_dewatering_methods_request(db):
    return list_dewatering_methods(db)


def create_dewatering_method_request(db, payload):

    row = create_dewatering_method(db, payload)

    record_business_master_change(
        db=db,
        module="Business Masters",
        action="CREATE",
        actor_user_id=payload.actor.user_id,
        actor_name=payload.actor.name,
        actor_role=payload.actor.role,
        title=f"{payload.actor.name} created Dewatering Method '{row.method_name}' in Business Masters",
        changes=[
            {"field": "method_key", "before": None, "after": row.method_key},
            {"field": "method_name", "before": None, "after": row.method_name},
            {"field": "rate_per_m3", "before": None, "after": row.rate_per_m3}
        ],
        remark=payload.remark
    )

    return row


def update_dewatering_method_request(db, method_id, payload):

    before = get_dewatering_method(db, method_id)

    if not before:
        return None

    fields_sent = [
        f for f in ("method_key", "method_name", "rate_per_m3", "best_for", "review_trigger")
        if f in payload.model_fields_set
    ]

    changes = _diff_fields(before, payload, fields_sent)

    row = update_dewatering_method(db, method_id, payload)

    if changes:

        record_business_master_change(
            db=db,
            module="Business Masters",
            action="UPDATE",
            actor_user_id=payload.actor.user_id,
            actor_name=payload.actor.name,
            actor_role=payload.actor.role,
            title=f"{payload.actor.name} updated Dewatering Method '{row.method_name}' in Business Masters",
            changes=changes,
            remark=payload.remark
        )

    return row


def delete_dewatering_method_request(db, method_id, actor, remark):

    row = get_dewatering_method(db, method_id)

    if not row:
        return False

    title = f"{actor.name} deleted Dewatering Method '{row.method_name}' from Business Masters"

    changes = [{"field": "method_name", "before": row.method_name, "after": None}]

    success = delete_dewatering_method(db, method_id)

    if success:

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

    return success


# ====================================
# ACCESSORIES
# ====================================

def list_accessories_request(db):
    return list_accessories(db)


def create_accessory_request(db, payload):

    row = create_accessory(db, payload)

    record_business_master_change(
        db=db,
        module="Business Masters",
        action="CREATE",
        actor_user_id=payload.actor.user_id,
        actor_name=payload.actor.name,
        actor_role=payload.actor.role,
        title=f"{payload.actor.name} created Accessory '{row.name}' in Business Masters",
        changes=[
            {"field": "name", "before": None, "after": row.name},
            {"field": "unit", "before": None, "after": row.unit},
            {"field": "rate", "before": None, "after": row.rate}
        ],
        remark=payload.remark
    )

    return row


def update_accessory_request(db, accessory_id, payload):

    before = get_accessory(db, accessory_id)

    if not before:
        return None

    fields_sent = [f for f in ("name", "unit", "rate") if f in payload.model_fields_set]

    changes = _diff_fields(before, payload, fields_sent)

    row = update_accessory(db, accessory_id, payload)

    if changes:

        record_business_master_change(
            db=db,
            module="Business Masters",
            action="UPDATE",
            actor_user_id=payload.actor.user_id,
            actor_name=payload.actor.name,
            actor_role=payload.actor.role,
            title=f"{payload.actor.name} updated Accessory '{row.name}' in Business Masters",
            changes=changes,
            remark=payload.remark
        )

    return row


def delete_accessory_request(db, accessory_id, actor, remark):

    row = get_accessory(db, accessory_id)

    if not row:
        return False

    title = f"{actor.name} deleted Accessory '{row.name}' from Business Masters"

    changes = [{"field": "name", "before": row.name, "after": None}]

    success = delete_accessory(db, accessory_id)

    if success:

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

    return success


# ====================================
# COMMERCIAL RULES
# ====================================

def get_commercial_rules_request(db):
    return get_commercial_rules(db)


def update_commercial_rules_request(db, payload):

    before = get_commercial_rules(db)

    rule_fields = [
        "mobilisation_rate", "setup_rate", "demob_rate", "overhead_pct",
        "margin_pct", "contingency_pct", "documentation_buffer", "access_support_buffer"
    ]

    changes = _diff_fields(before, payload, rule_fields) if before else []

    row = update_commercial_rules(db, payload)

    if changes:

        record_business_master_change(
            db=db,
            module="Business Masters",
            action="UPDATE",
            actor_user_id=payload.actor.user_id,
            actor_name=payload.actor.name,
            actor_role=payload.actor.role,
            title=f"{payload.actor.name} updated Commercial Rules in Business Masters",
            changes=changes,
            remark=payload.remark
        )

    return row


# ====================================
# CUSTOMER CATEGORIES
# ====================================

def list_customer_categories_request(db):
    return list_customer_categories(db)


def create_customer_category_request(db, payload):

    row = create_customer_category(db, payload)

    record_business_master_change(
        db=db,
        module="Business Masters",
        action="CREATE",
        actor_user_id=payload.actor.user_id,
        actor_name=payload.actor.name,
        actor_role=payload.actor.role,
        title=f"{payload.actor.name} created Customer Category '{row.category}' in Business Masters",
        changes=[
            {"field": "category", "before": None, "after": row.category},
            {"field": "margin_pct", "before": None, "after": row.margin_pct}
        ],
        remark=payload.remark
    )

    return row


def delete_customer_category_request(db, category_id, actor, remark):

    row = get_customer_category(db, category_id)

    if not row:
        return False

    title = f"{actor.name} deleted Customer Category '{row.category}' from Business Masters"

    changes = [{"field": "category", "before": row.category, "after": None}]

    success = delete_customer_category(db, category_id)

    if success:

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

    return success
