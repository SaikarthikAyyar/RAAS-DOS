from datetime import date, timedelta

from backend.data.machine_library import MACHINE_LIBRARY

from backend.models.machine_inventory import MachineInventory
from backend.models.personnel import Personnel
from backend.models.personnel_document import PersonnelDocument


def seed_machine_inventory(db):

    existing = db.query(MachineInventory).first()

    if existing:
        return

    today = date.today()



    for machine in MACHINE_LIBRARY:

        for number in range(1, 4):

            start_date = today + timedelta(days=(number - 1) * 5)
            completion_date = start_date + timedelta(days=10)

            inventory = MachineInventory(

                machine_code=machine["code"],

                machine_name=machine["name"],

                asset_number=f'{machine["code"]}-{number:03d}',

                status="AVAILABLE",

                current_job_id=None,

                site_location="Head Office",

                allocated_start=None,

                allocated_completion=None,

                estimated_arrival=None,

                next_available_date=None,

                remarks=None

            )

            db.add(inventory)

    db.commit()



def seed_personnel(db):

    existing = db.query(Personnel).first()

    if existing:
        return

    personnel_data = [

        ("EMP001", "Ravi Kumar", "9876543201", "OPS Supervisor"),
        ("EMP002", "Arun Singh", "9876543202", "Machine Operator"),
        ("EMP003", "Rahul Das", "9876543203", "Machine Operator"),
        ("EMP004", "Ajay Kumar", "9876543204", "Helper"),
        ("EMP005", "Vikram Patel", "9876543205", "Safety Officer"),
        ("EMP006", "Suresh Reddy", "9876543206", "Machine Operator"),
        ("EMP007", "Karthik Rao", "9876543207", "Helper"),
        ("EMP008", "Manoj Sharma", "9876543208", "Electrician"),
        ("EMP009", "Ashok Verma", "9876543209", "Mechanic"),
        ("EMP010", "Prakash Nair", "9876543210", "OPS Supervisor"),
        ("EMP011", "Ramesh Gupta", "9876543211", "Machine Operator"),
        ("EMP012", "Deepak Joshi", "9876543212", "Helper"),
        ("EMP013", "Sunil Yadav", "9876543213", "Safety Officer"),
        ("EMP014", "Harish Iyer", "9876543214", "Technician"),
        ("EMP015", "Naveen Kumar", "9876543215", "Machine Operator")

    ]

    documents = [

        ("Aadhaar Card", "Identity"),
        ("Driving Licence", "Licence"),
        ("Medical Certificate", "Medical"),
        ("Safety Certificate", "Certification")

    ]

    for code, fullname, phone, designation in personnel_data:

        person = Personnel(

            employee_code=code,

            full_name=fullname,

            phone_number=phone,

            current_location="Head Office",

            designation=designation,

            skill=designation,

            allocation_status="AVAILABLE",

            documents_verified=True

        )

        db.add(person)

        db.flush()

        for document_name, document_type in documents:

            document = PersonnelDocument(

                personnel_id=person.id,

                document_name=document_name,

                document_type=document_type,

                file_path=f"/documents/{code}/{document_name.replace(' ', '_')}.pdf",

                verification_status="VERIFIED",

                verified_by="USER"

            )

            db.add(document)

    db.commit()