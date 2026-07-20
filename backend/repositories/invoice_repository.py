# ====================================
# IMPORTS
# ====================================

from backend.models.invoice import Invoice


# ====================================
# CREATE INVOICE
# ====================================

def create_invoice(

    db,

    payload

):

    invoice = Invoice(

        job_creation_id =

        payload.job_creation_id,

        generated_job_id =

        payload.generated_job_id,

        customer_request_id =

        payload.customer_request_id,

        invoice_status =

        payload.invoice_status,

        execution_phase =

        payload.execution_phase,

        execution_progress =

        payload.execution_progress,

        customer_visible_status =

        payload.customer_visible_status,

        planned_start =

        payload.planned_start,

        estimated_completion =

        payload.estimated_completion,

        actual_completion =

        payload.actual_completion,

        delay_days =

        payload.delay_days,

        machine_status =

        payload.machine_status,

        machine_name =

        payload.machine_name,

        machine_code =

        payload.machine_code,

        machine_location =

        payload.machine_location,

        personnel_status =

        payload.personnel_status,

        personnel_json =

        payload.personnel_json,

        transport_status =

        payload.transport_status,

        gps_location =

        payload.gps_location,

        destination =

        payload.destination,

        distance_remaining_km =

        payload.distance_remaining_km,

        eta_minutes =

        payload.eta_minutes,

        current_activity =

        payload.current_activity,

        live_execution_log =

        payload.live_execution_log

    )

    db.add(

        invoice

    )

    db.commit()

    db.refresh(

        invoice

    )

    return invoice


# ====================================
# GET INVOICE
# ====================================

def get_invoice(

    db,

    invoice_id

):

    return (

        db.query(

            Invoice

        )

        .filter(

            Invoice.id == invoice_id

        )

        .first()

    )


# ====================================
# GET BY JOB
# ====================================

def get_invoice_by_job(

    db,

    job_creation_id

):

    return (

        db.query(

            Invoice

        )

        .filter(

            Invoice.job_creation_id ==

            job_creation_id

        )

        .first()

    )


# ====================================
# UPDATE INVOICE
# ====================================

def update_invoice(

    db,

    invoice

):

    db.commit()

    db.refresh(

        invoice

    )

    return invoice


# ====================================
# LIST INVOICES
# ====================================

def list_invoices(

    db

):

    return (

        db.query(

            Invoice

        )

        .order_by(

            Invoice.id

        )

        .all()

    )