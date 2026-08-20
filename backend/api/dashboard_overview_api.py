# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.services.dashboard_overview_service import get_dashboard_overview, get_pipeline_snapshot


api = APIRouter(tags=["Dashboard Overview"])


@api.get("/dashboard/overview")
def dashboard_overview(db: Session = Depends(get_db)):
    return get_dashboard_overview(db)


@api.get("/dashboard/pipeline-snapshot")
def dashboard_pipeline_snapshot(db: Session = Depends(get_db)):
    return get_pipeline_snapshot(db)
