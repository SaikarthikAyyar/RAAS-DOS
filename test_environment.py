from backend.database.connection import engine

from sqlalchemy import text

with engine.connect() as conn:

    print()

    print("DATABASE")

    print(

        conn.execute(

            text(

                "SELECT current_database();"

            )

        ).scalar()

    )

    print()

    print("COLUMNS")

    result = conn.execute(

        text(

            """
            SELECT column_name

            FROM information_schema.columns

            WHERE table_name='customer_requests'

            ORDER BY ordinal_position
            """
        )

    )

    for row in result:

        print(row[0])