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

from backend.services.enquiry_service import EnquiryService




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

    ops_payload = {

        "sales_survey_id":
            payload.sales_survey_id,

        "customer_request_id":
            sales_survey.customer_request_id,

        "doability":
            payload.doability
            if payload.doability is not None
            else ops_output["doability"],

        "service_configuration":
            payload.service_configuration
            if payload.service_configuration is not None
            else ops_output["service_configuration"],

        "recommended_machine":
            payload.recommended_machine
            if payload.recommended_machine is not None
            else ops_output["recommended_machine"],

        "pump_hose_package":
            payload.pump_hose_package
            if payload.pump_hose_package is not None
            else ops_output["pump_hose_package"],

        "accessories":
            payload.accessories
            if payload.accessories is not None
            else ops_output["accessories"],

        "mobilisation_days":
            payload.mobilisation_days
            if payload.mobilisation_days is not None
            else ops_output["mobilisation_days"],

        "setup_days":
            payload.setup_days
            if payload.setup_days is not None
            else ops_output["setup_days"],

        "execution_days":
            payload.execution_days
            if payload.execution_days is not None
            else ops_output["execution_days"],

        "ops_engine_version":
            payload.ops_engine_version
            if payload.ops_engine_version is not None
            else ops_output.get("ops_engine_version"),

        "demob_days":
            payload.demob_days
            if payload.demob_days is not None
            else ops_output["demob_days"],

        "total_job_days":
            payload.total_job_days
            if payload.total_job_days is not None
            else ops_output["total_job_days"],

        "manpower_required":
            payload.manpower_required
            if payload.manpower_required is not None
            else ops_output["manpower_required"],

        "approval_gate":
            payload.approval_gate
            if payload.approval_gate is not None
            else ops_output["approval_gate"],

        "internal_next_action":
            payload.internal_next_action
            if payload.internal_next_action is not None
            else ops_output["internal_next_action"],

        "selection_reason":
            payload.selection_reason
            if payload.selection_reason is not None
            else ops_output["selection_reason"],

        "workflow_status":
            "COMPLETED"

    }



    # ====================================
    # SAVE
    # ====================================

    ops = create_ops_selection(

            db,

            ops_payload

        )
    
    print("\n========== OPS WORKFLOW ==========")

    print(f"[Workflow] OPS Selection Saved")

    print(f"[Workflow] OPS ID : {ops.id}")

    print(f"[Workflow] Sales Survey : {ops.sales_survey_id}")


    print("[Workflow] Looking for incoming OPERATIONS enquiry")

    incoming = EnquiryService.get_received_enquiries(

        db,

        "OPERATIONS"

    )

    for enquiry in incoming:

        if enquiry.sales_survey_id == ops.sales_survey_id:

            print(f"[Workflow] Completing Enquiry {enquiry.id}")

            enquiry.completed = True

            enquiry.workflow_status = "COMPLETED"

            EnquiryService.update(

                db,

                enquiry

            )

            print("[Workflow] Incoming OPS enquiry completed")

            break

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

    
    print("[Workflow] Creating Quote Enquiry")

    payload = {

        "customer_request_id":

            survey.customer_request_id,

        "sales_survey_id":

            ops.sales_survey_id,

        "ops_selector_id":

            ops.id

    }

    EnquiryService.create_quote_enquiry(

        db,

        survey.customer_request_id,

        ops.sales_survey_id,

        ops.id,

        payload

    )

    print("[Workflow] Quote enquiry created")

    print("[Workflow] Customer Status Updated -> OPS_COMPLETED")

    print("========== OPS WORKFLOW COMPLETE ==========\n")

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


    update_customer_request_status(

        db,

        ops.customer_request_id,

        "OPS_COMPLETED"

    )
