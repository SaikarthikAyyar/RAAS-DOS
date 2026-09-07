# ====================================
# IMPORTS
# ====================================

import mimetypes

from fastapi import HTTPException

from backend.models.execution_media import ExecutionMedia

from backend.services.storage_client import upload_object, delete_object


# ====================================
# SAVE FILES
# Mirrors customer_media_service.py::save_media's shape (same upload
# flow the Sales Survey's own media picker already uses), scoped to
# an execution instead of a customer request. Stored in Supabase
# Storage (backend/services/storage_client.py) rather than local disk,
# which Render wipes on every redeploy.
# ====================================

async def save_media(
        db,
        execution_id,
        photos,
        videos,
        uploaded_by=None
):
    folder = f"execution_{execution_id}"

    await _process_files(db, execution_id, photos, "photo", folder, uploaded_by)

    await _process_files(db, execution_id, videos, "video", folder, uploaded_by)

    db.commit()

    return {"message": "uploaded"}


async def _process_files(
        db,
        execution_id,
        files,
        media_type,
        folder,
        uploaded_by
):
    for file in files:

        key = f"{folder}/{file.filename}"

        contents = await file.read()

        content_type = file.content_type or mimetypes.guess_type(file.filename)[0] or "application/octet-stream"

        upload_object(key, contents, content_type)

        db.add(
            ExecutionMedia(
                execution_id=execution_id,
                media_type=media_type,
                file_name=file.filename,
                file_path=key,
                uploaded_by=uploaded_by
            )
        )


# ====================================
# GET MEDIA
# ====================================

def get_media(
        db,
        execution_id
):
    media = (
        db.query(ExecutionMedia)
        .filter(ExecutionMedia.execution_id == execution_id)
        .order_by(ExecutionMedia.id)
        .all()
    )

    return [
        {
            "id": item.id,
            "media_type": item.media_type,
            "file_name": item.file_name,
            "uploaded_by": item.uploaded_by,
            "url": f"/uploads/{item.file_path}"
        }
        for item in media
    ]


# ====================================
# DELETE MEDIA
# Lets the uploading side remove a file it no longer wants shown - the
# real object is deleted from Supabase Storage first, then the DB row,
# so a failed/partial delete never leaves a dangling row pointing at
# nothing (the reverse order - delete row, then storage - risks the
# opposite failure mode: a real file nobody can ever reach again).
# ====================================

def delete_media(db, media_id):

    item = db.query(ExecutionMedia).filter(ExecutionMedia.id == media_id).first()

    if item is None:
        raise HTTPException(status_code=404, detail="Media not found.")

    delete_object(item.file_path)

    db.delete(item)
    db.commit()

    return {"message": "deleted"}
