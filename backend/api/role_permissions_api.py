# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.role_permissions_schema import RolePermissionsResponse

from backend.services.role_permissions_service import get_role_permissions_request

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
