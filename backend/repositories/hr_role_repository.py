# ====================================
# IMPORTS
# ====================================

from backend.models.hr_role import HrRole


_PAYLOAD_EXCLUDE = {"actor", "remark"}


def list_hr_roles(db):
    return db.query(HrRole).order_by(HrRole.role).all()


def get_hr_role(db, hr_role_id):
    return db.query(HrRole).filter(HrRole.id == hr_role_id).first()


def create_hr_role(db, payload):
    row = HrRole(**payload.model_dump(exclude=_PAYLOAD_EXCLUDE))
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def update_hr_role(db, hr_role_id, payload):
    row = db.query(HrRole).filter(HrRole.id == hr_role_id).first()
    if not row:
        return None

    for field, value in payload.model_dump(exclude_unset=True, exclude=_PAYLOAD_EXCLUDE).items():
        setattr(row, field, value)

    db.commit()
    db.refresh(row)
    return row


def delete_hr_role(db, hr_role_id):
    row = db.query(HrRole).filter(HrRole.id == hr_role_id).first()
    if not row:
        return False
    db.delete(row)
    db.commit()
    return True
