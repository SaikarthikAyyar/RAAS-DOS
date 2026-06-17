from fastapi import APIRouter

router = APIRouter()


@router.get("/customer")

def customer():

    return {

        "message":

        "customer router active"

    }