from sqlalchemy import Column, BigInteger, String, ForeignKey, text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import TIMESTAMP

from backend.database.tables import Base


# Sampled sensor readings kept while a machine is on a job (see
# services/mqtt_telemetry.py). One row roughly every 30 s per machine.
class MachineTelemetryLog(Base):

    __tablename__ = "machine_telemetry_log"

    id = Column(BigInteger, primary_key=True, index=True)

    machine_inventory_id = Column(
        BigInteger, ForeignKey("machine_inventory.id", ondelete="CASCADE"), nullable=False
    )

    execution_id = Column(
        BigInteger, ForeignKey("executions.id", ondelete="SET NULL"), nullable=True
    )

    bot_id = Column(String(64), nullable=False)

    recorded_at = Column(
        TIMESTAMP(timezone=True), nullable=False, server_default=text("now()")
    )

    payload = Column(JSONB, nullable=False)
