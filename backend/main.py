from fastapi import FastAPI

from backend.api.customer_api import router as customer_router

from backend.database.init_db import create_tables

app = FastAPI()

create_tables()

app.include_router(

    customer_router

)


@app.get("/")

def home():

    return {

        "message":

        "RAAS DOS API"

    }