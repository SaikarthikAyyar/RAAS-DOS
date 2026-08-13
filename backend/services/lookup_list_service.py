# ====================================
# IMPORTS
# ====================================

from backend.repositories.lookup_list_repository import (
    get_all_lists_with_values,
    get_list_by_key,
    get_active_values_for_list,
    get_active_other_value,
    get_value_by_normalized_text,
    get_max_sort_order,
    add_value,
    soft_delete_value
)

from backend.repositories.notification_repository import record_business_master_change


# ====================================
# HELPERS
# ====================================

# conditional_tag=None means "no filter" (used by the Business Masters
# admin tab, which must always see every row - tagged or not - so
# removing one value never makes unrelated tagged rows look deleted).
# A real tag (e.g. 'channel_partner') filters to untagged + matching
# rows only - that's the live-form behavior (Lead Source only offering
# the Channel Partner options once that kind of customer is selected).
def _filter_values(values, conditional_tag):
    if conditional_tag is None:
        return values
    return [
        v for v in values
        if v.conditional_tag is None or v.conditional_tag == conditional_tag
    ]


# ====================================
# LISTS
# ====================================

def list_all_lookup_lists(db):

    lists = get_all_lists_with_values(db)

    results = []

    for lookup_list in lists:

        values = get_active_values_for_list(db, lookup_list.id)

        results.append({

            "id": lookup_list.id,
            "list_key": lookup_list.list_key,
            "display_name": lookup_list.display_name,
            "module": lookup_list.module,
            "description": lookup_list.description,
            "values": values

        })

    return results


def get_lookup_list(db, list_key, conditional_tag=None):

    lookup_list = get_list_by_key(db, list_key)

    if lookup_list is None:
        raise ValueError(f"Lookup list '{list_key}' not found.")

    values = get_active_values_for_list(db, lookup_list.id)

    filtered = _filter_values(values, conditional_tag)

    return {

        "id": lookup_list.id,
        "list_key": lookup_list.list_key,
        "display_name": lookup_list.display_name,
        "module": lookup_list.module,
        "description": lookup_list.description,
        "values": filtered

    }


# ====================================
# VALUES
# ====================================

def add_lookup_value(db, list_key, payload):

    lookup_list = get_list_by_key(db, list_key)

    if lookup_list is None:
        raise ValueError(f"Lookup list '{list_key}' not found.")

    value_text = payload.value.strip()

    if not value_text:
        raise ValueError("Value cannot be empty.")

    is_other = payload.kind == "other"

    if is_other:

        existing_other = get_active_other_value(db, lookup_list.id)

        if existing_other:
            raise ValueError(
                f"'{lookup_list.display_name}' already has an Other option "
                f"('{existing_other.value}')."
            )

    else:

        duplicate = get_value_by_normalized_text(db, lookup_list.id, value_text)

        if duplicate:
            raise ValueError(f"'{value_text}' already exists in this list.")

    next_sort_order = get_max_sort_order(db, lookup_list.id) + 1

    new_value = add_value(db, lookup_list.id, value_text, is_other, next_sort_order)

    record_business_master_change(
        db=db,
        module="Business Masters",
        action="CREATE",
        actor_user_id=payload.actor.user_id,
        actor_name=payload.actor.name,
        actor_role=payload.actor.role,
        title=f"{payload.actor.name} added '{value_text}' to {lookup_list.display_name} in Business Masters",
        changes=[{"field": lookup_list.display_name, "before": None, "after": value_text}],
        remark=payload.remark
    )

    return new_value


def delete_lookup_value(db, value_id, actor, remark):

    row = soft_delete_value(db, value_id)

    if row:

        record_business_master_change(
            db=db,
            module="Business Masters",
            action="DELETE",
            actor_user_id=actor.user_id,
            actor_name=actor.name,
            actor_role=actor.role,
            title=f"{actor.name} removed '{row.value}' from {row.lookup_list.display_name} in Business Masters",
            changes=[{"field": row.lookup_list.display_name, "before": row.value, "after": None}],
            remark=remark
        )

    return row
