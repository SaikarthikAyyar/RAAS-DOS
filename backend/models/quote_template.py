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


class QuoteTemplate(Base):
    __tablename__ = "quote_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    active = Column(Boolean, nullable=False, default=True)
    body = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    variables = relationship(
        "QuoteTemplateVariable",
        back_populates="template",
        cascade="all, delete-orphan",
        order_by="QuoteTemplateVariable.sort_order"
    )


class QuoteTemplateVariable(Base):
    __tablename__ = "quote_template_variables"

    id = Column(Integer, primary_key=True, index=True)
    quote_template_id = Column(Integer, ForeignKey("quote_templates.id", ondelete="CASCADE"), nullable=False)
    key = Column(String(100), nullable=False)
    label = Column(String(255), nullable=False)
    sort_order = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, server_default=func.now())

    template = relationship("QuoteTemplate", back_populates="variables")
