# ====================================
# IMPORTS
# ====================================

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Boolean
from sqlalchemy import Text
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

from sqlalchemy.sql import func

from backend.database.tables import Base


class LookupList(Base):
    __tablename__ = "lookup_lists"

    id = Column(Integer, primary_key=True, index=True)
    list_key = Column(String(100), unique=True, nullable=False)
    display_name = Column(String(150), nullable=False)
    module = Column(String(50), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    values = relationship(
        "LookupListValue",
        back_populates="lookup_list",
        cascade="all, delete-orphan",
        order_by="LookupListValue.sort_order"
    )


class LookupListValue(Base):
    __tablename__ = "lookup_list_values"

    id = Column(Integer, primary_key=True, index=True)
    lookup_list_id = Column(Integer, ForeignKey("lookup_lists.id", ondelete="CASCADE"), nullable=False)
    value = Column(String(255), nullable=False)
    is_other = Column(Boolean, nullable=False, default=False)
    conditional_tag = Column(String(50))
    sort_order = Column(Integer, nullable=False, default=0)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, server_default=func.now())

    lookup_list = relationship("LookupList", back_populates="values")
