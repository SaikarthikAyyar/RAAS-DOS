# ====================================
# IMPORTS
# ====================================

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import Date
from sqlalchemy import DateTime
from sqlalchemy import JSON

from backend.database.tables import Base


# ====================================
# INVOICE
# ====================================

class Invoice(

    Base

):

    __tablename__ = "invoice"

    # ====================================
    # PRIMARY KEY
    # ====================================

    id = Column(

        Integer,

        primary_key=True,

        index=True

    )

    # ====================================
    # LINKS
    # ====================================

    job_creation_id = Column(

        Integer,

        nullable=False,

        unique=True

    )

    generated_job_id = Column(

        String(100),

        nullable=False,

        unique=True

    )

    customer_request_id = Column(

        Integer,

        nullable=False

    )

    execution_id = Column(

        Integer,

        nullable=True

    )

    # ====================================
    # WORKFLOW
    # ====================================

    invoice_status = Column(

        String(50),

        default="ACTIVE"

    )

    execution_phase = Column(

        String(100),

        default="JOB_CREATED"

    )

    execution_progress = Column(

        Float,

        default=0

    )

    customer_visible_status = Column(

        String(200),

        default="Job Created"

    )

    # ====================================
    # SCHEDULE
    # ====================================

    planned_start = Column(

        Date,

        nullable=True

    )

    estimated_completion = Column(

        Date,

        nullable=True

    )

    actual_completion = Column(

        Date,

        nullable=True

    )

    delay_days = Column(

        Integer,

        default=0

    )

    # ====================================
    # MACHINE
    # ====================================

    machine_status = Column(

        String(100),

        default="NOT_ALLOCATED"

    )

    machine_name = Column(

        String(100),

        nullable=True

    )

    machine_code = Column(

        String(100),

        nullable=True

    )

    machine_location = Column(

        String(200),

        nullable=True

    )

    # ====================================
    # PERSONNEL
    # ====================================

    personnel_status = Column(

        String(100),

        default="NOT_ASSIGNED"

    )

    personnel_json = Column(

        JSON,

        default=list

    )

    # ====================================
    # TRANSPORT
    # ====================================

    transport_status = Column(

        String(100),

        default="WAITING"

    )

    gps_location = Column(

        String(200),

        nullable=True

    )

    destination = Column(

        String(200),

        nullable=True

    )

    distance_remaining_km = Column(

        Float,

        default=0

    )

    eta_minutes = Column(

        Integer,

        default=0

    )

    # ====================================
    # EXECUTION
    # ====================================

    current_activity = Column(

        String(300),

        nullable=True

    )

    live_execution_log = Column(

        JSON,

        default=list

    )

    # ====================================
    # AUDIT
    # ====================================

    created_at = Column(

        DateTime,

        nullable=True

    )

    updated_at = Column(

        DateTime,

        nullable=True

    )