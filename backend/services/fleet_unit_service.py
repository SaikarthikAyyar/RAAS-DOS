# ====================================
# IMPORTS
# ====================================

from backend.repositories.fleet_unit_repository import (
    list_fleet_units,
    get_fleet_unit,
    build_fleet_unit_dict,
    create_fleet_unit,
    update_fleet_unit,
    delete_fleet_unit,
    list_all_machines
)

from backend.repositories.fleet_kit_repository import kit_options_for_fleet_unit

from backend.repositories.notification_repository import record_business_master_change

from backend.models.hub import Hub


# ====================================
# FLEET UNITS (33A: read-only)
# ====================================

def list_fleet_units_request(db):

    units = list_fleet_units(db)
    return [build_fleet_unit_dict(db, u) for u in units]


def get_kit_options_for_machine_request(db, machine_inventory_id):

    # Used by the Fleet Units modal, which needs the options for a
    # machine BEFORE the unit exists (or when the machine dropdown
    # changes). A transient, never-saved FleetUnit carries just the
    # machine id - kit_options_for_fleet_unit only reads that.
    from backend.models.fleet_unit import FleetUnit

    return kit_options_for_fleet_unit(
        db, FleetUnit(machine_inventory_id=machine_inventory_id)
    )


def get_kit_options_request(db, fleet_unit_id, job_id=None):

    unit = get_fleet_unit(db, fleet_unit_id)
    if not unit:
        return None

    return kit_options_for_fleet_unit(db, unit, job_id)


def get_fleet_unit_request(db, fleet_unit_id):

    unit = get_fleet_unit(db, fleet_unit_id)
    if not unit:
        return None

    return build_fleet_unit_dict(db, unit)


# ====================================
# SUPPORT: machine dropdown list
# ====================================

def list_all_machines_request(db):

    machines = list_all_machines(db)

    hubs_by_id = {h.id: h for h in db.query(Hub).all()}

    return [
        {
            "id": m.id,
            "machine_code": m.machine_code,
            "machine_name": m.machine_name,
            # Carried along for reference (the picked machine's real
            # home hub, resolved the same way build_fleet_unit_dict
            # resolves it for the fleet unit itself - hub is no longer
            # a separately-editable Fleet Unit field, it's always
            # whatever the assigned machine's own hub is).
            "hub_id": m.hub_id,
            "hub_name": hubs_by_id.get(m.hub_id).hub_name if m.hub_id and hubs_by_id.get(m.hub_id) else None,
            "current_site": m.current_site
        }
        for m in machines
    ]


# ====================================
# KIT LABEL (Phase 44) - "PMP-004 (#4)" / "Winch (#29)", so a change
# record names the item AND its id.
# ====================================

def _kit_label(items, pump=False):

    if pump:
        return ", ".join(f"{i['code']} (#{i['id']})" for i in items)

    return ", ".join(f"{i['name']} (#{i['id']})" for i in items)


# ====================================
# CREATE / UPDATE / DELETE (33C)
# ====================================

def create_fleet_unit_request(db, payload):

    row = create_fleet_unit(db, payload)
    unit_dict = build_fleet_unit_dict(db, row)

    changes = [
        {"field": "fleet_code", "before": None, "after": row.fleet_code},
        {"field": "fleet_name", "before": None, "after": row.fleet_name},
        {"field": "machine", "before": None, "after": unit_dict["machine_code"]},
        {"field": "hub", "before": None, "after": unit_dict["hub_name"]}
    ]

    if unit_dict["crew"]:
        changes.append({
            "field": "crew",
            "before": None,
            "after": ", ".join(c["full_name"] for c in unit_dict["crew"])
        })

    if unit_dict["pumps"]:
        changes.append({"field": "pumps", "before": None, "after": _kit_label(unit_dict["pumps"], pump=True)})

    if unit_dict["accessories"]:
        changes.append({"field": "accessories", "before": None, "after": _kit_label(unit_dict["accessories"])})

    record_business_master_change(
        db=db,
        module="Business Masters",
        action="CREATE",
        actor_user_id=payload.actor.user_id,
        actor_name=payload.actor.name,
        actor_role=payload.actor.role,
        title=f"{payload.actor.name} created Fleet Unit '{row.fleet_code}' in Business Masters",
        changes=changes,
        remark=payload.remark
    )

    return unit_dict


def update_fleet_unit_request(db, fleet_unit_id, payload):

    before = get_fleet_unit(db, fleet_unit_id)
    if not before:
        return None

    before_dict = build_fleet_unit_dict(db, before)

    fields_sent = [
        f for f in ("fleet_code", "fleet_name", "active")
        if f in payload.model_fields_set
    ]

    changes = []

    for field in fields_sent:
        old_value = getattr(before, field)
        new_value = getattr(payload, field)
        if old_value != new_value:
            changes.append({"field": field, "before": old_value, "after": new_value})

    machine_changed = (
        "machine_inventory_id" in payload.model_fields_set
        and payload.machine_inventory_id != before.machine_inventory_id
    )

    row = update_fleet_unit(db, fleet_unit_id, payload)
    after_dict = build_fleet_unit_dict(db, row)

    if machine_changed:
        changes.append({"field": "machine", "before": before_dict["machine_code"], "after": after_dict["machine_code"]})

    # Hub is derived from the assigned machine now (build_fleet_unit_dict),
    # not an independently-settable field - diff the resolved name
    # directly rather than tracking a separate hub_id payload field, so
    # this still reports correctly even when a machine swap is what
    # changed the hub.
    if before_dict["hub_name"] != after_dict["hub_name"]:
        changes.append({"field": "hub", "before": before_dict["hub_name"], "after": after_dict["hub_name"]})

    if "crew_personnel_ids" in payload.model_fields_set:
        before_names = {c["full_name"] for c in before_dict["crew"]}
        after_names = {c["full_name"] for c in after_dict["crew"]}
        if before_names != after_names:
            changes.append({
                "field": "crew",
                "before": ", ".join(before_names) if before_names else None,
                "after": ", ".join(after_names) if after_names else None
            })

    if before_dict["pumps"] != after_dict["pumps"]:
        changes.append({
            "field": "pumps",
            "before": _kit_label(before_dict["pumps"], pump=True) or None,
            "after": _kit_label(after_dict["pumps"], pump=True) or None
        })

    if before_dict["accessories"] != after_dict["accessories"]:
        changes.append({
            "field": "accessories",
            "before": _kit_label(before_dict["accessories"]) or None,
            "after": _kit_label(after_dict["accessories"]) or None
        })

    if changes:

        record_business_master_change(
            db=db,
            module="Business Masters",
            action="UPDATE",
            actor_user_id=payload.actor.user_id,
            actor_name=payload.actor.name,
            actor_role=payload.actor.role,
            title=f"{payload.actor.name} updated Fleet Unit '{row.fleet_code}' in Business Masters",
            changes=changes,
            remark=payload.remark
        )

    return after_dict


def delete_fleet_unit_request(db, fleet_unit_id, actor, remark):

    row = get_fleet_unit(db, fleet_unit_id)
    if not row:
        return False

    title = f"{actor.name} deleted Fleet Unit '{row.fleet_code}' from Business Masters"
    changes = [{"field": "fleet_code", "before": row.fleet_code, "after": None}]

    success = delete_fleet_unit(db, fleet_unit_id)

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
