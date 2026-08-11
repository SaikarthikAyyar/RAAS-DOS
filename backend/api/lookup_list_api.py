# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.schemas.lookup_list_schema import (
    LookupListOut,
    LookupListValueOut,
    LookupListValueCreate
)

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
    return get_lookup_list(db, list_key, conditional_tag)


@api.post("/lookup-lists/{list_key}/values", response_model=LookupListValueOut)
def add_lookup_list_value(list_key: str, payload: LookupListValueCreate, db: Session = Depends(get_db)):
    return add_lookup_value(db, list_key, payload)


@api.delete("/lookup-lists/values/{value_id}")
def delete_lookup_list_value(value_id: int, db: Session = Depends(get_db)):
    delete_lookup_value(db, value_id)
    return {"success": True}
