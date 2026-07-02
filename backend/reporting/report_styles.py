# ====================================
# IMPORTS
# ====================================

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4


# ====================================
# PAGE SETTINGS
# ====================================

PAGE_WIDTH, PAGE_HEIGHT = A4

LEFT_MARGIN = 45
RIGHT_MARGIN = 45

TOP_MARGIN = 50
BOTTOM_MARGIN = 50

LINE_SPACING = 20


# ====================================
# COLORS
# ====================================

TITLE_COLOR = HexColor("#0F3B63")
TEXT_COLOR = HexColor("#222222")


# ====================================
# SECTION TITLE
# ====================================

def draw_section_title(
    pdf,
    title,
    y
):

    pdf.setFillColor(TITLE_COLOR)

    pdf.setFont(
        "Helvetica-Bold",
        16
    )

    pdf.drawString(
        LEFT_MARGIN,
        y,
        title
    )

    y -= 8

    pdf.line(
        LEFT_MARGIN,
        y,
        PAGE_WIDTH - RIGHT_MARGIN,
        y
    )

    return y - 20


# ====================================
# COMPATIBILITY ALIAS
# ====================================

def draw_heading(
    pdf,
    title,
    y
):

    return draw_section_title(
        pdf,
        title,
        y
    )


# ====================================
# FIELD
# ====================================

def draw_field(
    pdf,
    label,
    value,
    y
):

    pdf.setFillColor(TEXT_COLOR)

    pdf.setFont(
        "Helvetica-Bold",
        11
    )

    pdf.drawString(
        LEFT_MARGIN,
        y,
        f"{label}:"
    )

    pdf.setFont(
        "Helvetica",
        11
    )

    if value is None or value == "":
        value = "-"

    pdf.drawString(
        210,
        y,
        str(value)
    )

    return y - LINE_SPACING


# ====================================
# PAGE BREAK
# ====================================

def check_page_break(
    pdf,
    y
):

    if y < BOTTOM_MARGIN:

        pdf.showPage()

        return PAGE_HEIGHT - TOP_MARGIN

    return y


# ====================================
# SAFE FIELD DRAWER
# ====================================

def draw_label_value(
    pdf,
    label,
    value,
    y
):

    y = check_page_break(
        pdf,
        y
    )

    return draw_field(
        pdf,
        label,
        value,
        y
    )