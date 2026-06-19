# ====================================
# IMPORTS
# ====================================

from datetime import datetime

from backend.models.approval_board import (

    ApprovalBoard

)


# ====================================
# CREATE APPROVAL
# ====================================

def create_approval(

        db,

        payload

):


    approval_status = (

        "APPROVED"

        if

        payload.approval_decision

        else

        "REJECTED"

    )


    next_action = (

        "CREATE_JOB"

        if

        payload.approval_decision

        else

        "REVIEW_QUOTE"

    )


    approval = ApprovalBoard(

        quote_id=payload.quote_id,

        approval_status=approval_status,

        approved_by=payload.approved_by,

        approval_date=str(

            datetime.now()

        ),

        next_action=next_action

    )


    db.add(

        approval

    )

    db.commit()

    db.refresh(

        approval

    )

    return approval