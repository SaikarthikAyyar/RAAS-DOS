# ====================================
# IMPORTS
# ====================================

from datetime import date, timedelta

from fastapi import HTTPException

from backend.schemas.job_creation_schema import JobCreationSchema

from backend.repositories.job_creation_repository import (

    create_job,

    get_job,

    update_job,

    get_job_by_approval

)

from backend.repositories.techno_commercial_quote_repository import (

    get_quote

)

from backend.repositories.ops_selector_repository import (

    get_ops_selection

)

from backend.repositories.customer_repository import (

    get_customer

)

from backend.services.sales_survey_service import (

    get_sales_survey_request

)

from backend.services.approval_board_service import (

    get_approval_request

)

from backend.repositories.job_creation_repository import (

    get_approved_quotes,

    get_job_creation_data

)

from backend.services.enquiry_service import EnquiryService

from backend.services.status_service import (
    update_customer_request_status
)

from backend.models.enquiry import Enquiry

from backend.models.fleet_schedule import FleetSchedule

from backend.services.enquiry_consolidated_service import update_module_reference

from backend.services.workflow_service import (
    advance_stage_at_least,
    WorkflowStage
)

# Replace this with your actual invoice service once it exists
from backend.services.invoice_service import create_invoice_request

# ====================================
# CREATE JOB
# ====================================

def create_job_request(

        db,

        payload

):

    # ====================================
    # LOAD APPROVAL
    # ====================================

    approval = get_approval_request(

        db,

        payload.approval_board_id

    )

    if approval is None:

        raise ValueError(

            "Approval Board not found."

        )

    # ====================================
    # CHECK EXISTING JOB
    # ====================================

    existing = get_job_by_approval(

        db,

        approval.id

    )

    if existing:

        raise HTTPException(

            status_code = 409,

            detail =

            "Job already created."

        )

    # ====================================
    # LOAD QUOTE
    # ====================================

    quote = get_quote(

        db,

        approval.quote_id

    )

    if quote is None:

        raise ValueError(

            "Quote not found."

        )
    
    # "APPROVAL_COMPLETED" is the real, current terminal status a
    # quote reaches via Commercial Approval's Accept/Release action
    # (approval_board_service.py) - "MANAGEMENT_APPROVED" is kept
    # accepted too for backward compatibility with older quotes that
    # predate that flow. Found and fixed 2026-08-25: this check only
    # ever accepted the latter, which no real PO_RECEIVED-stage
    # enquiry's quote actually reaches anymore, making Job Creation
    # completely unreachable until this was corrected.
    if quote.workflow_status not in ("APPROVAL_COMPLETED", "MANAGEMENT_APPROVED"):
        raise HTTPException(
            status_code=400,
            detail="Quote has not been approved by management."
        )

    # ====================================
    # LOAD OPS
    # ====================================

    ops = get_ops_selection(

        db,

        quote.ops_selection_id

    )

    if ops is None:

        raise ValueError(

            "Ops Selection not found."

        )

    # ====================================
    # LOAD SURVEY
    # ====================================

    survey = get_sales_survey_request(

        db,

        ops.sales_survey_id

    )

    # ====================================
    # LOAD CUSTOMER
    # ====================================

    customer = get_customer(

        db,

        quote.customer_request_id

    )

    # ====================================
    # PLANNED DATES
    # First estimate at creation time - a real, editable starting
    # point (see PUT /job-creation/{id}), same fallback shape
    # get_job_creation_data already computes on the fly elsewhere.
    # ====================================

    planned_start_value = date.today()

    total_days = ops.total_job_days if ops.total_job_days is not None else 1

    planned_completion_value = planned_start_value + timedelta(days=total_days)

    # ====================================
    # BUILD PAYLOAD
    # ====================================

    job = JobCreationSchema(

        approval_board_id =

        approval.id,

        customer_request_id =

        customer.id,

        sales_survey_id =

        survey.id,

        ops_selection_id =

        ops.id,

        generated_job_id =

        f"JOB-{approval.id:04d}",

        planned_start =

        planned_start_value.isoformat(),

        planned_completion =

        planned_completion_value.isoformat(),

        customer_visible_status =

        "Scheduled",

        approved_service_configuration =

        ops.service_configuration,

        approved_machine =

        ops.recommended_machine,

        approved_pump_package =

        ops.pump_hose_package,

        approved_accessories =

        ops.accessories,

        manpower_json = {},

        readiness_json = {},

        workflow_status =

        "DRAFT"

    )

    # ====================================
    # SAVE
    # ====================================

# ====================================
# SAVE
# ====================================

    job = create_job(

        db,

        job

    )

    print(f"[Workflow] Job Created : {job.id}")

    # Link the consolidated Enquiry row (the Enquiry Workspace's own
    # model - a separate, older EnquiryService-based queue is what the
    # code below this point actually drives) to the new job, so the
    # Job Created tab's by-enquiry lookup can find it. Never wired
    # before this phase - the tab had no real content to need it.
    consolidated_enquiry = (
        db.query(Enquiry)
        .filter(Enquiry.approval_board_id == approval.id)
        .first()
    )

    if consolidated_enquiry:
        update_module_reference(db, consolidated_enquiry.id, "job_creation_id", job.id)

    print("[Workflow] Completing Job Creation enquiry")

    enquiries = EnquiryService.get_received_enquiries(

        db,

        "OPS"

    )

    for enquiry in enquiries:

        if (
            enquiry.requested_task == "JOB_CREATION"
            and enquiry.approval_board_id == approval.id
        ):

            enquiry.completed = True
            enquiry.workflow_status = "COMPLETED"

            EnquiryService.update(

                db,

                enquiry

            )

            break

    
    update_customer_request_status(

        db,

        customer.id,

        "READY_FOR_ALLOCATION"

    )

    print("[Workflow] Customer Status -> READY_FOR_ALLOCATION")


    EnquiryService.create_allocation_enquiry(

        db,

        customer.id,

        survey.id,

        job.id,

        {

            "customer_request_id": customer.id,

            "sales_survey_id": survey.id,

            "job_creation_id": job.id

        }

    )

    print("[Workflow] Allocation enquiry created")


    # ====================================
    # GENERATE INVOICE
    # ====================================

    invoice = create_invoice_request(

        db,

        job.id

    )

    print(

        f"[Workflow] Invoice Created : {invoice.id}"

    )

    # Invoice is a subset of the Enquiry (Phase 39) - this is the
    # anchor the Invoice Dashboard/future Customer Portal resolve their
    # whole reference chain from, same update_module_reference pattern
    # already used for job_creation_id above.
    if consolidated_enquiry:
        update_module_reference(db, consolidated_enquiry.id, "invoice_id", invoice.id)

    print("[Workflow] Invoice generation pending")

    print("========== JOB CREATION COMPLETE ==========\n")

    return job


# ====================================
# UPDATE JOB (planned dates)
# So both Job Creation and, later, Fleet & Availability can adjust
# the job's dates after creation - closes the "subject to change...
# edited in fleet/availability" requirement.
# ====================================

def update_job_request(

        db,

        job_id,

        payload

):

    job = get_job(db, job_id)

    if job is None:
        raise HTTPException(status_code=404, detail="Job not found.")

    if payload.planned_start is not None:
        job.planned_start = payload.planned_start

    if payload.planned_completion is not None:
        job.planned_completion = payload.planned_completion

    job = update_job(db, job)

    return job


# ====================================
# CONFIRM JOB CREATION
# The explicit action that actually advances the enquiry's overall
# stage to JOB_CREATION - previously nothing in this file ever touched
# enquiry.stage at all, so a case sat at PO_RECEIVED forever even once
# a job existed and a fleet unit had been booked against it. Requires
# a real Fleet Unit booking to already exist (not just a bare job row)
# before it can be confirmed - "job creation" isn't genuinely done
# until resources have actually been allocated to it.
# ====================================

def confirm_job_creation_request(db, job_id):

    job = get_job(db, job_id)

    if job is None:
        raise HTTPException(status_code=404, detail="Job not found.")

    has_booking = (
        db.query(FleetSchedule)
        .filter(FleetSchedule.job_creation_id == job_id)
        .first()
    )

    if not has_booking:
        raise HTTPException(
            status_code=422,
            detail="Book a Fleet Unit before confirming Job Creation."
        )

    enquiry = (
        db.query(Enquiry)
        .filter(Enquiry.job_creation_id == job_id)
        .first()
    )

    if enquiry is None:
        raise HTTPException(
            status_code=404,
            detail="No enquiry is linked to this job."
        )

    job.workflow_status = "CONFIRMED"
    db.commit()
    db.refresh(job)

    advance_stage_at_least(db, enquiry.id, WorkflowStage.JOB_CREATION.value)

    return job


# ====================================
# GET JOB BY ENQUIRY (Phase 33D)
# Resolves the enquiry's own linked job_creation_id if set; otherwise
# reports "not yet created" plus the approval_board_id the frontend
# needs to create one - avoids a second round-trip just to find that
# id, since the Enquiry Workspace already has the full enquiry detail
# in hand.
# ====================================

def get_job_by_enquiry_request(db, enquiry):

    if not enquiry.job_creation_id:
        return {
            "job_exists": False,
            "approval_board_id": enquiry.approval_board_id
        }

    job = get_job(db, enquiry.job_creation_id)

    if job is None:
        return {
            "job_exists": False,
            "approval_board_id": enquiry.approval_board_id
        }

    return {
        "job_exists": True,
        "id": job.id,
        "generated_job_id": job.generated_job_id,
        "planned_start": job.planned_start,
        "planned_completion": job.planned_completion,
        "approved_service_configuration": job.approved_service_configuration,
        "approved_machine": job.approved_machine,
        "approved_pump_package": job.approved_pump_package,
        "approved_accessories": job.approved_accessories,
        "workflow_status": job.workflow_status,
        "enquiry_stage": enquiry.stage
    }


# ====================================
# GET APPROVED QUOTES
# ====================================

def get_approved_quotes_request(

        db

):

    print(

        "\n========== JOB CREATION SERVICE =========="

    )

    quotes = get_approved_quotes(

        db

    )

    print(

        "Approved Quotes:",

        len(

            quotes

        )

    )

    print(

        "==========================================\n"

    )

    return quotes


# ====================================
# GET JOB CREATION
# ====================================

def get_job_creation_request(

        db,

        quote_id

):

    print(

        "\n========== JOB CREATION SERVICE =========="

    )

    print(

        "Loading Quote:",

        quote_id

    )

    job = get_job_creation_data(

        db,

        quote_id

    )

    print(

        "==========================================\n"

    )

    return job