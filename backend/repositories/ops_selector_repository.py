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

    total_job_days = (

        payload.mobilisation_days +

        payload.setup_days +

        payload.execution_days +

        payload.demob_days

    )


    # --------------------------------
    # Create Ops Selection record
    # --------------------------------

    ops = OpsSelection(

        sales_survey_id=payload.sales_survey_id,

        doability=payload.doability,

        service_configuration=payload.service_configuration,

        recommended_machine=payload.recommended_machine,

        pump_hose_package=payload.pump_hose_package,

        accessories=payload.accessories,

        recommended_package=payload.recommended_package,

        mobilisation_days=payload.mobilisation_days,

        setup_days=payload.setup_days,

        execution_days=payload.execution_days,

        demob_days=payload.demob_days,

        total_job_days=total_job_days,

        manpower_required=payload.manpower_required,

        approval_gate=payload.approval_gate,

        internal_next_action=payload.internal_next_action

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