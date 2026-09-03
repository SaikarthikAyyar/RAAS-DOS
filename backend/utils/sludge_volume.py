# ====================================
# RESOLVE SLUDGE VOLUME
# Every downstream consumer from Ops Review onward (the Ops Engine's
# volume-fit scoring and execution-day duration calc, the dewatering
# add-on's per-m3 pricing, Execution Phase 2's completion target) has
# always meant "the volume of material actually needing removal" by
# what used to be called "estimated volume" - back when Sales Survey
# Section C had one ambiguous volume field and no separate tank-volume
# concept at all.
#
# Once Section C split that into a real Tank Volume (the renamed
# "estimated_volume" column - the tank's own physical capacity) and a
# newly-computed "sludge_volume" (height x length x width, using the
# renamed Sludge Height field), every one of those downstream
# consumers needed to start reading sludge_volume instead - using the
# tank's total volume for e.g. an execution-days calc would wildly
# overstate how long a job takes, since a tank is rarely anywhere
# near full of sludge.
#
# This resolver prefers the new, purpose-built sludge_volume column,
# falling back to the legacy estimated_volume column only for surveys
# submitted before that split existed - sludge_volume is NULL on
# those historical rows (never computed), but their estimated_volume
# value IS the sludge amount under the old, single-field semantics,
# so it's the honest value to keep using rather than silently
# zeroing out every pre-existing enquiry's scoring/duration/target.
# ====================================

def resolve_sludge_volume(survey):

    if not survey:
        return 0

    if survey.sludge_volume:
        return survey.sludge_volume

    return survey.estimated_volume or 0
