# ====================================
# IMPORTS
# ====================================


from backend.repositories.ops_selector_repository import (

    create_ops_selection,

    get_ops_selection_by_survey

)

from backend.models.sales_survey import SalesSurvey

from fastapi import HTTPException

from backend.mapping.survey_field_mapper import (
    map_sales_survey_to_ops
)

from backend.services.ops_engine import (
    run_ops_engine
)

from backend.services.sales_survey_service import (
    get_sales_survey_request
)
from backend.services.status_service import update_customer_request_status




# ====================================
# CREATE OPS SELECTION
# ====================================

def create_ops_selection_request(

        db,

        payload

):

    # ====================================
    # LOAD SALES SURVEY
    # ====================================

    sales_survey = get_sales_survey_request(

        db,

        payload.sales_survey_id

    )

    if sales_survey is None:

        raise ValueError(

            "Sales Survey not found."

        )
    
    # ====================================
    # CHECK EXISTING OPS SELECTION
    # ====================================

    existing = get_ops_selection_by_survey(

        db,

        payload.sales_survey_id

    )

    if existing:

        raise HTTPException(

            status_code=409,

            detail="Ops Selection already exists for this Sales Survey."

        )

    # ====================================
    # MAP TO ENGINE INPUTS
    # ====================================

    engineering_inputs = map_sales_survey_to_ops(

        sales_survey

    )

    # ====================================
    # RUN ENGINE
    # ====================================

    ops_output = run_ops_engine(

        engineering_inputs

    )

    # ====================================
    # POPULATE PAYLOAD
    # ====================================

    payload.doability = (

        ops_output["doability"]

    )

    payload.service_configuration = (

        ops_output["service_configuration"]

    )

    payload.recommended_machine = (

        ops_output["recommended_machine"]

    )

    payload.pump_hose_package = (

        ops_output["pump_hose_package"]

    )

    payload.accessories = (

        ops_output["accessories"]

    )

    payload.mobilisation_days = (

        ops_output["mobilisation_days"]

    )

    payload.setup_days = (

        ops_output["setup_days"]

    )

    payload.execution_days = (

        ops_output["execution_days"]

    )

    payload.demob_days = (

        ops_output["demob_days"]

    )

    payload.total_job_days = (

        ops_output["total_job_days"]

    )

    payload.manpower_required = (

        ops_output["manpower_required"]

    )

    payload.approval_gate = (

        ops_output["approval_gate"]

    )

    payload.internal_next_action = (

        ops_output["internal_next_action"]

    )

    payload.selection_reason = (

        ops_output["selection_reason"]

    )

    # ====================================
    # SAVE
    # ====================================

    ops = create_ops_selection(

            db,

            payload

        )

    survey = (

        db.query(

            SalesSurvey

        )

        .filter(

            SalesSurvey.id ==

            ops.sales_survey_id

        )

        .first()

    )

    if survey:

        update_customer_request_status(

            db,

            survey.customer_request_id,

            "OPS_COMPLETED"

        )

    return ops


# ====================================
# OPS PREVIEW
# ====================================

def get_ops_selection_preview(

        db,

        sales_survey_id

):

    # ====================================
    # LOAD SALES SURVEY
    # ====================================

    sales_survey = get_sales_survey_request(

        db,

        sales_survey_id

    )

    if sales_survey is None:

        raise ValueError(

            "Sales Survey not found."

        )

    # ====================================
    # MAP TO ENGINE INPUTS
    # ====================================

    engineering_inputs = map_sales_survey_to_ops(

        sales_survey

    )

    # ====================================
    # RUN ENGINE
    # ====================================

    ops_output = run_ops_engine(

        engineering_inputs

    )

    return {

        "inputs":

            engineering_inputs,

        **ops_output

    }