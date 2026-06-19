# ====================================
# IMPORTS
# ====================================

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import Boolean
from sqlalchemy import ForeignKey

from backend.database.tables import Base


# ====================================
# DEWATERING ASSESSMENT TABLE
# ====================================

class DewateringAssessment(Base):

    __tablename__ = "dewatering_assessments"


    # --------------------------------
    # Primary key
    # --------------------------------

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    # --------------------------------
    # Workflow connector
    # Ops Selector -> Dewatering
    # --------------------------------

    ops_selection_id = Column(

        Integer,

        ForeignKey(
            "ops_selections.id"
        )

    )


    # --------------------------------
    # Material behaviour
    # --------------------------------

    particle_size_fines_behavior = Column(
        String(150)
    )

    bulk_density = Column(
        Float
    )

    flocculation_response = Column(
        String(100)
    )


    # --------------------------------
    # Chemical behaviour
    # --------------------------------

    polymer_likely_required = Column(
        Boolean
    )

    ph_corrosiveness = Column(
        Float
    )

    abrasiveness = Column(
        String(100)
    )


    # --------------------------------
    # Moisture handling
    # --------------------------------

    target_final_moisture_pct = Column(
        Float
    )

    cake_handling_scope = Column(
        String
    )


    # --------------------------------
    # Compliance
    # --------------------------------

    compliance_filtrate_restriction = Column(
        String
    )


    # --------------------------------
    # Engineering decisions
    # --------------------------------

    dewatering_commitment_decision = Column(
        String(100)
    )

    recommended_dewatering_method = Column(
        String(100)
    )


    # --------------------------------
    # Commercial support
    # --------------------------------

    quote_wording = Column(
        String
    )

    review_owner = Column(
        String(100)
    )

    do_not_commit_rule = Column(
        String
    )