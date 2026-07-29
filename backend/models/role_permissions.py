from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Boolean
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey

from sqlalchemy.orm import relationship

from sqlalchemy.sql import func

from backend.database.tables import Base


class RolePermission(Base):

    __tablename__ = "role_permissions"

    id = Column(
        Integer,
        primary_key=True
    )

    role_id = Column(
        Integer,
        ForeignKey("roles.id"),
        nullable=False
    )

    module_id = Column(
        Integer,
        ForeignKey("modules.id"),
        nullable=False
    )

    can_view = Column(
        Boolean,
        default=False
    )

    can_create = Column(
        Boolean,
        default=False
    )

    can_edit = Column(
        Boolean,
        default=False
    )

    can_delete = Column(
        Boolean,
        default=False
    )

    can_approve = Column(
        Boolean,
        default=False
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now()
    )

    role = relationship(
        "Role"
    )

    module = relationship(
        "Module"
    )