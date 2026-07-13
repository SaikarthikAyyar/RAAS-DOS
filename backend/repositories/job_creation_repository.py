# ====================================
# IMPORTS
# ====================================

from backend.models.job_creation import JobCreation

from backend.models.techno_commercial_quote import Quote

from backend.models.customer_requests import CustomerRequest

from backend.models.ops_selector import OpsSelection

from backend.models.approval_board import ApprovalBoard


# ====================================
# CREATE JOB
# ====================================

def create_job(

        db,

        payload

):

    job = JobCreation(

        customer_request_id =
        payload.customer_request_id,

        sales_survey_id =
        payload.sales_survey_id,

        ops_selection_id =
        payload.ops_selection_id,

        approval_board_id =
        payload.approval_board_id,

        generated_job_id =
        payload.generated_job_id,

        planned_start =
        payload.planned_start,

        planned_completion =
        payload.planned_completion,

        customer_visible_status =
        payload.customer_visible_status,

        approved_service_configuration =
        payload.approved_service_configuration,

        approved_machine =
        payload.approved_machine,

        approved_pump_package =
        payload.approved_pump_package,

        approved_accessories =
        payload.approved_accessories,

        manpower_json =
        payload.manpower_json,

        readiness_json =
        payload.readiness_json,

        workflow_status =
        payload.workflow_status

    )

    db.add(

        job

    )

    db.commit()

    db.refresh(

        job

    )

    return job


# ====================================
# GET JOB
# ====================================

def get_job(

        db,

        job_id

):

    return (

        db.query(

            JobCreation

        )

        .filter(

            JobCreation.id == job_id

        )

        .first()

    )


# ====================================
# GET BY APPROVAL
# ====================================

def get_job_by_approval(

        db,

        approval_board_id

):

    return (

        db.query(

            JobCreation

        )

        .filter(

            JobCreation.approval_board_id ==

            approval_board_id

        )

        .first()

    )


# ====================================
# UPDATE JOB
# ====================================

def update_job(

        db,

        job

):

    db.commit()

    db.refresh(

        job

    )

    return job


# ====================================
# GET APPROVED QUOTES
# ====================================

def get_approved_quotes(

        db

):

    approvals = (

        db.query(

            ApprovalBoard,

            Quote,

            CustomerRequest

        )

        .join(

            Quote,

            ApprovalBoard.quote_id == Quote.id

        )

        .join(

            CustomerRequest,

            Quote.customer_request_id == CustomerRequest.id

        )

        .filter(

            ApprovalBoard.approval_status ==

            "APPROVED"

        )

        .order_by(

            Quote.id

        )

        .all()

    )

    result = []

    for approval, quote, customer in approvals:

        result.append({

            "quote_id":

                quote.id,

            "approval_board_id":

                approval.id,

            "quote_reference":

                f"PO-{quote.id:04d}",

            "customer":

                customer.company_name

        })

    return result

# ====================================
# GET JOB CREATION DATA
# ====================================

def get_job_creation_data(

        db,

        quote_id

):

    quote = (

        db.query(

            Quote

        )

        .filter(

            Quote.id == quote_id

        )

        .first()

    )

    if quote is None:

        return None

    customer = (

        db.query(

            CustomerRequest

        )

        .filter(

            CustomerRequest.id ==

            quote.customer_request_id

        )

        .first()

    )

    ops = (

        db.query(

            OpsSelection

        )

        .filter(

            OpsSelection.id ==

            quote.ops_selection_id

        )

        .first()

    )

    approval = (

        db.query(

            ApprovalBoard

        )

        .filter(

            ApprovalBoard.quote_id ==

            quote.id

        )

        .first()

    )

    job = None

    if approval is not None:

        job = (

            db.query(

                JobCreation

            )

            .filter(

                JobCreation.approval_board_id ==

                approval.id

            )

            .first()

        )

        # ====================================
        # CALCULATE PLANNED COMPLETION
        # ====================================

        planned_completion = None

        planned_start = (

            job.planned_start

            if job

            else None

        )

        if (

            planned_start is not None

            and

            ops.total_job_days is not None

        ):

            from datetime import timedelta

            planned_completion = (

                planned_start +

                timedelta(

                    days=ops.total_job_days

                )

            )

    return {

        "header": {

            "quote_reference":

                f"PO-{quote.id:04d}",

            "job_id":

                job.generated_job_id

                if job

                else f"JOB-{approval.id:04d}",

            "customer":

                customer.company_name

                if customer else "",

            "planned_start":

                job.planned_start

                if job else None,

            "total_job_days":

                ops.total_job_days,

            "planned_completion":

                job.planned_completion

                if (

                    job

                    and

                    job.planned_completion

                )

                else planned_completion,

            "customer_status":

                job.customer_visible_status

                if job else "Scheduled"

        },

        "recommended": {

            "service_configuration":

                ops.service_configuration,

            "recommended_machine":

                ops.recommended_machine,

            "pump_hose_package":

                ops.pump_hose_package,

            "dewatering_method":

                quote.dewatering_method

        },

        "manpower":

            job.manpower_json

            if job else {

                "ops_supervisor": [],

                "machine_operator": [],

                "helper": [],

                "safety_officer": []

            },

            "readiness":

                job.readiness_json

                if job else {

                    "machine_reserved": "",

                    "pump_ready": "",

                    "accessories_ready": "",

                    "manpower_assigned": "",

                    "customer_page": ""

                }

    }