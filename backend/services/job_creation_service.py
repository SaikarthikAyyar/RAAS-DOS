# ====================================
# IMPORTS
# ====================================

from fastapi import HTTPException

from backend.schemas.job_creation_schema import JobCreationSchema

from backend.repositories.job_creation_repository import (

    create_job,

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

# Replace this with your actual invoice service once it exists
# from backend.services.invoice_service import create_invoice_request

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
    
    if quote.workflow_status != "MANAGEMENT_APPROVED":
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

    # InvoiceService.create_invoice_request(
    #     db,
    #     job.id
    # )

    print("[Workflow] Invoice generation pending")

    print("========== JOB CREATION COMPLETE ==========\n")

    return job


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