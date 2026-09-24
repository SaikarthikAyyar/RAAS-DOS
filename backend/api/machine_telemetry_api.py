from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database.connection import get_db
from backend.services.machine_telemetry_service import get_machine_statistics

api = APIRouter(tags=["Machine Telemetry"])


@api.get("/machine-telemetry")
def machine_telemetry(db: Session = Depends(get_db)):
    return get_machine_statistics(db)


@api.get("/machine-telemetry/{unit_id}")
def machine_telemetry_detail(unit_id: int, db: Session = Depends(get_db)):
    from fastapi import HTTPException
    from backend.services.machine_telemetry_service import get_machine_detail
    result = get_machine_detail(db, unit_id)
    if not result:
        raise HTTPException(status_code=404, detail="Machine inventory unit not found.")
    return result
