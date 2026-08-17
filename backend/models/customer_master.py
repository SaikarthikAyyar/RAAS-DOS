# ====================================
# IMPORTS
# ====================================

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Date
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey

from sqlalchemy.sql import func

from backend.database.tables import Base


# ====================================
# CUSTOMER (BUSINESS MASTER)
# ====================================

class Customer(Base):

    __tablename__ = "customers"

    # ====================================
    # PRIMARY KEY
    # ====================================

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # ====================================
    # IDENTITY
    # ====================================

    company_name = Column(
        String(150),
        nullable=False
    )

    category = Column(
        String(50),
        default="Standard Industrial"
    )

    industry = Column(
        String(100)
    )

    region = Column(
        String(50)
    )

    gst_number = Column(
        String(50)
    )

    owner = Column(
        String(150)
    )

    # ====================================
    # OWNERSHIP / ATTRIBUTION
    # owner_user_id ("Account Owner") is reassignable; created_by_user_id
    # is set once at creation and never accepted on any update payload.
    # ====================================

    owner_user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    created_by_user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    # ====================================
    # NEXT FOLLOW-UP
    # ====================================

    next_follow_up_date = Column(
        Date
    )

    next_follow_up_owner = Column(
        String(150)
    )

    next_follow_up_note = Column(
        String(500)
    )

    # ====================================
    # TIMESTAMPS
    # ====================================

    created_at = Column(
        DateTime,
        server_default=func.now()
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now()
    )


# ====================================
# CUSTOMER CONTACT
# ====================================

class CustomerContact(Base):

    __tablename__ = "customer_contacts"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    customer_id = Column(
        Integer,
        ForeignKey("customers.id"),
        nullable=False
    )

    name = Column(
        String(150)
    )

    designation = Column(
        String(150)
    )

    email = Column(
        String(150)
    )

    phone = Column(
        String(30)
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )
