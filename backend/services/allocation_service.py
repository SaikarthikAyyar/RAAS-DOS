# ====================================
# IMPORTS
# ====================================

from backend.models.machine_inventory import MachineInventory
from backend.models.personnel import Personnel
from backend.models.personnel_document import PersonnelDocument
from backend.models.job_creation import JobCreation


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
            Personnel.allocation_status == "AVAILABLE"
        )
        .order_by(
            Personnel.full_name
        )
        .all()
    )


    machine_cards = []

    for machine in machines:

        machine_cards.append({

            "id":

                machine.id,

            "machine_code":

                machine.machine_code,

            "machine_name":

                machine.machine_name,

            "asset_number":

                machine.asset_number,

            "status":

                machine.status,

            "current_job":

                machine.current_job_id,

            "site_location":

                machine.site_location,

            "allocated_start":

                machine.allocated_start,

            "allocated_completion":

                machine.allocated_completion,

            "estimated_arrival":

                machine.estimated_arrival,

            "next_available_date":

                machine.next_available_date

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

                person.allocation_status,

            "documents_verified":

                person.documents_verified,

            "documents":[

                {

                    "name": d.document_name,

                    "type": d.document_type,

                    "status": d.verification_status,

                    "file": d.file_path

                }

                for d in docs

            ]

        })


    return {

        "job_id":

            job.id,

        "generated_job_id":

            job.generated_job_id,

        "machines":

            machine_cards,

        "personnel":

            personnel_cards

    }