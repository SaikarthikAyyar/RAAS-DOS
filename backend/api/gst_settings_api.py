# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.gst_settings_schema import GstSettingsUpdate, GstSettingsResponse

from backend.services.gst_settings_service import get_gst_settings_request, update_gst_settings_request


api = APIRouter(tags=["GST & Tax"])


@api.get("/gst-settings", response_model=GstSettingsResponse)
def get_gst_settings(db: Session = Depends(get_db)):
    return get_gst_settings_request(db)


@api.put("/gst-settings", response_model=GstSettingsResponse)
def update_gst_settings(payload: GstSettingsUpdate, db: Session = Depends(get_db)):
    return update_gst_settings_request(db, payload)
