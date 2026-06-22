# ====================================
# IMPORTS
# ====================================

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import Date
from sqlalchemy import ForeignKey
from sqlalchemy import Boolean

from backend.database.tables import Base


# ====================================
# SALES SURVEY TABLE
# ====================================

class SalesSurvey(Base):

    __tablename__ = "sales_surveys"


    # ====================================
    # PRIMARY KEY
    # ====================================

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    # ====================================
    # CUSTOMER REQUEST CONNECTION
    # ====================================

    customer_request_id = Column(
        Integer,

        ForeignKey(
            "customer_requests.id"
        )
    )


    # ====================================
    # SECTION A
    # ====================================

    survey_date = Column(
        Date
    )


    # ====================================
    # SECTION B
    # ====================================

    material_category = Column(
        String(100)
    )

    sludge_type = Column(
        String(100)
    )

    consistency = Column(
        String(100)
    )

    estimated_volume = Column(
        Float
    )

    average_output_target = Column(
        Float
    )

    solids_pct = Column(
        Float
    )

    bulk_density = Column(
        Float
    )

    hazard_level = Column(
        String(100)
    )


    # ====================================
    # SECTION C
    # ====================================

    opening_length = Column(
        Float
    )

    opening_width = Column(
        Float
    )

    height_from_ground = Column(
        Float
    )

    drop_to_floor = Column(
        Float
    )

    setup_distance = Column(
        Float
    )

    vertical_lift = Column(
        Float
    )

    hose_distance = Column(
        Float
    )

    access_path_width = Column(
        Float
    )

    scaffolding_needed = Column(
        Boolean
    )

    crane_available = Column(
        Boolean
    )


    # ====================================
    # SECTION D
    # ====================================

    power_available = Column(
        String(100)
    )

    water_available = Column(
        Boolean
    )

    confined_space = Column(
        Boolean
    )

    ventilation_required = Column(
        Boolean
    )

    gas_testing_required = Column(
        Boolean
    )

    ehs_restriction = Column(
        String(100)
    )


    # ====================================
    # SECTION E
    # ====================================

    debris_present = Column(
        Boolean
    )

    abrasiveness = Column(
        String(100)
    )

    ph_condition = Column(
        String(100)
    )

    pump_power_source = Column(
        String(100)
    )


    # ====================================
    # SECTION F
    # ====================================

    target_final_moisture = Column(
        Float
    )

    expected_final_form = Column(
        String(100)
    )

    natural_settling = Column(
        String(100)
    )

    oily_emulsified = Column(
        Boolean
    )

    space_available = Column(
        String(100)
    )

    filtrate_route = Column(
        Boolean
    )

    moisture_guarantee = Column(
        Boolean
    )

    cake_handling_scope = Column(
        String(100)
    )


    # ====================================
    # SECTION G
    # ====================================

    customer_pain_point = Column(
        String
    )

    shutdown_window = Column(
        String(100)
    )

    completion_deadline = Column(
        Date
    )

    discharge_pit_dimension = Column(

        String(100)

    )


    # ====================================
    # WORKFLOW
    # ====================================

    status = Column(
        String(50)
    )