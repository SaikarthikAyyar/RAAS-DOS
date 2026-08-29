# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.services.execution_service import (

    create_execution_request,

    get_execution_request,

    get_execution_by_job_request,

    list_execution_request,

    start_execution_phase,

    complete_execution_phase,

    update_execution_progress,

    set_execution_route

)

from backend.schemas.execution_schema import (
    ExecutionProgressUpdateSchema,
    ExecutionRouteUpdateSchema
)

# ====================================
# ROUTER
# ====================================

router = APIRouter()


# ====================================
# CREATE EXECUTION
# ====================================

@router.post(

    "/execution/{job_creation_id}"

)

def create_execution(

    job_creation_id: int,

    db: Session = Depends(get_db)

):

    print("\n========== EXECUTION API ==========")

    print(

        f"Creating Execution : {job_creation_id}"

    )

    return create_execution_request(

        db,

        job_creation_id

    )


# ====================================
# LIST EXECUTIONS
# ====================================

@router.get(

    "/execution"

)

def list_execution(

    db: Session = Depends(get_db)

):

    print("\n========== EXECUTION API ==========")

    print(

        "Listing Executions"

    )

    return list_execution_request(

        db

    )


# ====================================
# GET EXECUTION
# ====================================

@router.get(

    "/execution/{execution_id}/details"

)

def get_execution(

    execution_id: int,

    db: Session = Depends(get_db)

):

    print("\n========== EXECUTION API ==========")

    print(

        f"Execution : {execution_id}"

    )

    return get_execution_request(

        db,

        execution_id

    )


# ====================================
# GET EXECUTION BY JOB
# ====================================

@router.get(

    "/execution/by-job/{job_creation_id}"

)

def get_execution_by_job(

    job_creation_id: int,

    db: Session = Depends(get_db)

):

    return get_execution_by_job_request(

        db,

        job_creation_id

    )


# ====================================
# SET EXECUTION ROUTE
# ====================================

@router.put(

    "/execution/{execution_id}/route"

)

def set_route(

    execution_id: int,

    payload: ExecutionRouteUpdateSchema,

    db: Session = Depends(get_db)

):

    print("\n========== EXECUTION API ==========")

    print(

        f"Set Execution Route : {execution_id}"

    )

    return set_execution_route(

        db,

        execution_id,

        payload

    )


# ====================================
# START CURRENT PHASE
# (Also re-attempts any still-missing source/destination geocode as
# a third, automatic fill occasion - see _fill_missing_route_coordinates
# in execution_service.py.)
# ====================================

@router.post(

    "/execution/{execution_id}/start"

)

def start_phase(

    execution_id: int,

    db: Session = Depends(get_db)

):

    print("\n========== EXECUTION API ==========")

    print(

        f"Start Phase : {execution_id}"

    )

    return start_execution_phase(

        db,

        execution_id

    )


# ====================================
# COMPLETE CURRENT PHASE
# ====================================

@router.post(

    "/execution/{execution_id}/complete"

)

def complete_phase(

    execution_id: int,

    db: Session = Depends(get_db)

):

    print("\n========== EXECUTION API ==========")

    print(

        f"Complete Phase : {execution_id}"

    )

    return complete_execution_phase(

        db,

        execution_id

    )


# ====================================
# UPDATE EXECUTION PROGRESS
# ====================================

@router.put(

    "/execution/{execution_id}/progress"

)

def update_progress(

    execution_id: int,

    payload: ExecutionProgressUpdateSchema,

    db: Session = Depends(get_db)

):

    print("\n========== EXECUTION API ==========")

    print(

        f"Execution Progress Update : {execution_id}"

    )

    return update_execution_progress(

        db,

        execution_id,

        payload

    )