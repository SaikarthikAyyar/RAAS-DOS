# ====================================
# IMPORTS
# ====================================

from backend.data.commercial_assumptions import (

    MOBILISATION_RATE,

    SETUP_RATE,

    DEMOBILISATION_RATE,

    OVERHEAD_PERCENTAGE,

    CONTINGENCY_PERCENTAGE,

    MARGIN_PERCENTAGE,

    PUMP_ADDON_RATE,

    DOCUMENTATION_BUFFER,

    ACCESS_SUPPORT_BUFFER,

    SERVICE_RATES

)



# ====================================
# TECHNICAL SNAPSHOT
# ====================================

# ====================================
# FUTURE DEWATERING INTEGRATION
# Replace placeholders once the
# Dewatering Assessment module
# is implemented.
# ====================================

def build_snapshot(

    ops

):

    return {

        "recommended_machine":

            ops.recommended_machine,

        "service_configuration":

            ops.service_configuration,

        "pump_hose_package":

            ops.pump_hose_package,

        "dewatering_method":

            "N/A",

        "approval_gate":

            ops.approval_gate

    }

# ====================================
# COMMERCIAL CALCULATION
# ====================================

def build_commercial(

    ops

):

    machine_cost = SERVICE_RATES.get(

        ops.recommended_machine,

        0

    )

    mobilisation_cost = (

        ops.mobilisation_days *

        MOBILISATION_RATE

    )

    setup_cost = (

        ops.setup_days *

        SETUP_RATE

    )

    execution_cost = (

        ops.execution_days *

        machine_cost

    )

    pump_addon_cost = PUMP_ADDON_RATE

    direct_cost = (

        mobilisation_cost +

        setup_cost +

        execution_cost +

        pump_addon_cost +

        DOCUMENTATION_BUFFER +

        ACCESS_SUPPORT_BUFFER

    )

    overhead_cost = (

        direct_cost *

        OVERHEAD_PERCENTAGE

    )

    contingency_cost = (

        direct_cost *

        CONTINGENCY_PERCENTAGE

    )

    before_margin = (

        direct_cost +

        overhead_cost +

        contingency_cost

    )

    margin_value = (

        before_margin *

        MARGIN_PERCENTAGE

    )

    cleaning_quote = (

        before_margin +

        margin_value

    )

    return {

        "mobilisation_cost":

            mobilisation_cost,

        "setup_cost":

            setup_cost,

        "execution_cost":

            execution_cost,

        "pump_addon_cost":

            pump_addon_cost,

        "documentation_buffer":

            DOCUMENTATION_BUFFER,

        "access_support_buffer":

            ACCESS_SUPPORT_BUFFER,

        "overhead_cost":

            overhead_cost,

        "contingency_cost":

            contingency_cost,

        "margin_percentage":

            MARGIN_PERCENTAGE,

        "margin_value":

            margin_value,

        "cleaning_quote":

            cleaning_quote

    }


# ====================================
# BUILD QUOTE
# ====================================

# ====================================
# FUTURE DEWATERING INTEGRATION
# Replace placeholders once the
# Dewatering Assessment module
# is implemented.
# ====================================

def build_quote(

    ops

):

    snapshot = build_snapshot(

        ops

    )

    commercial = build_commercial(

        ops

    )

    return {

        **snapshot,

        **commercial,

        "dewatering_addon":

            0.0,

        "combined_budgetary_value":

            commercial["cleaning_quote"]

            +

            0.0

    }