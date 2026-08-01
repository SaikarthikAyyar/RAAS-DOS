# ====================================
# IMPORTS
# ====================================

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey

from sqlalchemy.dialects.postgresql import JSONB

from backend.database.tables import Base


# ====================================
# OPS SELECTOR TABLE
# ====================================

class OpsSelection(Base):

    __tablename__ = "ops_selections"


    # --------------------------------
    # Primary Key
    # --------------------------------

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    customer_request_id = Column(
        Integer,

        ForeignKey(
            "customer_requests.id"
        )
    )


    # --------------------------------
    # Workflow Connection
    # Sales Survey -> Ops Selector
    # --------------------------------

    sales_survey_id = Column(
        Integer,
        ForeignKey(
            "sales_surveys.id"
        )
    )


    # --------------------------------
    # Engine Version
    # --------------------------------

    ops_engine_version = Column(
        String(20)
    )


    # --------------------------------
    # Operational Feasibility
    # --------------------------------

    doability = Column(
        String(100)
    )


    # --------------------------------
    # Engineering Recommendation
    # --------------------------------

    service_configuration = Column(
        String(100)
    )


    recommended_machine = Column(
        String(50)
    )


    pump_hose_package = Column(
        String(150)
    )





    accessories = Column(
        String
    )


    recommended_package = Column(
        String(150)
    )


    # --------------------------------
    # Duration Planning
    # --------------------------------

    mobilisation_days = Column(
        Integer
    )


    setup_days = Column(
        Integer
    )


    execution_days = Column(
        Integer
    )


    demob_days = Column(
        Integer
    )


    total_job_days = Column(
        Integer
    )


    # --------------------------------
    # Resource Planning
    # --------------------------------

    manpower_required = Column(
        Integer
    )


    # --------------------------------
    # Internal Workflow
    # --------------------------------

    approval_gate = Column(
        String(100)
    )


    internal_next_action = Column(
        String(200)
    )


    selection_reason = Column(
        String(500)
    )

    workflow_status = Column(

        String(50),

        default="DRAFT"

    )


    # --------------------------------
    # Human Override
    # (Ops Review tab - wireframe parity)
    # --------------------------------

    override_machine = Column(
        String(50)
    )

    override_reason = Column(
        String(500)
    )


    # --------------------------------
    # Deployment Plan
    # (Ops Review tab - wireframe parity)
    # --------------------------------

    crew_plan = Column(
        JSONB
    )

    accessories_plan = Column(
        JSONB
    )

    dewatering_method_min = Column(
        String(100)
    )

    dewatering_method_max = Column(
        String(100)
    )


    # --------------------------------
    # Ops Review Decision
    # (Ops Review tab - wireframe parity)
    # --------------------------------

    review_status = Column(
        String(50),
        default="Pending"
    )

    reviewed_by = Column(
        String(100)
    )

    reviewed_date = Column(
        String(20)
    )

    review_note = Column(
        String(500)
    )