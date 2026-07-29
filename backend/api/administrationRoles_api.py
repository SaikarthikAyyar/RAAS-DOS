from typing import List

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.administrationRoles_schema import (
    AdministrationRoleCreate,
    AdministrationRoleUpdate,
    AdministrationRoleResponse,
)

from backend.services.administrationRoles_service import (
    get_all_roles,
    get_role_by_id,
    create_role,
    update_role,
    toggle_role_status,
    delete_role,
)


api = APIRouter(
    prefix="/administration/roles",
    tags=["Administration - Roles"],
)


# ==========================================================
# GET ALL ROLES
# ==========================================================

@api.get(
    "",
    response_model=List[AdministrationRoleResponse],
)
def api_get_all_roles(
    db: Session = Depends(get_db),
):

    print("\n========== ADMINISTRATION ROLES ==========")
    print("[API] GET ALL ROLES")

    roles = get_all_roles(db)

    print("[API] Returning roles.\n")

    return roles


# ==========================================================
# GET ROLE
# ==========================================================

@api.get(
    "/{role_id}",
    response_model=AdministrationRoleResponse,
)
def api_get_role(
    role_id: int,
    db: Session = Depends(get_db),
):

    print(f"\n[API] GET ROLE {role_id}")

    role = get_role_by_id(role_id, db)

    if not role:

        print("[API] Role not found.")

        raise HTTPException(
            status_code=404,
            detail="Role not found",
        )

    print("[API] Returning role.\n")

    return role


# ==========================================================
# CREATE ROLE
# ==========================================================

@api.post(
    "",
    response_model=AdministrationRoleResponse,
)
def api_create_role(
    payload: AdministrationRoleCreate,
    db: Session = Depends(get_db),
):

    print("\n[API] CREATE ROLE")

    role = create_role(payload, db)

    if not role:

        raise HTTPException(
            status_code=400,
            detail="Role already exists",
        )

    print("[API] Role created.\n")

    return role


# ==========================================================
# UPDATE ROLE
# ==========================================================

@api.put(
    "/{role_id}",
    response_model=AdministrationRoleResponse,
)
def api_update_role(
    role_id: int,
    payload: AdministrationRoleUpdate,
    db: Session = Depends(get_db),
):

    print(f"\n[API] UPDATE ROLE {role_id}")

    role = update_role(
        role_id,
        payload,
        db,
    )

    if not role:

        print("[API] Role not found.")

        raise HTTPException(
            status_code=404,
            detail="Role not found",
        )

    print("[API] Update successful.\n")

    return role


# ==========================================================
# TOGGLE ACTIVE
# ==========================================================

@api.patch(
    "/{role_id}/toggle",
    response_model=AdministrationRoleResponse,
)
def api_toggle_role(
    role_id: int,
    db: Session = Depends(get_db),
):

    print(f"\n[API] TOGGLE ROLE {role_id}")

    role = toggle_role_status(
        role_id,
        db,
    )

    if not role:

        raise HTTPException(
            status_code=404,
            detail="Role not found",
        )

    print("[API] Toggle complete.\n")

    return role


# ==========================================================
# DELETE ROLE
# ==========================================================

@api.delete("/{role_id}")
def api_delete_role(
    role_id: int,
    db: Session = Depends(get_db),
):

    print(f"\n[API] DELETE ROLE {role_id}")

    success = delete_role(
        role_id,
        db,
    )

    if not success:

        raise HTTPException(
            status_code=404,
            detail="Role not found",
        )

    print("[API] Delete successful.\n")

    return {
        "message": "Role deleted successfully"
    }