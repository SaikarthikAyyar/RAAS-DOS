# ====================================
# IMPORTS
# ====================================

from datetime import datetime

from sqlalchemy import or_

from backend.models.enquiry import Enquiry
from backend.models.customer_requests import CustomerRequest


# ====================================
# GET ENQUIRIES
# ====================================

def get_enquiries(

        db,

        status,

        search,

        page,

        page_size

):

    print("\n========================================")
    print("[REPOSITORY] GET ENQUIRIES")
    print(f"[REPOSITORY] Status Filter : {status}")
    print(f"[REPOSITORY] Search        : {search}")
    print(f"[REPOSITORY] Page          : {page}")
    print(f"[REPOSITORY] Page Size     : {page_size}")

    query = (

        db.query(

            Enquiry

        )

        .outerjoin(

            CustomerRequest,

            CustomerRequest.id == Enquiry.customer_request_id

        )

    )

    print("[REPOSITORY] Base Query Created")

    if status:

        print(f"[REPOSITORY] Applying Status Filter : {status}")

        query = (

            query.filter(

                Enquiry.status == status

            )

        )

    if search:

        print(f"[REPOSITORY] Applying Search : {search}")

        search = f"%{search}%"

        query = (

            query.filter(

                or_(

                    CustomerRequest.company_name.ilike(search),

                    Enquiry.owner_role.ilike(search),

                    Enquiry.id.cast(str).ilike(search)

                )

            )

        )

    enquiries = (

        query

        .order_by(

            Enquiry.created_at.desc()

        )

        .offset(

            (page - 1) * page_size

        )

        .limit(

            page_size

        )

        .all()

    )

    print(f"[REPOSITORY] Rows Retrieved : {len(enquiries)}")
    print("========================================\n")

    return enquiries


# ====================================
# COUNT ENQUIRIES
# ====================================

def count_enquiries(

        db,

        status,

        search

):

    print("\n========================================")
    print("[REPOSITORY] COUNT ENQUIRIES")
    print(f"[REPOSITORY] Status Filter : {status}")
    print(f"[REPOSITORY] Search        : {search}")

    query = (

        db.query(

            Enquiry

        )

        .outerjoin(

            CustomerRequest,

            CustomerRequest.id == Enquiry.customer_request_id

        )

    )

    if status:

        query = (

            query.filter(

                Enquiry.status == status

            )

        )

    if search:

        search = f"%{search}%"

        query = (

            query.filter(

                or_(

                    CustomerRequest.company_name.ilike(search),

                    Enquiry.owner_role.ilike(search),

                    Enquiry.id.cast(str).ilike(search)

                )

            )

        )

    total = query.count()

    print(f"[REPOSITORY] Total Count : {total}")
    print("========================================\n")

    return total


# ====================================
# GET ENQUIRY
# ====================================

def get_enquiry(

        db,

        enquiry_id

):

    print("\n========================================")
    print("[REPOSITORY] GET ENQUIRY")
    print(f"[REPOSITORY] Enquiry ID : {enquiry_id}")

    enquiry = (

        db.query(

            Enquiry

        )

        .filter(

            Enquiry.id == enquiry_id

        )

        .first()

    )

    if enquiry:

        print("[REPOSITORY] Enquiry Found")
        print(f"[REPOSITORY] Status : {enquiry.status}")
        print(f"[REPOSITORY] Stage  : {enquiry.stage}")

    else:

        print("[REPOSITORY] Enquiry NOT FOUND")

    print("========================================\n")

    return enquiry


# ====================================
# UPDATE STATUS
# ====================================

def update_enquiry_status(

    db,

    enquiry,

    status,

    closed_at=None

):

    print("\n========================================")
    print("[REPOSITORY] UPDATE ENQUIRY STATUS")
    print(f"[REPOSITORY] Enquiry ID : {enquiry.id}")
    print(f"[REPOSITORY] Old Status : {enquiry.status}")
    print(f"[REPOSITORY] New Status : {status}")

    enquiry.status = (

        status.value if hasattr(status, "value") else status

    )

    enquiry.closed_at = closed_at

    print("[REPOSITORY] Committing Transaction...")

    db.commit()

    print("[REPOSITORY] Commit Successful")

    db.refresh(

        enquiry

    )

    print("[REPOSITORY] Refresh Successful")
    print(f"[REPOSITORY] Current Status : {enquiry.status}")
    print(f"[REPOSITORY] Closed At      : {enquiry.closed_at}")
    print("========================================\n")

    return enquiry


# ====================================
# DELETE ENQUIRY
# ====================================

def delete_enquiry(

        db,

        enquiry

):

    print("\n========================================")
    print("[REPOSITORY] DELETE ENQUIRY")
    print(f"[REPOSITORY] Enquiry ID : {enquiry.id}")
    print(f"[REPOSITORY] Status     : {enquiry.status}")

    db.delete(

        enquiry

    )

    print("[REPOSITORY] Committing Delete...")

    db.commit()

    print("[REPOSITORY] Delete Successful")
    print("========================================\n")