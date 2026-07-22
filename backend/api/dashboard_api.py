# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.services.dashboard_service import (
    get_dashboard_data
)

import traceback

# ====================================
# ROUTER
# ====================================

router = APIRouter()

# ====================================
# DASHBOARD
# ====================================

@router.get("/dashboard")
def dashboard(

    role: str,

    received_enquiry_id: int | None = None,

    sent_enquiry_id: int | None = None,

    db: Session = Depends(get_db)

):
    try:

        print("\n========== DASHBOARD API ==========")

        print("Role:", role)

        print("Received:", received_enquiry_id)

        print("Sent:", sent_enquiry_id)

        dashboard = get_dashboard_data(

            db,

            role,

            received_enquiry_id,

            sent_enquiry_id

        )

        print("Dashboard Response Ready")

        print(dashboard)

        print("===================================\n")

        return dashboard

    except Exception as e:

        print("DASHBOARD FAILED")

        traceback.print_exc()

        raise