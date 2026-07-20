# ====================================
# IMPORTS
# ====================================

import os

from reportlab.lib.utils import ImageReader

from backend.reporting.report_styles import (
    PAGE_HEIGHT,
    TOP_MARGIN,
    LEFT_MARGIN,
    draw_section_title
)

# ====================================
# IMAGE SETTINGS
# ====================================

IMAGE_WIDTH = 430
IMAGE_HEIGHT = 260

TEXT_GAP = 15

# ====================================
# DRAW IMAGE BLOCK
# ====================================

def draw_media_item(
    pdf,
    media,
    y,
    media_type
):

    try:

        image = ImageReader(media.file_path)

        pdf.drawImage(

            image,

            LEFT_MARGIN,

            y - IMAGE_HEIGHT,

            width=IMAGE_WIDTH,

            height=IMAGE_HEIGHT,

            preserveAspectRatio=True

        )

    except Exception:

        pdf.setFont(
            "Helvetica",
            12
        )

        pdf.drawString(

            LEFT_MARGIN,

            y - 20,

            "Preview unavailable"

        )

    y -= IMAGE_HEIGHT + 15

    pdf.setFont(

        "Helvetica-Bold",

        10

    )

    pdf.drawString(

        LEFT_MARGIN,

        y,

        media.file_name

    )

    y -= TEXT_GAP

    url = (

        "API/uploads/"

        + media.file_path.split("backend/uploads/")[-1]

    )

    pdf.setFillColorRGB(

        0,

        0,

        1

    )

    pdf.drawString(

        LEFT_MARGIN,

        y,

        f"Open Original {media_type.title()}"

    )

    pdf.linkURL(

        url,

        (

            LEFT_MARGIN,

            y-2,

            LEFT_MARGIN+120,

            y+10

        ),

        relative=0

    )

    pdf.setFillColorRGB(

        0,

        0,

        0

    )

    return y - 30


# ====================================
# DRAW SECTION
# ====================================

def draw_group(

    pdf,

    title,

    items,

    y,

    media_type

):

    if not items:

        return y

    pdf.showPage()

    y = PAGE_HEIGHT - TOP_MARGIN

    y = draw_section_title(

        pdf,

        title,

        y

    )

    count = 0

    for item in items:

        y = draw_media_item(

            pdf,

            item,

            y,

            media_type

        )

        count += 1

        if count == 2:

            pdf.showPage()

            y = PAGE_HEIGHT - TOP_MARGIN

            count = 0

    return y


# ====================================
# MAIN
# ====================================

def draw_media_section(

    pdf,

    report,

    y

):

    y = draw_group(

        pdf,

        "5. Site Photos",

        report.media.photos,

        y,

        "image"

    )

    y = draw_group(

        pdf,

        "6. Site Layouts",

        report.media.layouts,

        y,

        "layout"

    )

    y = draw_group(

        pdf,

        "7. Site Videos",

        report.media.videos,

        y,

        "video"

    )

    return y