from backend.models.enquiry import Enquiry
from backend.repositories.enquiry_repository import EnquiryRepository


class EnquiryService:

    @staticmethod
    def create_customer_request_enquiry(
        db,
        customer_request_id,
        payload
    ):

        enquiry = Enquiry(

            customer_request_id=customer_request_id,

            sales_survey_id=None,

            ops_selector_id=None,

            dewatering_assessment_id=None,

            quote_id=None,

            approval_board_id=None,

            job_creation_id=None,

            execution_id=None,

            sender_role="CUSTOMER",

            receiver_role="SALES",

            requested_task="SALES_SURVEY",

            current_module="CUSTOMER_REQUEST",

            workflow_status="PENDING",

            completed=False,

            payload=payload,

            created_by = None

        )

        return EnquiryRepository.create(
            db,
            enquiry
        )

    @staticmethod
    def create_sales_survey_enquiry(
        db,
        customer_request_id,
        sales_survey_id,
        payload
    ):

        enquiry = Enquiry(

            customer_request_id=customer_request_id,

            sales_survey_id=sales_survey_id,

            ops_selector_id=None,

            dewatering_assessment_id=None,

            quote_id=None,

            approval_board_id=None,

            job_creation_id=None,

            execution_id=None,

            sender_role="SALES",

            receiver_role="OPERATIONS",

            requested_task="OPS_SELECTION",

            current_module="SALES_SURVEY",

            workflow_status="PENDING",

            completed=False,

            payload=payload,

            created_by=sales_survey_id

        )

        return EnquiryRepository.create(
            db,
            enquiry
        )

    @staticmethod
    def update(
        db,
        enquiry
    ):
        return EnquiryRepository.update(
            db,
            enquiry
        )

    @staticmethod
    def get(
        db,
        enquiry_id
    ):
        return EnquiryRepository.get(
            db,
            enquiry_id
        )

    @staticmethod
    def get_all(
        db
    ):
        return EnquiryRepository.get_all(
            db
        )
    
    @staticmethod
    def get_sales_pending(db):
        return EnquiryRepository.get_sales_pending(db)
    
    
    
    # ====================================
    # RECEIVED ENQUIRIES
    # ====================================

    @staticmethod
    def get_received_enquiries(
        db,
        role
    ):

        return EnquiryRepository.get_received_enquiries(

            db,

            role.upper()

        )


    # ====================================
    # SENT ENQUIRIES
    # ====================================

    @staticmethod
    def get_sent_enquiries(
        db,
        role
    ):

        return EnquiryRepository.get_sent_enquiries(

            db,

            role.upper()

        )




    # ====================================
    # DASHBOARD ENQUIRIES
    # ====================================

    @staticmethod
    def get_dashboard_enquiries(

        db,

        role

    ):

        received = (

            EnquiryService.get_received_enquiries(

                db,

                role

            )

        )

        sent = (

            EnquiryService.get_sent_enquiries(

                db,

                role

            )

        )

        selected = None

        if received:

            selected = received[0]

        elif sent:

            selected = sent[0]

        return {

            "received": received,

            "sent": sent,

            "selected": selected,

            "received_count": len(received),

            "sent_count": len(sent)

        }
    

        # ====================================
    # OPS APPROVAL -> OPS SELECTION
    # ====================================

    @staticmethod
    def create_ops_selection_enquiry(

        db,

        customer_request_id,

        sales_survey_id,

        ops_approval_id,

        payload

    ):

        print("\n========== ENQUIRY SERVICE ==========")
        print("[Enquiry] Creating OPS Selection Enquiry")
        print(f"[Enquiry] Customer Request : {customer_request_id}")
        print(f"[Enquiry] Sales Survey     : {sales_survey_id}")
        print(f"[Enquiry] OPS Approval     : {ops_approval_id}")

        enquiry = Enquiry(

            customer_request_id=customer_request_id,

            sales_survey_id=sales_survey_id,

            ops_selector_id=None,

            dewatering_assessment_id=None,

            quote_id=None,

            approval_board_id=None,

            job_creation_id=None,

            execution_id=None,

            sender_role="OPERATIONS",

            receiver_role="OPERATIONS",

            requested_task="OPS_SELECTION",

            current_module="OPS_APPROVAL",

            workflow_status="PENDING",

            completed=False,

            payload=payload,

            created_by=ops_approval_id

        )

        enquiry = EnquiryRepository.create(

            db,

            enquiry

        )

        print(f"[Enquiry] Created : {enquiry.id}")
        print("=====================================\n")

        return enquiry
    

    # ====================================
    # OPS SELECTION -> QUOTE
    # ====================================

    @staticmethod
    def create_quote_enquiry(

        db,

        customer_request_id,

        sales_survey_id,

        ops_selector_id,

        payload

    ):

        print("\n========== ENQUIRY SERVICE ==========")
        print("[Enquiry] Creating Quote Enquiry")
        print(f"[Enquiry] Customer Request : {customer_request_id}")
        print(f"[Enquiry] Sales Survey     : {sales_survey_id}")
        print(f"[Enquiry] OPS Selection    : {ops_selector_id}")

        enquiry = Enquiry(

            customer_request_id=customer_request_id,

            sales_survey_id=sales_survey_id,

            ops_selector_id=ops_selector_id,

            dewatering_assessment_id=None,

            quote_id=None,

            approval_board_id=None,

            job_creation_id=None,

            execution_id=None,

            sender_role="OPERATIONS",

            receiver_role="SALES",

            requested_task="QUOTE",

            current_module="OPS_SELECTION",

            workflow_status="PENDING",

            completed=False,

            payload=payload,

            created_by=ops_selector_id

        )

        enquiry = EnquiryRepository.create(

            db,

            enquiry

        )

        print(f"[Enquiry] Quote Enquiry Created : {enquiry.id}")
        print("=====================================\n")

        return enquiry


    @staticmethod
    def create_customer_quote_review_enquiry(

        db,

        customer_request_id,

        sales_survey_id,

        quote_id,

        payload

    ):

        print("\n========== ENQUIRY SERVICE ==========")
        print("[Enquiry] Creating Customer Review Enquiry")

        enquiry = Enquiry(

            customer_request_id=customer_request_id,

            sales_survey_id=sales_survey_id,

            ops_selector_id=None,

            dewatering_assessment_id=None,

            quote_id=quote_id,

            approval_board_id=None,

            job_creation_id=None,

            execution_id=None,

            sender_role="SALES",

            receiver_role="CUSTOMER",

            requested_task="QUOTE_REVIEW",

            current_module="TECHNO_COMMERCIAL_QUOTE",

            workflow_status="PENDING",

            completed=False,

            payload=payload,

            created_by=quote_id

        )

        enquiry = EnquiryRepository.create(

            db,

            enquiry

        )

        print(f"[Enquiry] Customer Review Enquiry : {enquiry.id}")

        return enquiry

        # ====================================
        # QUOTE -> APPROVAL BOARD
        # ====================================

    @staticmethod
    def create_approval_board_enquiry(

        db,

        customer_request_id,

        sales_survey_id,

        quote_id,

        payload

    ):

        print("\n========== ENQUIRY SERVICE ==========")
        print("[Enquiry] Creating Approval Board Enquiry")
        print(f"[Enquiry] Customer Request : {customer_request_id}")
        print(f"[Enquiry] Sales Survey     : {sales_survey_id}")
        print(f"[Enquiry] Quote            : {quote_id}")

        enquiry = Enquiry(

            customer_request_id=customer_request_id,

            sales_survey_id=sales_survey_id,

            ops_selector_id=None,

            dewatering_assessment_id=None,

            quote_id=quote_id,

            approval_board_id=None,

            job_creation_id=None,

            execution_id=None,

            sender_role="SALES",

            receiver_role="MANAGER",

            requested_task="APPROVAL_BOARD",

            current_module="QUOTE",

            workflow_status="PENDING",

            completed=False,

            payload=payload,

            created_by=quote_id

        )

        enquiry = EnquiryRepository.create(

            db,

            enquiry

        )

        print(f"[Enquiry] Approval Board Enquiry Created : {enquiry.id}")
        print("=============================================\n")

        return enquiry
    
    @staticmethod
    def create_quote_revision_enquiry(

        db,

        customer_request_id,

        sales_survey_id,

        quote_id,

        payload

    ):

        enquiry = Enquiry(

            customer_request_id=customer_request_id,

            sales_survey_id=sales_survey_id,

            ops_selector_id=None,

            dewatering_assessment_id=None,

            quote_id=quote_id,

            approval_board_id=None,

            job_creation_id=None,

            execution_id=None,

            sender_role="CUSTOMER",

            receiver_role="SALES",

            requested_task="QUOTE_REVISION",

            current_module="CUSTOMER_REVIEW",

            workflow_status="PENDING",

            completed=False,

            payload=payload,

            created_by=quote_id

        )

        return EnquiryRepository.create(

            db,

            enquiry

        )
    
    # ====================================
    # JOB CREATION -> ALLOCATION
    # ====================================

    @staticmethod
    def create_allocation_enquiry(

        db,

        customer_request_id,

        sales_survey_id,

        job_creation_id,

        payload

    ):

        print("\n========== ENQUIRY SERVICE ==========")
        print("[Enquiry] Creating Allocation Enquiry")
        print(f"[Enquiry] Customer Request : {customer_request_id}")
        print(f"[Enquiry] Sales Survey     : {sales_survey_id}")
        print(f"[Enquiry] Job Creation     : {job_creation_id}")

        enquiry = Enquiry(

            customer_request_id=customer_request_id,

            sales_survey_id=sales_survey_id,

            ops_selector_id=None,

            dewatering_assessment_id=None,

            quote_id=None,

            approval_board_id=None,

            job_creation_id=job_creation_id,

            execution_id=None,

            sender_role="OPS",

            receiver_role="OPS",

            requested_task="ALLOCATION",

            current_module="JOB_CREATION",

            workflow_status="PENDING",

            completed=False,

            payload=payload,

            created_by=job_creation_id

        )

        enquiry = EnquiryRepository.create(

            db,

            enquiry

        )

        print(f"[Enquiry] Allocation Enquiry Created : {enquiry.id}")
        print("=====================================\n")

        return enquiry
    

    @staticmethod
    def create_job_creation_enquiry(
        db,
        customer_request_id,
        sales_survey_id,
        approval_board_id,
        payload
    ):

        print("\n========== ENQUIRY SERVICE ==========")
        print("[Enquiry] Creating Job Creation Enquiry")

        enquiry = Enquiry(

            customer_request_id=customer_request_id,

            sales_survey_id=sales_survey_id,

            ops_selector_id=None,

            dewatering_assessment_id=None,

            quote_id=None,

            approval_board_id=approval_board_id,

            job_creation_id=None,

            execution_id=None,

            sender_role="MANAGER",

            receiver_role="OPERATIONS",

            requested_task="JOB_CREATION",

            current_module="APPROVAL_BOARD",

            workflow_status="PENDING",

            completed=False,

            payload=payload,

            created_by=approval_board_id

        )

        enquiry = EnquiryRepository.create(
            db,
            enquiry
        )

        print(f"[Enquiry] Job Creation Enquiry Created : {enquiry.id}")

        return enquiry