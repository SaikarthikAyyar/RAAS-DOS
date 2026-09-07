# ====================================
# IMPORTS
# ====================================

import os

from backend.models.execution_media import ExecutionMedia


# ====================================
# SAVE FILES
# Mirrors customer_media_service.py::save_media's shape (same upload
# flow the Sales Survey's own media picker already uses), scoped to
# an execution instead of a customer request.
# ====================================

async def save_media(
        db,
        execution_id,
        photos,
        videos,
        uploaded_by=None
):
    folder = f"backend/uploads/execution_{execution_id}"

    os.makedirs(folder, exist_ok=True)

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

        filepath = f"{folder}/{file.filename}"

        contents = await file.read()

        with open(filepath, "wb") as f:
            f.write(contents)

        db.add(
            ExecutionMedia(
                execution_id=execution_id,
                media_type=media_type,
                file_name=file.filename,
                file_path=filepath,
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
            "url": item.file_path.replace("backend", "", 1)
        }
        for item in media
    ]
