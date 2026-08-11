# ====================================
# IMPORTS
# ====================================

from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict


# ====================================
# VALUES
# ====================================

class LookupListValueOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    value: str
    is_other: bool
    conditional_tag: Optional[str] = None
    sort_order: int


class LookupListValueCreate(BaseModel):
    value: str
    kind: Literal["custom", "other"]


# ====================================
# LISTS
# ====================================

class LookupListOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    list_key: str
    display_name: str
    module: str
    description: Optional[str] = None
    values: list[LookupListValueOut]
