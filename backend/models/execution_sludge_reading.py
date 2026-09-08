# ====================================
# EXECUTION SLUDGE READING
# One row per periodic checkpoint reading within a daily sludge log
# (execution_sludge_daily_log.py) - TF is always required (both
# methods); fr_reading is the Flow Meter method's real input (reference
# -only for Settling); settled_sludge_volume_ml is the Settling
# method's real input (unused for Flow Meter).
#
# `source` is the sensor-readiness hook: MANUAL today, ready for a real
# machine-attached device to write DEVICE readings later through this
# exact same table/endpoints - deliberately NOT a gate on editability.
# Every reading stays directly editable via the same update path
# regardless of its source, forever, per direct instruction - a device
# populating this table later must never make a value harder to
# correct than it is today.
# ====================================

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import TIMESTAMP
from sqlalchemy import ForeignKey

from sqlalchemy.sql import func

from backend.database.tables import Base


class ExecutionSludgeReading(Base):

    __tablename__ = "execution_sludge_readings"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    daily_log_id = Column(
        Integer,
        ForeignKey("execution_sludge_daily_logs.id"),
        nullable=False
    )

    recorded_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=func.now())

    tf_reading = Column(Float, nullable=False)

    fr_reading = Column(Float, nullable=True)

    settled_sludge_volume_ml = Column(Float, nullable=True)

    # Sample Collection (Settling) method only - captured per-reading
    # rather than once for the whole day, since different flask sizes
    # may genuinely be used sample to sample. The daily log's own
    # flask_volume_ml column is superseded by this for any reading
    # that sets its own value.
    flask_volume_ml = Column(Float, nullable=True)

    source = Column(String(20), nullable=False, default="MANUAL")  # MANUAL | DEVICE

    recorded_by = Column(String(150), nullable=True)

    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
