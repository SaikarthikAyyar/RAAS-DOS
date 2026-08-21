# ====================================
# IMPORTS
# ====================================

from backend.repositories.gst_settings_repository import get_gst_settings, update_gst_settings

from backend.repositories.notification_repository import record_business_master_change


def get_gst_settings_request(db):
    return get_gst_settings(db)


def update_gst_settings_request(db, payload):

    before = get_gst_settings(db)
    before_rate = float(before.rate) if before else None
    before_treatment = before.treatment if before else None

    row = update_gst_settings(db, payload)

    changes = []

    if payload.rate != before_rate:
        changes.append({"field": "rate", "before": before_rate, "after": float(row.rate)})

    if payload.treatment != before_treatment:
        changes.append({"field": "treatment", "before": before_treatment, "after": row.treatment})

    if changes:

        record_business_master_change(
            db=db,
            module="Business Masters",
            action="UPDATE",
            actor_user_id=payload.actor.user_id,
            actor_name=payload.actor.name,
            actor_role=payload.actor.role,
            title=f"{payload.actor.name} updated GST & Tax settings in Business Masters",
            changes=changes,
            remark=payload.remark
        )

    return row
