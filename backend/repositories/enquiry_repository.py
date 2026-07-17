from sqlalchemy.orm import Session

from backend.models.enquiry import Enquiry


class EnquiryRepository:

    @staticmethod
    def create(db: Session, enquiry: Enquiry):
        db.add(enquiry)
        db.commit()
        db.refresh(enquiry)
        return enquiry

    @staticmethod
    def get(db: Session, enquiry_id: int):
        return (
            db.query(Enquiry)
            .filter(Enquiry.id == enquiry_id)
            .first()
        )

    @staticmethod
    def get_all(db: Session):
        return (
            db.query(Enquiry)
            .order_by(Enquiry.created_at.desc())
            .all()
        )
    
    @staticmethod
    def get_sales_pending(db: Session):
        return (
            db.query(Enquiry)
            .filter(
                Enquiry.receiver_role == "SALES",
                Enquiry.requested_task == "SALES_SURVEY",
                Enquiry.completed == False
            )
            .order_by(Enquiry.created_at.desc())
            .all()
        )
    
        # ====================================
    # RECEIVED ENQUIRIES
    # ====================================

    @staticmethod
    def get_received_enquiries(

        db: Session,

        role: str

    ):

        return (

            db.query(

                Enquiry

            )

            .filter(

                Enquiry.receiver_role == role,

                Enquiry.completed == False

            )

            .order_by(

                Enquiry.created_at.desc()

            )

            .all()

        )


    # ====================================
    # SENT ENQUIRIES
    # ====================================

    @staticmethod
    def get_sent_enquiries(

        db: Session,

        role: str

    ):

        return (

            db.query(

                Enquiry

            )

            .filter(

                Enquiry.sender_role == role

            )

            .order_by(

                Enquiry.created_at.desc()

            )

            .all()

        )

    @staticmethod
    def update(db: Session, enquiry: Enquiry):
        db.commit()
        db.refresh(enquiry)
        return enquiry
    
