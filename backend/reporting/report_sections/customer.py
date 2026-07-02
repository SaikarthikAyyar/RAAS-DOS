# ====================================
# IMPORTS
# ====================================

from backend.reporting.report_styles import (
    draw_section_title,
    draw_field,
    check_page_break
)


# ====================================
# DRAW CUSTOMER SECTION
# ====================================

def draw_customer_section(

    pdf,

    report,

    y

):

    customer = report.customer


    # ====================================
    # SECTION TITLE
    # ====================================

    y = draw_section_title(

        pdf,

        "1. Customer Information",

        y

    )


    # ====================================
    # CUSTOMER DETAILS
    # ====================================

    y = draw_field(

        pdf,

        "Company",

        customer.company_name,

        y

    )

    y = draw_field(

        pdf,

        "Plant Location",

        customer.plant_site_location,

        y

    )

    y = draw_field(

        pdf,

        "Contact Person",

        customer.contact_person,

        y

    )

    y = draw_field(

        pdf,

        "Contact Number",

        customer.contact_number,

        y

    )

    y = draw_field(

        pdf,

        "Nearest City Hub",

        customer.nearest_city_hub,

        y

    )

    y = draw_field(

        pdf,

        "Urgency",

        customer.urgency,

        y

    )


    # ====================================
    # PAGE BREAK
    # ====================================

    y = check_page_break(

        pdf,

        y

    )


    return y