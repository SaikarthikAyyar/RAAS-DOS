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

    # Phase 21D/21E: which Business Masters tabs this role can open,
    # and which real task-keys it's allowed to use per tab (keyed by
    # module_key, both business_master_tab and workspace_tab entries).
    business_master_tabs: list[ModuleEntrySchema] = []

    tasks: dict[str, list[str]] = {}

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


# ====================================
# TASK ACCESS MATRIX (Phase 21D)
# Scoped to one role at a time (unlike the nav matrix, which is every
# role at once) - selecting a role in the Role-based Access subtab
# loads this. Two module_type groups: "business_master_tab" (14 tabs)
# and "workspace_tab" (9 tabs, reusing the same rows the Navigation
# Access matrix's workspace_tab modules already use). Each tab-row
# carries its own Tab Access flag (role_permissions.can_view) plus a
# list of that tab's real task checkboxes (role_task_permissions).
# Approve/Reject/Accept/Send-back-style buttons are never represented
# here - those are governed by hub_approvers (Phase 21C), not this.
# ====================================

class TaskEntry(BaseModel):

    module_task_id: int

    task_key: str

    task_label: str

    allowed: bool


class TaskMatrixTabRow(BaseModel):

    module_id: int

    module_key: str

    module_name: str

    can_view: bool

    tasks: list[TaskEntry]


class TaskMatrixGroup(BaseModel):

    group_name: str

    tabs: list[TaskMatrixTabRow]


class TaskMatrixResponse(BaseModel):

    role_id: int

    role_name: str

    groups: list[TaskMatrixGroup]


class TaskMatrixTaskSave(BaseModel):

    module_task_id: int

    allowed: bool


class TaskMatrixTabSave(BaseModel):

    module_id: int

    can_view: bool

    tasks: list[TaskMatrixTaskSave]


class TaskMatrixSaveRequest(BaseModel):

    tabs: list[TaskMatrixTabSave]
