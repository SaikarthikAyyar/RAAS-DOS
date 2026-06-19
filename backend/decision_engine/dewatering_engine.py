# ====================================
# DETERMINE POLYMER REQUIREMENT
# ====================================

def determine_polymer_requirement(

        bulk_density

):

    return bulk_density > 1.2


# ====================================
# DETERMINE DEWATERING METHOD
# ====================================

def determine_dewatering_method(

        target_final_moisture_pct

):

    if target_final_moisture_pct <= 35:

        return "FILTER_PRESS"

    return "CENTRIFUGE"


# ====================================
# DETERMINE COMMITMENT DECISION
# ====================================

def determine_commitment_decision(

        target_final_moisture_pct

):

    if target_final_moisture_pct <= 30:

        return "ENGINEERING_REVIEW_REQUIRED"

    return "COMMITTABLE"


# ====================================
# GENERATE QUOTE WORDING
# ====================================

def generate_quote_wording(

        recommended_method

):

    return (

        f"Recommended dewatering "

        f"method: {recommended_method}"

    )


# ====================================
# GENERATE SAFETY RULE
# ====================================

def generate_do_not_commit_rule(

        target_final_moisture_pct

):

    if target_final_moisture_pct <= 30:

        return (

            "DO NOT GUARANTEE "

            "FINAL MOISTURE"

        )

    return "STANDARD_EXECUTION"