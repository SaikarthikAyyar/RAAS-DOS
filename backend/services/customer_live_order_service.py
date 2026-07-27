# ====================================
# IMPORTS
# ====================================

from sqlalchemy.orm import Session

from backend.models.execution import Execution

from backend.models.invoice import Invoice


# ====================================
# LIST CUSTOMERS WITH EXECUTION
# ====================================

def get_customer_execution_ids(

    db: Session

):

    ids = (

        db.query(

            Execution.customer_request_id

        )

        .distinct()

        .all()

    )

    return [

        row[0]

        for row in ids

    ]


# ====================================
# CUSTOMER LIVE ORDER
# ====================================

def get_customer_live_order(

    db: Session,

    customer_request_id: int

):

    invoice = (

        db.query(

            Invoice

        )

        .filter(

            Invoice.customer_request_id ==

            customer_request_id

        )

        .first()

    )

    if invoice is None:

        return None

    execution = (

        db.query(

            Execution

        )

        .filter(

            Execution.customer_request_id ==

            customer_request_id

        )

        .first()

    )

    invoice.execution = execution

    return invoice


# ====================================
# CUSTOMER IDS WITH EXECUTIONS
# ====================================

def get_customer_execution_ids(

    db: Session

):

    return [

        row.customer_request_id

        for row in

        db.query(

            Execution.customer_request_id

        )

        .distinct()

        .order_by(

            Execution.customer_request_id

        )

        .all()

    ]