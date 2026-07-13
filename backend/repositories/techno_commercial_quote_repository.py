# ====================================
# IMPORTS
# ====================================

import logging

from backend.models.techno_commercial_quote import Quote

from backend.models.ops_selector import OpsSelection


logger = logging.getLogger(__name__)

# ====================================
# GET OPS SELECTION
# ====================================

def get_ops_selection(

        db,

        ops_selection_id

):

    return (

        db.query(

            OpsSelection

        )

        .filter(

            OpsSelection.id

            ==

            ops_selection_id

        )

        .first()

    )

# ====================================
# GET QUOTE
# ====================================

def get_quote(

        db,

        quote_id

):

    return (

        db.query(

            Quote

        )

        .filter(

            Quote.id ==

            quote_id

        )

        .first()

    )


# ====================================
# GET LATEST QUOTE
# ====================================

def get_latest_quote(

    db,

    ops_selection_id

):

    return (

        db.query(

            Quote

        )

        .filter(

            Quote.ops_selection_id

            ==

            ops_selection_id

        )

        .order_by(

            Quote.revision_number.desc()

        )

        .first()

    )


# ====================================
# GET QUOTE REVISION
# ====================================

def get_quote_revision(

    db,

    ops_selection_id,

    revision_number

):

    return (

        db.query(

            Quote

        )

        .filter(

            Quote.ops_selection_id

            ==

            ops_selection_id

        )

        .filter(

            Quote.revision_number

            ==

            revision_number

        )

        .first()

    )

# ====================================
# SAVE QUOTE
# ====================================

# ====================================
# SAVE QUOTE
# ====================================

def create_quote(

    db,

    payload

):

    quote = get_quote_by_ops_selection(

        db,

        payload["ops_selection_id"]

    )

    if quote is None:

        quote = Quote(

            ops_selection_id=

            payload["ops_selection_id"]

        )

        db.add(

            quote

        )

    
    quote.customer_request_id = (

        payload["customer_request_id"]

    )

    

    quote.revision_number = (

        payload["revision_number"]

    )

    quote.workflow_status = (

        payload["workflow_status"]

    )

    quote.dewatering_assessment_id = (

        payload["dewatering_assessment_id"]

    )

    quote.recommended_machine = (

        payload["recommended_machine"]

    )

    quote.service_configuration = (

        payload["service_configuration"]

    )

    quote.pump_hose_package = (

        payload["pump_hose_package"]

    )

    quote.dewatering_method = (

        payload["dewatering_method"]

    )

    quote.approval_gate = (

        payload["approval_gate"]

    )

    quote.mobilisation_cost = (

        payload["mobilisation_cost"]

    )

    quote.setup_cost = (

        payload["setup_cost"]

    )

    quote.execution_cost = (

        payload["execution_cost"]

    )

    quote.pump_addon_cost = (

        payload["pump_addon_cost"]

    )

    quote.documentation_buffer = (

        payload["documentation_buffer"]

    )

    quote.access_support_buffer = (

        payload["access_support_buffer"]

    )

    quote.overhead_cost = (

        payload["overhead_cost"]

    )

    quote.contingency_cost = (

        payload["contingency_cost"]

    )

    quote.margin_percentage = (

        payload["margin_percentage"]

    )

    quote.margin_value = (

        payload["margin_value"]

    )

    quote.cleaning_quote = (

        payload["cleaning_quote"]

    )

    quote.dewatering_addon = (

        payload["dewatering_addon"]

    )

    quote.combined_budgetary_value = (

        payload["combined_budgetary_value"]

    )

    db.commit()

    db.refresh(

        quote

    )

    return quote



# ====================================
# GET QUOTE BY OPS
# ====================================

def get_quote_by_ops_selection(

    db,

    ops_selection_id

):

    return (

        db.query(

            Quote

        )

        .filter(

            Quote.ops_selection_id ==

            ops_selection_id

        )

        .first()

    )


# ====================================
# GET QUOTE BY OPS
# ====================================

def get_quote_by_ops_selection(

    db,

    ops_selection_id

):

    return (

        db.query(

            Quote

        )

        .filter(

            Quote.ops_selection_id ==

            ops_selection_id

        )

        .first()

    )


# ====================================
# LIST OPS SELECTIONS
# ====================================

def list_ops_selections(db):

    return (

        db.query(

            OpsSelection

        )

        .order_by(

            OpsSelection.id

        )

        .all()

    )


    def get_quote_preview(db, ops_selection_id):

        ops = get_ops_selection(db, ops_selection_id)

        if ops is None:
            return None

        return build_quote(ops)