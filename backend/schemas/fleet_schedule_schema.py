# ====================================
# IMPORTS
# ====================================

from typing import Optional
from datetime import date

from pydantic import BaseModel, ConfigDict

from backend.schemas.notification_schema import ActorSchema


# ====================================
# BOOK FLEET UNIT
# ====================================

class BookFleetUnitSchema(BaseModel):

    job_id: int
    fleet_unit_id: int
    site_location: str
    planned_start: date
    planned_completion: date

    actor: Optional[ActorSchema] = None
    remark: Optional[str] = None


# ====================================
# RESCHEDULE
# ====================================

class RescheduleFleetSchedule(BaseModel):

    planned_start: date
    planned_completion: date

    actor: Optional[ActorSchema] = None
    remark: Optional[str] = None


# ====================================
# CANCEL
# ====================================

class CancelFleetSchedule(BaseModel):

    actor: Optional[ActorSchema] = None
    remark: Optional[str] = None


# ====================================
# RESPONSE
# ====================================

class FleetScheduleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    fleet_unit_id: int
    job_creation_id: int
    execution_id: Optional[int] = None
    queue_position: int
    site_location: str
    planned_start: date
    planned_completion: date
    actual_start: Optional[date] = None
    actual_completion: Optional[date] = None
    schedule_status: str

    # Not a real column - set only when booking this schedule tried to
    # geocode the site location into the execution's destination
    # coordinates and found nothing. See book_fleet_unit_request.
    destination_geocode_warning: Optional[str] = None
