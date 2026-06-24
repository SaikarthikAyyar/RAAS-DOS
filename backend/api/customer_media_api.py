from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import Depends

from typing import List

from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.services.customer_media_service import save_media

from backend.services.customer_media_service import get_media


router=APIRouter()


@router.post(
"/customer-request/{customer_id}/media"
)

async def upload_media(


customer_id:int,
photos: List[UploadFile] = File(default=[]),

videos: List[UploadFile] = File(default=[]),

layouts: List[UploadFile] = File(default=[]),

db:Session=Depends(get_db)

):
    
    print(

        "MEDIA API CALLED"

    )


    return await save_media(

    db,

    customer_id,

    photos,

    videos,

    layouts

    )


@router.get(

"/customer-request/{customer_id}/media"

)

def media(

customer_id:int,

db:Session=Depends(

get_db

)

):


    return get_media(

        db,

        customer_id

    )

