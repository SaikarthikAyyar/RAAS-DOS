# ====================================
# IMPORTS
# ====================================

from backend.reporting.report_styles import (
    draw_section_title,
    draw_label_value,
    check_page_break
)


# ====================================
# DRAW SAFETY SECTION
# ====================================

def draw_safety_section(
    pdf,
    report,
    y
):

    y = check_page_break(
        pdf,
        y
    )

    y = draw_section_title(
        pdf,
        "4. Safety & Site Conditions",
        y
    )

    # --------------------------------
    # SITE ACCESS
    # --------------------------------

    y = draw_label_value(
        pdf,
        "Opening Length",
        report.safety.opening_length,
        y
    )

    y = draw_label_value(
        pdf,
        "Opening Width",
        report.safety.opening_width,
        y
    )

    y = draw_label_value(
        pdf,
        "Height From Ground",
        report.safety.height_from_ground,
        y
    )

    y = draw_label_value(
        pdf,
        "Drop To Floor",
        report.safety.drop_to_floor,
        y
    )

    y = draw_label_value(
        pdf,
        "Setup Distance",
        report.safety.setup_distance,
        y
    )

    y = draw_label_value(
        pdf,
        "Vertical Lift",
        report.safety.vertical_lift,
        y
    )

    y = draw_label_value(
        pdf,
        "Hose Distance",
        report.safety.hose_distance,
        y
    )

    y = draw_label_value(
        pdf,
        "Access Path Width",
        report.safety.access_path_width,
        y
    )

    y = draw_label_value(
        pdf,
        "Scaffolding Needed",
        report.safety.scaffolding_needed,
        y
    )

    y = draw_label_value(
        pdf,
        "Crane Available",
        report.safety.crane_available,
        y
    )

    # --------------------------------
    # SAFETY
    # --------------------------------

    y = draw_label_value(
        pdf,
        "Power Available",
        report.safety.power_available,
        y
    )

    y = draw_label_value(
        pdf,
        "Water Available",
        report.safety.water_available,
        y
    )

    y = draw_label_value(
        pdf,
        "Confined Space",
        report.safety.confined_space,
        y
    )

    y = draw_label_value(
        pdf,
        "Ventilation Required",
        report.safety.ventilation_required,
        y
    )

    y = draw_label_value(
        pdf,
        "Gas Testing Required",
        report.safety.gas_testing_required,
        y
    )

    y = draw_label_value(
        pdf,
        "EHS Restriction",
        report.safety.ehs_restriction,
        y
    )

    return y