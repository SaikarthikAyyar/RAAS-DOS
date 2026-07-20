from backend.database.connection import engine

from backend.database.tables import Base

# import every model

from backend.models.customer_requests import CustomerRequest

from backend.models.customer_media import CustomerMedia



from backend.models.sales_survey import SalesSurvey

from backend.models.dewatering_assessment import DewateringAssessment

from backend.models.approval_board import ApprovalBoard

from backend.models.techno_commercial_quote import Quote

from backend.models.job_creation import JobCreation

from backend.models.invoice import Invoice

from backend.models.users import User
from backend.models.enquiry import Enquiry

from backend.models.ops_approval import OpsApproval

from backend.models.machine_inventory import MachineInventory

from backend.models.personnel import Personnel

from backend.models.personnel_document import PersonnelDocument

from backend.models.execution import Execution

from backend.repositories.allocation_repository import (
    seed_machine_inventory,
    seed_personnel
)

from backend.database.connection import SessionLocal

def create_tables():

    Base.metadata.create_all(
        bind=engine
    )

    db = SessionLocal()

    try:

        seed_machine_inventory(db)

        seed_personnel(db)

    finally:

        db.close()