# ====================================
# IMPORTS
# ====================================

from sqlalchemy import Column

from sqlalchemy import Integer

from sqlalchemy import Float

from sqlalchemy import Boolean

from sqlalchemy import ForeignKey

from sqlalchemy import String


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


    customer_id = Column(

        Integer,

        ForeignKey(

            "customer_requests.id"

        )

    )


    ops_selection_id = Column(

        Integer,

        ForeignKey(

            "ops_selections.id"

        )

    )


    dewatering_assessment_id = Column(

        Integer,

        ForeignKey(

            "dewatering_assessments.id"

        )

    )


    equipment_cost = Column(

        Float

    )


    manpower_cost = Column(

        Float

    )


    mobilisation_cost = Column(

        Float

    )


    subtotal = Column(

        Float

    )


    margin_pct = Column(

        Float

    )


    final_quote_value = Column(

        Float

    )


    approved = Column(

        Boolean,

        default=False

    )

    

