# ====================================
# IMPORTS
# ====================================

from sqlalchemy import Column

from sqlalchemy import Integer

from sqlalchemy import String

from sqlalchemy import ForeignKey

from backend.database.tables import Base


# ====================================
# TABLE
# ====================================

class CustomerMedia(Base):


    __tablename__="customer_media"


    id=Column(

        Integer,

        primary_key=True,

        index=True

    )


    customer_request_id=Column(

        Integer,

        ForeignKey(

            "customer_requests.id"

        )

    )


    media_type=Column(

        String(20)

    )


    file_name=Column(

        String(255)

    )


    file_path=Column(

        String(500)

    )