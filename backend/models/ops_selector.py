# ====================================
# IMPORTS
# ====================================

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey

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