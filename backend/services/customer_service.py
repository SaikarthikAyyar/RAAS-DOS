from backend.repositories.customer_repository import create_customer


def create_customer_request(

        db,

        payload

):

    return create_customer(

        db,

        payload

    )