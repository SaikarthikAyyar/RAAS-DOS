# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.services.dashboard_overview_service import get_dashboard_overview


api = APIRouter(tags=["Dashboard Overview"])


@api.get("/dashboard/overview")
def dashboard_overview(db: Session = Depends(get_db)):
    return get_dashboard_overview(db)
