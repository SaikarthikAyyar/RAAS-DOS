# ====================================
# IMPORTS
# ====================================

from backend.models.business_masters_pricing import (
    ServiceConfiguration,
    ServiceConfigurationAccessory,
    MachineServiceConfiguration,
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
        row.machine_id for row in
        db.query(MachineServiceConfiguration.machine_id)
        .join(ServiceConfiguration, ServiceConfiguration.id == MachineServiceConfiguration.service_configuration_id)
        .filter(ServiceConfiguration.code == code)
        .all()
    ]


def accessory_ids_for_service_configuration(db, config_id):
    return [
        row.accessory_id for row in
        db.query(ServiceConfigurationAccessory)
        .filter(ServiceConfigurationAccessory.service_configuration_id == config_id)
        .all()
    ]


# Replace-all for THIS configuration only: a machine can be in several
# configurations, so other configs' memberships are never touched.
# machines.service_configuration stays the machine's primary config -
# set when it has none, and moved to another membership (or cleared)
# when the machine leaves the config it was primary for.
# Returns the ids of machines newly added, so their accessories can be
# added under this configuration too.
def set_service_configuration_machines(db, config, machine_ids):

    machine_ids = set(machine_ids or [])

    existing = {
        row.machine_id: row for row in
        db.query(MachineServiceConfiguration)
        .filter(MachineServiceConfiguration.service_configuration_id == config.id)
        .all()
    }

    removed = [mid for mid in existing if mid not in machine_ids]
    added = [mid for mid in machine_ids if mid not in existing]

    for mid in removed:
        db.delete(existing[mid])

    db.flush()

    for mid in added:
        db.add(MachineServiceConfiguration(machine_id=mid, service_configuration_id=config.id))

    db.flush()

    for machine in db.query(Machine).filter(Machine.id.in_(removed)).all() if removed else []:
        if machine.service_configuration == config.code:
            remaining = (
                db.query(ServiceConfiguration.code)
                .join(MachineServiceConfiguration, MachineServiceConfiguration.service_configuration_id == ServiceConfiguration.id)
                .filter(MachineServiceConfiguration.machine_id == machine.id)
                .order_by(ServiceConfiguration.id)
                .first()
            )
            machine.service_configuration = remaining[0] if remaining else None

    for machine in db.query(Machine).filter(Machine.id.in_(added)).all() if added else []:
        if not machine.service_configuration:
            machine.service_configuration = config.code

    db.commit()

    return added


# Adds (never removes) the accessories the given machines carry to this
# configuration, so a machine brought into a config brings its kit with it.
def add_machine_accessories_to_config(db, config_id, machine_ids):

    if not machine_ids:
        return

    names = set()

    for machine in db.query(Machine).filter(Machine.id.in_(machine_ids)).all():
        names.update(machine.accessories or [])

    if not names:
        return

    have = set(accessory_ids_for_service_configuration(db, config_id))

    for accessory in db.query(Accessory).filter(Accessory.name.in_(names)).all():
        if accessory.id not in have:
            db.add(ServiceConfigurationAccessory(
                service_configuration_id=config_id,
                accessory_id=accessory.id
            ))

    db.commit()


# Called from Machine Specs create/update: whatever primary configuration
# a machine is given is also one of its memberships.
def ensure_machine_in_primary_config(db, machine):

    if not machine.service_configuration:
        return

    config = (
        db.query(ServiceConfiguration)
        .filter(ServiceConfiguration.code == machine.service_configuration)
        .first()
    )

    if not config:
        return

    exists = (
        db.query(MachineServiceConfiguration.id)
        .filter(
            MachineServiceConfiguration.machine_id == machine.id,
            MachineServiceConfiguration.service_configuration_id == config.id
        )
        .first()
    )

    if not exists:
        db.add(MachineServiceConfiguration(machine_id=machine.id, service_configuration_id=config.id))
        db.commit()


def service_configuration_codes_by_machine(db):

    rows = (
        db.query(MachineServiceConfiguration.machine_id, ServiceConfiguration.code)
        .join(ServiceConfiguration, ServiceConfiguration.id == MachineServiceConfiguration.service_configuration_id)
        .order_by(ServiceConfiguration.id)
        .all()
    )

    result = {}

    for machine_id, code in rows:
        result.setdefault(machine_id, []).append(code)

    return result


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
# active Machine that is a member of this config (a machine can be in several),
# plus the config's own directly-edited accessory set (the join table
# above) - not derived from any machine's own accessories list.
def build_service_configuration_dict(db, config):

    machines = (
        db.query(Machine)
        .join(MachineServiceConfiguration, MachineServiceConfiguration.machine_id == Machine.id)
        .filter(MachineServiceConfiguration.service_configuration_id == config.id)
        .filter(Machine.active.is_(True))
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
