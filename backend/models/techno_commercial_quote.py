# ====================================
# IMPORTS
# ====================================

from sqlalchemy import Column

from sqlalchemy import Integer

from sqlalchemy import Float

from sqlalchemy import Boolean

from sqlalchemy import ForeignKey

from sqlalchemy import String

from sqlalchemy import DateTime

from sqlalchemy.sql import func


from backend.database.tables import Base


# ====================================
# QUOTE MODEL
# ====================================

class Quote(Base):

    __tablename__ = "quotes"


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




    ops_selection_id = Column(

        Integer,

        ForeignKey(

            "ops_selections.id"

        ),


        nullable=False

    )


    # ====================================
    # REVISION
    # ====================================

    revision_number = Column(

        Integer,

        default=1

    )

    workflow_status = Column(

        String(50),

        default="DRAFT"

    )

    created_on = Column(

        DateTime,

        server_default=func.now()

    )


    dewatering_assessment_id = Column(

        Integer,

        ForeignKey(

            "dewatering_assessments.id"

        )

    )

    # ====================================
    # TECHNICAL SNAPSHOT
    # ====================================

    recommended_machine = Column(

        String(100)

    )

    service_configuration = Column(

        String(100)

    )

    pump_hose_package = Column(

        String(150)

    )



    approval_gate = Column(

        String(100)

    )

    # ====================================
    # COMMERCIAL BREAKDOWN
    # ====================================

    mobilisation_cost = Column(

        Float

    )

    setup_cost = Column(

        Float

    )

    execution_cost = Column(

        Float

    )

    pump_addon_cost = Column(

        Float

    )

    documentation_buffer = Column(

        Float

    )

    access_support_buffer = Column(

        Float

    )

    overhead_cost = Column(

        Float

    )

    contingency_cost = Column(

        Float

    )



    # ====================================
    # COMMERCIAL SUMMARY
    # ====================================

    margin_percentage = Column(

        Float

    )

    margin_value = Column(

        Float

    )

    cleaning_quote = Column(

        Float

    )

    dewatering_method = Column(

        String(150)

    )

    dewatering_addon = Column(

        Float

    )

    combined_budgetary_value = Column(

        Float

    )


    # ====================================
    # COMMERCIAL BREAKDOWN - MIN/MAX RANGE
    # (Techno-Commercial Approval tab -
    # wireframe parity. The columns above
    # this point are no longer written to
    # by new quotes - kept for old rows.)
    # ====================================

    mobilisation_cost_min = Column(Float)
    mobilisation_cost_max = Column(Float)

    setup_cost_min = Column(Float)
    setup_cost_max = Column(Float)

    execution_cost_min = Column(Float)
    execution_cost_max = Column(Float)

    pump_addon_cost_min = Column(Float)
    pump_addon_cost_max = Column(Float)

    direct_cost_min = Column(Float)
    direct_cost_max = Column(Float)

    overhead_cost_min = Column(Float)
    overhead_cost_max = Column(Float)

    contingency_cost_min = Column(Float)
    contingency_cost_max = Column(Float)

    margin_value_min = Column(Float)
    margin_value_max = Column(Float)

    cleaning_quote_min = Column(Float)
    cleaning_quote_max = Column(Float)

    dewatering_addon_min = Column(Float)
    dewatering_addon_max = Column(Float)

    combined_budgetary_value_min = Column(Float)
    combined_budgetary_value_max = Column(Float)


    # ====================================
    # TECHNO-COMMERCIAL APPROVAL DECISION
    # (Techno-Commercial Approval tab -
    # wireframe parity)
    # ====================================

    techno_status = Column(
        String(50),
        default="Pending"
    )

    techno_approved_by = Column(
        String(100)
    )

    techno_approved_date = Column(
        String(20)
    )

    techno_note = Column(
        String(500)
    )













    

