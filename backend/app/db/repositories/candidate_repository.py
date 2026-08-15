from app.db.database import get_connection


def get_candidates():
    with get_connection() as connection:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                id,
                sap_id,
                name,
                role,
                experience_years,
                location,
                status,
                created_at,
                updated_at
            FROM candidates
            ORDER BY created_at DESC
            """
        )

        rows = cursor.fetchall()

        return [dict(row) for row in rows]