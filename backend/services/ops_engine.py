# ====================================
# OPS ENGINE
# ====================================

import math

def evaluate_doability(

        engineering_inputs

):

    material = engineering_inputs.get(

        "material_category"

    )

    debris = engineering_inputs.get(

        "debris_level"

    )

    hazard = engineering_inputs.get(

        "hazard"

    )

    job_type = engineering_inputs.get(

        "job_type"

    )


    # --------------------------------
    # NOT DOABLE DIRECT
    # --------------------------------

    if (

        material == "Mixed random waste"

        or

        debris in [

            "Heavy random debris",

            "Wood / logs / stones / metal"

        ]

    ):

        return "Not Doable Direct"


    # --------------------------------
    # EHS REVIEW
    # --------------------------------

    if (

        hazard != "None"

        or

        material == "Chemical sludge"

    ):

        return "EHS Review"


    # --------------------------------
    # ENGINEERING REVIEW
    # --------------------------------

    if (

        material in [

            "Ash / abrasive slurry",

            "Dry powder / ash"

        ]

        or

        job_type in [

            "Pipeline / Conduit",

            "Hot Zone / Furnace / Ash"

        ]

    ):

        return "Engineering Review"


    # --------------------------------
    # DOABLE WITH PREPARATION
    # --------------------------------

    if (

        material in [

            "Sticky sludge",

            "Settled sludge",

            "Heavy sludge / scale"

        ]

    ):

        return "Doable with Preparation"


    # --------------------------------
    # DOABLE
    # --------------------------------

    return "Doable"




# ====================================
# SERVICE CONFIGURATION
# ====================================

# ====================================
# SERVICE CONFIGURATION
# ====================================

def determine_service_configuration(

        recommended_machine

):

    """
    Returns the service configuration
    corresponding to the selected machine.

    Excel Basis

        Selected Machine

            ↓

        Machine Library

            ↓

        Service Configuration
    """

    machine = recommended_machine.get(

        "machine",

        {}

    )


    return machine.get(

        "service_configuration",

        ""

    )

# ====================================
# ACCESS SCORE
# ====================================

def score_access(

        engineering_inputs,

        machine,


):
    """
    Scores whether the machine can
    physically access the asset.

    Excel Basis

        Opening Width >= Min Width

        AND

        Opening Height >= Min Height

            -> +20

        Machine has no dimensional limit

            -> +10

        Otherwise

            -> -20
    """

    opening_width = (

        engineering_inputs.get(

            "opening_width"

        )

        or 0

    )

    opening_height = (

        engineering_inputs.get(

            "opening_height"

        )

        or 0

    )

    minimum_width = machine.get(

        "minimum_width",

        0

    )

    minimum_height = machine.get(

        "minimum_height",

        0

    )


    # --------------------------------
    # Base fit score
    # --------------------------------

    if (

        minimum_width == 0

        and

        minimum_height == 0

    ):

        base_score = 10

    elif (

        opening_width >= minimum_width

        and

        opening_height >= minimum_height

    ):

        base_score = 20

    else:

        base_score = -20


    # --------------------------------
    # Vertical lift shortfall
    # (machine has a real lift limit and the
    # site's required lift exceeds it)
    # --------------------------------

    penalty = 0

    vertical_lift = engineering_inputs.get("vertical_lift") or 0

    max_vertical_lift = machine.get("max_vertical_lift")

    if max_vertical_lift and vertical_lift > max_vertical_lift:

        penalty -= 15


    # --------------------------------
    # Crane required, none available
    # --------------------------------

    crane_required = machine.get("crane_required")

    crane_available = engineering_inputs.get("crane_available")

    if crane_required == "Yes" and crane_available == "No":

        penalty -= 15


    # --------------------------------
    # Power availability shortfall.
    #
    # Our real Power Available lookup list has no literal "None
    # Available" option (unlike the wireframe's own vocabulary) -
    # the closest real signal that a site has no ready electrical
    # supply is "Generator Required". Only penalize pure-Electric
    # machines here - Diesel/Hydraulic machines carry their own
    # power source and are unaffected either way.
    # --------------------------------

    power_source = engineering_inputs.get("power_source")

    power_type = (machine.get("power_type") or "").strip().lower()

    if power_source == "Generator Required" and power_type == "electric":

        penalty -= 10


    return base_score + penalty


# ====================================
# MATERIAL SCORE
# ====================================

def score_material(

        engineering_inputs,

        machine

):
    """
    Scores how well the customer's
    material matches the machine.

    Excel Basis

        Preferred Material

            -> +30

        Otherwise

            -> +5

        Survey machine

            handled separately.
    """

    material = (

        engineering_inputs.get(

            "material_category"

        )

        or ""

    ).strip().lower()


    preferred_materials = [

        value.lower()

        for value in machine.get(

            "preferred_materials",

            []

        )

    ]


    # --------------------------------
    # Survey machine
    # --------------------------------

    if (

        machine["code"]

        ==

        "MATSYA-BATHY"

    ):

        if (

            "survey"

            in material

        ):

            return 30

        return -999


    # --------------------------------
    # Preferred material
    # --------------------------------

    if (

        material

        in

        preferred_materials

    ):

        return 30


    # --------------------------------
    # Acceptable fallback
    # --------------------------------

    return 5
# ====================================
# JOB TYPE SCORE
# ====================================

def score_job_type(

        engineering_inputs,

        machine

):
    """
    Scores how well the customer's
    job type matches the machine.

    Excel Basis

        Preferred Job Type

            -> +25

        Otherwise

            -> +5

        Survey machine

            handled separately.
    """

    job_type = (

        engineering_inputs.get(

            "job_type"

        )

        or ""

    ).strip().lower()


    preferred_job_types = [

        value.lower()

        for value in machine.get(

            "preferred_job_types",

            []

        )

    ]


    # --------------------------------
    # Survey Machine
    # --------------------------------

    if machine["code"] == "MATSYA-BATHY":

        if "survey" in job_type:

            return 25

        return -999


    # --------------------------------
    # Preferred Job Type
    # --------------------------------

    if job_type in preferred_job_types:

        return 25


    # --------------------------------
    # Acceptable fallback
    # --------------------------------

    return 5

# ====================================
# SCORE VOLUME
# ====================================

def score_volume(

        engineering_inputs,

        machine

):
    
    estimated_volume = (
                            engineering_inputs.get(
                                "estimated_volume"
                            )
                            or 0
                        )

    max_volume = machine.get(

        "recommended_max_volume",

        0

    )


    # --------------------------------
    # Survey-only machines
    # --------------------------------

    if max_volume == 0:

        return 0


    # --------------------------------
    # Within machine capacity
    # --------------------------------

    if estimated_volume <= max_volume:

        return 15


    # --------------------------------
    # Above recommended capacity
    # --------------------------------

    return 0


# ====================================
# ENVIRONMENT SCORE
# ====================================

# Categorical Temperature Range -> a representative Celsius value,
# used only to compare against a machine's numeric max_operating_temp.
# Upper end of each band is used deliberately (conservative: flags a
# machine as unsuitable rather than silently under-estimating heat).
TEMPERATURE_RANGE_C = {

    "ambient": 35,

    "hot (40°c - 70°c)": 70,

    "very hot (>70°c)": 90,

    "cold (<10°c)": 10

}


def score_environment(

        engineering_inputs,

        machine

):
    """
    Scores environmental/material-compatibility fit.

    Excel Basis

        Hazard = Explosive/flammable AND machine not ATEX-rated

            -> hard -30

        Otherwise, base 10, then:

            Extreme pH (< 4 or > 10) AND Mild Steel construction

                -> -15

            Site temperature exceeds machine's max operating temp

                -> -15
    """

    hazard = engineering_inputs.get("hazard") or ""

    hazard_rating = machine.get("hazard_rating") or ""


    if (

        hazard == "Explosive / flammable"

        and

        not hazard_rating.startswith("ATEX")

    ):

        return -30


    score = 10


    ph_min = engineering_inputs.get("ph_min")

    ph_max = engineering_inputs.get("ph_max")

    material_construction = machine.get("material_construction")

    extreme_ph = (

        (ph_min is not None and ph_min < 4)

        or

        (ph_max is not None and ph_max > 10)

    )

    if extreme_ph and material_construction == "Mild Steel":

        score -= 15


    temperature_label = (

        engineering_inputs.get("temperature") or ""

    ).strip().lower()

    temperature_c = TEMPERATURE_RANGE_C.get(temperature_label)

    max_operating_temp = machine.get("max_operating_temp")

    if (

        temperature_c is not None

        and

        max_operating_temp is not None

        and

        temperature_c > max_operating_temp

    ):

        score -= 15


    return score


# ====================================
# DEBRIS SCORE
# ====================================

# Our Sales Survey's Debris Level lookup list is more granular than the
# machine master's simple None/Minor/Moderate/Heavy vocabulary (kept
# that way deliberately when Machines was promoted to a Business
# Master, so the wireframe's rank comparison logic still applies) -
# this maps the survey's real values down to the same 4-point rank.
SURVEY_DEBRIS_RANK = {

    "none / negligible": 0,

    "minor screenable debris": 1,

    "moderate plastic/fibres": 2,

    "heavy random debris": 3,

    "wood / logs / stones / metal": 3,

    "unknown": 2

}

MACHINE_DEBRIS_RANK = {

    "none": 0,

    "minor": 1,

    "moderate": 2,

    "heavy": 3

}


def score_debris(

        engineering_inputs,

        machine

):
    """
    Scores whether the machine's debris tolerance
    meets or exceeds what the site actually has.

    Excel Basis

        Machine tolerance rank >= site debris rank

            -> +10

        Otherwise

            -> -10
    """

    survey_debris = (

        engineering_inputs.get("debris_level") or ""

    ).strip().lower()

    survey_rank = SURVEY_DEBRIS_RANK.get(survey_debris, 0)


    machine_tolerance = (

        machine.get("debris_tolerance") or ""

    ).strip().lower()

    machine_rank = MACHINE_DEBRIS_RANK.get(machine_tolerance, 0)


    if machine_rank >= survey_rank:

        return 10


    return -10


# ====================================
# HUB FIT SCORE
# ====================================

def score_hub_fit(

        engineering_inputs,

        machine

):
    """
    Scores whether the machine is already
    stationed at the site's nearest hub.

    Excel Basis

        Machine available at the site's nearest hub

            -> +10

        Otherwise

            -> +5
    """

    nearest_hub = engineering_inputs.get("nearest_hub")

    hubs_available = machine.get("hubs_available") or []


    if nearest_hub and nearest_hub in hubs_available:

        return 10


    return 5


# ====================================
# MACHINE SCORING (ALL MACHINES)
# ====================================

def score_all_machines(

        engineering_inputs,

        machines

):
    """
    Scores every machine in `machines` and returns
    them ranked best-first, with a 1-based "rank" field.

    `machines` is a list of plain dicts (see
    backend/repositories/machine_repository.py::
    list_active_machines_as_dicts) - this function has no DB/session
    coupling of its own, the caller resolves the data source.

    Used by:
      - select_machine() below, for the winner
      - the Ops Review tab's machine scoring table
    """

    machine_scores = []

    for machine in machines:

        access_score = score_access(

            engineering_inputs,
            machine

        )


        material_score = score_material(

            engineering_inputs,

            machine

        )


        job_score = score_job_type(

            engineering_inputs,

            machine

        )


        volume_score = score_volume(

            engineering_inputs,

            machine

        )


        environment_score = score_environment(

            engineering_inputs,

            machine

        )


        debris_score = score_debris(

            engineering_inputs,

            machine

        )


        hub_fit_score = score_hub_fit(

            engineering_inputs,

            machine

        )


        total_score = (

            access_score +

            material_score +

            job_score +

            volume_score +

            environment_score +

            debris_score +

            hub_fit_score

        )


        machine_scores.append(

            {

                "machine": machine,

                "total_score": total_score,

                "access_score": access_score,

                "material_score": material_score,

                "job_score": job_score,

                "volume_score": volume_score,

                "environment_score": environment_score,

                "debris_score": debris_score,

                "hub_fit_score": hub_fit_score

            }

        )

    machine_scores.sort(

        key=lambda m: m["total_score"],

        reverse=True

    )

    for index, entry in enumerate(machine_scores):

        entry["rank"] = index + 1

    return machine_scores


# ====================================
# MACHINE SELECTION
# ====================================

def select_machine(

        engineering_inputs,

        machines

):

    machine_scores = score_all_machines(

        engineering_inputs,

        machines

    )

    return machine_scores[0]


# ====================================
# PUMP / HOSE PACKAGE
# ====================================

def build_pump_selection(

        recommended_machine,

        engineering_inputs,

        pumps

):
    """
    Resolves a real, engineering-informed pump from the compatible
    set for the recommended machine, replacing the old flat
    `machine.pump_package` string.

    Falls back to the machine's own `pump_package` string if no
    compatible pumps are configured yet (e.g. a freshly-added machine
    with no join rows) - a resolution gap must never block the Ops
    Engine from returning a result.

    `pumps` is a list of plain dicts from
    backend/repositories/pump_repository.py::list_active_pumps_as_dicts.
    """

    machine = recommended_machine.get("machine", {})

    hose_size = machine.get("hose_size")


    compatible_codes = set(machine.get("compatible_pump_codes") or [])

    candidates = [

        pump for pump in pumps

        if pump.get("code") in compatible_codes

        and pump.get("active")

    ]


    # --------------------------------
    # No compatible pumps configured yet -
    # fall back to the machine's own flat string.
    # --------------------------------

    if not candidates:

        pump_package = machine.get("pump_package")

        return f"{pump_package} | {hose_size}"


    # --------------------------------
    # Prefer pumps meeting the suction depth,
    # keep the wider set if none qualify.
    # --------------------------------

    suction_depth = engineering_inputs.get("suction_depth")

    if suction_depth:

        meeting_suction = [

            p for p in candidates

            if p.get("max_suction_lift") is not None

            and p.get("max_suction_lift") >= suction_depth

        ]

        if meeting_suction:

            candidates = meeting_suction


    # --------------------------------
    # Prefer pumps meeting the required vertical
    # lift (discharge head), same graceful fallback.
    # --------------------------------

    vertical_lift = engineering_inputs.get("vertical_lift")

    if vertical_lift:

        meeting_lift = [

            p for p in candidates

            if p.get("max_discharge_head") is not None

            and p.get("max_discharge_head") >= vertical_lift

        ]

        if meeting_lift:

            candidates = meeting_lift


    # --------------------------------
    # Explosive/flammable sites prefer a
    # non-Standard (e.g. ATEX) hazard rating.
    # --------------------------------

    hazard = engineering_inputs.get("hazard")

    if hazard == "Explosive / flammable":

        atex_rated = [

            p for p in candidates

            if (p.get("hazard_rating") or "Standard") != "Standard"

        ]

        if atex_rated:

            candidates = atex_rated


    # --------------------------------
    # Required flow: smallest pump that still
    # meets it, else the largest available.
    # --------------------------------

    required_flow = engineering_inputs.get("required_flow")

    chosen = None

    if required_flow:

        meeting_flow = sorted(

            (

                p for p in candidates

                if p.get("flow_rate") is not None

                and p.get("flow_rate") >= required_flow

            ),

            key=lambda p: p["flow_rate"]

        )

        if meeting_flow:

            chosen = meeting_flow[0]


    if chosen is None:

        by_flow = sorted(

            candidates,

            key=lambda p: p.get("flow_rate") or 0,

            reverse=True

        )

        chosen = by_flow[0]


    return (

        f"{chosen['code']} - {chosen['name']}"

        f" | "

        f"{hose_size}"

    )

def build_accessories(

        recommended_machine

):

    """
    Retrieves the standard accessories
    supplied with the selected machine.

    Returns:

        Accessories list.
    """

    # ====================================
    # MACHINE DATA
    # ====================================

    machine = recommended_machine.get(

        "machine",

        {}

    )


    # ====================================
    # ACCESSORIES
    # ====================================

    accessories = machine.get(

        "accessories",

        ""

    )


    return accessories


# ====================================
# JOB DURATION
# ====================================

def calculate_duration(

    engineering_inputs,

    doability,

    recommended_machine

):

    # ====================================
    # ENGINEERING INPUTS
    # ====================================

    estimated_volume = (

        engineering_inputs.get(

            "estimated_volume"

        )

        or 0

    )




    # ====================================
    # MACHINE DATA
    # ====================================

    machine = recommended_machine.get(

        "machine",

        {}

    )


    base_output = machine.get(

        "base_output_per_day",

        0

    )


    setup_complexity = machine.get(

        "setup_complexity",

        "Low"

    )


    crew_base = machine.get(

        "crew",

        0

    )

        # ====================================
    # MOBILISATION DAYS
    # ====================================

    if doability == "Not Doable Direct":

        mobilisation_days = 0

    else:

        mobilisation_days = 1

    
        # ====================================
    # SETUP DAYS
    # ====================================

    if doability == "Not Doable Direct":

        setup_days = 0

    elif setup_complexity == "Low":

        setup_days = 1

    elif setup_complexity == "Medium":

        setup_days = 2

    else:

        setup_days = 3

        # ====================================
    # EXECUTION DAYS
    # ====================================

    machine_code = machine.get(

        "code",

        ""

    )


    if doability == "Not Doable Direct":

        execution_days = 0


    elif machine_code == "MATSYA-BATHY":

        execution_days = 1


    elif base_output <= 0:

        execution_days = 0


    else:

        execution_days = math.ceil(

            estimated_volume /

            base_output

        )

        # ====================================
    # DEMOBILISATION DAYS
    # ====================================

    if doability == "Not Doable Direct":

        demob_days = 0

    else:

        demob_days = 1

        # ====================================
    # TOTAL JOB DAYS
    # ====================================

    total_job_days = (

        mobilisation_days +

        setup_days +

        execution_days +

        demob_days

    )

    return {

        "mobilisation_days": mobilisation_days,

        "setup_days": setup_days,


        "execution_days": execution_days,

        "demob_days": demob_days,

        "total_job_days": total_job_days

    }


# ====================================
# MANPOWER REQUIREMENTS
# ====================================



def calculate_manpower(

        recommended_machine

):

    # ====================================
    # SELECTED MACHINE
    # ====================================

    machine = recommended_machine.get(

        "machine",

        {}

    )


    # ====================================
    # CREW BASE
    # ====================================

    crew = machine.get(

        "crew",

        0

    )


    return crew


# ====================================
# APPROVAL GATE
# ====================================

def determine_approval_gate(

    doability,

    recommended_machine

):

    # ====================================
    # SELECTED MACHINE
    # ====================================

    machine = recommended_machine.get(

        "machine",

        {}

    )


    machine_code = machine.get(

        "code",

        ""

    )


    machine_approval = machine.get(

        "approval_gate",

        "Ops Review"

    )


    # ====================================
    # APPROVAL GATE
    # ====================================

    if doability == "Not Doable Direct":

        approval_gate = "Ops + Engineering Review"


    elif doability == "Engineering Review":

        approval_gate = "Engineering Review"


    elif doability == "EHS Review":

        approval_gate = "EHS Review"


    else:

        approval_gate = machine_approval


    # ====================================
    # INTERNAL NEXT ACTION
    # ====================================

    if machine_code == "MATSYA-BATHY":

        internal_next_action = (

            "Proceed to Bathymetric Survey"

        )


    elif doability == "Not Doable Direct":

        internal_next_action = (

            "Engineering Site Review Required"

        )


    else:

        internal_next_action = (

            "Proceed to Planning"

        )


    return {

        "approval_gate": approval_gate,

        "internal_next_action": internal_next_action

    }


# ====================================
# SELECTION REASON
# ====================================

def generate_selection_reason(

        engineering_inputs,

        doability,

        service_configuration,

        recommended_machine,

        pump_package,

        duration,

        manpower,

        approval

):

    machine = recommended_machine.get(

        "machine",

        {}

    )


    machine_name = machine.get(

        "name",

        "Selected Machine"

    )


    service = service_configuration


    pump = pump_package


    total_days = duration.get(

        "total_job_days",

        0

    )


    crew = manpower


    approval_gate = approval.get(

        "approval_gate",

        "Ops Review"

    )

    reason = (

        f"{doability}. "

        f"Recommended service configuration: {service}. "

        f"Selected machine: {machine_name}. "

        f"Pump package: {pump}. "

        f"Estimated duration: {total_days} day(s). "

        f"Recommended crew: {crew}. "

        f"Approval requirement: {approval_gate}."

    )


    return reason


# ====================================
# RUN OPS ENGINE
# ====================================

def run_ops_engine(

        engineering_inputs,

        machines,

        pumps

):

    """
    Executes the complete
    operational engineering workflow.

    `machines` is a list of plain dicts from
    backend/repositories/machine_repository.py::list_active_machines_as_dicts -
    resolved by the caller (ops_selector_service.py), not read here.

    `pumps` is the same shape from
    backend/repositories/pump_repository.py::list_active_pumps_as_dicts.

    Returns:

        Dictionary containing all
        engineering outputs.
    """

    doability = evaluate_doability(

        engineering_inputs

    )


    recommended_machine = select_machine(

        engineering_inputs,

        machines

    )

    service_configuration = determine_service_configuration(

        recommended_machine

    )


    pump_package = build_pump_selection(

        recommended_machine,

        engineering_inputs,

        pumps

    )

    accessories = build_accessories(

                    recommended_machine

                )


    duration = calculate_duration(

        engineering_inputs,

        doability,

        recommended_machine

    )


    manpower = calculate_manpower(

        recommended_machine

    )


    approval = determine_approval_gate(

        doability,

        recommended_machine

    )


    selection_reason = generate_selection_reason(

        engineering_inputs,

        doability,

        service_configuration,

        recommended_machine,

        pump_package,

        duration,

        manpower,

        approval

    )


    return {

        "doability":

            doability,

        "service_configuration":

            service_configuration,

        "recommended_machine":

            recommended_machine["machine"]["name"],

        "pump_hose_package":

            pump_package,

        "accessories":

            accessories,

        "mobilisation_days":

            duration["mobilisation_days"],

        "setup_days":

            duration["setup_days"],

        "execution_days":

            duration["execution_days"],

        "demob_days":

            duration["demob_days"],

        "total_job_days":

            duration["total_job_days"],

        "manpower_required":

            manpower,

        "approval_gate":

            approval["approval_gate"],

        "internal_next_action":

            approval["internal_next_action"],

        "selection_reason":

            selection_reason

    }