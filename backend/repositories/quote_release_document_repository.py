# ====================================
# IMPORTS
# ====================================

from backend.models.quote_release_document import QuoteReleaseDocument


def create_quote_release_document(db, quote_id, enquiry_id, file_name, file_path, generated_by):

    row = QuoteReleaseDocument(
        quote_id=quote_id,
        enquiry_id=enquiry_id,
        file_name=file_name,
        file_path=file_path,
        generated_by=generated_by
    )

    db.add(row)
    db.commit()
    db.refresh(row)

    return row


def get_quote_release_document(db, document_id):
    return db.query(QuoteReleaseDocument).filter(QuoteReleaseDocument.id == document_id).first()


def get_latest_quote_release_document_by_quote(db, quote_id):
    return (
        db.query(QuoteReleaseDocument)
        .filter(QuoteReleaseDocument.quote_id == quote_id)
        .order_by(QuoteReleaseDocument.created_at.desc())
        .first()
    )
