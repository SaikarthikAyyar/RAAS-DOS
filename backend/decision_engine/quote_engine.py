# ====================================
# EQUIPMENT COST
# ====================================

def calculate_equipment_cost():

    return 10000


# ====================================
# MANPOWER COST
# ====================================

def calculate_manpower_cost(

        manpower_required

):

    return manpower_required * 2000


# ====================================
# MOBILISATION COST
# ====================================

def calculate_mobilisation_cost(

        total_job_days

):

    return total_job_days * 5000


# ====================================
# SUBTOTAL
# ====================================

def calculate_subtotal(

        equipment_cost,

        manpower_cost,

        mobilisation_cost

):

    return (

        equipment_cost

        +

        manpower_cost

        +

        mobilisation_cost

    )


# ====================================
# FINAL QUOTE
# ====================================

def calculate_final_quote(

        subtotal

):

    margin_pct = 20


    final_quote = (

        subtotal * (1 + margin_pct/100)

    )


    return (

        margin_pct,

        final_quote

    )