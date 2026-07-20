# ====================================
# IMPORTS
# ====================================

from backend.models.machine_inventory import MachineInventory
from backend.models.personnel import Personnel
from backend.models.personnel_document import PersonnelDocument
from backend.models.job_creation import JobCreation

from backend.models.invoice import Invoice

from backend.models.machine_schedule import MachineSchedule

import os





# ====================================
# LOAD JOBS FROM INVOICE
# ====================================

def get_invoice_jobs(db):

    invoices = (

        db.query(Invoice)

        .filter(

            Invoice.job_creation_id != None

        )

        .all()

    )

    results = []

    for invoice in invoices:

        job = (

            db.query(JobCreation)

            .filter(

                JobCreation.id == invoice.job_creation_id

            )

            .first()

        )

        if not job:

            continue

        results.append({

            "invoice_id": invoice.id,

            "job_id": job.id,

            "generated_job_id": job.generated_job_id,

            "customer_request_id": invoice.customer_request_id

        })

    return results


# ====================================
# LOAD ALLOCATION SCREEN
# ====================================

def get_allocation_dashboard(

    db,

    job_id

):
    

    job = (

        db.query(

            JobCreation

        )

        .filter(

            JobCreation.id == job_id

        )

        .first()

    )

    if job is None:

        raise ValueError(

            "Job not found."

        )
    
    invoice = (

        db.query(

            Invoice

        )

        .filter(

            Invoice.job_creation_id == job.id

        )

        .first()

    )


    machines = (
        db.query(MachineInventory)
        .filter(
            MachineInventory.status == "AVAILABLE"
        )
        .order_by(
            MachineInventory.machine_name,
            MachineInventory.asset_number
        )
        .all()
    )


    personnel = (
        db.query(Personnel)
        .filter(
            Personnel.availability_status == "AVAILABLE"
        )
        .order_by(
            Personnel.full_name
        )
        .all()
    )


    machine_cards = []

    for machine in machines:

        queue = (

            db.query(MachineSchedule)

            .filter(

                MachineSchedule.machine_id == machine.id

            )

            .order_by(

                MachineSchedule.queue_position

            )

            .all()

        )

        queue_items = []

        for item in queue:

            job = (

                db.query(JobCreation)

                .filter(

                    JobCreation.id == item.job_creation_id

                )

                .first()

            )

            queue_items.append({

                "queue_position": item.queue_position,

                "job_creation_id": item.job_creation_id,

                "generated_job_id": job.generated_job_id if job else None,

                "site_location": item.site_location,

                "planned_start": item.planned_start,

                "planned_completion": item.planned_completion,

                "status": item.schedule_status

            })

        machine_cards.append({

            "id": machine.id,

            "machine_code": machine.machine_code,

            "machine_name": machine.machine_name,

            "asset_number": machine.asset_number,

            "status": machine.status,

            "current_job": machine.current_job_id,

            "current_site": machine.current_site,

            "current_gps": machine.current_gps,

            "queue_count": len(queue_items),

            "queue": queue_items,

            "remarks": machine.remarks

        })


    personnel_cards = []

    for person in personnel:

        docs = (

            db.query(

                PersonnelDocument

            )

            .filter(

                PersonnelDocument.personnel_id == person.id

            )

            .all()

        )

        personnel_cards.append({

            "id":

                person.id,

            "employee_code":

                person.employee_code,

            "name":

                person.full_name,

            "designation":

                person.designation,

            "skill":

                person.skill,

            "location":

                person.current_location,

            "status":

                person.availability_status,

            "documents_verified":

                person.documents_verified,

            "documents": [
                {
                    "name": d.document_name,
                    "type": d.document_type,
                    "status": d.verification_status,
                    "file": (
                        f"uploads/personnel_documents/EMP004/"
                        f"{person.employee_code}/"
                        f"{os.path.basename(d.file_path)}"
                    )
                }
                for d in docs
            ]

        })


    job_summary = {

        "job_id": job.id,

        "generated_job_id": job.generated_job_id,

        "planned_start": job.planned_start,

        "planned_completion": job.planned_completion,

        "workflow_status": job.workflow_status

    }

    invoice_summary = None

    if invoice:

        invoice_summary = {

            "status": invoice.invoice_status,

            "phase": invoice.execution_phase,

            "progress": invoice.execution_progress,

            "customer_status": invoice.customer_visible_status

        }


    return {

        "job": job_summary,

        "invoice": invoice_summary,

        "machines": machine_cards,

        "personnel": personnel_cards

    }