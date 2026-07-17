# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.ops_approval_schema import OpsApprovalSchema

from backend.services.ops_approval_service import (
    create_ops_approval_request
)

# ====================================
# ROUTER
# ====================================

router = APIRouter()

# ====================================
# HEALTH CHECK
# ====================================

@router.get("/ops-approval")
def ops_approval():

    print("\n========== OPS APPROVAL API ==========")
    print("[API] Health Check")
    print("======================================\n")

    return {

        "message":

            "ops approval router active"

    }


# ====================================
# CREATE OPS APPROVAL
# ====================================

@router.post("/ops-approval")
def create_ops_approval(

    payload: OpsApprovalSchema,

    db: Session = Depends(get_db)

):

    print("\n========== OPS APPROVAL API ==========")
    print("[API] Create Approval Request")
    print(f"[API] Customer Request : {payload.customer_request_id}")
    print(f"[API] Sales Survey     : {payload.sales_survey_id}")

    approval = create_ops_approval_request(

        db,

        payload

    )

    print("[API] Response Ready")
    print("======================================\n")

    return approval