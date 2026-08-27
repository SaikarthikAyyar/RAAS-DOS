# ====================================
# GEO UTILITIES
# Straight-line (great-circle) distance only - no routing API, no
# external dependency. Matches this project's existing "budgetary
# estimate, not false precision" posture (e.g. min/max quote ranges) -
# see Phase 38's plan for why this was chosen over a real road-routing
# service. Swapping to a real routing API later needs no schema change,
# distance_to_cover_km stays one float regardless of how it's computed.
# ====================================

import math

EARTH_RADIUS_KM = 6371.0


def haversine_km(lat1, lon1, lat2, lon2):

    if None in (lat1, lon1, lat2, lon2):
        return None

    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(d_phi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2) ** 2
    )

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return round(EARTH_RADIUS_KM * c, 2)
