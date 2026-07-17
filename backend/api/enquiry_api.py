from fastapi import APIRouter

router = APIRouter(
    prefix="/enquiries",
    tags=["Enquiries"]
)


@router.get("/")
def get_enquiries():
    return {
        "message": "Enquiry API running"
    }


@router.get("/{enquiry_id}")
def get_enquiry(enquiry_id: int):
    return {
        "enquiry_id": enquiry_id
    }


@router.post("/")
def create_enquiry():
    return {
        "message": "Create enquiry endpoint"
    }


@router.put("/{enquiry_id}")
def update_enquiry(enquiry_id: int):
    return {
        "message": "Update enquiry",
        "enquiry_id": enquiry_id
    }