# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.business_masters_pricing_schema import (
    ServiceConfigurationCreate,
    ServiceConfigurationUpdate,
    ServiceConfigurationResponse
)

from backend.schemas.notification_schema import BusinessMasterActionSchema

from backend.services.business_masters_pricing_service import (
    list_service_configurations_request,
    create_service_configuration_request,
    update_service_configuration_request,
    delete_service_configuration_request
)


api = APIRouter(tags=["Service Configurations"])


@api.get("/service-configurations", response_model=list[ServiceConfigurationResponse])
def list_service_configurations(db: Session = Depends(get_db)):
    return list_service_configurations_request(db)


@api.post("/service-configurations", response_model=ServiceConfigurationResponse)
def create_service_configuration(payload: ServiceConfigurationCreate, db: Session = Depends(get_db)):
    return create_service_configuration_request(db, payload)


@api.put("/service-configurations/{config_id}", response_model=ServiceConfigurationResponse)
def update_service_configuration(config_id: int, payload: ServiceConfigurationUpdate, db: Session = Depends(get_db)):
    result = update_service_configuration_request(db, config_id, payload)
    if not result:
        raise HTTPException(status_code=404, detail="Service configuration not found.")
    return result


@api.delete("/service-configurations/{config_id}")
def delete_service_configuration(config_id: int, payload: BusinessMasterActionSchema, db: Session = Depends(get_db)):
    result = delete_service_configuration_request(db, config_id, payload.actor, payload.remark)
    if not result:
        raise HTTPException(status_code=404, detail="Service configuration not found.")
    return {"success": True}
