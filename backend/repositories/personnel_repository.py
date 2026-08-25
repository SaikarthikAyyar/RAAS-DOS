# ====================================
# IMPORTS
# ====================================

from backend.models.personnel import Personnel
from backend.models.personnel_document import PersonnelDocument


_PERSONNEL_EXCLUDE = {"actor", "remark"}
_DOCUMENT_EXCLUDE = {"actor", "remark"}


# ====================================
# PERSONNEL
# ====================================

def list_personnel(db):
    return db.query(Personnel).order_by(Personnel.full_name).all()


def get_personnel(db, personnel_id):
    return db.query(Personnel).filter(Personnel.id == personnel_id).first()


def create_personnel(db, payload):
    row = Personnel(**payload.model_dump(exclude=_PERSONNEL_EXCLUDE))
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def update_personnel(db, personnel_id, payload):
    row = get_personnel(db, personnel_id)
    if not row:
        return None

    for field, value in payload.model_dump(exclude_unset=True, exclude=_PERSONNEL_EXCLUDE).items():
        setattr(row, field, value)

    db.commit()
    db.refresh(row)
    return row


def delete_personnel(db, personnel_id):
    row = get_personnel(db, personnel_id)
    if not row:
        return False
    db.delete(row)
    db.commit()
    return True


# ====================================
# PERSONNEL DOCUMENTS
# ====================================

def list_documents(db, personnel_id):
    return (
        db.query(PersonnelDocument)
        .filter(PersonnelDocument.personnel_id == personnel_id)
        .order_by(PersonnelDocument.created_at)
        .all()
    )


def get_document(db, document_id):
    return db.query(PersonnelDocument).filter(PersonnelDocument.id == document_id).first()


def create_document(db, personnel_id, document_name, document_type, file_path, valid_till, insurance_type=None, verification_status="NOT_VERIFIED"):

    row = PersonnelDocument(
        personnel_id=personnel_id,
        document_name=document_name,
        document_type=document_type,
        insurance_type=insurance_type,
        file_path=file_path,
        valid_till=valid_till,
        verification_status=verification_status
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def update_document(db, document_id, payload):
    row = get_document(db, document_id)
    if not row:
        return None

    for field, value in payload.model_dump(exclude_unset=True, exclude=_DOCUMENT_EXCLUDE).items():
        setattr(row, field, value)

    db.commit()
    db.refresh(row)
    return row


def delete_document(db, document_id):
    row = get_document(db, document_id)
    if not row:
        return None
    db.delete(row)
    db.commit()
    return row
