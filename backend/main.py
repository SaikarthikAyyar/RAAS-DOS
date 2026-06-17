from fastapi import FastAPI

from backend.api.customer_api import router as customer_router

app = FastAPI()

app.include_router(

 customer_router

)


@app.get("/")

def home():

 return {

 "message":

 "RAAS DOS API"

 }