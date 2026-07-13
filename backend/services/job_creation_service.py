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

    return create_job(

        db,

        job

    )


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