# ====================================
# IMPORTS
# ====================================

from backend.models.gst_settings import GstSettings


def get_gst_settings(db):
    return db.query(GstSettings).filter(GstSettings.id == 1).first()


def update_gst_settings(db, payload):

    row = get_gst_settings(db)

    if not row:
        row = GstSettings(id=1, rate=payload.rate, treatment=payload.treatment)
        db.add(row)
    else:
        row.rate = payload.rate
        row.treatment = payload.treatment

    db.commit()
    db.refresh(row)
    return row
