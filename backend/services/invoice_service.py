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

from backend.models.enquiry import Enquiry
from backend.models.purchase_order import PurchaseOrder


# ====================================
# RESOLVE PURCHASE ORDER FOR A JOB
# Resolves via the job's own real enquiry - job.approval_board_id is a
# direct, unambiguous FK to exactly one Enquiry (the same join
# create_job_request itself uses to find "consolidated_enquiry").
#
# Falls back to the older customer_request_id + most-recent heuristic
# only when no enquiry carries that approval_board_id at all (a job
# with no real approval-board linkage). That fallback is NOT safe as
# the primary path: EnquiryService.create_allocation_enquiry() creates
# a second, separate Enquiry row for the same job right after Job
# Creation (an "Allocation task" stub - approval_board_id always NULL,
# customer_name always NULL, id always higher than the real enquiry's
# since it's created moments later) sharing the same
# customer_request_id. Ordering by id-desc then always picked that
# empty stub over the real, PO-bearing enquiry - silently resolving to
# "no PO" for every job ever created through the real workflow.
# ====================================

def _resolve_purchase_order_for_job(db, job):

    enquiry = (
        db.query(Enquiry)
        .filter(Enquiry.approval_board_id == job.approval_board_id)
        .first()
    )

    if enquiry is None:

        enquiry = (
            db.query(Enquiry)
            .filter(Enquiry.customer_request_id == job.customer_request_id)
            .order_by(Enquiry.id.desc())
            .first()
        )

    if enquiry is None:
        return None

    po = (
        db.query(PurchaseOrder)
        .filter(PurchaseOrder.enquiry_id == enquiry.id)
        .order_by(PurchaseOrder.uploaded_at.desc())
        .first()
    )

    return po




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

    purchase_order = _resolve_purchase_order_for_job(db, job)

    invoice = InvoiceSchema(

        job_creation_id =

        job.id,

        generated_job_id =

        job.generated_job_id,

        customer_request_id =

        job.customer_request_id,

        purchase_order_id =

        purchase_order.id if purchase_order else None,

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

    if invoice is None:

        return None

    print("\n========== CUSTOMER POLL ==========")

    print(f"Invoice ID : {invoice.id}")

    invoice_value = None

    if invoice.purchase_order_id:
        po = db.query(PurchaseOrder).filter(PurchaseOrder.id == invoice.purchase_order_id).first()
        if po is not None:
            invoice_value = float(po.po_value) if po.po_value is not None else None

    response = {

        "id": invoice.id,

        # ====================================
        # JOB TAB
        # ====================================

        "job": {

            "generated_job_id":
                invoice.generated_job_id,

            "job_creation_id":
                invoice.job_creation_id,

            "customer_request_id":
                invoice.customer_request_id,

            "purchase_order_id":
                invoice.purchase_order_id,

            "invoice_value":
                invoice_value,

            "invoice_status":
                invoice.invoice_status,

            "planned_start":
                invoice.planned_start,

            "estimated_completion":
                invoice.estimated_completion,

            "actual_completion":
                invoice.actual_completion

        },

        # ====================================
        # EXECUTION TAB
        # ====================================

        "execution": {

            "phase":
                invoice.execution_phase,

            "progress":
                invoice.execution_progress,

            "customer_visible_status":
                invoice.customer_visible_status,

            "current_activity":
                invoice.current_activity,

            "transport_status":
                invoice.transport_status,

            "gps_location":
                invoice.gps_location,

            "distance_remaining_km":
                invoice.distance_remaining_km,

            "eta_minutes":
                invoice.eta_minutes,

            "delay_days":
                invoice.delay_days,

            "machine_status":
                invoice.machine_status,

            "machine_name":
                invoice.machine_name,

            "machine_code":
                invoice.machine_code,

            "machine_location":
                invoice.machine_location,

            "live_execution_log":
                invoice.live_execution_log

        },

        # ====================================
        # PERSONNEL TAB (Future)
        # ====================================

        "personnel": {

            "status":
                invoice.personnel_status,

            "members":
                invoice.personnel_json

        },

        # ====================================
        # ANALYSIS TAB (Future)
        # ====================================

        "analysis": {}

    }

    print(f"Phase      : {invoice.execution_phase}")

    print(f"Progress   : {invoice.execution_progress}")

    print(f"Activity   : {invoice.current_activity}")

    print(f"Transport  : {invoice.transport_status}")

    print(f"Machine    : {invoice.machine_name}")

    return response

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




