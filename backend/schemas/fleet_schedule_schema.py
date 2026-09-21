# ====================================
# IMPORTS
# ====================================

from typing import Optional
from datetime import date

from pydantic import BaseModel, ConfigDict

from backend.schemas.notification_schema import ActorSchema
from backend.schemas.fleet_unit_schema import KitPumpSchema, KitAccessorySchema


# ====================================
# BOOK FLEET UNIT
# ====================================

class BookFleetUnitSchema(BaseModel):

    job_id: int
    fleet_unit_id: int
    site_location: str
    planned_start: date
    planned_completion: date

    # Phase 44 - pumps/accessories this job takes along, by id.
    pump_ids: list[int] = []
    accessory_ids: list[int] = []

    actor: Optional[ActorSchema] = None
    remark: Optional[str] = None


# ====================================
# EDIT KIT (Phase 44)
# ====================================

class UpdateFleetScheduleKit(BaseModel):

    pump_ids: list[int] = []
    accessory_ids: list[int] = []

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

    # Phase 44 - this booking's kit, each item with its id.
    pumps: list[KitPumpSchema] = []
    accessories: list[KitAccessorySchema] = []

    # Not a real column - set only when booking this schedule tried to
    # geocode the site location into the execution's destination
    # coordinates and found nothing. See book_fleet_unit_request.
    destination_geocode_warning: Optional[str] = None
