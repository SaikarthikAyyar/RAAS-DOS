# ====================================
# IMPORTS
# ====================================

from backend.models.roles import Role
from backend.models.modules import Module
from backend.models.role_permissions import RolePermission


# ====================================
# SEED DATA
# role names are lowercase machine keys matching the existing
# users.role convention (confirmed: 'admin','sales','ops','customer',
# 'management' are already stored lowercase) rather than the
# wireframe's Title Case display names - roles.name has to match
# users.role exactly for the permissions join to resolve.
# ====================================

NAV_MODULES = [

    ("/dashboard", "Dashboard"),
    ("/administration", "Administration"),
    ("/business-master", "Business Masters"),
    ("/enquiry", "Enquiries"),
    ("/quotes", "Quotes"),
    ("/customer-request", "Customer Request"),
    ("/sales-survey", "Sales Survey"),
    ("/ops-approval", "Ops Approval"),
    ("/ops-selector", "Ops Selector"),
    ("/dewatering-gate", "Dewatering Gate"),
    ("/quote", "Quote"),
    ("/approval", "Approval"),
    ("/job-creation", "Job Creation"),
    ("/allocation", "Allocation"),
    ("/execution", "Execution"),
    ("/customer-portal", "Customer Portal"),
    ("/analytics", "Analytics"),
    ("/audit-trail", "Audit Trail")

]

WORKSPACE_TABS = [

    ("enquiry-tab-survey", "Survey"),
    ("enquiry-tab-ops-review", "Ops Review"),
    ("enquiry-tab-techno-commercial-approval", "Techno-Commercial Approval"),
    ("enquiry-tab-quote-commercial", "Quote & Commercial"),
    ("enquiry-tab-commercial-approval", "Commercial Approval"),
    ("enquiry-tab-po", "PO"),
    ("enquiry-tab-job-created", "Job Created"),
    ("enquiry-tab-execution", "Execution / Job"),
    ("enquiry-tab-audit", "Audit Trail")

]

ROLES = [

    ("admin", "janyu"),
    ("sales", "janyu"),
    ("ops", "janyu"),
    ("management", "janyu"),
    ("customer", "customer"),
    ("sales_executive", "janyu")

]

# Matches frontend/src/config/navigation.jsx's ROLE_MODULES today,
# EXCEPT admin - corrected per direct instruction to exclude
# Customer Portal and Analytics (a deliberate change, not a faithful
# migration, for that one role).
#
# Dashboard is deliberately excluded from every role below (2026-08-06
# direct instruction) - the page is incomplete, so it's pulled from
# the accessible-modules list for now rather than left half-built and
# visible. The module/route itself is untouched, just not granted to
# anyone - add "/dashboard" back to the relevant role(s) here (and
# rerun the same removal script against role_permissions on both DBs,
# in reverse, or just re-seed) once the page is ready.
#
# Dewatering Gate is excluded the same way, as of 2026-08-08 - the
# module hasn't been built yet either. Add "/dewatering-gate" back
# to admin/ops here (and undo the matching can_view=False update on
# both DBs) once that module is ready.
ROLE_NAV_ACCESS = {

    "admin": [
        path for path, _ in NAV_MODULES
        if path not in ("/customer-portal", "/analytics", "/dashboard", "/dewatering-gate")
    ],

    "sales": [
        "/business-master", "/sales-survey", "/quote", "/quotes"
    ],

    "ops": [
        "/ops-approval", "/ops-selector",
        "/job-creation", "/allocation", "/execution"
    ],

    "management": [
        "/approval"
    ],

    "customer": [
        "/customer-request", "/customer-portal"
    ],

    "sales_executive": [
        "/administration", "/enquiry", "/business-master"
    ]

}

# All 9 tabs for every existing role (matches today's behaviour - no
# tab is currently hidden from anyone), Survey-only for the new role.
ROLE_TAB_ACCESS = {

    "admin": [key for key, _ in WORKSPACE_TABS],
    "sales": [key for key, _ in WORKSPACE_TABS],
    "ops": [key for key, _ in WORKSPACE_TABS],
    "management": [key for key, _ in WORKSPACE_TABS],
    "customer": [key for key, _ in WORKSPACE_TABS],

    "sales_executive": ["enquiry-tab-survey"]

}


# ====================================
# SEED ROLES / MODULES / ROLE_PERMISSIONS
# Idempotent - safe to call on every backend startup, matches the
# seed_machine_inventory()/seed_personnel() pattern.
# ====================================

def seed_roles_modules_permissions(db):

    existing = db.query(RolePermission).first()

    if existing:
        return

    role_rows = {}

    for name, role_type in ROLES:

        role = db.query(Role).filter(Role.name == name).first()

        if not role:
            role = Role(name=name, role_type=role_type, is_active=True)
            db.add(role)
            db.flush()

        role_rows[name] = role

    module_rows = {}

    for module_key, module_name in NAV_MODULES:

        module = db.query(Module).filter(Module.module_key == module_key).first()

        if not module:
            module = Module(module_key=module_key, module_name=module_name, module_type="nav")
            db.add(module)
            db.flush()

        module_rows[module_key] = module

    for module_key, module_name in WORKSPACE_TABS:

        module = db.query(Module).filter(Module.module_key == module_key).first()

        if not module:
            module = Module(module_key=module_key, module_name=module_name, module_type="workspace_tab")
            db.add(module)
            db.flush()

        module_rows[module_key] = module

    for role_name, allowed_paths in ROLE_NAV_ACCESS.items():

        for path in allowed_paths:

            db.add(RolePermission(
                role_id=role_rows[role_name].id,
                module_id=module_rows[path].id,
                can_view=True
            ))

    for role_name, allowed_tabs in ROLE_TAB_ACCESS.items():

        for tab_key in allowed_tabs:

            db.add(RolePermission(
                role_id=role_rows[role_name].id,
                module_id=module_rows[tab_key].id,
                can_view=True
            ))

    db.commit()
