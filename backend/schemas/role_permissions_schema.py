# ====================================
# IMPORTS
# ====================================

from pydantic import BaseModel


# ====================================
# MODULE ENTRY
# ====================================

class ModuleEntrySchema(BaseModel):

    module_key: str

    module_name: str


# ====================================
# ROLE PERMISSIONS RESPONSE
# ====================================

class RolePermissionsResponse(BaseModel):

    role_name: str

    nav_modules: list[ModuleEntrySchema]

    workspace_tabs: list[ModuleEntrySchema]
