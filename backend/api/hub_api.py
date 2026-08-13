# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.hub_schema import (
    HubCreate,
    HubUpdate,
    HubResponse
)

from backend.schemas.notification_schema import BusinessMasterActionSchema

from backend.services.hub_service import (
    list_hubs_request,
    create_hub_request,
    update_hub_request,
    delete_hub_request
)


api = APIRouter(tags=["Hubs"])


@api.get("/hubs", response_model=list[HubResponse])
def list_hubs(db: Session = Depends(get_db)):
    return list_hubs_request(db)


@api.post("/hubs", response_model=HubResponse)
def create_hub(payload: HubCreate, db: Session = Depends(get_db)):
    return create_hub_request(db, payload)


@api.put("/hubs/{hub_id}", response_model=HubResponse)
def update_hub(hub_id: int, payload: HubUpdate, db: Session = Depends(get_db)):
    result = update_hub_request(db, hub_id, payload)
    if not result:
        raise HTTPException(status_code=404, detail="Hub not found.")
    return result


@api.delete("/hubs/{hub_id}")
def delete_hub(hub_id: int, payload: BusinessMasterActionSchema, db: Session = Depends(get_db)):
    result = delete_hub_request(db, hub_id, payload.actor, payload.remark)
    if not result:
        raise HTTPException(status_code=404, detail="Hub not found.")
    return {"success": True}
