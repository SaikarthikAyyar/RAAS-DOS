from sqlalchemy import (
    Column,
    BigInteger,
    String,
    Boolean,
    ForeignKey,
    TIMESTAMP,
    text
)

from backend.database.tables import Base


class PersonnelDocument(Base):

    __tablename__ = "personnel_documents"

    id = Column(
        BigInteger,
        primary_key=True,
        index=True
    )

    personnel_id = Column(
        BigInteger,
        ForeignKey("personnel.id"),
        nullable=False
    )

    document_name = Column(
        String(100),
        nullable=False
    )

    document_type = Column(
        String(50),
        nullable=False
    )

    file_path = Column(
        String(500),
        nullable=False
    )

    verification_status = Column(
        String(30),
        server_default="VERIFIED"
    )

    verified_by = Column(
        String(100),
        server_default="USER"
    )

    created_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )

    updated_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )