# ====================================
# IMPORTS
# ====================================

from backend.schemas.invoice_schema import InvoiceSchema

from backend.repositories.invoice_repository import (

    create_invoice,

    get_invoice,

    get_invoice_by_job,

    update_invoice,

    list_invoices

)

from backend.repositories.job_creation_repository import (

    get_job

)




# ====================================
# CREATE INVOICE
# ====================================

def create_invoice_request(

    db,

    job_id

):

    print(

        "\n========== INVOICE SERVICE =========="

    )

    print(

        f"Creating Invoice for Job : {job_id}"

    )

    job = get_job(

        db,

        job_id

    )

    if job is None:

        raise ValueError(

            "Job not found."

        )

    existing = get_invoice_by_job(

        db,

        job.id

    )

    if existing:

        print(

            "Invoice already exists."

        )

        return existing

    invoice = InvoiceSchema(

        job_creation_id =

        job.id,

        generated_job_id =

        job.generated_job_id,

        customer_request_id =

        job.customer_request_id,

        invoice_status =

        "ACTIVE",

        execution_phase =

        "JOB_CREATED",

        execution_progress =

        0,

        customer_visible_status =

        "Job Created",

        planned_start =

        job.planned_start,

        estimated_completion =

        job.planned_completion,

        actual_completion =

        None,

        delay_days =

        0,

        machine_status =

        "NOT_ALLOCATED",

        machine_name =

        None,

        machine_code =

        None,

        machine_location =

        None,

        personnel_status =

        "NOT_ASSIGNED",

        personnel_json =

        [],

        transport_status =

        "WAITING",

        gps_location =

        None,

        destination =

        None,

        distance_remaining_km =

        0,

        eta_minutes =

        0,

        current_activity =

        "Waiting for Allocation",

        live_execution_log =

        []

    )

    invoice = create_invoice(

        db,

        invoice

    )

    print(

        f"Invoice Created : {invoice.id}"

    )

    print(

        "=====================================\n"

    )

    return invoice


# ====================================
# GET INVOICE
# ====================================

def get_invoice_request(

    db,

    invoice_id

):

    return get_invoice(

        db,

        invoice_id

    )


# ====================================
# GET BY JOB
# ====================================

def get_invoice_by_job_request(

    db,

    job_id

):

    invoice = get_invoice_by_job(

        db,

        job_id

    )

    print("\n========== CUSTOMER POLL ==========")
    print(f"Job ID      : {job_id}")

    if invoice:

        print(f"Invoice ID  : {invoice.id}")
        print(f"Progress    : {invoice.execution_progress}")
        print(f"Activity    : {invoice.current_activity}")
        print(f"Transport   : {invoice.transport_status}")
        print(f"Machine     : {invoice.machine_name}")
        print(f"GPS         : {invoice.gps_location}")

    return invoice

# ====================================
# UPDATE
# ====================================

def update_invoice_request(

    db,

    invoice

):

    return update_invoice(

        db,

        invoice

    )


# ====================================
# LIST
# ====================================

def list_invoice_request(

    db

):

    return list_invoices(

        db

    )




