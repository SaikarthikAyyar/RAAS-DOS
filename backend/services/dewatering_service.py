# ====================================
# IMPORTS
# ====================================

from backend.decision_engine.dewatering_engine import (

    determine_polymer_requirement,

    determine_dewatering_method,

    determine_commitment_decision,

    generate_quote_wording,

    generate_do_not_commit_rule

)

from backend.repositories.dewatering_repository import (

    create_dewatering_assessment

)


# ====================================
# CREATE DEWATERING ASSESSMENT
# ====================================

def create_dewatering_request(

        db,

        payload

):


    # --------------------------------
    # Generate engineering decisions
    # --------------------------------

    polymer_required = (

        determine_polymer_requirement(

            payload.bulk_density

        )

    )


    recommended_method = (

        determine_dewatering_method(

            payload.target_final_moisture_pct

        )

    )


    commitment_decision = (

        determine_commitment_decision(

            payload.target_final_moisture_pct

        )

    )


    quote_wording = (

        generate_quote_wording(

            recommended_method

        )

    )


    do_not_commit_rule = (

        generate_do_not_commit_rule(

            payload.target_final_moisture_pct

        )

    )


    # --------------------------------
    # Save assessment
    # --------------------------------

    return create_dewatering_assessment(

        db,

        payload,

        polymer_required,

        commitment_decision,

        recommended_method,

        quote_wording,

        do_not_commit_rule

    )