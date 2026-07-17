from sqlalchemy import Column

from sqlalchemy import Integer

from sqlalchemy import String

from sqlalchemy import Boolean

from sqlalchemy import DateTime

from sqlalchemy.sql import func

from backend.database.tables import Base

class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True)

    name = Column(String)

    email = Column(String)

    password = Column(String)

    role = Column(String)

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