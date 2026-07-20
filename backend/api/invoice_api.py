# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.services.invoice_service import (

    create_invoice_request,

    get_invoice_request,

    get_invoice_by_job_request,

    list_invoice_request

)


# ====================================
# ROUTER
# ====================================

router = APIRouter(

    prefix="/invoice",

    tags=["Invoice"]

)


# ====================================
# LIST
# ====================================

@router.get(

    ""

)

def list_invoice(

    db: Session = Depends(

        get_db

    )

):

    return list_invoice_request(

        db

    )


# ====================================
# GET
# ====================================

@router.get(

    "/{invoice_id}"

)

def get_invoice(

    invoice_id: int,

    db: Session = Depends(

        get_db

    )

):

    return get_invoice_request(

        db,

        invoice_id

    )


# ====================================
# GET BY JOB
# ====================================

@router.get(

    "/job/{job_id}"

)

def get_invoice_by_job(

    job_id: int,

    db: Session = Depends(

        get_db

    )

):

    return get_invoice_by_job_request(

        db,

        job_id

    )


# ====================================
# CREATE
# ====================================

@router.post(

    "/create/{job_id}"

)

def create_invoice(

    job_id: int,

    db: Session = Depends(

        get_db

    )

):

    return create_invoice_request(

        db,

        job_id

    )