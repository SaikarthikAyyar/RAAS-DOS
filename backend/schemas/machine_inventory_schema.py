# ====================================
# IMPORTS
# ====================================

from typing import Optional

from pydantic import BaseModel, ConfigDict

from backend.schemas.notification_schema import ActorSchema


# ====================================
# MACHINE INVENTORY CREATE / UPDATE
# Only the fields an admin should genuinely hand-edit here - live
# allocation state (current_job_id, current_gps, queue_count) stays
# system-managed by the booking/dequeue mechanism, not exposed here.
# ====================================

class MachineInventoryCreate(BaseModel):
    machine_name: str
    machine_code: str
    asset_number: str
    machine_type_id: Optional[int] = None
    status: str = "AVAILABLE"
    current_site: Optional[str] = "WAREHOUSE"
    remarks: Optional[str] = None

    actor: ActorSchema
    remark: str


class MachineInventoryUpdate(BaseModel):
    machine_name: Optional[str] = None
    machine_code: Optional[str] = None
    asset_number: Optional[str] = None
    machine_type_id: Optional[int] = None
    status: Optional[str] = None
    current_site: Optional[str] = None
    remarks: Optional[str] = None

    actor: ActorSchema
    remark: str


# ====================================
# RESPONSE
# ====================================

class MachineInventoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    machine_name: str
    machine_code: str
    asset_number: str
    machine_type_id: Optional[int] = None
    machine_type_code: Optional[str] = None
    machine_type_name: Optional[str] = None
    status: Optional[str] = None
    current_site: Optional[str] = None
    current_job_id: Optional[int] = None
    queue_count: Optional[int] = None
    remarks: Optional[str] = None
