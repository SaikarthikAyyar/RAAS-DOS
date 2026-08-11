# ====================================
# IMPORTS
# ====================================

from backend.repositories.business_masters_pricing_repository import (
    list_service_configurations,
    create_service_configuration,
    update_service_configuration,
    delete_service_configuration,
    list_dewatering_methods,
    create_dewatering_method,
    update_dewatering_method,
    delete_dewatering_method,
    list_accessories,
    create_accessory,
    update_accessory,
    delete_accessory,
    get_commercial_rules,
    update_commercial_rules,
    list_customer_categories,
    create_customer_category,
    delete_customer_category
)


# ====================================
# SERVICE CONFIGURATIONS
# ====================================

def list_service_configurations_request(db):
    return list_service_configurations(db)


def create_service_configuration_request(db, payload):
    return create_service_configuration(db, payload)


def update_service_configuration_request(db, config_id, payload):
    return update_service_configuration(db, config_id, payload)


def delete_service_configuration_request(db, config_id):
    return delete_service_configuration(db, config_id)


# ====================================
# DEWATERING METHODS
# ====================================

def list_dewatering_methods_request(db):
    return list_dewatering_methods(db)


def create_dewatering_method_request(db, payload):
    return create_dewatering_method(db, payload)


def update_dewatering_method_request(db, method_id, payload):
    return update_dewatering_method(db, method_id, payload)


def delete_dewatering_method_request(db, method_id):
    return delete_dewatering_method(db, method_id)


# ====================================
# ACCESSORIES
# ====================================

def list_accessories_request(db):
    return list_accessories(db)


def create_accessory_request(db, payload):
    return create_accessory(db, payload)


def update_accessory_request(db, accessory_id, payload):
    return update_accessory(db, accessory_id, payload)


def delete_accessory_request(db, accessory_id):
    return delete_accessory(db, accessory_id)


# ====================================
# COMMERCIAL RULES
# ====================================

def get_commercial_rules_request(db):
    return get_commercial_rules(db)


def update_commercial_rules_request(db, payload):
    return update_commercial_rules(db, payload)


# ====================================
# CUSTOMER CATEGORIES
# ====================================

def list_customer_categories_request(db):
    return list_customer_categories(db)


def create_customer_category_request(db, payload):
    return create_customer_category(db, payload)


def delete_customer_category_request(db, category_id):
    return delete_customer_category(db, category_id)
