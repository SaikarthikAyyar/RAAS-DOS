# ====================================
# SLUDGE PROGRESS FORMULAS
# Both methods below were hand-verified against real client worksheets
# ("Daily Sludge Calculation Day 7-Day 10.pdf", "Daily Sludge
# Calculation 8 May.pdf") before being encoded here - every step
# reproduces the client's own real worked numbers exactly. Do not
# change this math without re-checking it against those worksheets;
# see the persistent memory note "project-execution-sludge-progress-
# methods" for the full formula derivation and glossary.
#
# TF (Totalizer Flow) is always a lifetime-cumulative meter reading in
# m3, never a rate, never reset day to day - Total(TF) = end_tf -
# start_tf is the day's real, meter-verified total volume of slurry
# removed, and is the ground truth both methods below decompose into a
# sludge component and a water component.
#
# Neither function touches the database - pure calculation only, so
# the results are trivially unit-testable and reusable from anywhere
# (the daily-log recompute path today; a future device-signal ingestion
# path later, with zero change needed here).
# ====================================

PENDING = {
    "avg_fr": None,
    "fr_per_minute": None,
    "total_sludge_pumping_estimate_m3": None,
    "total_tf_m3": None,
    "pct_sludge": None,
    "pct_water": None,
    "sludge_output_m3": None,
    "water_output_m3": None
}


# ====================================
# METHOD 1 - FLOW METER READING METHOD
# Estimates the day's total volume from periodic flow-rate sampling,
# then compares that estimate against the totalizer's true total to
# infer the sludge/water split - applied to Total(TF), not the
# estimate (verified: the estimate is only ever used to derive the
# percentage split, never as the volume the split is applied to).
# ====================================

def compute_flow_meter_day(start_tf, end_tf, readings, pump_minutes):

    if end_tf is None or not readings:
        return dict(PENDING)

    total_tf_m3 = end_tf - start_tf

    fr_values = [
        r["fr_reading"]
        for r in readings
        if r.get("fr_reading") is not None
    ]

    if not fr_values or pump_minutes is None:

        result = dict(PENDING)
        result["total_tf_m3"] = total_tf_m3

        return result

    # Mean of EVERY reading taken that day, including the terminal one
    # - verified: excluding the terminal reading does not reproduce the
    # source document's real per-day average.
    avg_fr = sum(fr_values) / len(fr_values)

    fr_per_minute = avg_fr / 60

    total_sludge_pumping_estimate_m3 = pump_minutes * fr_per_minute

    if total_sludge_pumping_estimate_m3 <= 0:

        result = dict(PENDING)
        result["total_tf_m3"] = total_tf_m3
        result["avg_fr"] = avg_fr
        result["fr_per_minute"] = fr_per_minute
        result["total_sludge_pumping_estimate_m3"] = total_sludge_pumping_estimate_m3

        return result

    pct_water = (
        (total_sludge_pumping_estimate_m3 - total_tf_m3)
        / total_sludge_pumping_estimate_m3
        * 100
    )

    pct_sludge = 100 - pct_water

    return {
        "avg_fr": avg_fr,
        "fr_per_minute": fr_per_minute,
        "total_sludge_pumping_estimate_m3": total_sludge_pumping_estimate_m3,
        "total_tf_m3": total_tf_m3,
        "pct_sludge": pct_sludge,
        "pct_water": pct_water,
        "sludge_output_m3": total_tf_m3 * (pct_sludge / 100),
        "water_output_m3": total_tf_m3 * (pct_water / 100)
    }


# ====================================
# METHOD 2 - SAMPLE COLLECTION (SETTLING) METHOD
# Measures the sludge fraction directly via a physical settling test -
# no flow-rate estimate is computed or needed at all. FR/pump-minutes
# may still be recorded per reading for reference, but play no role in
# this method's real sludge/water split (verified against the source
# worksheet).
# ====================================

def compute_settling_day(start_tf, end_tf, readings, flask_volume_ml):

    if end_tf is None or not readings:
        return dict(PENDING)

    total_tf_m3 = end_tf - start_tf

    settled_values = [
        r["settled_sludge_volume_ml"]
        for r in readings
        if r.get("settled_sludge_volume_ml") is not None
    ]

    if not settled_values or not flask_volume_ml:

        result = dict(PENDING)
        result["total_tf_m3"] = total_tf_m3

        return result

    avg_settled_sludge_ml = sum(settled_values) / len(settled_values)

    pct_sludge = (avg_settled_sludge_ml / flask_volume_ml) * 100

    pct_water = 100 - pct_sludge

    return {
        "avg_fr": None,
        "fr_per_minute": None,
        "total_sludge_pumping_estimate_m3": None,
        "total_tf_m3": total_tf_m3,
        "pct_sludge": pct_sludge,
        "pct_water": pct_water,
        "sludge_output_m3": total_tf_m3 * (pct_sludge / 100),
        "water_output_m3": total_tf_m3 * (pct_water / 100)
    }


def compute_daily_log(method, start_tf, end_tf, readings, pump_minutes=None, flask_volume_ml=None):

    if method == "FLOW_METER":
        return compute_flow_meter_day(start_tf, end_tf, readings, pump_minutes)

    if method == "SETTLING":
        return compute_settling_day(start_tf, end_tf, readings, flask_volume_ml)

    raise ValueError(f"Unknown sludge tracking method: {method}")
