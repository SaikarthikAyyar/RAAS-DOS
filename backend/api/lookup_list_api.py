# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.lookup_list_schema import (
    LookupListOut,
    LookupListValueOut,
    LookupListValueCreate
)

from backend.schemas.notification_schema import BusinessMasterActionSchema

from backend.services.lookup_list_service import (
    list_all_lookup_lists,
    get_lookup_list,
    add_lookup_value,
    delete_lookup_value
)


api = APIRouter(tags=["Lookup Lists"])


@api.get("/lookup-lists", response_model=list[LookupListOut])
def list_lookup_lists(db: Session = Depends(get_db)):
    return list_all_lookup_lists(db)


@api.get("/lookup-lists/{list_key}", response_model=LookupListOut)
def get_lookup_list_route(list_key: str, conditional_tag: str | None = None, db: Session = Depends(get_db)):
    try:
        return get_lookup_list(db, list_key, conditional_tag)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))


@api.post("/lookup-lists/{list_key}/values", response_model=LookupListValueOut)
def add_lookup_list_value(list_key: str, payload: LookupListValueCreate, db: Session = Depends(get_db)):
    try:
        return add_lookup_value(db, list_key, payload)
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error))


@api.delete("/lookup-lists/values/{value_id}")
def delete_lookup_list_value(value_id: int, payload: BusinessMasterActionSchema, db: Session = Depends(get_db)):
    delete_lookup_value(db, value_id, payload.actor, payload.remark)
    return {"success": True}
