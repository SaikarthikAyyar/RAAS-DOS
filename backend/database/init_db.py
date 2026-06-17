from backend.database.connection import engine

from backend.database.tables import Base

# import every model

from backend.models.customer_requests import CustomerRequest

from backend.models.jobs import Job

from backend.models.sales_surveys import SalesSurvey


def create_tables():

    Base.metadata.create_all(
        bind=engine
    )