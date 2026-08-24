# ====================================
# IMPORTS
# ====================================

import os

from backend.repositories.personnel_repository import (
    list_personnel,
    get_personnel,
    create_personnel,
    update_personnel,
    delete_personnel,
    list_documents,
    get_document,
    create_document,
    update_document,
    delete_document
)

from backend.repositories.notification_repository import record_business_master_change

from backend.schemas.personnel_schema import PersonnelResponse, PersonnelDocumentResponse


# ====================================
# PERSONNEL -> RESPONSE (with documents attached)
# ====================================

def _build_personnel_response(db, row):

    documents = list_documents(db, row.id)

    return PersonnelResponse(
        id=row.id,
        employee_code=row.employee_code,
        full_name=row.full_name,
        phone_number=row.phone_number,
        current_location=row.current_location,
        designation=row.designation,
        skill=row.skill,
        availability_status=row.availability_status,
        documents_verified=row.documents_verified,
        documents=[PersonnelDocumentResponse.model_validate(d) for d in documents]
    )


# ====================================
# PERSONNEL
# ====================================

def list_personnel_request(db):
    rows = list_personnel(db)
    return [_build_personnel_response(db, r) for r in rows]


def create_personnel_request(db, payload):

    row = create_personnel(db, payload)

    record_business_master_change(
        db=db,
        module="Business Masters",
        action="CREATE",
        actor_user_id=payload.actor.user_id,
        actor_name=payload.actor.name,
        actor_role=payload.actor.role,
        title=f"{payload.actor.name} added Personnel '{row.full_name}' in Business Masters",
        changes=[
            {"field": "employee_code", "before": None, "after": row.employee_code},
            {"field": "full_name", "before": None, "after": row.full_name},
            {"field": "designation", "before": None, "after": row.designation}
        ],
        remark=payload.remark
    )

    return _build_personnel_response(db, row)


def update_personnel_request(db, personnel_id, payload):

    before = get_personnel(db, personnel_id)

    if not before:
        return None

    fields_sent = [
        f for f in ("full_name", "phone_number", "current_location", "designation", "skill")
        if f in payload.model_fields_set
    ]

    changes = []
    for field in fields_sent:
        before_value = getattr(before, field)
        after_value = getattr(payload, field)
        if before_value != after_value:
            changes.append({"field": field, "before": before_value, "after": after_value})

    row = update_personnel(db, personnel_id, payload)

    if changes:

        record_business_master_change(
            db=db,
            module="Business Masters",
            action="UPDATE",
            actor_user_id=payload.actor.user_id,
            actor_name=payload.actor.name,
            actor_role=payload.actor.role,
            title=f"{payload.actor.name} updated Personnel '{row.full_name}' in Business Masters",
            changes=changes,
            remark=payload.remark
        )

    return _build_personnel_response(db, row)


def delete_personnel_request(db, personnel_id, actor, remark):

    row = get_personnel(db, personnel_id)

    if not row:
        return False

    full_name = row.full_name

    for doc in list_documents(db, personnel_id):
        if doc.file_path and os.path.exists(doc.file_path):
            os.remove(doc.file_path)

    success = delete_personnel(db, personnel_id)

    if success:

        record_business_master_change(
            db=db,
            module="Business Masters",
            action="DELETE",
            actor_user_id=actor.user_id,
            actor_name=actor.name,
            actor_role=actor.role,
            title=f"{actor.name} removed Personnel '{full_name}' from Business Masters",
            changes=[{"field": "full_name", "before": full_name, "after": None}],
            remark=remark
        )

    return success


# ====================================
# PERSONNEL DOCUMENTS
# Real file upload, same backend/uploads/ convention as PO uploads
# (customer_media_service.py/purchase_order_service.py) - not the
# wireframe's demo placeholder.
# ====================================

async def upload_document_request(db, personnel_id, file, document_type, valid_till, actor, remark):

    person = get_personnel(db, personnel_id)

    if not person:
        raise ValueError("Person not found.")

    # Personnel compliance documents (Insurance, ID Proof, Driving
    # License, Medical Certificate, etc.) are always scanned/issued as
    # PDFs - reject anything else rather than silently accepting a
    # photo or a doc file that the viewer link below wouldn't render
    # sensibly in a browser tab.
    if not file.filename.lower().endswith(".pdf"):
        raise ValueError("Only PDF files are accepted for personnel documents.")

    folder = f"backend/uploads/personnel_documents/{personnel_id}"
    os.makedirs(folder, exist_ok=True)

    file_path = f"{folder}/{file.filename}"

    contents = await file.read()

    with open(file_path, "wb") as f:
        f.write(contents)

    row = create_document(db, personnel_id, file.filename, document_type, file_path, valid_till)

    record_business_master_change(
        db=db,
        module="Business Masters",
        action="CREATE",
        actor_user_id=actor.user_id,
        actor_name=actor.name,
        actor_role=actor.role,
        title=f"{actor.name} added a {document_type} document for {person.full_name} in Business Masters",
        changes=[
            {"field": "document_type", "before": None, "after": row.document_type},
            {"field": "document_name", "before": None, "after": row.document_name},
            {"field": "valid_till", "before": None, "after": row.valid_till.isoformat() if row.valid_till else None}
        ],
        remark=remark
    )

    return row


def update_document_request(db, document_id, payload):

    before = get_document(db, document_id)

    if not before:
        return None

    fields_sent = [f for f in ("document_type", "valid_till") if f in payload.model_fields_set]

    changes = []
    for field in fields_sent:
        before_value = getattr(before, field)
        after_value = getattr(payload, field)
        if before_value != after_value:
            changes.append({
                "field": field,
                "before": before_value.isoformat() if hasattr(before_value, "isoformat") else before_value,
                "after": after_value.isoformat() if hasattr(after_value, "isoformat") else after_value
            })

    row = update_document(db, document_id, payload)

    person = get_personnel(db, row.personnel_id)

    if changes:

        record_business_master_change(
            db=db,
            module="Business Masters",
            action="UPDATE",
            actor_user_id=payload.actor.user_id,
            actor_name=payload.actor.name,
            actor_role=payload.actor.role,
            title=f"{payload.actor.name} updated a document for {person.full_name if person else 'a person'} in Business Masters",
            changes=changes,
            remark=payload.remark
        )

    return row


def delete_document_request(db, document_id, actor, remark):

    row = get_document(db, document_id)

    if not row:
        return False

    person = get_personnel(db, row.personnel_id)

    document_name = row.document_name
    document_type = row.document_type

    if row.file_path and os.path.exists(row.file_path):
        os.remove(row.file_path)

    deleted = delete_document(db, document_id)

    if deleted:

        record_business_master_change(
            db=db,
            module="Business Masters",
            action="DELETE",
            actor_user_id=actor.user_id,
            actor_name=actor.name,
            actor_role=actor.role,
            title=f"{actor.name} removed a {document_type} document for {person.full_name if person else 'a person'} from Business Masters",
            changes=[{"field": "document_name", "before": document_name, "after": None}],
            remark=remark
        )

    return True
