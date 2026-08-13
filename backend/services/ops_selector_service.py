# ====================================
# IMPORTS
# ====================================

from datetime import date

from backend.repositories.ops_selector_repository import (

    create_ops_selection,

    get_ops_selection_by_survey,

    get_ops_selection

)

from backend.models.sales_survey import SalesSurvey

from fastapi import HTTPException

from backend.mapping.survey_field_mapper import (
    map_sales_survey_to_ops
)

from backend.services.ops_engine import (
    run_ops_engine,
    score_all_machines
)

from backend.services.sales_survey_service import (
    get_sales_survey_request
)
from backend.services.status_service import update_customer_request_status

from backend.services.enquiry_service import EnquiryService

from backend.models.enquiry import Enquiry

from backend.services.enquiry_consolidated_service import update_module_reference





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
    # SAVE / UPDATE
    # ====================================

    if existing:

        print(f"[OPS] Updating Existing OPS Selection : {existing.id}")

        for key, value in ops_payload.items():

            setattr(

                existing,

                key,

                value

            )

        db.commit()

        db.refresh(

            existing

        )

        ops = existing

    else:

        print("[OPS] Creating New OPS Selection")

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

    
    print("[Workflow] Updating consolidated Enquiry")

    if getattr(payload, "enquiry_id", None):

        target_enquiry = (

            db.query(Enquiry)

            .filter(Enquiry.id == payload.enquiry_id)

            .first()

        )

    else:

        # Fallback when the caller doesn't know its enquiry_id (e.g. the
        # standalone Ops Selector page opened without workspace context).
        # Ambiguous when historical duplicate rows share a sales_survey_id
        # (pre-dates the consolidated-enquiry fix).
        target_enquiry = (

            db.query(Enquiry)

            .filter(Enquiry.sales_survey_id == ops.sales_survey_id)

            .order_by(Enquiry.id.desc())

            .first()

        )

    if target_enquiry:

        update_module_reference(

            db,

            target_enquiry.id,

            "ops_selector_id",

            ops.id

        )

        # Saving/regenerating the Ops Selector is a pure data operation -
        # it must never move the workflow stage forward. Only the human
        # "Approve & Send to Techno-Commercial" decision on the Ops
        # Review Decision card (save_ops_review_decision below) is
        # allowed to do that.
        print(
            f"[Workflow] Enquiry {target_enquiry.id} -> "
            f"ops_selector_id={ops.id} (stage unchanged - data save only)"
        )

    else:

        print("[Workflow] WARNING: No consolidated Enquiry found for this sales_survey_id")

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


# ====================================
# MACHINE SCORING TABLE
# ====================================

def get_ops_selection_scoring(

        db,

        ops_selection_id

):

    ops = get_ops_selection(

        db,

        ops_selection_id

    )

    if ops is None:

        raise ValueError(

            "Ops Selection not found."

        )

    sales_survey = get_sales_survey_request(

        db,

        ops.sales_survey_id

    )

    if sales_survey is None:

        raise ValueError(

            "Sales Survey not found."

        )

    engineering_inputs = map_sales_survey_to_ops(

        sales_survey

    )

    return score_all_machines(

        engineering_inputs

    )


# ====================================
# SAVE HUMAN OVERRIDE
# ====================================

def save_ops_override(

        db,

        ops_selection_id,

        override_machine,

        override_reason

):

    ops = get_ops_selection(

        db,

        ops_selection_id

    )

    if ops is None:

        raise ValueError(

            "Ops Selection not found."

        )

    ops.override_machine = override_machine

    ops.override_reason = override_reason

    db.commit()

    db.refresh(

        ops

    )

    return ops


# ====================================
# SAVE DEPLOYMENT PLAN
# ====================================

def save_deployment_plan(

        db,

        ops_selection_id,

        payload

):

    ops = get_ops_selection(

        db,

        ops_selection_id

    )

    if ops is None:

        raise ValueError(

            "Ops Selection not found."

        )

    ops.mobilisation_days = payload.mobilisation_days

    ops.setup_days = payload.setup_days

    ops.execution_days = payload.execution_days

    ops.demob_days = payload.demob_days

    ops.total_job_days = (

        payload.mobilisation_days +
        payload.setup_days +
        payload.execution_days +
        payload.demob_days

    )

    ops.crew_plan = [

        role.dict() for role in payload.crew_plan

    ]

    ops.accessories_plan = [

        item.dict() for item in payload.accessories_plan

    ]

    ops.dewatering_method_min = payload.dewatering_method_min

    ops.dewatering_method_max = payload.dewatering_method_max

    db.commit()

    db.refresh(

        ops

    )

    return ops


# ====================================
# SAVE OPS REVIEW DECISION
# ====================================

def save_ops_review_decision(

        db,

        ops_selection_id,

        status,

        reviewed_by,

        review_note

):

    ops = get_ops_selection(

        db,

        ops_selection_id

    )

    if ops is None:

        raise ValueError(

            "Ops Selection not found."

        )

    ops.review_status = status

    ops.reviewed_by = reviewed_by

    ops.reviewed_date = date.today().isoformat()

    ops.review_note = review_note

    db.commit()

    db.refresh(

        ops

    )

    return ops
