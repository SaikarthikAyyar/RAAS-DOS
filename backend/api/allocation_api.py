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

from backend.services.allocation_service import (

    get_allocation_dashboard,
    get_invoice_jobs

)

from backend.services.allocation_assignment_service import (

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

    "/allocation/jobs"

)

def load_invoice_jobs(

    db: Session = Depends(get_db)

):

    print("\n========== ALLOCATION JOB LIST ==========")

    return get_invoice_jobs(

        db

    )

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

        payload,

        job_id

    )

@router.get(

    "/allocation/{job_id}"

)

def get_allocation(

    job_id: int,

    db: Session = Depends(get_db)

):

    print("\n========== ALLOCATION API ==========")

    print(f"Loading Allocation : {job_id}")

    return get_allocation_dashboard(

        db,

        job_id

    )


# ====================================
# ALLOCATE
# ====================================

# ====================================
# LOAD JOB LIST
# ====================================

