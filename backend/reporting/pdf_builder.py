# ====================================
# IMPORTS
# ====================================

from io import BytesIO

from reportlab.pdfgen import canvas

from backend.reporting.report_styles import (
    PAGE_HEIGHT,
    PAGE_WIDTH,
    TOP_MARGIN,
    LEFT_MARGIN
)

from backend.reporting.report_sections.customer import (
    draw_customer_section
)

from backend.reporting.report_sections.requirement import (
    draw_requirement_section
)

from backend.reporting.report_sections.computations import (
    draw_computations_section
)

from backend.reporting.report_sections.safety import (
    draw_safety_section
)

from backend.reporting.report_sections.media import (
    draw_media_section
)

from backend.reporting.report_sections.insights import (
    draw_insights_section
)

# ====================================
# BUILD PDF
# ====================================

def build_pdf(report):

    # ====================================
    # PDF BUFFER
    # ====================================

    buffer = BytesIO()

    pdf = canvas.Canvas(
        buffer,
        pagesize=(PAGE_WIDTH, PAGE_HEIGHT)
    )

    # ====================================
    # START POSITION
    # ====================================

    y = PAGE_HEIGHT - TOP_MARGIN


    # ====================================
    # REPORT TITLE
    # ====================================

    pdf.setFont(
        "Helvetica-Bold",
        22
    )

    pdf.drawString(
        LEFT_MARGIN,
        y,
        "DOS Site Survey Report"
    )

    y -= 40


    # ====================================
    # CUSTOMER SECTION
    # ====================================

    y = draw_customer_section(
        pdf,
        report,
        y
    )

    y -= 25

    y = draw_requirement_section(
        pdf,
        report,
        y
    )


    # ====================================
    # COMPUTATIONS SECTION
    # ====================================

    y = draw_computations_section(
        pdf,
        report,
        y
    )

    y = draw_safety_section(
        pdf,
        report,
        y
    )   

    y = draw_media_section(
        pdf,
        report,
        y
    )

    y = draw_insights_section(
        pdf,
        report,
        y
    )

    # ====================================
    # SAVE PDF
    # ====================================

    pdf.save()

    buffer.seek(0)

    return buffer