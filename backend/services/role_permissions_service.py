# ====================================
# IMPORTS
# ====================================

from backend.models.roles import Role
from backend.models.modules import Module
from backend.models.role_permissions import RolePermission
from backend.models.module_task import ModuleTask
from backend.models.role_task_permission import RoleTaskPermission

from backend.repositories import role_permissions_repository as repository


# ====================================
# GET ROLE PERMISSIONS
# Returns the nav modules and workspace tabs a role can view, split
# by Module.module_type, driving the sidebar and the Enquiry
# Workspace tab strip dynamically instead of a hardcoded frontend map.
# ====================================

def get_role_permissions_request(

        db,

        role_name

):

    role = (

        db.query(Role)

        .filter(Role.name == role_name)

        .first()

    )

    if not role:
        return None

    rows = (

        db.query(RolePermission, Module)

        .join(Module, RolePermission.module_id == Module.id)

        .filter(

            RolePermission.role_id == role.id,

            RolePermission.can_view == True  # noqa: E712

        )

        .all()

    )

    nav_modules = []

    workspace_tabs = []

    business_master_tabs = []

    landing_page = None

    for permission, module in rows:

        entry = {

            "module_key": module.module_key,

            "module_name": module.module_name

        }

        if module.module_type == "workspace_tab":
            workspace_tabs.append(entry)
        elif module.module_type == "business_master_tab":
            # Phase 21E: which Business Masters tabs this role can even
            # open - mirrors workspace_tabs' role in gating the Enquiry
            # Workspace tab strip, just for BusinessMastersModule.jsx's
            # own local tab strip instead.
            business_master_tabs.append(entry)
        elif module.module_type == "nav":
            # Explicit "nav" check (not "else") - module_type also now
            # includes "business_master_tab" (Phase 21D), which must
            # never leak into nav_modules or it would falsely appear as
            # a sidebar entry in Sidebar.jsx.
            nav_modules.append(entry)

        if permission.is_landing_page:
            landing_page = module.module_key

    # Phase 21E: task-level enforcement data - module_key -> list of
    # allowed task_keys, for every business_master_tab/workspace_tab
    # task this role is granted. A tab the role can't even view simply
    # has no entries here (or an empty list), which is harmless since
    # the tab itself is already hidden by the tab-level gate above.
    task_rows = (

        db.query(RoleTaskPermission, ModuleTask, Module)

        .join(ModuleTask, RoleTaskPermission.module_task_id == ModuleTask.id)

        .join(Module, ModuleTask.module_id == Module.id)

        .filter(

            RoleTaskPermission.role_id == role.id,

            RoleTaskPermission.allowed == True  # noqa: E712

        )

        .all()

    )

    tasks = {}

    for _permission, task, module in task_rows:
        tasks.setdefault(module.module_key, []).append(task.task_key)

    return {

        "role_name": role.name,

        "nav_modules": nav_modules,

        "workspace_tabs": workspace_tabs,

        "business_master_tabs": business_master_tabs,

        "tasks": tasks,

        "landing_page": landing_page

    }


# ====================================
# NAV MATRIX
# ====================================

def get_nav_matrix_request(db):

    return repository.get_nav_matrix(db)


def save_nav_matrix_request(db, payload):

    repository.save_nav_matrix(db, payload.cells)

    return repository.get_nav_matrix(db)


# ====================================
# TASK MATRIX (Phase 21D)
# ====================================

def get_task_matrix_request(db, role_id):

    return repository.get_task_matrix(db, role_id)


def save_task_matrix_request(db, role_id, payload):

    if repository.get_task_matrix(db, role_id) is None:
        return None

    repository.save_task_matrix(db, role_id, payload.tabs)

    return repository.get_task_matrix(db, role_id)
