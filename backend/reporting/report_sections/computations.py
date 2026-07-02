# ====================================
# IMPORTS
# ====================================

from backend.reporting.report_styles import (
    draw_section_title,
    draw_field,
    check_page_break
)


# ====================================
# DRAW COMPUTATIONS
# ====================================

def draw_computations_section(

    pdf,
    report,
    y

):

    y = check_page_break(

        pdf,
        y

    )

    # ====================================
    # SECTION TITLE
    # ====================================

    y = draw_section_title(

        pdf,
        "3. Engineering Computations",
        y

    )

    computations = report.computations

    # ====================================
    # VALUES
    # ====================================

    rows = [

        (

            "Tank Volume",

            computations.tank_volume

        ),

        (

            "Working Volume",

            computations.working_volume

        ),

        (

            "Sludge Volume",

            computations.sludge_volume

        ),

        (

            "Surface Area",

            computations.surface_area

        )

    ]

    # ====================================
    # DRAW ROWS
    # ====================================

    for label, value in rows:

        value = "-" if value is None else str(value)

        y = draw_field(

            pdf,
            label,
            value,
            y

        )

    return y