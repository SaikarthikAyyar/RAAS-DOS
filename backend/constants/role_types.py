from enum import Enum


class RoleType(str, Enum):
    JANYU = "janyu"
    PARTNER = "partner"
    CUSTOMER = "customer"