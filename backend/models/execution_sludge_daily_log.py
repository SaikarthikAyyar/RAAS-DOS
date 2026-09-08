# ====================================
# EXECUTION SLUDGE DAILY LOG
# One row per calendar day of Job Execution (Phase 2) tracked via a
# real field method - Flow Meter Reading or Sample Collection
# (Settling), chosen fresh each day. Every cached field below (avg_fr
# through water_output_m3) is never hand-edited - it's recomputed in
# full by execution_sludge_service.py any time a reading or the raw
# inputs on this row change, so it's always a snapshot of the current,
# correct calculation rather than a value that can drift stale.
# sludge_output_m3 across every daily log for an execution is what
# executions.total_output actually is, for any execution whose
# progress_tracking_mode is SLUDGE_LOG.
# ====================================

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import BigInteger
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import Text
from sqlalchemy import Date
from sqlalchemy import TIMESTAMP
from sqlalchemy import ForeignKey
from sqlalchemy import UniqueConstraint

from sqlalchemy.sql import func

from backend.database.tables import Base


class ExecutionSludgeDailyLog(Base):

    __tablename__ = "execution_sludge_daily_logs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    execution_id = Column(
        BigInteger,
        ForeignKey("executions.id"),
        nullable=False
    )

    log_date = Column(Date, nullable=False)

    method = Column(String(20), nullable=False)  # FLOW_METER | SETTLING

    start_tf = Column(Float, nullable=False)

    end_tf = Column(Float, nullable=True)

    total_sludge_pump_minutes = Column(Float, nullable=True)

    flask_volume_ml = Column(Float, default=1000)

    # ====================================
    # CACHED, ALWAYS-RECOMPUTED OUTPUTS
    # ====================================

    avg_fr = Column(Float, nullable=True)

    fr_per_minute = Column(Float, nullable=True)

    total_sludge_pumping_estimate_m3 = Column(Float, nullable=True)

    total_tf_m3 = Column(Float, nullable=True)

    pct_sludge = Column(Float, nullable=True)

    pct_water = Column(Float, nullable=True)

    sludge_output_m3 = Column(Float, nullable=True)

    water_output_m3 = Column(Float, nullable=True)

    # Set (non-None) exactly when the split couldn't be computed
    # because the inputs are physically inconsistent - e.g. a
    # flow-rate estimate smaller than Total(TF), or a settled sample
    # bigger than its own flask. Never a nonsensical negative/over-100
    # percentage is computed in that case - see backend/utils/
    # sludge_progress.py for the guard.
    invalid_reason = Column(Text, nullable=True)

    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("execution_id", "log_date", name="uq_execution_sludge_daily_logs_execution_date"),
    )
