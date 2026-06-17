from fastapi import APIRouter

from backend.schemas.customer_schema import CustomerRequestSchema

router = APIRouter()


@router.post(

"/customer-request"

)

def create_customer(

customer:CustomerRequestSchema

):

 return {

 "success":True,

 "data":customer

 }