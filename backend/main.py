from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from fastapi.staticfiles import StaticFiles

from backend.api.customer_api import router as customer_router

from backend.api.customer_media_api import router as customer_media_router

from backend.api.report_api import router as report_router

from backend.api.sales_survey_api import router as sales_survey_router

from backend.api.ops_selector_api import router as ops_selector_router

from backend.api.dashboard_api import router as dashboard_router

from backend.api.dewatering_api import router as dewatering_router

from backend.api.techno_commercial_quote_api import router as quote_router

from backend.api.approval_board_api import (
    router as approval_board_router
)

from backend.api.auth_api import (

    router as auth_router

)

from backend.api.allocation_api import (
    router as allocation_router
)

from backend.api.execution_api import (
    router as execution_router
)

from backend.api.enquiry_api import (
    router as enquiry_router
)

from backend.api.job_creation_api import router as job_creation_router

from backend.api.ops_approval_api import router as ops_approval_router

from backend.api.invoice_api import (
    router as invoice_router
)

from backend.database.init_db import create_tables

from fastapi.staticfiles import StaticFiles


app = FastAPI()

app.mount(

"/uploads",

StaticFiles(

directory="backend/uploads"

),

name="uploads"

)

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

    auth_router

)


app.include_router(

    customer_router

)

app.include_router(

customer_media_router

)

app.include_router(

    sales_survey_router

)

app.include_router(report_router)

app.include_router(

    ops_approval_router

)

app.include_router(

    ops_selector_router

)

app.include_router(

    dashboard_router

)

app.include_router(

    dewatering_router

)

app.include_router(

    quote_router

)

app.include_router(

    approval_board_router

)

app.include_router(

    job_creation_router

)

app.include_router(

    invoice_router

)



app.include_router(

    allocation_router

)


app.include_router(

    execution_router

)


app.include_router(

    enquiry_router

)

@app.get("/")

def home():

    return {

        "message":"RAAS DOS API"

    }


@app.get("/db-test")
def db_test():

    from backend.database.connection import engine

    return {

        "database": str(engine.url)

    }
