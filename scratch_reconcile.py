import sys
import backend.database.init_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.services.workflow_service import update_stage, WorkflowStage
from backend.models.enquiry import Enquiry

dsn = sys.argv[1]
engine = create_engine(dsn)
Session = sessionmaker(bind=engine)
db = Session()

stubs = (
    db.query(Enquiry)
    .filter(Enquiry.approval_board_id.is_(None), Enquiry.customer_name.is_(None), Enquiry.job_creation_id.isnot(None))
    .all()
)

print(f"Found {len(stubs)} stub row(s)")

for stub in stubs:
    real = (
        db.query(Enquiry)
        .filter(Enquiry.job_creation_id == stub.job_creation_id, Enquiry.id != stub.id)
        .filter(Enquiry.approval_board_id.isnot(None))
        .first()
    )
    print(f"stub id={stub.id} job_creation_id={stub.job_creation_id} stub.stage={stub.stage} -> real enquiry: {real.id if real else None} (customer={real.customer_name if real else None}, real.stage={real.stage if real else None})")

    if real is None:
        print(f"  ! no real sibling found for stub {stub.id} - skipping stage reconciliation, will still remove stub")
        continue

    order = [s.value for s in WorkflowStage]
    try:
        stub_idx = order.index(stub.stage)
    except ValueError:
        stub_idx = -1
    try:
        real_idx = order.index(real.stage)
    except ValueError:
        real_idx = -1

    if stub_idx > real_idx:
        print(f"  -> advancing real enquiry {real.id} from {real.stage} to {stub.stage}")
        update_stage(db, real.id, stub.stage)
    else:
        print(f"  -> real enquiry {real.id} already at or past stub's stage, no change")

db.close()
