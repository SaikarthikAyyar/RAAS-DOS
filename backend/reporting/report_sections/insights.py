# ====================================
# IMPORTS
# ====================================

from backend.reporting.report_styles import (
    draw_section_title,
    draw_label_value
)


# ====================================
# DRAW ENGINEERING INSIGHTS
# ====================================

def draw_insights_section(
    pdf,
    report,
    y
):

    y = draw_section_title(
        pdf,
        "6. Engineering Insights",
        y
    )

    # --------------------------------
    # Tank Capacity
    # --------------------------------

    if report.computations.tank_volume:

        utilization = (
            report.computations.sludge_volume
            /
            report.computations.tank_volume
        ) * 100

        y = draw_label_value(
            pdf,
            "Tank Utilization",
            f"{utilization:.1f} %",
            y
        )

    # --------------------------------
    # Estimated Cleaning Volume
    # --------------------------------

    y = draw_label_value(
        pdf,
        "Sludge To Remove",
        report.computations.sludge_volume,
        y
    )

    # --------------------------------
    # Pump Capacity
    # --------------------------------

    y = draw_label_value(
        pdf,
        "Recommended Pump Capacity",
        report.computations.pump_capacity,
        y
    )

    # --------------------------------
    # Estimated Duration
    # --------------------------------

    y = draw_label_value(
        pdf,
        "Estimated Duration",
        report.computations.estimated_duration,
        y
    )

    # --------------------------------
    # Estimated Manpower
    # --------------------------------

    y = draw_label_value(
        pdf,
        "Estimated Manpower",
        report.computations.estimated_manpower,
        y
    )

    # --------------------------------
    # Dewatering
    # --------------------------------

    if report.computations.dewatering_required:

        recommendation = "Required"

    else:

        recommendation = "Not Required"

    y = draw_label_value(
        pdf,
        "Dewatering",
        recommendation,
        y
    )

    return y