# ====================================
# IMPORTS
# ====================================

from backend.models.ops_approval import OpsApproval

from backend.repositories.ops_approval_repository import (
    create_ops_approval
)

from backend.services.enquiry_service import EnquiryService

from backend.services.status_service import (
    update_customer_request_status
)


# ====================================
# CREATE OPS APPROVAL
# ====================================

def create_ops_approval_request(
    db,
    payload
):

    print("\n========== OPS APPROVAL SERVICE ==========")
    print("[Service] Creating OPS Approval")
    print(f"[Service] Customer Request : {payload.customer_request_id}")
    print(f"[Service] Sales Survey     : {payload.sales_survey_id}")

    approval = OpsApproval(

        customer_request_id=payload.customer_request_id,

        sales_survey_id=payload.sales_survey_id,

        job_doable=payload.job_doable,

        approval_notes=payload.approval_notes,

        approved_by=payload.approved_by,

        status="APPROVED"

    )

    approval = create_ops_approval(

        db,

        approval

    )

    print(f"[Service] OPS Approval Saved : {approval.id}")

    print("[Service] Searching OPERATIONS received enquiry")

    enquiries = EnquiryService.get_received_enquiries(

        db,

        "OPERATIONS"

    )

    for enquiry in enquiries:

        if (
            enquiry.customer_request_id == approval.customer_request_id
            and enquiry.sales_survey_id == approval.sales_survey_id
            and enquiry.requested_task == "OPS_APPROVAL"
            and not enquiry.completed
        ):

            enquiry.workflow_status = "COMPLETED"
            enquiry.completed = True

            EnquiryService.update(
                db,
                enquiry
            )

            break

    if approval.job_doable:

        print("[Service] Job Approved")

        print("[Service] Creating OPS Selection enquiry")

        EnquiryService.create_ops_selection_enquiry(

            db,

            approval.customer_request_id,

            approval.sales_survey_id,

            approval.id,

            {

                "customer_request_id": approval.customer_request_id,

                "sales_survey_id": approval.sales_survey_id,

                "ops_approval_id": approval.id

            }

        )

        update_customer_request_status(

            db,

            approval.customer_request_id,

            "OPS_APPROVED"

        )

        print("[Service] Customer Status Updated")

    else:

        print("[Service] Job Rejected")

    print("==========================================\n")

    return approval