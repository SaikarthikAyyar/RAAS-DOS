from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from backend.api.customer_api import router as customer_router

from backend.api.sales_survey_api import router as sales_survey_router

from backend.api.ops_selector_api import router as ops_selector_router

from backend.api.dewatering_api import router as dewatering_router

from backend.api.quote_api import router as quote_router

from backend.database.init_db import create_tables


app = FastAPI()


# ====================================
# CORS
# ====================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=[

        "*"

    ],

    allow_credentials=False,

    allow_methods=["*"],

    allow_headers=["*"]

)


create_tables()


app.include_router(

    customer_router

)

app.include_router(

    sales_survey_router

)

app.include_router(

    ops_selector_router

)

app.include_router(

    dewatering_router

)

app.include_router(

    quote_router

)


@app.get("/")

def home():

    return {

        "message":"RAAS DOS API"

    }
