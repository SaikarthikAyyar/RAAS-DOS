from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime

from sqlalchemy.sql import func

from backend.database.tables import Base


class Module(Base):

    __tablename__ = "modules"

    id = Column(
        Integer,
        primary_key=True
    )

    module_key = Column(
        String,
        nullable=False,
        unique=True
    )

    module_name = Column(
        String,
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