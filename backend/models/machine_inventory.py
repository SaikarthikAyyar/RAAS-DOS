# ====================================
# IMPORTS
# ====================================

from sqlalchemy import Column
from sqlalchemy import BigInteger
from sqlalchemy import String
from sqlalchemy import TIMESTAMP
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import text

from backend.database.tables import Base


# ====================================
# MACHINE INVENTORY
# ====================================

class MachineInventory(Base):

    __tablename__ = "machine_inventory"

    # ====================================
    # PRIMARY KEY
    # ====================================

    id = Column(
        BigInteger,
        primary_key=True,
        index=True
    )

    # ====================================
    # MACHINE DETAILS
    # ====================================

    machine_name = Column(
        String(200),
        nullable=False
    )
    machine_code = Column(
        String(100),
        unique=True,
        nullable=False
    )

    asset_number = Column(
        String(100),
        unique=True,
        nullable=False
    )

    # ====================================
    # LIVE STATUS
    # ====================================

    status = Column(
        String(50),
        default="AVAILABLE"
    )

    current_job_id = Column(
        BigInteger,
        ForeignKey("job_creations.id"),
        nullable=True
    )

    current_site = Column(
        String(200),
        default="WAREHOUSE"
    )

    current_gps = Column(
        String(100),
        nullable=True
    )

    queue_count = Column(
        Integer,
        default=0
    )

    remarks = Column(
        String(500),
        nullable=True
    )

    # ====================================
    # AUDIT
    # ====================================

    created_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )

    updated_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )