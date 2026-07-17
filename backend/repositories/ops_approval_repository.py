# ====================================
# IMPORTS
# ====================================

from sqlalchemy.orm import Session

from backend.models.ops_approval import OpsApproval


# ====================================
# CREATE OPS APPROVAL
# ====================================

def create_ops_approval(
    db: Session,
    approval: OpsApproval
):

    print("\n========== OPS APPROVAL REPOSITORY ==========")
    print("[Repository] Creating OPS Approval")
    print(f"[Repository] Customer Request : {approval.customer_request_id}")
    print(f"[Repository] Sales Survey     : {approval.sales_survey_id}")

    db.add(approval)

    db.commit()

    db.refresh(approval)

    print(f"[Repository] OPS Approval ID : {approval.id}")
    print("[Repository] Create Successful")
    print("============================================\n")

    return approval


# ====================================
# GET BY ID
# ====================================

def get_ops_approval(
    db: Session,
    approval_id: int
):

    print("\n========== OPS APPROVAL REPOSITORY ==========")
    print(f"[Repository] Loading Approval : {approval_id}")

    approval = (

        db.query(
            OpsApproval
        )

        .filter(
            OpsApproval.id == approval_id
        )

        .first()

    )

    print(f"[Repository] Found : {approval is not None}")
    print("============================================\n")

    return approval


# ====================================
# GET BY SALES SURVEY
# ====================================

def get_ops_approval_by_sales_survey(
    db: Session,
    sales_survey_id: int
):

    print("\n========== OPS APPROVAL REPOSITORY ==========")
    print(f"[Repository] Survey : {sales_survey_id}")

    approval = (

        db.query(
            OpsApproval
        )

        .filter(
            OpsApproval.sales_survey_id == sales_survey_id
        )

        .first()

    )

    print(f"[Repository] Found : {approval is not None}")
    print("============================================\n")

    return approval


# ====================================
# LIST
# ====================================

def list_ops_approvals(
    db: Session
):

    print("\n========== OPS APPROVAL REPOSITORY ==========")
    print("[Repository] Loading All Approvals")

    approvals = (

        db.query(
            OpsApproval
        )

        .order_by(
            OpsApproval.id.desc()
        )

        .all()

    )

    print(f"[Repository] Records : {len(approvals)}")
    print("============================================\n")

    return approvals


# ====================================
# UPDATE
# ====================================

def update_ops_approval(
    db: Session,
    approval: OpsApproval
):

    print("\n========== OPS APPROVAL REPOSITORY ==========")
    print(f"[Repository] Updating Approval : {approval.id}")

    db.commit()

    db.refresh(approval)

    print("[Repository] Update Successful")
    print("============================================\n")

    return approval