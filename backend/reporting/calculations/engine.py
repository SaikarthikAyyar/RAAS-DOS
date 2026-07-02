# ====================================
# IMPORTS
# ====================================

from backend.reporting.calculations.geometry import (
    calculate_geometry
)


# ====================================
# CALCULATION ENGINE
# ====================================

def calculate_report(customer, survey):
    """
    Master calculation engine.

    Every engineering calculation used by the
    reporting system starts here.
    """

    calculations = {}

    # ====================================
    # GEOMETRY
    # ====================================

    calculations.update(

        calculate_geometry(customer)

    )

    # ====================================
    # FUTURE MODULES
    # ====================================

    # calculations.update(
    #     calculate_sludge(...)
    # )

    # calculations.update(
    #     calculate_pump(...)
    # )

    # calculations.update(
    #     calculate_productivity(...)
    # )

    # calculations.update(
    #     calculate_dewatering(...)
    # )

    return calculations