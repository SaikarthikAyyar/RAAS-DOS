# ====================================
# REVERSE GEOCODING
# Turns a raw lat/lon into a human-readable place name via OpenStreetMap's
# free Nominatim API - no API key needed, matching the same free/no-key
# posture already used for the Leaflet map tiles themselves (Phase 38).
# Best-effort only: any failure (timeout, no internet, rate limit) returns
# None and the caller falls back to showing raw coordinates instead -
# never allowed to block a real execution save.
# ====================================

import requests


NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse"


def reverse_geocode(lat, lon, timeout=4):

    if lat is None or lon is None:
        return None

    try:

        response = requests.get(
            NOMINATIM_REVERSE_URL,
            params={
                "lat": lat,
                "lon": lon,
                "format": "json",
                "zoom": 10
            },
            headers={
                # Nominatim's usage policy requires a real identifying
                # User-Agent on every request.
                "User-Agent": "RAAS-DOS-Execution-Tracker/1.0"
            },
            timeout=timeout
        )

        response.raise_for_status()

        data = response.json()
        address = data.get("address", {})

        place = (
            address.get("city")
            or address.get("town")
            or address.get("village")
            or address.get("county")
        )

        state = address.get("state")

        if place and state:
            return f"{place}, {state}"

        return place or data.get("display_name")

    except Exception as error:

        print(f"[reverse_geocode] Lookup failed for ({lat}, {lon}): {error}")
        return None
