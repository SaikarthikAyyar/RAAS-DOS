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
#
# `invalid_reason` (None when everything is fine) flags a result that
# was NOT computed because the inputs are physically inconsistent -
# e.g. a flow-rate estimate smaller than what the totalizer actually
# measured, or a settled sample bigger than its own flask. Rather than
# silently emitting a nonsensical percentage (negative, or over 100%),
# every output field stays None and the reason is surfaced so the user
# can go fix the actual bad input (a mistyped pump time, a mistyped
# flask volume) instead of trusting a confidently-wrong number.
# ====================================

PENDING = {
    "avg_fr": None,
    "fr_per_minute": None,
    "total_sludge_pumping_estimate_m3": None,
    "total_tf_m3": None,
    "pct_sludge": None,
    "pct_water": None,
    "sludge_output_m3": None,
    "water_output_m3": None,
    "invalid_reason": None
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

    # The flow-rate estimate is only a valid basis for the % split when
    # it's at least as large as the totalizer's real measured total -
    # the split formula below reads (estimate - total_tf) as "how much
    # of the estimate wasn't real sludge", which only makes physical
    # sense when the estimate is the larger of the two. An estimate
    # smaller than Total(TF) means the pump time/FR readings entered
    # don't account for everything the totalizer actually measured -
    # a real data-entry problem, not a valid (if unusual) reading.
    if total_sludge_pumping_estimate_m3 < total_tf_m3:

        result = dict(PENDING)
        result["total_tf_m3"] = total_tf_m3
        result["avg_fr"] = avg_fr
        result["fr_per_minute"] = fr_per_minute
        result["total_sludge_pumping_estimate_m3"] = total_sludge_pumping_estimate_m3
        result["invalid_reason"] = (
            f"The flow-rate estimate ({total_sludge_pumping_estimate_m3:.2f} m3) is less than "
            f"the totalizer's real measured total for this day ({total_tf_m3:.2f} m3). "
            f"Check Total Sludge Pump Time and the FR readings."
        )

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
        "water_output_m3": total_tf_m3 * (pct_water / 100),
        "invalid_reason": None
    }


# ====================================
# METHOD 2 - SAMPLE COLLECTION (SETTLING) METHOD
# Measures the sludge fraction directly via a physical settling test -
# no flow-rate estimate is computed or needed at all. FR/pump-minutes
# may still be recorded per reading for reference, but play no role in
# this method's real sludge/water split (verified against the source
# worksheet).
#
# Flask volume is captured per reading, not once for the whole day -
# different flask sizes may genuinely be used sample to sample. Each
# reading's own settled-sludge fraction is computed first
# (settled/flask), then the fractions are averaged - mathematically
# identical to the verified PDF's own "average settled ml / one flask
# volume" approach whenever every reading really did use the same
# flask size (constant-denominator averaging), and correctly
# generalizes to a day where it didn't.
# ====================================

def compute_settling_day(start_tf, end_tf, readings):

    if end_tf is None or not readings:
        return dict(PENDING)

    total_tf_m3 = end_tf - start_tf

    fractions = []
    invalid_reason = None

    for r in readings:

        settled = r.get("settled_sludge_volume_ml")
        flask = r.get("flask_volume_ml")

        if settled is None or not flask or flask <= 0:
            continue

        if settled > flask:

            invalid_reason = (
                f"A settled sludge reading ({settled:.0f} ml) is larger than its own flask "
                f"volume ({flask:.0f} ml) - that reading needs to be corrected."
            )
            continue

        fractions.append(settled / flask)

    if not fractions:

        result = dict(PENDING)
        result["total_tf_m3"] = total_tf_m3
        result["invalid_reason"] = invalid_reason

        return result

    if invalid_reason:

        result = dict(PENDING)
        result["total_tf_m3"] = total_tf_m3
        result["invalid_reason"] = invalid_reason

        return result

    pct_sludge = (sum(fractions) / len(fractions)) * 100

    pct_water = 100 - pct_sludge

    return {
        "avg_fr": None,
        "fr_per_minute": None,
        "total_sludge_pumping_estimate_m3": None,
        "total_tf_m3": total_tf_m3,
        "pct_sludge": pct_sludge,
        "pct_water": pct_water,
        "sludge_output_m3": total_tf_m3 * (pct_sludge / 100),
        "water_output_m3": total_tf_m3 * (pct_water / 100),
        "invalid_reason": None
    }


def compute_daily_log(method, start_tf, end_tf, readings, pump_minutes=None):

    if method == "FLOW_METER":
        return compute_flow_meter_day(start_tf, end_tf, readings, pump_minutes)

    if method == "SETTLING":
        return compute_settling_day(start_tf, end_tf, readings)

    raise ValueError(f"Unknown sludge tracking method: {method}")
