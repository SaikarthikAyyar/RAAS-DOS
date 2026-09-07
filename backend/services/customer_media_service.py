# ====================================
# IMPORTS
# ====================================

import mimetypes

from backend.models.customer_media import CustomerMedia

from backend.services.storage_client import upload_object


# ====================================
# SAVE FILES
# Stored in Supabase Storage (backend/services/storage_client.py)
# rather than local disk, which Render wipes on every redeploy.
# ====================================

async def save_media(db, customer_request_id, photos, videos, layouts):

    folder = f"customer_{customer_request_id}"

    await process_files(db, customer_request_id, photos, "photo", folder)
    await process_files(db, customer_request_id, videos, "video", folder)
    await process_files(db, customer_request_id, layouts, "layout", folder)

    db.commit()

    return {"message": "uploaded"}


# ====================================
# PROCESS FILES
# ====================================

async def process_files(db, customer_request_id, files, media_type, folder):

    for file in files:

        key = f"{folder}/{file.filename}"

        contents = await file.read()

        content_type = file.content_type or mimetypes.guess_type(file.filename)[0] or "application/octet-stream"

        upload_object(key, contents, content_type)

        db.add(
            CustomerMedia(
                customer_request_id=customer_request_id,
                media_type=media_type,
                file_name=file.filename,
                file_path=key
            )
        )


# ====================================
# GET MEDIA
# ====================================

def get_media(db, customer_request_id):

    media = (
        db.query(CustomerMedia)
        .filter(CustomerMedia.customer_request_id == customer_request_id)
        .all()
    )

    return [
        {
            "id": item.id,
            "media_type": item.media_type,
            "file_name": item.file_name,
            "url": f"/uploads/{item.file_path}"
        }
        for item in media
    ]
