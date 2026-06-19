# ====================================
# IMPORTS
# ====================================

from sqlalchemy import Column

from sqlalchemy import Integer

from sqlalchemy import String

from sqlalchemy import ForeignKey

from backend.database.tables import Base


# ====================================
# APPROVAL BOARD
# ====================================

class ApprovalBoard(

    Base

):


    __tablename__ = (

        "approval_boards"

    )


    id = Column(

        Integer,

        primary_key=True,

        index=True

    )


    quote_id = Column(

        Integer,

        ForeignKey(

            "quotes.id"

        )

    )


    approval_status = Column(

        String(

            50

        )

    )


    approved_by = Column(

        String(

            100

        )

    )


    approval_date = Column(

        String(

            50

        )

    )


    next_action = Column(

        String(

            100

        )

    )