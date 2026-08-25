# ====================================
# IMPORTS
# ====================================

from backend.models.machine_inventory import MachineInventory
from backend.models.machines_pumps import Machine


# ====================================
# READS
# ====================================

def list_machine_inventory(db):
    return db.query(MachineInventory).order_by(MachineInventory.machine_code).all()


def get_machine_inventory(db, machine_inventory_id):
    return db.query(MachineInventory).filter(MachineInventory.id == machine_inventory_id).first()


def build_machine_inventory_dict(db, row, machine_types_by_id=None):

    machine_type = None

    if row.machine_type_id:

        if machine_types_by_id is not None:
            machine_type = machine_types_by_id.get(row.machine_type_id)
        else:
            machine_type = db.query(Machine).filter(Machine.id == row.machine_type_id).first()

    return {
        "id": row.id,
        "machine_name": row.machine_name,
        "machine_code": row.machine_code,
        "asset_number": row.asset_number,
        "machine_type_id": row.machine_type_id,
        "machine_type_code": machine_type.code if machine_type else None,
        "machine_type_name": machine_type.name if machine_type else None,
        "status": row.status,
        "current_site": row.current_site,
        "current_job_id": row.current_job_id,
        "queue_count": row.queue_count,
        "remarks": row.remarks
    }


# ====================================
# CREATE / UPDATE / DELETE
# ====================================

_PAYLOAD_EXCLUDE = {"actor", "remark"}


def create_machine_inventory(db, payload):

    row = MachineInventory(**payload.model_dump(exclude=_PAYLOAD_EXCLUDE))
    db.add(row)
    db.commit()
    db.refresh(row)

    return row


def update_machine_inventory(db, machine_inventory_id, payload):

    row = get_machine_inventory(db, machine_inventory_id)
    if not row:
        return None

    for field, value in payload.model_dump(exclude_unset=True, exclude=_PAYLOAD_EXCLUDE).items():
        setattr(row, field, value)

    db.commit()
    db.refresh(row)

    return row


def delete_machine_inventory(db, machine_inventory_id):

    row = get_machine_inventory(db, machine_inventory_id)
    if not row:
        return False

    db.delete(row)
    db.commit()

    return True
