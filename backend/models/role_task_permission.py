from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Boolean
from sqlalchemy import ForeignKey

from sqlalchemy.orm import relationship

from backend.database.tables import Base


class RoleTaskPermission(Base):

    __tablename__ = "role_task_permissions"

    id = Column(
        Integer,
        primary_key=True
    )

    role_id = Column(
        Integer,
        ForeignKey("roles.id", ondelete="CASCADE"),
        nullable=False
    )

    module_task_id = Column(
        Integer,
        ForeignKey("module_tasks.id", ondelete="CASCADE"),
        nullable=False
    )

    allowed = Column(
        Boolean,
        default=False,
        nullable=False
    )

    role = relationship(
        "Role"
    )

    module_task = relationship(
        "ModuleTask"
    )
