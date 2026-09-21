# ====================================
# IMPORTS
# ====================================

from typing import Optional

from pydantic import BaseModel, ConfigDict

from backend.schemas.notification_schema import ActorSchema


# ====================================
# CREW MEMBER (resolved display)
# ====================================

class FleetUnitCrewMemberSchema(BaseModel):
    id: int
    full_name: str
    designation: Optional[str] = None


# ====================================
# KIT ITEMS (Phase 44) - the pumps / accessories a unit carries,
# always shown with their ids.
# ====================================

class KitPumpSchema(BaseModel):
    id: int
    code: str
    name: str


class KitAccessorySchema(BaseModel):
    id: int
    name: str


# ====================================
# FLEET UNIT CREATE / UPDATE (33C)
# ====================================

class FleetUnitCreate(BaseModel):
    fleet_code: str
    fleet_name: str
    machine_inventory_id: int
    hub_id: Optional[int] = None
    active: bool = True
    crew_personnel_ids: list[int] = []
    pump_ids: list[int] = []
    accessory_ids: list[int] = []

    actor: ActorSchema
    remark: str


class FleetUnitUpdate(BaseModel):
    fleet_code: Optional[str] = None
    fleet_name: Optional[str] = None
    machine_inventory_id: Optional[int] = None
    hub_id: Optional[int] = None
    active: Optional[bool] = None
    crew_personnel_ids: Optional[list[int]] = None
    pump_ids: Optional[list[int]] = None
    accessory_ids: Optional[list[int]] = None

    actor: ActorSchema
    remark: str


# ====================================
# FLEET UNIT
# ====================================

class FleetUnitResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    fleet_code: str
    fleet_name: str
    active: bool

    machine_inventory_id: int
    machine_code: Optional[str] = None
    machine_name: Optional[str] = None

    hub_id: Optional[int] = None
    hub_name: Optional[str] = None

    current_location: Optional[str] = None

    crew: list[FleetUnitCrewMemberSchema] = []

    pumps: list[KitPumpSchema] = []
    accessories: list[KitAccessorySchema] = []


# ====================================
# KIT OPTIONS (Phase 44) - what a unit may be given
# ====================================

class FleetUnitKitOptionsResponse(BaseModel):
    machine_type_id: Optional[int] = None
    compatible_pumps: list[KitPumpSchema] = []
    accessories: list[KitAccessorySchema] = []
    default_accessory_ids: list[int] = []
