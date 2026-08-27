# ====================================
# IMPORTS
# ====================================

from sqlalchemy import Column
from sqlalchemy import BigInteger
from sqlalchemy import String
from sqlalchemy import TIMESTAMP
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import Float
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
    # MACHINE TYPE (Business Masters -> Machine Inventory)
    # Real FK to the Machines/Fleet spec catalog - the "type" this
    # physical unit belongs to. Nullable since legacy rows may not
    # have a clean code match; new rows always set this via the tab.
    # ====================================

    machine_type_id = Column(
        BigInteger,
        ForeignKey("machines.id"),
        nullable=True
    )

    # ====================================
    # HOME HUB
    # Real per-unit hub ownership - the Machine Specs catalog's own
    # hubs_available list (per TYPE) is superseded by this going
    # forward, since real physical stock has exactly one home hub.
    # ====================================

    hub_id = Column(
        BigInteger,
        ForeignKey("hubs.id"),
        nullable=True
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

    # current_gps (String) is superseded by the two real float columns
    # below - it was never actually written to anywhere in the codebase
    # (confirmed by a full repo grep, Phase 38), left in place unused
    # per this project's non-destructive-column convention rather than
    # dropped.
    current_gps = Column(
        String(100),
        nullable=True
    )

    # The machine's own "last known position" - set at Execution
    # creation (prefills that execution's own source_latitude/
    # _longitude) and kept in sync at each real Phase transition
    # (Phase 38), not just at final dequeue - this is what lets
    # Business Masters / Fleet & Availability show a real, current
    # position without opening a specific execution.
    current_latitude = Column(
        Float,
        nullable=True
    )

    current_longitude = Column(
        Float,
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