# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter

from fastapi import Depends

from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.job_creation_schema import (

    JobCreationSchema

)

from backend.services.job_creation_service import (

    create_job_request,

    get_approved_quotes_request,

    get_job_creation_request

)


# ====================================
# ROUTER
# ====================================

router = APIRouter()


# ====================================
# CREATE JOB
# ====================================

@router.post(

    "/job-creation"

)

def create_job(

    payload: JobCreationSchema,

    db: Session = Depends(

        get_db

    )

):

    print(

        "\n========== JOB CREATION API =========="

    )

    print(

        "Approval Board:",

        payload.approval_board_id

    )

    job = create_job_request(

        db,

        payload

    )

    print(

        "Job Created:",

        job.id

    )

    print(

        "======================================\n"

    )

    return job


# ====================================
# GET APPROVED QUOTES
# ====================================

@router.get(

    "/job-creation/quotes"

)

def get_approved_quotes(

    db: Session = Depends(

        get_db

    )

):

    print(

        "\n========== JOB CREATION API =========="

    )

    print(

        "Loading Approved Quotes"

    )

    quotes = get_approved_quotes_request(

        db

    )

    print(

        "Returned:",

        len(

            quotes

        )

    )

    print(

        "======================================\n"

    )

    return quotes


# ====================================
# GET JOB CREATION
# ====================================

@router.get(

    "/job-creation/{quote_id}"

)

def get_job_creation(

    quote_id: int,

    db: Session = Depends(

        get_db

    )

):

    print(

        "\n========== JOB CREATION API =========="

    )

    print(

        "Quote:",

        quote_id

    )

    job = get_job_creation_request(

        db,

        quote_id

    )

    print(

        "======================================\n"

    )

    return job