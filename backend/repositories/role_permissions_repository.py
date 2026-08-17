# ====================================
# IMPORTS
# ====================================

from backend.models.roles import Role
from backend.models.modules import Module
from backend.models.role_permissions import RolePermission
from backend.models.module_task import ModuleTask
from backend.models.role_task_permission import RoleTaskPermission


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

# Phase 21D: one module row per Business Masters tab (matches
# frontend/src/data/businessMastersTabs.js exactly, in the same order),
# module_type='business_master_tab' - a new, third module_type
# alongside 'nav'/'workspace_tab'. "bm-tab-" prefix mirrors the
# existing "enquiry-tab-" convention for workspace tabs.
BUSINESS_MASTER_TABS = [

    ("bm-tab-customers", "Customers"),
    ("bm-tab-machines", "Machines / Fleet"),
    ("bm-tab-pumps", "Pump Master"),
    ("bm-tab-personnel", "Personnel"),
    ("bm-tab-accessories", "Accessories"),
    ("bm-tab-hr", "Human Resources"),
    ("bm-tab-dewatering", "Dewatering Methods"),
    ("bm-tab-serviceconfig", "Service Configurations"),
    ("bm-tab-rules", "Commercial Rules"),
    ("bm-tab-hubs", "Hubs"),
    ("bm-tab-quotetemplates", "Quote Templates"),
    ("bm-tab-emailtemplates", "Email Templates"),
    ("bm-tab-lists", "Lookup Lists"),
    ("bm-tab-gst", "GST & Tax")

]

# Phase 21D: the real, enumerated action buttons per tab, EXCLUDING any
# Approve/Reject/Accept/Send-back-style button (those are governed by
# hub_approvers, Phase 21C, not this matrix). Placeholder tabs
# (Personnel, Human Resources, GST & Tax - unbuilt, "Not built yet.")
# get an empty list - they still get a Module row so they're ready to
# gain tasks once built, per the standing "don't jeopardize existing
# function" instruction (an empty task list changes nothing for a role
# that already has no buttons to click there).
MODULE_TASKS = {

    "bm-tab-customers": [
        ("add_customer", "Add customer"),
        ("add_contact", "Add contact"),
        ("set_follow_up", "Set / update follow-up"),
        ("send_reminder", "Send reminder"),
        ("reassign_account_owner", "Reassign account owner"),
        ("export_customer_360", "Export current customer (Excel)"),
        ("export_current_tab", "Export current tab")
    ],

    "bm-tab-machines": [
        ("add_machine", "Add machine"),
        ("edit_machine", "Edit machine"),
        ("remove_machine", "Remove machine"),
        ("export_current_tab", "Export current tab")
    ],

    "bm-tab-pumps": [
        ("add_pump", "Add pump"),
        ("edit_pump", "Edit pump"),
        ("remove_pump", "Remove pump"),
        ("export_current_tab", "Export current tab")
    ],

    "bm-tab-personnel": [],

    "bm-tab-accessories": [
        ("add_accessory", "Add accessory"),
        ("edit_accessory", "Edit accessory"),
        ("remove_accessory", "Remove accessory"),
        ("export_current_tab", "Export current tab")
    ],

    "bm-tab-hr": [],

    "bm-tab-dewatering": [
        ("add_dewatering_method", "Add dewatering method"),
        ("edit_dewatering_method", "Edit dewatering method"),
        ("remove_dewatering_method", "Remove dewatering method"),
        ("export_current_tab", "Export current tab")
    ],

    "bm-tab-serviceconfig": [
        ("add_service_config", "Add service configuration"),
        ("edit_service_config", "Edit service configuration"),
        ("remove_service_config", "Remove service configuration"),
        ("export_current_tab", "Export current tab")
    ],

    "bm-tab-rules": [
        ("save_commercial_rules", "Save commercial rules"),
        ("add_customer_category", "Add customer category"),
        ("remove_customer_category", "Remove customer category"),
        ("export_current_tab", "Export current tab")
    ],

    "bm-tab-hubs": [
        ("add_hub", "Add hub"),
        ("edit_hub", "Edit hub"),
        ("remove_hub", "Remove hub"),
        ("export_current_tab", "Export current tab")
    ],

    "bm-tab-quotetemplates": [
        ("add_quote_template", "Add quote template"),
        ("edit_quote_template", "Edit quote template"),
        ("toggle_quote_template_active", "Activate / deactivate quote template"),
        ("view_quote_template_variables", "View template variables (details)"),
        ("add_quote_template_variable", "Add variable"),
        ("remove_quote_template_variable", "Remove variable"),
        ("download_quote_template_sample", "Download sample .docx"),
        ("remove_quote_template", "Remove quote template"),
        ("export_current_tab", "Export current tab")
    ],

    "bm-tab-emailtemplates": [
        ("add_email_template", "Add email template"),
        ("edit_email_template", "Edit email template"),
        ("toggle_email_template_active", "Activate / deactivate email template"),
        ("view_email_template_body", "View / edit template body"),
        ("view_email_template_variables", "View template variables (details)"),
        ("add_email_template_variable", "Add variable"),
        ("remove_email_template_variable", "Remove variable"),
        ("mark_variable_as_recipient", "Mark variable as recipient field"),
        ("send_email_template", "Send email template"),
        ("remove_email_template", "Remove email template"),
        ("export_current_tab", "Export current tab")
    ],

    "bm-tab-lists": [
        ("add_lookup_value", "Add lookup value"),
        ("remove_lookup_value", "Remove lookup value"),
        ("export_current_tab", "Export current tab")
    ],

    "bm-tab-gst": [],

    "enquiry-tab-survey": [
        ("fill_edit_survey", "Fill / Edit Survey"),
        ("request_ops_review", "Request Ops Review"),
        ("set_survey_reminder", "Set reminder"),
        ("cancel_survey_reminder", "Cancel reminder")
    ],

    "enquiry-tab-ops-review": [
        ("open_ops_selector", "Open Ops Selector"),
        ("save_ops_override", "Save machine override"),
        ("save_deployment_plan_generate_quote", "Save Deployment Plan & Generate Quote"),
        ("add_crew_role", "Add crew role"),
        ("remove_crew_role", "Remove crew role")
    ],

    "enquiry-tab-techno-commercial-approval": [],

    "enquiry-tab-quote-commercial": [
        ("save_internal_addition", "Save internal addition"),
        ("preview_customer_quote", "Preview customer-facing quote"),
        ("save_valid_till", "Save valid-till date"),
        ("open_quotes_module", "Open Quotes Module"),
        ("request_revision", "Request Revision"),
        ("proceed_to_commercial_approval", "Proceed to Commercial Approval")
    ],

    "enquiry-tab-commercial-approval": [
        ("download_quote_document", "Download quote document (.docx)"),
        ("send_quote_release_email", "Send Quote Release Email")
    ],

    "enquiry-tab-po": [
        ("upload_po", "Upload PO"),
        ("remove_po", "Remove PO"),
        ("proceed_to_job_creation", "Proceed to Job Creation")
    ],

    "enquiry-tab-job-created": [],
    "enquiry-tab-execution": [],
    "enquiry-tab-audit": []

}

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

    for module_key, module_name in BUSINESS_MASTER_TABS:

        module = db.query(Module).filter(Module.module_key == module_key).first()

        if not module:
            module = Module(module_key=module_key, module_name=module_name, module_type="business_master_tab")
            db.add(module)
            db.flush()

        module_rows[module_key] = module

    db.flush()

    # module_tasks: real catalog of task checkboxes per tab, idempotent
    # per (module_id, task_key).
    task_rows = {}

    for module_key, tasks in MODULE_TASKS.items():

        module = module_rows.get(module_key)

        if not module:
            continue

        for order, (task_key, task_label) in enumerate(tasks):

            task = (
                db.query(ModuleTask)
                .filter(ModuleTask.module_id == module.id, ModuleTask.task_key == task_key)
                .first()
            )

            if not task:
                task = ModuleTask(
                    module_id=module.id,
                    task_key=task_key,
                    task_label=task_label,
                    sort_order=order
                )
                db.add(task)
                db.flush()

            task_rows[(module_key, task_key)] = task

    db.flush()

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

    db.flush()

    # Phase 21D defaults: a role that already has "/business-master" nav
    # access gets can_view=True on all 14 bm-tab-* rows too - matches
    # today's real, implicit behaviour (every tab is reachable once
    # inside Business Masters), so this seed never silently narrows
    # anyone's actual current access.
    for role_name, allowed_paths in ROLE_NAV_ACCESS.items():

        if "/business-master" not in allowed_paths:
            continue

        for module_key, _ in BUSINESS_MASTER_TABS:

            already_granted = db.query(RolePermission).filter(
                RolePermission.role_id == role_rows[role_name].id,
                RolePermission.module_id == module_rows[module_key].id
            ).first()

            if already_granted:
                continue

            db.add(RolePermission(
                role_id=role_rows[role_name].id,
                module_id=module_rows[module_key].id,
                can_view=True
            ))

    db.flush()

    # Phase 21D defaults: role_task_permissions.allowed=True for every
    # task under a tab the role can already view (business_master_tab
    # via /business-master nav access above, workspace_tab via the
    # existing ROLE_TAB_ACCESS grants) - a role that has zero access to
    # a tab gets zero task rows granted for it, but never loses a task
    # it can already click today, since "can view the tab" is exactly
    # today's real access boundary (no per-button gating exists yet).
    tab_keys_with_view_by_role = {}

    for role_name, allowed_paths in ROLE_NAV_ACCESS.items():
        if "/business-master" in allowed_paths:
            tab_keys_with_view_by_role.setdefault(role_name, set()).update(
                key for key, _ in BUSINESS_MASTER_TABS
            )

    for role_name, allowed_tabs in ROLE_TAB_ACCESS.items():
        tab_keys_with_view_by_role.setdefault(role_name, set()).update(allowed_tabs)

    for role_name, tab_keys in tab_keys_with_view_by_role.items():

        role = role_rows.get(role_name)

        if not role:
            continue

        for tab_key in tab_keys:

            for task_key, _ in MODULE_TASKS.get(tab_key, []):

                task = task_rows.get((tab_key, task_key))

                if not task:
                    continue

                already_granted = db.query(RoleTaskPermission).filter(
                    RoleTaskPermission.role_id == role.id,
                    RoleTaskPermission.module_task_id == task.id
                ).first()

                if already_granted:
                    continue

                db.add(RoleTaskPermission(
                    role_id=role.id,
                    module_task_id=task.id,
                    allowed=True
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


# ====================================
# GET TASK MATRIX (Phase 21D)
# Scoped to a single role. Two groups by module_type - "Business
# Masters" (business_master_tab) and "Enquiries" (workspace_tab).
# Each tab-row carries its own Tab Access flag (RolePermission.can_view
# for that tab's module row - the exact same per-tab mechanism already
# proven for workspace tabs since Phase 4) plus its real task list,
# each defaulting to unchecked if no RoleTaskPermission row exists yet
# (mirrors get_nav_matrix's "full cross-product, unset = unchecked"
# convention, so a brand-new role/task shows up ready to configure).
# ====================================

def get_task_matrix(db, role_id):

    role = db.query(Role).filter(Role.id == role_id).first()

    if not role:
        return None

    groups_spec = [
        ("Business Masters", "business_master_tab"),
        ("Enquiries", "workspace_tab")
    ]

    can_view_by_module = {
        p.module_id: bool(p.can_view)
        for p in db.query(RolePermission).filter(RolePermission.role_id == role_id).all()
    }

    allowed_by_task = {
        p.module_task_id: bool(p.allowed)
        for p in db.query(RoleTaskPermission).filter(RoleTaskPermission.role_id == role_id).all()
    }

    groups = []

    for group_name, module_type in groups_spec:

        modules = (
            db.query(Module)
            .filter(Module.module_type == module_type)
            .order_by(Module.id)
            .all()
        )

        tabs = []

        for module in modules:

            tasks = (
                db.query(ModuleTask)
                .filter(ModuleTask.module_id == module.id)
                .order_by(ModuleTask.sort_order, ModuleTask.id)
                .all()
            )

            tabs.append({
                "module_id": module.id,
                "module_key": module.module_key,
                "module_name": module.module_name,
                "can_view": can_view_by_module.get(module.id, False),
                "tasks": [
                    {
                        "module_task_id": task.id,
                        "task_key": task.task_key,
                        "task_label": task.task_label,
                        "allowed": allowed_by_task.get(task.id, False)
                    }
                    for task in tasks
                ]
            })

        groups.append({
            "group_name": group_name,
            "tabs": tabs
        })

    return {
        "role_id": role.id,
        "role_name": role.name,
        "groups": groups
    }


# ====================================
# SAVE TASK MATRIX (Phase 21D)
# Upserts RolePermission.can_view for each tab and RoleTaskPermission
# .allowed for each task, scoped to one role. Configuration only - does
# not itself gate anything (Phase 21E wires enforcement).
# ====================================

def save_task_matrix(db, role_id, tabs):

    for tab in tabs:

        permission = (
            db.query(RolePermission)
            .filter(RolePermission.role_id == role_id, RolePermission.module_id == tab.module_id)
            .first()
        )

        if not permission:
            permission = RolePermission(role_id=role_id, module_id=tab.module_id)
            db.add(permission)

        permission.can_view = tab.can_view

        for task in tab.tasks:

            task_permission = (
                db.query(RoleTaskPermission)
                .filter(
                    RoleTaskPermission.role_id == role_id,
                    RoleTaskPermission.module_task_id == task.module_task_id
                )
                .first()
            )

            if not task_permission:
                task_permission = RoleTaskPermission(
                    role_id=role_id,
                    module_task_id=task.module_task_id
                )
                db.add(task_permission)

            task_permission.allowed = task.allowed

    db.commit()
