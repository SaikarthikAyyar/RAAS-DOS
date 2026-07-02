# ====================================
# OPS ENGINE
# ====================================

import math

from backend.data.machine_library import MACHINE_LIBRARY

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
    # No dimensional restriction
    # --------------------------------

    if (

        minimum_width == 0

        and

        minimum_height == 0

    ):

        return 10


    # --------------------------------
    # Machine fits
    # --------------------------------

    if (

        opening_width >= minimum_width

        and

        opening_height >= minimum_height

    ):

        return 20


    # --------------------------------
    # Machine cannot fit
    # --------------------------------

    return -20


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
    
    estimated_volume = engineering_inputs.get(
                            "estimated_volume"
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
# MACHINE SELECTION
# ====================================

def select_machine(

        engineering_inputs

):
    
    opening_width = engineering_inputs.get(
        "opening_width"
    )

    opening_height = engineering_inputs.get(
        "opening_height"
    )

    material_category = engineering_inputs.get(
        "material_category"
    )

    job_type = engineering_inputs.get(
        "job_type"
    )

    estimated_volume = engineering_inputs.get(
        "estimated_volume"
    )
    
    machine_scores = []

    for machine in MACHINE_LIBRARY:

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


        total_score = (

            access_score +

            material_score +

            job_score +

            volume_score

        )


        machine_scores.append(

            {

                "machine": machine,

                "total_score": total_score,

                "access_score": access_score,

                "material_score": material_score,

                "job_score": job_score,

                "volume_score": volume_score

            }

        )

        best_machine = max(

        machine_scores,

        key=lambda m: m["total_score"]

    )


    return best_machine


# ====================================
# PUMP / HOSE PACKAGE
# ====================================

def build_pump_package(


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
    # PUMP PACKAGE
    # ====================================

    pump_package = machine.get(

        "pump_package"

    )


    # ====================================
    # HOSE SIZE
    # ====================================

    hose_size = machine.get(

        "hose_size"

    )


    return (

        f"{pump_package}"

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

    estimated_volume = engineering_inputs.get(

        "estimated_volume",

        0

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

        engineering_inputs

):

    """
    Executes the complete
    operational engineering workflow.

    Returns:

        Dictionary containing all
        engineering outputs.
    """

    doability = evaluate_doability(

        engineering_inputs

    )


    recommended_machine = select_machine(

        engineering_inputs

    )

    service_configuration = determine_service_configuration(

        recommended_machine

    )


    pump_package = build_pump_package(


        recommended_machine

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