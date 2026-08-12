# ====================================
# IMPORTS
# ====================================

from datetime import datetime, timezone


# ====================================
# AGING
# Time an enquiry has spent in its CURRENT stage, computed to the
# second from `stage_entered_at` (reset on every stage transition -
# see workflow_service.py::update_stage). Every time-based feature
# that depends on aging (the Enquiries list display, the Survey
# Reminder's stage-change detection) should read it through here so
# it's computed exactly one way everywhere.
# ====================================

def compute_aging_seconds(stage_entered_at, now=None):

    now = now or datetime.now(timezone.utc)

    entered = stage_entered_at

    if entered.tzinfo is None:
        entered = entered.replace(tzinfo=timezone.utc)

    return max(0, (now - entered).total_seconds())


# Display-only: days, rounded (matches the wireframe's own
# Math.round(ms / 86400000), not floor/ceil).
def aging_seconds_to_days_display(seconds):

    return f"{round(seconds / 86400)}d"
