# ====================================
# IMPORTS
# ====================================

from backend.models.business_masters_pricing import (
    ServiceConfiguration,
    DewateringMethod,
    Accessory,
    CommercialRules,
    CustomerCategory
)


# ====================================
# SERVICE CONFIGURATIONS
# ====================================

def list_service_configurations(db):
    return db.query(ServiceConfiguration).order_by(ServiceConfiguration.code).all()


def get_service_configuration(db, config_id):
    return db.query(ServiceConfiguration).filter(ServiceConfiguration.id == config_id).first()


# actor/remark (Phase 15) ride along on every Business Masters payload
# for the notification layer only - excluded here so they never reach
# the ORM constructor/setattr loop (which would otherwise choke on
# unknown columns).
def create_service_configuration(db, payload):
    row = ServiceConfiguration(**payload.model_dump(exclude={"actor", "remark"}))
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def update_service_configuration(db, config_id, payload):
    row = db.query(ServiceConfiguration).filter(ServiceConfiguration.id == config_id).first()
    if not row:
        return None
    for field, value in payload.model_dump(exclude_unset=True, exclude={"actor", "remark"}).items():
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
