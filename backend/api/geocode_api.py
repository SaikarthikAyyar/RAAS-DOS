# ====================================
# GEOCODE CHECK
# A standalone, DB-free lookup so a form field can warn the user the
# moment they type a site location that won't resolve, instead of only
# finding out after booking (via the existing destination_geocode_warning
# on POST /fleet-schedule). Consumed by Job Creation's Site location
# field on blur.
# ====================================

from fastapi import APIRouter

from backend.utils.geocode import forward_geocode

router = APIRouter()


@router.get(

    "/geocode/check"

)

def check_geocode(

    text: str

):

    coordinates = forward_geocode(text)

    return {

        "found": coordinates is not None,

        "latitude": coordinates[0] if coordinates else None,

        "longitude": coordinates[1] if coordinates else None

    }
