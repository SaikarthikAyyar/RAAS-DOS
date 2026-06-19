import logging

logger = logging.getLogger(__name__)

from backend.models.customer_requests import CustomerRequest

from sqlalchemy import text

def create_customer(db, payload):

    logger.warning(f"PAYLOAD = {payload}")

    logger.warning(
         f"DATABASE = {db.execute(text('SELECT current_database();')).scalar()}"
    )

    logger.warning(
         f"COLUMNS = {
            db.execute(
               text(
                   '''
                   SELECT column_name
                   FROM information_schema.columns
                   WHERE table_name='customer_requests'
                   '''
                )
            ).fetchall()
       }"
    )
    customer = CustomerRequest(
        company_name=payload.company_name,
        plant_site_location=payload.plant_site_location,
        
        status="REQUESTED"
    )

    db.add(customer)

    db.commit()

    db.refresh(customer)

    return customer