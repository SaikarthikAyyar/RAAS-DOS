from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey

from sqlalchemy.orm import relationship

from backend.database.tables import Base


class ModuleTask(Base):

    __tablename__ = "module_tasks"

    id = Column(
        Integer,
        primary_key=True
    )

    module_id = Column(
        Integer,
        ForeignKey("modules.id", ondelete="CASCADE"),
        nullable=False
    )

    task_key = Column(
        String(100),
        nullable=False
    )

    task_label = Column(
        String(255),
        nullable=False
    )

    sort_order = Column(
        Integer,
        default=0,
        nullable=False
    )

    module = relationship(
        "Module"
    )
