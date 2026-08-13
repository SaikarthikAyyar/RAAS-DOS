# ====================================
# IMPORTS
# ====================================

from backend.models.hub import Hub


# ====================================
# HUBS
# ====================================

def list_hubs(db):
    return db.query(Hub).order_by(Hub.hub_name).all()


def get_hub(db, hub_id):
    return db.query(Hub).filter(Hub.id == hub_id).first()


def get_hub_by_name(db, hub_name):
    return db.query(Hub).filter(Hub.hub_name == hub_name).first()


# actor/remark (Phase 15) ride along on every Business Masters payload
# for the notification layer only - excluded here so they never reach
# the ORM constructor/setattr loop (which would otherwise choke on
# unknown columns).
def create_hub(db, payload):
    row = Hub(**payload.model_dump(exclude={"actor", "remark"}))
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def update_hub(db, hub_id, payload):
    row = db.query(Hub).filter(Hub.id == hub_id).first()
    if not row:
        return None
    for field, value in payload.model_dump(exclude_unset=True, exclude={"actor", "remark"}).items():
        setattr(row, field, value)
    db.commit()
    db.refresh(row)
    return row


def delete_hub(db, hub_id):
    row = db.query(Hub).filter(Hub.id == hub_id).first()
    if not row:
        return False
    db.delete(row)
    db.commit()
    return True
