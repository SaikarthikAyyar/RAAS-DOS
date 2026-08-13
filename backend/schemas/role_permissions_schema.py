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

    # module_key of the role's landing page (Phase 14 Navigation Access
    # matrix), or None if that role has never had one set - callers
    # should fall back to a sensible default in that case.
    landing_page: str | None = None


# ====================================
# NAVIGATION ACCESS MATRIX
# Admin-facing editable grid: every role x every nav-type module.
# Unlike RolePermissionsResponse above (login-time, can_view=True rows
# only), this always returns the full cross-product so a role with
# zero role_permissions rows still shows up fully populated
# (all cells unchecked) and ready to configure.
# ====================================

class NavMatrixRole(BaseModel):

    id: int

    name: str

    role_type: str

    is_active: bool


class NavMatrixModule(BaseModel):

    id: int

    module_key: str

    module_name: str


class NavMatrixCell(BaseModel):

    role_id: int

    module_id: int

    can_view: bool

    is_landing_page: bool


class NavMatrixResponse(BaseModel):

    roles: list[NavMatrixRole]

    modules: list[NavMatrixModule]

    cells: list[NavMatrixCell]


class NavMatrixSaveRequest(BaseModel):

    cells: list[NavMatrixCell]
