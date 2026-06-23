# ====================================
# IMPORTS
# ====================================

import os

from backend.models.customer_media import CustomerMedia


# ====================================
# SAVE FILES
# ====================================

async def save_media(

db,

customer_request_id,

photos,

videos,

layouts

):

    folder = (

        f"backend/uploads/customer_{customer_request_id}"

    )

    os.makedirs(

        folder,

        exist_ok=True

    )


    await process_files(

        db,

        customer_request_id,

        photos,

        "photo",

        folder

    )


    await process_files(

        db,

        customer_request_id,

        videos,

        "video",

        folder

    )


    await process_files(

        db,

        customer_request_id,

        layouts,

        "layout",

        folder

    )


    db.commit()


    return {

        "message":"uploaded"

    }


# ====================================
# PROCESS FILES
# ====================================

async def process_files(

db,

customer_request_id,

files,

media_type,

folder

):


    for file in files:


        filepath=(

            f"{folder}/{file.filename}"

        )


        contents=await file.read()


        with open(

            filepath,

            "wb"

        ) as f:

            f.write(

                contents

            )


        media=CustomerMedia(

            customer_request_id=

            customer_request_id,

            media_type=

            media_type,

            file_name=

            file.filename,

            file_path=

            filepath

        )


        db.add(

            media

        )

# ====================================
# GET MEDIA
# ====================================

def get_media(

db,

customer_request_id

):


    media= db.query(

        CustomerMedia

    ).filter(

        CustomerMedia.customer_request_id

        ==

        customer_request_id

    ).all()


    output=[]


    for item in media:


        output.append(

            {

                "id":item.id,

                "media_type":item.media_type,

                "file_name":item.file_name,

                "url":(

                    item.file_path

                    .replace(

                        "backend",

                        ""

                    )

                )

            }

        )


    return output