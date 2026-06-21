# ====================================
# IMPORTS
# ====================================

from sqlalchemy import Column

from sqlalchemy import Integer

from sqlalchemy import String

from sqlalchemy import Float

from sqlalchemy import Boolean

from backend.database.tables import Base


# ====================================
# CUSTOMER REQUEST TABLE
# ====================================

class CustomerRequest(Base):


    __tablename__ = "customer_requests"


    # ====================================
    # PRIMARY KEY
    # ====================================

    id = Column(

        Integer,

        primary_key=True,

        index=True

    )


    # ====================================
    # CUSTOMER DETAILS
    # ====================================

    company_name = Column(

        String(150)

    )


    plant_site_location = Column(

        String(150)

    )


    contact_person = Column(

        String(150)

    )


    contact_number = Column(

        String(30)

    )


    nearest_city_hub = Column(

        String(100)

    )


    urgency = Column(

        String(50)

    )


    # ====================================
    # REQUIREMENT BASICS
    # ====================================

    service_requirement_type = Column(

        String(150)

    )


    observed_material = Column(

        String(150)

    )


    estimated_quantity_known = Column(

        String(100)

    )


    tank_type = Column(

        String(50)

    )


    # ====================================
    # DIMENSIONS
    # ====================================

    approx_length_dia = Column(

        Float

    )


    approx_width = Column(

        Float

    )


    approx_depth = Column(

        Float

    )


    # ====================================
    # ACCESS
    # ====================================

    access_opening_type = Column(

        String(100)

    )


    can_place_equipment_nearby = Column(

        Boolean

    )


    # ====================================
    # COMMERCIAL
    # ====================================

    quote_basis = Column(

        String(150)

    )


    pain_point = Column(

        String

    )


    # ====================================
    # MEDIA COUNTS
    # ====================================

    photo_count = Column(

        Integer,

        default=0

    )


    video_count = Column(

        Integer,

        default=0

    )


    layout_count = Column(

        Integer,

        default=0

    )


    # ====================================
    # WORKFLOW
    # ====================================

    status = Column(

        String(50),

        default="REQUESTED"

    )