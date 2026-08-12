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


class EmailTemplate(Base):
    __tablename__ = "email_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    use_case = Column(String(255), nullable=False)
    subject = Column(String(500), nullable=False)
    body = Column(Text, nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    variables = relationship(
        "EmailTemplateVariable",
        back_populates="template",
        cascade="all, delete-orphan",
        order_by="EmailTemplateVariable.sort_order"
    )


class EmailTemplateVariable(Base):
    __tablename__ = "email_template_variables"

    id = Column(Integer, primary_key=True, index=True)
    email_template_id = Column(Integer, ForeignKey("email_templates.id", ondelete="CASCADE"), nullable=False)
    key = Column(String(100), nullable=False)
    label = Column(String(255), nullable=False)
    is_recipient_field = Column(Boolean, nullable=False, default=False)
    sort_order = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, server_default=func.now())

    template = relationship("EmailTemplate", back_populates="variables")
