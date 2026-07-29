from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import Boolean

from sqlalchemy.sql import func

from backend.database.tables import Base


class Role(Base):

    __tablename__ = "roles"

    id = Column(
        Integer,
        primary_key=True
    )

    name = Column(
        String,
        nullable=False,
        unique=True
    )

    role_type = Column(
        String,
        nullable=False
    )

    description = Column(
        String,
        nullable=True
    )

    is_active = Column(
        Boolean,
        default=True
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