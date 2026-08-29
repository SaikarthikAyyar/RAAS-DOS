# ====================================
# REVERSE GEOCODING
# Turns a raw lat/lon into a human-readable place name via OpenStreetMap's
# free Nominatim API - no API key needed, matching the same free/no-key
# posture already used for the Leaflet map tiles themselves (Phase 38).
# Best-effort only: any failure (timeout, no internet, rate limit) returns
# None and the caller falls back to showing raw coordinates instead -
# never allowed to block a real execution save.
# ====================================

import re

import requests


NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse"

NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search"


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


# ====================================
# FORWARD GEOCODING
# The reverse of reverse_geocode above - turns a place name into real
# coordinates, via the same free Nominatim API. Used so Phase 1's
# source/destination fields can be populated automatically from names
# already on hand (the enquiry's hub, the job's site location) instead
# of requiring someone to look up and type in coordinates by hand.
# Nothing about the result is persisted anywhere except straight into
# the execution row's own source/destination columns - there is no
# separate coordinate store.
#
# Every search is restricted to India (countrycodes=in) - this app
# doesn't currently handle jobs outside India, so there's no reason a
# lookup should ever be allowed to resolve somewhere else. Confirmed
# necessary, not just tidy: without it, a short/generic name like
# "Delhi-NCR" silently resolved to a hotel in the Philippines - a
# wrong answer with no error to catch, not a lookup failure.
#
# Real addresses (e.g. "Neyveli, Tamil Nadu") and specific localities
# (e.g. "Whitefield, Bangalore" - confirmed by hand) are passed through
# to Nominatim as-is; it already handles that shape of input well, and
# pre-splitting it apart would throw away context Nominatim uses to
# disambiguate. Hub names are a different, narrower case - see
# extract_hub_city below, used only for those.
#
# Best-effort: any failure (unresolvable text, timeout, no internet)
# returns None and the caller leaves the field blank for manual entry.
# ====================================

def forward_geocode(place_text, timeout=4):

    if not place_text or not place_text.strip():
        return None

    try:

        response = requests.get(
            NOMINATIM_SEARCH_URL,
            params={
                "q": place_text.strip(),
                "format": "json",
                "limit": 1,
                "countrycodes": "in"
            },
            headers={
                "User-Agent": "RAAS-DOS-Execution-Tracker/1.0"
            },
            timeout=timeout
        )

        response.raise_for_status()

        results = response.json()

        if not results:
            return None

        return (float(results[0]["lat"]), float(results[0]["lon"]))

    except Exception as error:

        print(f"[forward_geocode] Lookup failed for '{place_text}': {error}")
        return None


# ====================================
# HUB NAME -> CITY EXTRACTION
# Hub names in this app are short compound labels, not addresses - e.g.
# "Delhi-NCR (North)" or "Mumbai / Raigad" - built for display, not for
# feeding to a geocoder. Passed to forward_geocode whole, they either
# fail to resolve or (worse) resolve to the wrong place entirely, since
# a hub always genuinely centers on one real city and the compound
# label just adds a region qualifier or a second nearby place name on
# top of it. This strips exactly that: drop anything in parentheses,
# then take the first segment before a "/" or "-" separator, which is
# the actual city name every one of this app's real hub names starts
# with. Only used for hub resolution - real addresses and localities
# go through forward_geocode directly, unmodified, since Nominatim
# already parses those correctly on its own.
# ====================================

def extract_hub_city(hub_name):

    if not hub_name:
        return None

    without_qualifier = re.sub(r"\([^)]*\)", "", hub_name)

    first_segment = re.split(r"[/\-]", without_qualifier)[0]

    city = first_segment.strip()

    return city or None
