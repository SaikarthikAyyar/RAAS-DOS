# ====================================
# EXECUTION MEDIA
# Photos/videos captured during Job Execution (Phase 2) - the same
# concept as customer_media (Sales Survey's own photo/video upload),
# scoped to a real execution_id instead of a customer_request_id since
# this is job-execution-specific, not survey-specific. Kept as its
# own table rather than reusing customer_media so the two concerns
# (a site survey's own record vs. a job's real-time execution record)
# don't get conflated under one FK column that means two different
# things depending on context.
# ====================================

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey

from sqlalchemy.sql import func

from backend.database.tables import Base


class ExecutionMedia(Base):

    __tablename__ = "execution_media"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    execution_id = Column(
        Integer,
        ForeignKey("executions.id"),
        nullable=False
    )

    media_type = Column(String(20))

    file_name = Column(String(255))

    file_path = Column(String(500))

    uploaded_by = Column(String(150), nullable=True)

    created_at = Column(
        DateTime,
        server_default=func.now()
    )
