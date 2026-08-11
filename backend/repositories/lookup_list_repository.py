# ====================================
# IMPORTS
# ====================================

from backend.models.lookup_list_model import LookupList, LookupListValue


# ====================================
# LISTS
# ====================================

def get_all_lists_with_values(db):
    return db.query(LookupList).order_by(LookupList.display_name).all()


def get_list_by_key(db, list_key):
    return db.query(LookupList).filter(LookupList.list_key == list_key).first()


# ====================================
# VALUES
# ====================================

def get_active_values_for_list(db, lookup_list_id):
    return (
        db.query(LookupListValue)
        .filter(
            LookupListValue.lookup_list_id == lookup_list_id,
            LookupListValue.is_active == True
        )
        .order_by(LookupListValue.sort_order)
        .all()
    )


def get_active_other_value(db, lookup_list_id):
    return (
        db.query(LookupListValue)
        .filter(
            LookupListValue.lookup_list_id == lookup_list_id,
            LookupListValue.is_other == True,
            LookupListValue.is_active == True
        )
        .first()
    )


def get_value_by_normalized_text(db, lookup_list_id, value):
    return (
        db.query(LookupListValue)
        .filter(
            LookupListValue.lookup_list_id == lookup_list_id,
            LookupListValue.is_active == True
        )
        .filter(LookupListValue.value.ilike(value.strip()))
        .first()
    )


def get_max_sort_order(db, lookup_list_id):
    row = (
        db.query(LookupListValue)
        .filter(LookupListValue.lookup_list_id == lookup_list_id)
        .order_by(LookupListValue.sort_order.desc())
        .first()
    )
    return row.sort_order if row else -1


def add_value(db, lookup_list_id, value, is_other, sort_order):
    row = LookupListValue(
        lookup_list_id=lookup_list_id,
        value=value,
        is_other=is_other,
        sort_order=sort_order
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def get_value_by_id(db, value_id):
    return db.query(LookupListValue).filter(LookupListValue.id == value_id).first()


def soft_delete_value(db, value_id):
    row = get_value_by_id(db, value_id)
    if not row:
        return None
    row.is_active = False
    db.commit()
    return row
