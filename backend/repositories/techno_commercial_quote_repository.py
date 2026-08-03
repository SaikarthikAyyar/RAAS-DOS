# ====================================
# IMPORTS
# ====================================

import logging

from backend.models.techno_commercial_quote import Quote

from backend.models.ops_selector import OpsSelection

from sqlalchemy import func
from backend.models.enquiry import Enquiry


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


    quote = Quote(
        ops_selection_id=payload["ops_selection_id"]
    )

    db.add(quote)

    


    
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

    quote.mobilisation_cost_min = payload["mobilisation_cost_min"]
    quote.mobilisation_cost_max = payload["mobilisation_cost_max"]

    quote.setup_cost_min = payload["setup_cost_min"]
    quote.setup_cost_max = payload["setup_cost_max"]

    quote.execution_cost_min = payload["execution_cost_min"]
    quote.execution_cost_max = payload["execution_cost_max"]

    quote.pump_addon_cost_min = payload["pump_addon_cost_min"]
    quote.pump_addon_cost_max = payload["pump_addon_cost_max"]

    quote.documentation_buffer = (

        payload["documentation_buffer"]

    )

    quote.access_support_buffer = (

        payload["access_support_buffer"]

    )

    quote.direct_cost_min = payload["direct_cost_min"]
    quote.direct_cost_max = payload["direct_cost_max"]

    quote.overhead_cost_min = payload["overhead_cost_min"]
    quote.overhead_cost_max = payload["overhead_cost_max"]

    quote.contingency_cost_min = payload["contingency_cost_min"]
    quote.contingency_cost_max = payload["contingency_cost_max"]

    quote.margin_percentage = (

        payload["margin_percentage"]

    )

    quote.margin_value_min = payload["margin_value_min"]
    quote.margin_value_max = payload["margin_value_max"]

    quote.cleaning_quote_min = payload["cleaning_quote_min"]
    quote.cleaning_quote_max = payload["cleaning_quote_max"]

    quote.dewatering_addon_min = payload["dewatering_addon_min"]
    quote.dewatering_addon_max = payload["dewatering_addon_max"]

    quote.combined_budgetary_value_min = payload["combined_budgetary_value_min"]
    quote.combined_budgetary_value_max = payload["combined_budgetary_value_max"]

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
        db.query(Quote)
        .filter(
            Quote.ops_selection_id == ops_selection_id
        )
        .order_by(
            Quote.revision_number.desc()
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

from sqlalchemy import func






def get_next_revision_number(
    db,
    customer_request_id,
    sales_survey_id
):
    count = (
        db.query(func.count(Enquiry.id))
        .filter(
            Enquiry.customer_request_id == customer_request_id
        )
        .filter(
            Enquiry.sales_survey_id == sales_survey_id
        )
        .filter(
            Enquiry.requested_task == "QUOTE_REVIEW"
        )
        .scalar()
    )

    return count + 1

