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

# SQLAlchemy 2.1+ defaults plain postgresql:// to psycopg (v3); we ship psycopg2.
if DATABASE_URL and DATABASE_URL.startswith(("postgresql://", "postgres://")):
    DATABASE_URL = "postgresql+psycopg2://" + DATABASE_URL.split("://", 1)[1]

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
