# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.role_permissions_schema import (
    RolePermissionsResponse,
    NavMatrixResponse,
    NavMatrixSaveRequest,
    TaskMatrixResponse,
    TaskMatrixSaveRequest
)

from backend.services.role_permissions_service import (
    get_role_permissions_request,
    get_nav_matrix_request,
    save_nav_matrix_request,
    get_task_matrix_request,
    save_task_matrix_request
)

# ====================================
# ROUTER
# ====================================

router = APIRouter()


# ====================================
# GET ROLE PERMISSIONS
# Drives the sidebar (nav_modules) and the Enquiry Workspace tab
# strip (workspace_tabs) dynamically for a given role name - replaces
# the hardcoded ROLE_MODULES object on the frontend.
# ====================================

@router.get(
    "/roles/{role_name}/permissions",
    response_model=RolePermissionsResponse
)
def get_role_permissions(
        role_name: str,
        db: Session = Depends(get_db)
):
    permissions = get_role_permissions_request(db, role_name)

    if not permissions:
        raise HTTPException(
            status_code=404,
            detail="Role not found."
        )

    return permissions


# ====================================
# NAV MATRIX (admin-facing, editable)
# Full role x nav-module cross-product - drives the new Navigation
# Access subtab under Administration -> Roles & Permissions.
# ====================================

@router.get(
    "/role-permissions/nav-matrix",
    response_model=NavMatrixResponse
)
def get_nav_matrix(
        db: Session = Depends(get_db)
):
    return get_nav_matrix_request(db)


@router.put(
    "/role-permissions/nav-matrix",
    response_model=NavMatrixResponse
)
def save_nav_matrix(
        payload: NavMatrixSaveRequest,
        db: Session = Depends(get_db)
):
    try:
        return save_nav_matrix_request(db, payload)

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


# ====================================
# TASK MATRIX (Phase 21D, admin-facing, editable)
# Scoped to one role - drives the Role-based Access subtab once a role
# is selected from the existing role list.
# ====================================

@router.get(
    "/role-permissions/task-matrix/{role_id}",
    response_model=TaskMatrixResponse
)
def get_task_matrix(
        role_id: int,
        db: Session = Depends(get_db)
):
    matrix = get_task_matrix_request(db, role_id)

    if not matrix:
        raise HTTPException(
            status_code=404,
            detail="Role not found."
        )

    return matrix


@router.put(
    "/role-permissions/task-matrix/{role_id}",
    response_model=TaskMatrixResponse
)
def save_task_matrix(
        role_id: int,
        payload: TaskMatrixSaveRequest,
        db: Session = Depends(get_db)
):
    matrix = save_task_matrix_request(db, role_id, payload)

    if not matrix:
        raise HTTPException(
            status_code=404,
            detail="Role not found."
        )

    return matrix
