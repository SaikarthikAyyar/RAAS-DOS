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

    plant_site_location = Column(

        String(150)

    )


    # ====================================
    # SECTION B
    # ====================================

    tank_type = Column(
        String(100)
    )

    tank_length = Column(
        Float
    )

    tank_width = Column(
        Float
    )

    tank_depth = Column(
        Float
    )

    job_type = Column(
        String(100)
    )

    material_category = Column(
        String(100)
    )

    sludge_type = Column(
        String(100)
    )



    estimated_volume = Column(
        Float
    )

    average_output = Column(
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

    temperature_range = Column(
        String(100)
    )

    sample_available = Column(
        String(100)
    )

    # ====================================
    # CLEANING HISTORY
    # ====================================

    cleaning_date = Column(
        Date
    )

    cleaning_frequency = Column(
        String(100)
    )

    # ====================================
    # SITE CONDITION
    # ====================================

    sludge_hardness = Column(
        String(100)
    )

    debris_level = Column(
        String(100)
    )

    water_visibility = Column(
        String(100)
    )

    pumpable = Column(String(100))

    large_object_type = Column(String(100))

    ph_min = Column(Float)

    ph_max = Column(Float)

    flow_after_agitation = Column(String(100))


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


    access_support = Column(
        String(100)
    )

    customer_support = Column(
        String(100)
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

    air_supply_available = Column(String(100))


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

    discharge_medium = Column(String(100))

    disposal_route = Column(
        String(100)
    )

    disposal_responsibility = Column(
        String(100)
    )

    discharge_point_distance = Column(
        Float
    )

    hose_route_bends = Column(
        Integer
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