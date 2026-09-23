# ====================================
# IMPORTS
# ====================================

from backend.models.business_masters_pricing import (
    ServiceConfiguration,
    ServiceConfigurationAccessory,
    DewateringMethod,
    Accessory,
    CommercialRules,
    CustomerCategory
)

from backend.models.machines_pumps import Machine


# ====================================
# SERVICE CONFIGURATIONS
# ====================================

def list_service_configurations(db):
    return db.query(ServiceConfiguration).order_by(ServiceConfiguration.code).all()


def get_service_configuration(db, config_id):
    return db.query(ServiceConfiguration).filter(ServiceConfiguration.id == config_id).first()


def machine_ids_for_service_configuration(db, code):
    return [
        m.id for m in
        db.query(Machine.id).filter(Machine.service_configuration == code).all()
    ]


def accessory_ids_for_service_configuration(db, config_id):
    return [
        row.accessory_id for row in
        db.query(ServiceConfigurationAccessory)
        .filter(ServiceConfigurationAccessory.service_configuration_id == config_id)
        .all()
    ]


# Replace-all: every machine in machine_ids gets its own
# service_configuration set to this config's code; any machine that
# used to point here but isn't in the new list gets cleared. A machine
# belongs to at most one Service Configuration (a plain string field
# on Machine, not a join table), so reassigning here is the same
# mechanism as editing it from the Machine Specs tab directly.
def set_service_configuration_machines(db, config, machine_ids):

    machine_ids = set(machine_ids or [])

    currently_assigned = (
        db.query(Machine)
        .filter(Machine.service_configuration == config.code)
        .all()
    )

    for machine in currently_assigned:
        if machine.id not in machine_ids:
            machine.service_configuration = None

    if machine_ids:
        for machine in db.query(Machine).filter(Machine.id.in_(machine_ids)).all():
            machine.service_configuration = config.code

    db.commit()


# Replace-all: the join table is the direct source of truth for a
# config's accessory set, independent of any specific machine's own
# accessories list (unchanged, still used for kit-picking elsewhere).
def set_service_configuration_accessories(db, config_id, accessory_ids):

    db.query(ServiceConfigurationAccessory).filter(
        ServiceConfigurationAccessory.service_configuration_id == config_id
    ).delete()

    for accessory_id in (accessory_ids or []):
        db.add(ServiceConfigurationAccessory(
            service_configuration_id=config_id,
            accessory_id=accessory_id
        ))

    db.commit()


# Resolves what falls under a Service Configuration for display: every
# Machine whose own service_configuration matches this config's code,
# plus the config's own directly-edited accessory set (the join table
# above) - not derived from any machine's own accessories list.
def build_service_configuration_dict(db, config):

    machines = (
        db.query(Machine)
        .filter(Machine.service_configuration == config.code)
        .order_by(Machine.code)
        .all()
    )

    accessories = (
        db.query(Accessory)
        .join(ServiceConfigurationAccessory, ServiceConfigurationAccessory.accessory_id == Accessory.id)
        .filter(ServiceConfigurationAccessory.service_configuration_id == config.id)
        .order_by(Accessory.name)
        .all()
    )

    return {
        "id": config.id,
        "code": config.code,
        "name": config.name,
        "rate_per_day": config.rate_per_day,
        "machines": [
            {"id": m.id, "code": m.code, "name": m.name, "active": m.active}
            for m in machines
        ],
        "accessories": [
            {"id": a.id, "name": a.name}
            for a in accessories
        ]
    }


# actor/remark (Phase 15) ride along on every Business Masters payload
# for the notification layer only - excluded here so they never reach
# the ORM constructor/setattr loop (which would otherwise choke on
# unknown columns).
def create_service_configuration(db, payload):
    row = ServiceConfiguration(
        **payload.model_dump(exclude={"actor", "remark", "machine_ids", "accessory_ids"})
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def update_service_configuration(db, config_id, payload):
    row = db.query(ServiceConfiguration).filter(ServiceConfiguration.id == config_id).first()
    if not row:
        return None
    for field, value in payload.model_dump(
        exclude_unset=True, exclude={"actor", "remark", "machine_ids", "accessory_ids"}
    ).items():
        setattr(row, field, value)
    db.commit()
    db.refresh(row)
    return row


def delete_service_configuration(db, config_id):
    row = db.query(ServiceConfiguration).filter(ServiceConfiguration.id == config_id).first()
    if not row:
        return False
    db.delete(row)
    db.commit()
    return True


# ====================================
# DEWATERING METHODS
# ====================================

def list_dewatering_methods(db):
    return db.query(DewateringMethod).order_by(DewateringMethod.method_name).all()


def get_dewatering_method(db, method_id):
    return db.query(DewateringMethod).filter(DewateringMethod.id == method_id).first()


def create_dewatering_method(db, payload):
    row = DewateringMethod(**payload.model_dump(exclude={"actor", "remark"}))
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def update_dewatering_method(db, method_id, payload):
    row = db.query(DewateringMethod).filter(DewateringMethod.id == method_id).first()
    if not row:
        return None
    for field, value in payload.model_dump(exclude_unset=True, exclude={"actor", "remark"}).items():
        setattr(row, field, value)
    db.commit()
    db.refresh(row)
    return row


def delete_dewatering_method(db, method_id):
    row = db.query(DewateringMethod).filter(DewateringMethod.id == method_id).first()
    if not row:
        return False
    db.delete(row)
    db.commit()
    return True


# ====================================
# ACCESSORIES
# ====================================

def list_accessories(db):
    return db.query(Accessory).order_by(Accessory.name).all()


def get_accessory(db, accessory_id):
    return db.query(Accessory).filter(Accessory.id == accessory_id).first()


def create_accessory(db, payload):
    row = Accessory(**payload.model_dump(exclude={"actor", "remark"}))
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def update_accessory(db, accessory_id, payload):
    row = db.query(Accessory).filter(Accessory.id == accessory_id).first()
    if not row:
        return None
    for field, value in payload.model_dump(exclude_unset=True, exclude={"actor", "remark"}).items():
        setattr(row, field, value)
    db.commit()
    db.refresh(row)
    return row


def delete_accessory(db, accessory_id):
    row = db.query(Accessory).filter(Accessory.id == accessory_id).first()
    if not row:
        return False
    db.delete(row)
    db.commit()
    return True


# ====================================
# COMMERCIAL RULES (single row)
# ====================================

def get_commercial_rules(db):
    return db.query(CommercialRules).first()


def update_commercial_rules(db, payload):
    row = db.query(CommercialRules).first()
    if not row:
        row = CommercialRules(**payload.model_dump(exclude={"actor", "remark"}))
        db.add(row)
    else:
        for field, value in payload.model_dump(exclude={"actor", "remark"}).items():
            setattr(row, field, value)
    db.commit()
    db.refresh(row)
    return row


# ====================================
# CUSTOMER CATEGORIES
# ====================================

def list_customer_categories(db):
    return db.query(CustomerCategory).order_by(CustomerCategory.category).all()


def get_customer_category(db, category_id):
    return db.query(CustomerCategory).filter(CustomerCategory.id == category_id).first()


def create_customer_category(db, payload):
    row = CustomerCategory(**payload.model_dump(exclude={"actor", "remark"}))
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def delete_customer_category(db, category_id):
    row = db.query(CustomerCategory).filter(CustomerCategory.id == category_id).first()
    if not row:
        return False
    db.delete(row)
    db.commit()
    return True


def get_margin_for_category(db, category):
    if not category:
        return None
    row = db.query(CustomerCategory).filter(CustomerCategory.category == category).first()
    return float(row.margin_pct) if row else None
