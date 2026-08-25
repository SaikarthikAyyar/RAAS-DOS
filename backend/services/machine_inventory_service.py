# ====================================
# IMPORTS
# ====================================

from backend.repositories.machine_inventory_repository import (
    list_machine_inventory,
    get_machine_inventory,
    build_machine_inventory_dict,
    create_machine_inventory,
    update_machine_inventory,
    delete_machine_inventory
)

from backend.repositories.notification_repository import record_business_master_change

from backend.models.machines_pumps import Machine


def _machine_types_by_id(db):
    return {m.id: m for m in db.query(Machine).all()}


# ====================================
# LIST / GET
# ====================================

def list_machine_inventory_request(db):

    rows = list_machine_inventory(db)
    types_by_id = _machine_types_by_id(db)

    return [build_machine_inventory_dict(db, r, types_by_id) for r in rows]


def get_machine_inventory_request(db, machine_inventory_id):

    row = get_machine_inventory(db, machine_inventory_id)
    if not row:
        return None

    return build_machine_inventory_dict(db, row)


# ====================================
# CREATE / UPDATE / DELETE
# ====================================

def create_machine_inventory_request(db, payload):

    row = create_machine_inventory(db, payload)
    row_dict = build_machine_inventory_dict(db, row)

    changes = [
        {"field": "machine_name", "before": None, "after": row.machine_name},
        {"field": "machine_code", "before": None, "after": row.machine_code},
        {"field": "asset_number", "before": None, "after": row.asset_number},
        {"field": "machine_type", "before": None, "after": row_dict["machine_type_code"]}
    ]

    record_business_master_change(
        db=db,
        module="Business Masters",
        action="CREATE",
        actor_user_id=payload.actor.user_id,
        actor_name=payload.actor.name,
        actor_role=payload.actor.role,
        title=f"{payload.actor.name} added Machine Inventory unit '{row.machine_code}' in Business Masters",
        changes=changes,
        remark=payload.remark
    )

    return row_dict


def update_machine_inventory_request(db, machine_inventory_id, payload):

    before = get_machine_inventory(db, machine_inventory_id)
    if not before:
        return None

    before_dict = build_machine_inventory_dict(db, before)

    fields_sent = [
        f for f in ("machine_name", "machine_code", "asset_number", "status", "current_site", "remarks")
        if f in payload.model_fields_set
    ]

    changes = []

    for field in fields_sent:
        old_value = getattr(before, field)
        new_value = getattr(payload, field)
        if old_value != new_value:
            changes.append({"field": field, "before": old_value, "after": new_value})

    type_changed = (
        "machine_type_id" in payload.model_fields_set
        and payload.machine_type_id != before.machine_type_id
    )

    row = update_machine_inventory(db, machine_inventory_id, payload)
    after_dict = build_machine_inventory_dict(db, row)

    if type_changed:
        changes.append({
            "field": "machine_type",
            "before": before_dict["machine_type_code"],
            "after": after_dict["machine_type_code"]
        })

    if changes:

        record_business_master_change(
            db=db,
            module="Business Masters",
            action="UPDATE",
            actor_user_id=payload.actor.user_id,
            actor_name=payload.actor.name,
            actor_role=payload.actor.role,
            title=f"{payload.actor.name} updated Machine Inventory unit '{row.machine_code}' in Business Masters",
            changes=changes,
            remark=payload.remark
        )

    return after_dict


def delete_machine_inventory_request(db, machine_inventory_id, actor, remark):

    row = get_machine_inventory(db, machine_inventory_id)
    if not row:
        return False

    title = f"{actor.name} removed Machine Inventory unit '{row.machine_code}' from Business Masters"
    changes = [{"field": "machine_code", "before": row.machine_code, "after": None}]

    success = delete_machine_inventory(db, machine_inventory_id)

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
