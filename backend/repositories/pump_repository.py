# ====================================
# IMPORTS
# ====================================

from backend.models.machines_pumps import Pump


# ====================================
# PUMPS
# ====================================

def list_pumps(db):
    return db.query(Pump).order_by(Pump.code).all()


def list_active_pumps(db):
    return db.query(Pump).filter(Pump.active.is_(True)).order_by(Pump.code).all()


def get_pump(db, pump_id):
    return db.query(Pump).filter(Pump.id == pump_id).first()


def create_pump(db, payload):
    row = Pump(**payload.model_dump(exclude={"actor", "remark"}))
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def update_pump(db, pump_id, payload):
    row = db.query(Pump).filter(Pump.id == pump_id).first()
    if not row:
        return None
    for field, value in payload.model_dump(exclude_unset=True, exclude={"actor", "remark"}).items():
        setattr(row, field, value)
    db.commit()
    db.refresh(row)
    return row


def delete_pump(db, pump_id):
    row = db.query(Pump).filter(Pump.id == pump_id).first()
    if not row:
        return False
    db.delete(row)
    db.commit()
    return True


# ====================================
# OPS ENGINE ADAPTER
# Same dict-shape-adapter reasoning as machine_repository.py's
# list_active_machines_as_dicts.
# ====================================

def list_active_pumps_as_dicts(db):

    rows = list_active_pumps(db)

    pumps = []

    for row in rows:

        pumps.append({
            "code": row.code,
            "name": row.name,
            "hp": float(row.hp) if row.hp is not None else None,
            "phase": row.phase,
            "voltage": row.voltage,
            "peak_current": row.peak_current,
            "density_range": row.density_range,
            "flow_rate": float(row.flow_rate) if row.flow_rate is not None else None,
            "type": row.type,
            "max_suction_lift": float(row.max_suction_lift) if row.max_suction_lift is not None else None,
            "max_discharge_head": float(row.max_discharge_head) if row.max_discharge_head is not None else None,
            "max_solids_size": float(row.max_solids_size) if row.max_solids_size is not None else None,
            "hazard_rating": row.hazard_rating,
            "power_source": row.power_source,
            "active": row.active
        })

    return pumps
