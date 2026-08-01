from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field



# ============================================================
# ENUMS
# ============================================================

class EnquiryStatus(str, Enum):
    OPEN = "OPEN"
    CLOSED = "CLOSED"
    LOST = "LOST"
    ARCHIVED = "ARCHIVED"


class EnquiryStage(str, Enum):
    CUSTOMER_REQUEST = "CUSTOMER_REQUEST"
    SALES_SURVEY = "SALES_SURVEY"
    OPS_REVIEW = "OPS_REVIEW"
    TECHNO_COMMERCIAL_APPROVAL = "TECHNO_COMMERCIAL_APPROVAL"
    COMMERCIAL_APPROVAL = "COMMERCIAL_APPROVAL"
    QUOTE_RELEASED = "QUOTE_RELEASED"
    PO_RECEIVED = "PO_RECEIVED"
    JOB_CREATION = "JOB_CREATION"
    EXECUTION = "EXECUTION"
    COMPLETED = "COMPLETED"


# ============================================================
# DASHBOARD QUERY
# ============================================================

class EnquiryDashboardQuery(BaseModel):
    status: Optional[EnquiryStatus] = None
    search: Optional[str] = None
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)


# ============================================================
# DASHBOARD ROW
# ============================================================

class EnquiryConsolidatedListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int

    customer_request_id: Optional[int] = None

    customer_name: Optional[str] = None

    nature: Optional[str] = None

    stage: EnquiryStage

    status: EnquiryStatus

    owner_role: Optional[str] = None

    owner_user_id: Optional[int] = None

    created_at: datetime

    updated_at: Optional[datetime] = None

    closed_at: Optional[datetime] = None


# ============================================================
# DASHBOARD RESPONSE
# ============================================================

class EnquiryConsolidatedListResponse(BaseModel):
    items: List[EnquiryConsolidatedListItem]

    total: int

    page: int

    page_size: int


# ============================================================
# DETAIL
# ============================================================

class EnquiryConsolidatedDetail(EnquiryConsolidatedListItem):

    sales_survey_id: Optional[int] = None

    ops_selector_id: Optional[int] = None

    dewatering_assessment_id: Optional[int] = None

    quote_id: Optional[int] = None

    approval_board_id: Optional[int] = None

    job_creation_id: Optional[int] = None

    execution_id: Optional[int] = None


# ============================================================
# ACTION RESPONSE
# ============================================================

class EnquiryLifecycleResponse(BaseModel):

    success: bool

    message: str

    enquiry: EnquiryConsolidatedDetail


# ============================================================
# DELETE RESPONSE
# ============================================================

class EnquiryDeleteResponse(BaseModel):

    success: bool

    message: str


class ModuleReferenceUpdateRequest(BaseModel):

    reference_field: str

    reference_id: int


class SetStageRequest(BaseModel):

    stage: EnquiryStage