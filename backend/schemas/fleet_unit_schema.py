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
# MACHINE BUNDLE (Phase 45) - the real machines a fleet unit carries,
# always shown with their ids and role (PRIMARY does the job, SUPPORT
# is transport/auxiliary).
# ====================================

class FleetUnitMachineSchema(BaseModel):
    id: int
    machine_code: Optional[str] = None
    machine_name: Optional[str] = None
    role: str
    hub_id: Optional[int] = None
    hub_name: Optional[str] = None
    current_site: Optional[str] = None


# ====================================
# FLEET UNIT CREATE / UPDATE (33C, extended 45 for multi-machine)
# ====================================

class FleetUnitCreate(BaseModel):
    fleet_code: str
    fleet_name: str
    machine_ids: list[int]
    primary_machine_id: int
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
    machine_ids: Optional[list[int]] = None
    primary_machine_id: Optional[int] = None
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

    # Describe the PRIMARY machine only - kept for any consumer that
    # still expects a single machine. "machines" below is the real,
    # complete bundle and is what every new/updated screen should read.
    machine_inventory_id: int
    machine_code: Optional[str] = None
    machine_name: Optional[str] = None

    hub_id: Optional[int] = None
    hub_name: Optional[str] = None

    current_location: Optional[str] = None

    machines: list[FleetUnitMachineSchema] = []

    crew: list[FleetUnitCrewMemberSchema] = []

    pumps: list[KitPumpSchema] = []
    accessories: list[KitAccessorySchema] = []


# ====================================
# KIT OPTIONS (Phase 44, extended 45) - what a unit may be given,
# aggregated across every machine it bundles.
# ====================================

class FleetUnitKitOptionsResponse(BaseModel):
    machine_type_ids: list[int] = []
    compatible_pumps: list[KitPumpSchema] = []
    accessories: list[KitAccessorySchema] = []
    default_accessory_ids: list[int] = []
