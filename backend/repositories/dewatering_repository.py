# ====================================
# IMPORTS
# ====================================

import logging

from backend.models.dewatering_assessment import DewateringAssessment


logger = logging.getLogger(__name__)


# ====================================
# SAVE DEWATERING ASSESSMENT
# ====================================

def create_dewatering_assessment(

        db,

        payload,

        polymer_required,

        commitment_decision,

        recommended_method,

        quote_wording,

        do_not_commit_rule

):

    logger.warning(

        f"Saving Dewatering Assessment "

        f"for Ops ID: "

        f"{payload.ops_selection_id}"

    )


    assessment = DewateringAssessment(

        ops_selection_id=payload.ops_selection_id,

        particle_size_fines_behavior=payload.particle_size_fines_behavior,

        bulk_density=payload.bulk_density,

        flocculation_response=payload.flocculation_response,

        polymer_likely_required=polymer_required,

        ph_corrosiveness=payload.ph_corrosiveness,

        abrasiveness=payload.abrasiveness,

        target_final_moisture_pct=payload.target_final_moisture_pct,

        cake_handling_scope=payload.cake_handling_scope,

        compliance_filtrate_restriction=payload.compliance_filtrate_restriction,

        dewatering_commitment_decision=commitment_decision,

        recommended_dewatering_method=recommended_method,

        quote_wording=quote_wording,

        review_owner=payload.review_owner,

        do_not_commit_rule=do_not_commit_rule

    )


    db.add(

        assessment

    )


    db.commit()


    db.refresh(

        assessment

    )


    return assessment