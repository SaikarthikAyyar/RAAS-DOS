# ====================================
# IMPORTS
# ====================================

from backend.models.business_masters_pricing import (
    ServiceConfiguration,
    DewateringMethod,
    Accessory,
    CommercialRules
)

from backend.models.machines_pumps import Machine

from backend.utils.sludge_volume import resolve_sludge_volume


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
# ACCESSORIES ADD-ON
# Sums the rate of every accessory marked "Needed: Yes" on the
# Deployment Plan (ops.accessories_plan), matched by name against the
# Accessories master. Replaces the old flat PUMP_ADDON_RATE constant.
# An accessory name with no matching master row (e.g. machine_library.py
# lists a name that was renamed/removed from the master) contributes 0
# rather than erroring - a pricing gap shouldn't block the whole quote,
# same posture as the welcome-email try/except.
# ====================================

def build_accessories_addon(

    db,
    ops

):

    accessories_plan = ops.accessories_plan or []

    needed_names = [
        row.get("name")
        for row in accessories_plan
        if row.get("needed") == "Yes"
    ]

    if not needed_names:

        return 0.0

    rows = (

        db.query(Accessory)
        .filter(Accessory.name.in_(needed_names))
        .all()

    )

    rates_by_name = {row.name: float(row.rate) for row in rows}

    return sum(

        rates_by_name.get(name, 0.0)
        for name in needed_names

    )


# ====================================
# MACHINE RATE RESOLUTION
#
# Resolves the final machine's own per-machine `rate` from the
# Machines/Fleet Business Master, replacing the old
# service-configuration-group rate lookup. `ops.override_machine`
# (set) beats `ops.recommended_machine` - whichever one actually
# reflects the machine that will be deployed. The identifier is
# inconsistently a code vs. a name today (pre-existing quirk), so
# this matches either, mirroring the exact dual-match tolerance
# DeploymentPlanCard.jsx's defaultAccessoriesPlan already relies on
# client-side (`r.machine.code===finalMachine || r.machine.name===finalMachine`).
#
# Falls back to the pre-Phase-18 ServiceConfiguration.rate_per_day
# lookup if no machine row matches (e.g. a machine renamed/removed
# from the master after the quote's ops selection was made) - a
# resolution gap must never block a quote, same posture as the
# accessory-name-mismatch fallback above.
# ====================================

def resolve_machine_rate(

    db,
    ops

):

    identifier = ops.override_machine or ops.recommended_machine

    machine = None

    if identifier:

        machine = (

            db.query(Machine)
            .filter(
                (Machine.code == identifier)
                | (Machine.name == identifier)
            )
            .first()

        )

    if machine and machine.rate is not None:

        return float(machine.rate)

    service_config = (

        db.query(ServiceConfiguration)
        .filter(ServiceConfiguration.code == ops.service_configuration)
        .first()

    )

    return float(service_config.rate_per_day) if service_config else 0.0


# ====================================
# COMMERCIAL CALCULATION (MIN/MAX RANGE)
#
# Same formula and order of operations as the original single-value
# version - every line just gets a min AND a max instead of one
# number. Every line below is currently a FIXED quantity (days,
# machine choice) so min===max for all of them; that mirrors the RAAS
# DOS wireframe's own quote engine, where fixed-quantity lines are
# also min===max ("Fixed rate, no range"). Only the dewatering add-on
# (computed separately, see build_dewatering_addon) actually differs
# between min and max, because that's the one place we collect a real
# range (dewatering_method_min / _max).
#
# Reads Business Masters -> Service Configurations / Commercial Rules
# instead of the old backend/data/commercial_assumptions.py constants
# (kept in place as a historical reference, no longer imported here).
# `category_margin_pct`, when given, overrides CommercialRules.margin_pct
# for this one quote (the enquiry's customer's category override).
# ====================================

def build_commercial(

    db,
    ops,
    category_margin_pct=None

):

    rules = db.query(CommercialRules).first()

    machine_cost = resolve_machine_rate(db, ops)

    mobilisation_cost = (

        ops.mobilisation_days *

        float(rules.mobilisation_rate)

    )

    setup_cost = (

        ops.setup_days *

        float(rules.setup_rate)

    )

    execution_cost = (

        ops.execution_days *

        machine_cost

    )

    pump_addon_cost = build_accessories_addon(db, ops)

    documentation_buffer = float(rules.documentation_buffer)

    access_support_buffer = float(rules.access_support_buffer)

    direct_cost = (

        mobilisation_cost +

        setup_cost +

        execution_cost +

        pump_addon_cost +

        documentation_buffer +

        access_support_buffer

    )

    overhead_cost = (

        direct_cost *

        float(rules.overhead_pct)

    )

    contingency_cost = (

        direct_cost *

        float(rules.contingency_pct)

    )

    before_margin = (

        direct_cost +

        overhead_cost +

        contingency_cost

    )

    margin_pct = (

        category_margin_pct
        if category_margin_pct is not None
        else float(rules.margin_pct)

    )

    margin_value = (

        before_margin *

        margin_pct

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

        "documentation_buffer": documentation_buffer,

        "access_support_buffer": access_support_buffer,

        "direct_cost_min": direct_cost,
        "direct_cost_max": direct_cost,

        "overhead_cost_min": overhead_cost,
        "overhead_cost_max": overhead_cost,

        "contingency_cost_min": contingency_cost,
        "contingency_cost_max": contingency_cost,

        "margin_percentage": margin_pct,

        "margin_value_min": margin_value,
        "margin_value_max": margin_value,

        "cleaning_quote_min": cleaning_quote,
        "cleaning_quote_max": cleaning_quote

    }


# ====================================
# DEWATERING ADD-ON (MIN/MAX RANGE)
#
# The one genuine source of range in the quote: dewatering_method_min/
# _max (set on the Deployment Plan) each pick a different rate from
# the Dewatering Methods master, applied to the survey's estimated
# volume.
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

    # Dewatering processes whatever sludge actually came out of the
    # tank, not the tank's own physical capacity - resolve_sludge_volume
    # also covers the legacy-survey fallback (see backend/utils/
    # sludge_volume.py).
    volume = resolve_sludge_volume(survey)

    def rate_for(method_key):

        if not method_key:
            return 0.0

        row = (
            db.query(DewateringMethod)
            .filter(DewateringMethod.method_key == method_key)
            .first()
        )

        return float(row.rate_per_m3) if row else 0.0

    rate_min = rate_for(ops.dewatering_method_min)

    rate_max = rate_for(ops.dewatering_method_max)

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

    ops,

    category_margin_pct=None

):

    snapshot = build_snapshot(

        ops

    )

    commercial = build_commercial(

        db,

        ops,

        category_margin_pct

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
