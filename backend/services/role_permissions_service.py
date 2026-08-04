# ====================================
# IMPORTS
# ====================================

from backend.models.roles import Role
from backend.models.modules import Module
from backend.models.role_permissions import RolePermission


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

    for _permission, module in rows:

        entry = {

            "module_key": module.module_key,

            "module_name": module.module_name

        }

        if module.module_type == "workspace_tab":
            workspace_tabs.append(entry)
        else:
            nav_modules.append(entry)

    return {

        "role_name": role.name,

        "nav_modules": nav_modules,

        "workspace_tabs": workspace_tabs

    }
