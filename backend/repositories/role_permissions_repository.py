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
    ("/audit-trail", "Audit Trail"),
    ("/reviews-approvals", "Reviews & Approvals")

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
    ("sales_executive", "janyu"),
    ("Sales and Marketing", "janyu"),
    ("Senior General Manager Sales", "janyu")

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
        "/job-creation", "/allocation", "/execution",
        "/reviews-approvals"
    ],

    "management": [
        "/approval", "/reviews-approvals"
    ],

    "customer": [
        "/customer-request", "/customer-portal"
    ],

    "sales_executive": [
        "/administration", "/enquiry", "/business-master"
    ],

    # Added 2026-08-11 per direct instruction - both roles were
    # created directly in Administration -> Roles & Permissions on the
    # live deployment first; this codifies their nav access so it
    # survives a redeploy / reseed instead of living only as a manual
    # DB edit.
    "Sales and Marketing": [
        "/business-master", "/enquiry", "/audit-trail"
    ],

    "Senior General Manager Sales": [
        "/business-master", "/enquiry", "/audit-trail"
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

    "sales_executive": ["enquiry-tab-survey"],

    # Added 2026-08-12 per direct instruction - both roles already had
    # nav access (above) from 2026-08-11 but were missing from this
    # dict entirely, which meant WorkflowTabs.jsx's "no permissions
    # loaded yet" fallback (empty workspaceTabs array -> show all 9
    # tabs) was silently granting them full tab access instead of the
    # intended Survey-only. Real rows here fix that at the source.
    "Sales and Marketing": ["enquiry-tab-survey"],

    "Senior General Manager Sales": ["enquiry-tab-survey"]

}


# ====================================
# SEED ROLES / MODULES / ROLE_PERMISSIONS
# Idempotent - safe to call on every backend startup, matches the
# seed_machine_inventory()/seed_personnel() pattern.
#
# Originally short-circuited entirely ("if any role_permissions row
# exists, skip") - that meant adding a new role/permission to the
# lists above and pushing did nothing on an already-seeded database
# (local or deployed), silently defeating the "code change takes
# effect on redeploy" expectation. Fixed 2026-08-11 to check
# existence per role and per role-permission pair instead, so newly
# added roles/grants are picked up on the next startup without
# touching what's already there.
# ====================================

def seed_roles_modules_permissions(db):

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

            already_granted = db.query(RolePermission).filter(
                RolePermission.role_id == role_rows[role_name].id,
                RolePermission.module_id == module_rows[path].id
            ).first()

            if already_granted:
                continue

            db.add(RolePermission(
                role_id=role_rows[role_name].id,
                module_id=module_rows[path].id,
                can_view=True
            ))

    for role_name, allowed_tabs in ROLE_TAB_ACCESS.items():

        for tab_key in allowed_tabs:

            already_granted = db.query(RolePermission).filter(
                RolePermission.role_id == role_rows[role_name].id,
                RolePermission.module_id == module_rows[tab_key].id
            ).first()

            if already_granted:
                continue

            db.add(RolePermission(
                role_id=role_rows[role_name].id,
                module_id=module_rows[tab_key].id,
                can_view=True
            ))

    db.commit()


# ====================================
# GET NAV MATRIX
# Full cross-product of every role x every nav-type module - a role
# with zero role_permissions rows still returns a complete set of
# (unchecked) cells, which is what makes a brand-new role show up
# ready to configure without any extra wiring.
# ====================================

def get_nav_matrix(db):

    roles = db.query(Role).order_by(Role.name).all()

    modules = (
        db.query(Module)
        .filter(Module.module_type == "nav")
        .order_by(Module.id)
        .all()
    )

    existing = {
        (permission.role_id, permission.module_id): permission
        for permission in (
            db.query(RolePermission)
            .filter(RolePermission.module_id.in_([m.id for m in modules]))
            .all()
        )
    }

    cells = []

    for role in roles:
        for module in modules:

            permission = existing.get((role.id, module.id))

            cells.append({
                "role_id": role.id,
                "module_id": module.id,
                "can_view": bool(permission.can_view) if permission else False,
                "is_landing_page": bool(permission.is_landing_page) if permission else False
            })

    return {
        "roles": roles,
        "modules": modules,
        "cells": cells
    }


# ====================================
# SAVE NAV MATRIX
# Validates at most one is_landing_page=True per role_id in the
# incoming payload before writing anything - a bad payload never
# partially commits. Finds-or-creates each RolePermission row.
# ====================================

def save_nav_matrix(db, cells):

    landing_pages_by_role = {}

    for cell in cells:

        if not cell.is_landing_page:
            continue

        if cell.role_id in landing_pages_by_role:
            raise ValueError(
                f"Role {cell.role_id} has more than one landing page in this save request."
            )

        landing_pages_by_role[cell.role_id] = cell.module_id

    permissions_by_cell = {}

    # Pass 1: upsert can_view for every cell and unconditionally clear
    # is_landing_page first. Two passes (clear-all, then set-true) so a
    # role moving its landing page from one module to another never
    # transiently holds two True rows at once mid-flush, which would
    # trip the partial unique index regardless of input ordering.
    for cell in cells:

        permission = (
            db.query(RolePermission)
            .filter(
                RolePermission.role_id == cell.role_id,
                RolePermission.module_id == cell.module_id
            )
            .first()
        )

        if not permission:
            permission = RolePermission(
                role_id=cell.role_id,
                module_id=cell.module_id
            )
            db.add(permission)

        permission.can_view = cell.can_view
        permission.is_landing_page = False

        permissions_by_cell[(cell.role_id, cell.module_id)] = permission

    db.flush()

    # Pass 2: set the True flags.
    for cell in cells:

        if not cell.is_landing_page:
            continue

        permissions_by_cell[(cell.role_id, cell.module_id)].is_landing_page = True

    db.commit()
