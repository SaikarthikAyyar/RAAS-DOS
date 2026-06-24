# ====================================
# IMPORTS
# ====================================

import os

from sqlalchemy import create_engine

from sqlalchemy.orm import sessionmaker

from dotenv import load_dotenv

load_dotenv()


# ====================================
# DATABASE URL
# ====================================

DATABASE_URL = os.getenv(

    "DATABASE_URL"

)


# ====================================
# ENGINE
# ====================================

engine = create_engine(

    DATABASE_URL

)


# ====================================
# SESSION
# ====================================

SessionLocal = sessionmaker(

    autocommit=False,

    autoflush=False,

    bind=engine

)


# ====================================
# DATABASE DEPENDENCY
# ====================================

def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()
