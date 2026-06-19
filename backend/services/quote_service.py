# ====================================
# IMPORTS
# ====================================

from backend.decision_engine.quote_engine import (

    calculate_equipment_cost,

    calculate_manpower_cost,

    calculate_mobilisation_cost,

    calculate_subtotal,

    calculate_final_quote

)

from backend.repositories.quote_repository import (

    create_quote,

    get_ops_selection

)


# ====================================
# CREATE QUOTE
# ====================================

def create_quote_request(

        db,

        payload

):
    
    # -----------------------------

# Fetch OPS selection

# -----------------------------

    ops = (

        get_ops_selection(

            db,

            payload.ops_selection_id

        )

    )


    # -----------------------------

    # Calculate costs

    # -----------------------------

    equipment_cost = (

        calculate_equipment_cost()

    )

    # -----------------------------

# Calculate manpower cost

# -----------------------------

    manpower_cost = (

       calculate_manpower_cost(

         ops.manpower_required

        )

   )


# -----------------------------

# Calculate mobilisation cost

# -----------------------------

    mobilisation_cost = (

      calculate_mobilisation_cost(

         ops.total_job_days

        )

    )


    


    # -----------------------------

    # Calculate subtotal

    # -----------------------------

    subtotal = (

        calculate_subtotal(

            equipment_cost,

            manpower_cost,

            mobilisation_cost

        )

    )


    # -----------------------------

    # Calculate final quote

    # -----------------------------

    margin_pct, final_quote_value = calculate_final_quote(

    subtotal

)


    # -----------------------------

    # Save quote

    # -----------------------------

    return create_quote(

        db,

        payload,

        equipment_cost,

        manpower_cost,

        mobilisation_cost,

        subtotal,

        margin_pct,

        final_quote_value

    )