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
from backend.models.roles import Role
from backend.models.modules import Module
from backend.models.role_permissions import RolePermission

from backend.models.ops_approval import OpsApproval

from backend.models.machine_inventory import MachineInventory

from backend.models.personnel import Personnel

from backend.models.personnel_document import PersonnelDocument

from backend.models.execution import Execution

from backend.models.partners import Partner

from backend.models.customer_master import Customer, CustomerContact
from backend.models.asset import Asset

from backend.models.notification import Notification, NotificationChange, NotificationRead

from backend.models.business_masters_pricing import (
    ServiceConfiguration,
    DewateringMethod,
    Accessory,
    CommercialRules,
    CustomerCategory
)

from backend.models.lookup_list_model import LookupList, LookupListValue

from backend.models.email_template import EmailTemplate, EmailTemplateVariable

from backend.models.quote_template import QuoteTemplate, QuoteTemplateVariable

from backend.models.quote_release_document import QuoteReleaseDocument

from backend.models.purchase_order import PurchaseOrder

from backend.models.survey_reminder import SurveyReminder

from backend.models.hub import Hub
from backend.models.hub_approver import HubApprover

from backend.models.module_task import ModuleTask
from backend.models.role_task_permission import RoleTaskPermission

from backend.models.machines_pumps import Machine, Pump, MachinePumpCompatibility

from backend.models.hr_role import HrRole
from backend.models.gst_settings import GstSettings

from backend.repositories.allocation_repository import (
    seed_machine_inventory,
    seed_personnel
)

from backend.repositories.role_permissions_repository import (
    seed_roles_modules_permissions
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

        seed_roles_modules_permissions(db)

    finally:

        db.close()