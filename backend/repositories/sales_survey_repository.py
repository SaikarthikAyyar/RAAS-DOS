# ====================================
# IMPORTS
# ====================================

import logging

from backend.models.sales_survey import SalesSurvey


# ====================================
# LOGGER
# ====================================

logger = logging.getLogger(__name__)


# ====================================
# CREATE SALES SURVEY RECORD
# ====================================

def create_sales_survey(

        db,

        payload

):

    logger.warning(

        f"Saving Sales Survey for Customer Request ID: {payload.customer_request_id}"

    )

    survey = SalesSurvey(

        customer_request_id=payload.customer_request_id,

        job_type=payload.job_type,

        sludge_type=payload.sludge_type,

        volume=payload.volume,

        output_target=payload.output_target,

        access_type=payload.access_type,

        vertical_lift=payload.vertical_lift,

        hose_distance=payload.hose_distance,

        safety_notes=payload.safety_notes,

        status="SURVEY_COMPLETED"

    )

    db.add(

        survey

    )

    db.commit()

    db.refresh(

        survey

    )

    return survey