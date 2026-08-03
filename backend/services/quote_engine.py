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

    SERVICE_RATES,

    DEWATERING_RATE

)



# ====================================
# TECHNICAL SNAPSHOT
# ====================================

def build_snapshot(

    ops

):

    if ops.dewatering_method_min or ops.dewatering_method_max:

        dewatering_method = (

            f"{ops.dewatering_method_min or 'N/A'}"
            f" - "
            f"{ops.dewatering_method_max or 'N/A'}"

        )

    else:

        dewatering_method = "N/A"

    return {

        "recommended_machine":

            ops.recommended_machine,

        "service_configuration":

            ops.service_configuration,

        "pump_hose_package":

            ops.pump_hose_package,

        "dewatering_method":

            dewatering_method,

        "approval_gate":

            ops.approval_gate

    }


# ====================================
# COMMERCIAL CALCULATION (MIN/MAX RANGE)
#
# Same formula and order of operations as
# the original single-value version - every
# line just gets a min AND a max instead of
# one number. Every line below is currently
# a FIXED quantity (days, machine choice) so
# min===max for all of them; that mirrors
# the RAAS DOS wireframe's own quote engine,
# where fixed-quantity lines are also
# min===max ("Fixed rate, no range"). Only
# the dewatering add-on (computed separately,
# see build_dewatering_addon) actually
# differs between min and max, because that's
# the one place we collect a real range
# (dewatering_method_min / _max).
# ====================================

def build_commercial(

    ops

):

    machine_cost = SERVICE_RATES.get(

        ops.service_configuration,

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

        "mobilisation_cost_min": mobilisation_cost,
        "mobilisation_cost_max": mobilisation_cost,

        "setup_cost_min": setup_cost,
        "setup_cost_max": setup_cost,

        "execution_cost_min": execution_cost,
        "execution_cost_max": execution_cost,

        "pump_addon_cost_min": pump_addon_cost,
        "pump_addon_cost_max": pump_addon_cost,

        "documentation_buffer": DOCUMENTATION_BUFFER,

        "access_support_buffer": ACCESS_SUPPORT_BUFFER,

        "direct_cost_min": direct_cost,
        "direct_cost_max": direct_cost,

        "overhead_cost_min": overhead_cost,
        "overhead_cost_max": overhead_cost,

        "contingency_cost_min": contingency_cost,
        "contingency_cost_max": contingency_cost,

        "margin_percentage": MARGIN_PERCENTAGE,

        "margin_value_min": margin_value,
        "margin_value_max": margin_value,

        "cleaning_quote_min": cleaning_quote,
        "cleaning_quote_max": cleaning_quote

    }


# ====================================
# DEWATERING ADD-ON (MIN/MAX RANGE)
#
# The one genuine source of range in the
# quote: dewatering_method_min/_max (set on
# the Deployment Plan) each pick a different
# DEWATERING_RATE, applied to the survey's
# estimated volume.
# ====================================

def build_dewatering_addon(

    db,

    ops

):

    if not ops.dewatering_method_min and not ops.dewatering_method_max:

        return {

            "dewatering_addon_min": 0.0,

            "dewatering_addon_max": 0.0

        }

    from backend.services.sales_survey_service import (
        get_sales_survey_request
    )

    survey = get_sales_survey_request(

        db,

        ops.sales_survey_id

    )

    volume = (

        survey.estimated_volume

        if survey and survey.estimated_volume

        else 0

    )

    rate_min = DEWATERING_RATE.get(

        ops.dewatering_method_min,

        0

    )

    rate_max = DEWATERING_RATE.get(

        ops.dewatering_method_max,

        0

    )

    addon_min = rate_min * volume

    addon_max = rate_max * volume

    return {

        "dewatering_addon_min": min(addon_min, addon_max),

        "dewatering_addon_max": max(addon_min, addon_max)

    }


# ====================================
# BUILD QUOTE
# ====================================

def build_quote(

    db,

    ops

):

    snapshot = build_snapshot(

        ops

    )

    commercial = build_commercial(

        ops

    )

    dewatering = build_dewatering_addon(

        db,

        ops

    )

    return {

        **snapshot,

        **commercial,

        **dewatering,

        "combined_budgetary_value_min":

            commercial["cleaning_quote_min"]

            +

            dewatering["dewatering_addon_min"],

        "combined_budgetary_value_max":

            commercial["cleaning_quote_max"]

            +

            dewatering["dewatering_addon_max"]

    }
