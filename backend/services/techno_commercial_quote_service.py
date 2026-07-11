# ====================================
# CREATE QUOTE
# ====================================

from backend.services.quote_engine import (

    build_quote

)

from backend.repositories.techno_commercial_quote_repository import (

    create_quote,

    get_ops_selection

)

from backend.repositories.techno_commercial_quote_repository import (

    get_latest_quote

)

from backend.repositories.techno_commercial_quote_repository import (

    get_quote_by_ops_selection

)
from backend.services.status_service import update_customer_request_status


def create_quote_request(

    db,

    payload

):

    # ====================================
    # FETCH OPS SELECTION
    # ====================================

    ops = get_ops_selection(

        db,

        payload.ops_selection_id

    )

    if ops is None:

        raise ValueError(

            "OPS Selection not found."

        )
    
    dewatering_assessment_id = None

    revision_number = 1

    workflow_status = "COMPLETED"

    # ====================================
    # BUILD COMMERCIAL QUOTE
    # ====================================

    quote = build_quote(

        ops

    )

    # ====================================
    # BUILD PAYLOAD
    # ====================================

    quote_data = {

        "ops_selection_id":
            payload.ops_selection_id,

        
        "customer_request_id":

        ops.customer_request_id,

        "revision_number":
            revision_number,

        "workflow_status":
            workflow_status,

        "dewatering_assessment_id":
            dewatering_assessment_id,

        **quote

    }


    update_customer_request_status(

        db,

        ops.customer_request_id,

        "QUOTE_CREATED"

    )

    # ====================================
    # SAVE
    # ====================================

    return create_quote(

        db,

        quote_data

    )




# ====================================
# GET QUOTE
# ====================================

def get_quote_request(

    db,

    ops_selection_id

):

    quote = get_quote_by_ops_selection(

        db,

        ops_selection_id

    )

    if quote is None:

        raise ValueError(

            "Quote not found."

        )

    return quote


# ====================================
# LIST QUOTE OPS
# ====================================

from backend.repositories.techno_commercial_quote_repository import (

    list_ops_selections

)


def list_quote_ops_request(

    db

):

    ops = list_ops_selections(db)

    return [

        {

            "id": row.id,

            "label": f"OPS-{row.id}"

        }

        for row in ops

    ]


def get_quote_preview_request(db, ops_selection_id):

    ops = get_ops_selection(db, ops_selection_id)

    if ops is None:
        raise ValueError("OPS Selection not found.")

    return build_quote(ops)