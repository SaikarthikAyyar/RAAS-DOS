# ====================================
# DRAW REQUIREMENT SECTION
# ====================================

from backend.reporting.report_styles import (
    draw_heading,
    draw_field
)


def draw_requirement_section(
    pdf,
    report,
    y
):

    draw_heading(
        pdf,
        "2. Site Requirement",
        y
    )

    y -= 28

    req = report.requirement

    fields = [

        (
            "Service Requirement",
            req.service_requirement_type
        ),

        (
            "Observed Material",
            req.observed_material
        ),

        (
            "Estimated Quantity",
            req.estimated_quantity_known
        ),

        (
            "Tank Type",
            req.tank_type
        ),

        (
            "Approx Length / Diameter",
            req.approx_length_dia
        ),

        (
            "Approx Width",
            req.approx_width
        ),

        (
            "Approx Depth",
            req.approx_depth
        ),

        (
            "Access Opening",
            req.access_opening_type
        ),

        (
            "Equipment Nearby",
            req.can_place_equipment_nearby
        ),

        (
            "Quote Basis",
            req.quote_basis
        ),

        (
            "Pain Point",
            req.pain_point
        )

    ]

    for label, value in fields:

        y = draw_field(
            pdf,
            label,
            value,
            y
        )

    return y