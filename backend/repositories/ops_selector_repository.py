# ====================================
# IMPORTS
# ====================================

import logging

from backend.models.ops_selector import OpsSelection


# ====================================
# LOGGER
# ====================================

logger = logging.getLogger(__name__)


# ====================================
# CREATE OPS SELECTION
# ====================================

def create_ops_selection(

        db,

        payload

):

    # --------------------------------
    # Calculate total duration
    # --------------------------------

    total_job_days=(

    (payload.mobilisation_days or 0)+

    (payload.setup_days or 0)+

    (payload.execution_days or 0)+

    (payload.demob_days or 0)

    )


    # --------------------------------
    # Create Ops Selection record
    # --------------------------------

    ops = OpsSelection(

        customer_request_id=
        payload.customer_request_id,

        sales_survey_id=payload.sales_survey_id,

        doability=payload.doability,

        service_configuration=payload.service_configuration,

        ops_engine_version=payload.ops_engine_version,

        recommended_machine=payload.recommended_machine,

        pump_hose_package=payload.pump_hose_package,

        accessories=payload.accessories,

        mobilisation_days=payload.mobilisation_days,

        setup_days=payload.setup_days,

        execution_days=payload.execution_days,

        demob_days=payload.demob_days,

        total_job_days=total_job_days,

        manpower_required=payload.manpower_required,

        approval_gate=payload.approval_gate,

        internal_next_action=payload.internal_next_action,

        selection_reason=

        payload.selection_reason,

        workflow_status=payload.workflow_status

    )


    # --------------------------------
    # Save to database
    # --------------------------------

    db.add(

        ops

    )

    db.commit()

    db.refresh(

        ops

    )

    return ops

def get_ops_selection_by_survey(

        db,

        sales_survey_id

):

    return (

        db.query(

            OpsSelection

        )

        .filter(

            OpsSelection.sales_survey_id == sales_survey_id

        )

        .first()

    )