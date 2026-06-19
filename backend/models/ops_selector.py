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
    # Primary key
    # --------------------------------

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    # --------------------------------
    # Workflow connection
    # Sales Survey -> Ops Selector
    # --------------------------------

    sales_survey_id = Column(
        Integer,

        ForeignKey(
            "sales_surveys.id"
        )
    )


    # --------------------------------
    # Operational feasibility
    # --------------------------------

    doability = Column(
        String(100)
    )


    # --------------------------------
    # Service recommendation
    # --------------------------------

    service_configuration = Column(
        String
    )


    recommended_machine = Column(
        String(150)
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
    # Duration planning
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
    # Resource planning
    # --------------------------------

    manpower_required = Column(
        Integer
    )


    # --------------------------------
    # Internal workflow
    # --------------------------------

    approval_gate = Column(
        String(100)
    )


    internal_next_action = Column(
        String(200)
    )