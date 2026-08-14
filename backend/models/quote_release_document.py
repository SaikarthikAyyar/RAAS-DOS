# ====================================
# IMPORTS
# ====================================

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey

from sqlalchemy.sql import func

from backend.database.tables import Base


class QuoteReleaseDocument(Base):
    __tablename__ = "quote_release_documents"

    id = Column(Integer, primary_key=True, index=True)
    quote_id = Column(Integer, ForeignKey("quotes.id"), nullable=False)
    enquiry_id = Column(Integer, ForeignKey("enquiries.id"))
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    generated_by = Column(String(150))
    created_at = Column(DateTime, server_default=func.now())
