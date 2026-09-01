# ====================================
# IMPORTS
# ====================================

from datetime import datetime

from backend.models.machine_deployment_segment import MachineDeploymentSegment
from backend.models.enquiry import Enquiry

from backend.utils.geocode import reverse_geocode
from backend.utils.enquiry_resolution import resolve_enquiry_by_job_creation_id


# ====================================
# OPEN SEGMENT
# The one mechanism every phase-transition/dequeue call site uses -
# closes whatever segment is currently open for this machine (if any)
# and opens a new one, so a machine's deployment timeline is always a
# clean, gapless sequence with no manual bookkeeping needed at each
# call site. Called only from the phase-transition points that already
# exist (Start/Complete Current Phase) - these ARE the "site personnel
# confirm start/end of journey" moments, not a separate action.
# ====================================

def _get_open_segment(db, machine_inventory_id):

    return (
        db.query(MachineDeploymentSegment)
        .filter(
            MachineDeploymentSegment.machine_inventory_id == machine_inventory_id,
            MachineDeploymentSegment.ended_at.is_(None)
        )
        .order_by(MachineDeploymentSegment.started_at.desc())
        .first()
    )


def _resolve_purpose_label(db, execution):

    if execution is None:
        return "Available"

    enquiry = resolve_enquiry_by_job_creation_id(db, execution.job_creation_id)

    customer = enquiry.customer_name if enquiry else None
    site = execution.site_location

    if customer and site:
        return f"{customer} - {site}"

    return customer or site or "Job"


def open_deployment_segment(

    db,

    machine_inventory_id,

    execution,

    segment_type,

    start_lat,
    start_lng,
    end_lat=None,
    end_lng=None,

    when=None

):

    if machine_inventory_id is None:
        return None

    now = when or datetime.utcnow()

    previous = _get_open_segment(db, machine_inventory_id)

    if previous:
        previous.ended_at = now

    place_lat = end_lat if end_lat is not None else start_lat
    place_lng = end_lng if end_lng is not None else start_lng

    place_name = (
        reverse_geocode(place_lat, place_lng)
        if place_lat is not None and place_lng is not None
        else None
    )

    segment = MachineDeploymentSegment(
        machine_inventory_id=machine_inventory_id,
        execution_id=execution.id if execution else None,
        segment_type=segment_type,
        start_latitude=start_lat,
        start_longitude=start_lng,
        end_latitude=end_lat,
        end_longitude=end_lng,
        place_name=place_name,
        purpose_label=_resolve_purpose_label(db, execution),
        started_at=now
    )

    db.add(segment)
    db.commit()
    db.refresh(segment)

    return segment
