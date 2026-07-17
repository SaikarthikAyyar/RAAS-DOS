# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.allocation_schema import (
    AllocationRequestSchema
)

from backend.services.allocation_assignment_service import (
    get_allocation_request,
    allocate_resources
)

# ====================================
# ROUTER
# ====================================

router = APIRouter()


# ====================================
# LOAD ALLOCATION
# ====================================

@router.get(

    "/allocation/{job_id}"

)

def get_allocation(

    job_id: int,

    db: Session = Depends(get_db)

):

    print("\n========== ALLOCATION API ==========")

    print(f"Loading Allocation : {job_id}")

    return get_allocation_request(
        db,
        job_id
    )


# ====================================
# ALLOCATE
# ====================================

@router.post(

    "/allocation/{job_id}"

)

def allocate(

    job_id: int,

    payload: AllocationRequestSchema,

    db: Session = Depends(get_db)

):

    print("\n========== ALLOCATION API ==========")

    print(f"Allocating Job : {job_id}")

    return allocate_resources(

        db,

        job_id,

        payload.machine_ids,

        payload.personnel_ids,

        payload.site_location

    )