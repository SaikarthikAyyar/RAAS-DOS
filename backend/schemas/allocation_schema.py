# ====================================
# IMPORTS
# ====================================

from datetime import date

from pydantic import BaseModel


# ====================================
# ALLOCATION REQUEST
# ====================================

class AllocationRequestSchema(BaseModel):

    machine_ids: list[int]

    personnel_ids: list[int]

    site_location: str

    planned_start: date

    planned_completion: date

    remarks: str | None = None