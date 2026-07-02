

from fastapi import APIRouter

from fastapi import Depends


from backend.database.connection import get_db

from backend.schemas.ops_selector_schema import (

    OpsSelectorSchema

)


from backend.services.ops_engine import determine_service_configuration, evaluate_doability

from backend.services.ops_engine import score_access
from backend.data.machine_library import MACHINE_LIBRARY

from backend.services.ops_engine import score_material

from backend.services.ops_engine import score_job_type

from backend.services.ops_engine import score_volume

from backend.services.ops_engine import select_machine

from backend.services.ops_engine import  determine_service_configuration

from backend.services.ops_engine import  calculate_duration


router = APIRouter()

# ====================================
# TEST DOABILITY
# ====================================

@router.post(

    "/test-doability"

)

def test_doability(

        engineering_inputs: dict

):

    decision = evaluate_doability(

        engineering_inputs

    )

    return {

        "decision":

            decision

    }


# ====================================
# TEST ACCESS SCORE
# ====================================

@router.post("/test-access-score")
def test_access_score(payload: dict):

    machine_code = payload.get("machine_code")

    machine = next(

        (
            m for m in MACHINE_LIBRARY
            if m["code"] == machine_code
        ),

        None

    )

    if machine is None:

        return {

            "error":

            "Machine not found"

        }

    score = score_access(

        payload,

        machine

    )

    return {

        "machine":

        machine["name"],

        "score":

        score

    }


# ====================================
# TEST MATERIAL SCORE
# ====================================

@router.post("/test-material-score")
def test_material_score(payload: dict):

    machine_code = payload.get(

        "machine_code"

    )


    machine = next(

        (

            m

            for m

            in MACHINE_LIBRARY

            if m["code"] == machine_code

        ),

        None

    )


    if machine is None:

        return {

            "error":

            "Machine not found"

        }


    score = score_material(

        payload,

        machine

    )


    return {

        "machine":

        machine["name"],

        "score":

        score

    }


# ====================================
# TEST JOB TYPE SCORE
# ====================================

@router.post("/test-job-score")
def test_job_score(payload: dict):

    machine_code = payload.get("machine_code")

    machine = next(

        (

            m

            for m

            in MACHINE_LIBRARY

            if m["code"] == machine_code

        ),

        None

    )

    if machine is None:

        return {

            "error":

            "Machine not found"

        }

    score = score_job_type(

        payload,

        machine

    )

    return {

        "machine":

        machine["name"],

        "score":

        score

    }

# ====================================
# TEST VOLUME SCORE
# ====================================



@router.post(

    "/test-volume-score"

)

def test_volume_score(

        payload: dict

):

    machine = next(

        (

            m

            for m in MACHINE_LIBRARY

            if m["code"] == payload["machine_code"]

        ),

        None

    )


    if machine is None:

        return {

            "error": "Machine not found"

        }


    score = score_volume(

        machine,

        payload["estimated_volume"]

    )


    return {

        "machine": machine["name"],

        "score": score

    }


# ====================================
# TEST MACHINE SELECTION
# ====================================

@router.post(

    "/test-select-machine"

)

def test_select_machine(

    payload: dict

):

    result = select_machine(

        payload

    )

    return {

        "selected_machine":

            result["machine"]["name"],

        "machine_code":

            result["machine"]["code"],

        "service_configuration":

            result["machine"]["service_configuration"],

        "total_score":

            result["total_score"],

        "access_score":

            result["access_score"],

        "material_score":

            result["material_score"],

        "job_score":

            result["job_score"],

        "volume_score":

            result["volume_score"]

    }

# ====================================
# TEST SERVICE CONFIGURATION
# ====================================

@router.post(

    "/test-service-configuration"

)

def test_service_configuration(

        payload: dict

):

    selected_machine = select_machine(

        payload

    )

    service_configuration = (

        determine_service_configuration(

            selected_machine

        )

    )

    return {

        "machine":

            selected_machine["machine"]["name"],

        "machine_code":

            selected_machine["machine"]["code"],

        "service_configuration":

            service_configuration

    }


# ====================================
# TEST DURATION
# ====================================

@router.post(

    "/test-duration"

)

def test_duration(

        payload: dict

):

    selected_machine = select_machine(

        payload

    )


    duration = calculate_duration(

        payload,

        selected_machine

    )


    return {

        "machine":

            selected_machine["machine"]["name"],

        "duration":

            duration

    }

