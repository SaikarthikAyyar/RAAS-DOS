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

    # ON DELETE CASCADE: a permission row is meaningless without its
    # role/module - without this, deleting a role that the Navigation
    # Access matrix has ever saved (which creates a full role x module
    # row set, not just the checked cells) fails on the FK constraint.
    role_id = Column(
        Integer,
        ForeignKey("roles.id", ondelete="CASCADE"),
        nullable=False
    )

    module_id = Column(
        Integer,
        ForeignKey("modules.id", ondelete="CASCADE"),
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

    # At most one True per role_id - enforced app-side (save_nav_matrix)
    # and DB-side (uq_role_permissions_one_landing_page partial index).
    is_landing_page = Column(
        Boolean,
        default=False,
        nullable=False
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