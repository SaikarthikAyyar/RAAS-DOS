from sqlalchemy import (
    Column,
    BigInteger,
    String,
    Boolean,
    Date,
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

    insurance_type = Column(
        String(150),
        nullable=True
    )

    file_path = Column(
        String(500),
        nullable=False
    )

    verification_status = Column(
        String(30),
        server_default="VERIFIED"
    )

    valid_till = Column(
        Date,
        nullable=True
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

    # file_path is a Supabase Storage key (e.g. "personnel_documents/6/x.pdf"),
    # not a local disk path - this property is what PersonnelDocumentResponse's
    # from_attributes=True picks up as `url`, so the frontend never needs to
    # know or guess how to turn a stored key into a fetchable path.
    @property
    def url(self):
        return f"/uploads/{self.file_path}"