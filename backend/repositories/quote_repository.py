# ====================================
# IMPORTS
# ====================================

import logging

from backend.models.quotes import Quote

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
# SAVE QUOTE
# ====================================

def create_quote(

        db,

        payload,

        equipment_cost,

        manpower_cost,

        mobilisation_cost,

        subtotal,

        margin_pct,

        final_quote_value

):


    quote = Quote(

        customer_id=payload.customer_id,

        ops_selection_id=payload.ops_selection_id,

        dewatering_assessment_id=

        payload.dewatering_assessment_id,

        equipment_cost=equipment_cost,

        manpower_cost=manpower_cost,

        mobilisation_cost=mobilisation_cost,

        subtotal=subtotal,

        margin_pct=margin_pct,

        final_quote_value=

        final_quote_value

    )


    db.add(

        quote

    )


    db.commit()


    db.refresh(

        quote

    )


    return quote