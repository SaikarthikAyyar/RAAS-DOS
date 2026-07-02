# ====================================
# IMPORTS
# ====================================

from backend.reporting.report_repository import (
    get_customer_request,
    get_sales_survey,
    get_customer_media
)

from backend.reporting.report_builder import (
    build_report
)

from backend.reporting.pdf_builder import (
    build_pdf
)


# ====================================
# BUILD REPORT SERVICE
# ====================================

def build_report_service(
    db,
    customer_request_id
):

    # ====================================
    # LOAD CUSTOMER
    # ====================================

    customer = get_customer_request(
        db,
        customer_request_id
    )

    if not customer:
        return None

    # ====================================
    # LOAD SALES SURVEY
    # ====================================

    survey = get_sales_survey(
        db,
        customer_request_id
    )

    # ====================================
    # LOAD MEDIA
    # ====================================

    media = get_customer_media(
        db,
        customer_request_id
    )

    # ====================================
    # BUILD REPORT DATA
    # ====================================

    report = build_report(
        customer,
        survey,
        media
    )

    # ====================================
    # BUILD PDF
    # ====================================

    return build_pdf(
        report
    )