from uuid import uuid4

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
                summary,
                created_at,
                updated_at
            FROM candidates
            ORDER BY created_at DESC
            """
        )

        rows = cursor.fetchall()

    candidates = []

    for row in rows:
        candidate = dict(row)
        candidate["skills"] = get_candidate_skills(candidate["id"])
        candidates.append(candidate)

    return candidates


def get_candidate_by_sap_id(sap_id: str):
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
                summary,
                created_at,
                updated_at
            FROM candidates
            WHERE sap_id = ?
            """,
            (sap_id,),
        )

        row = cursor.fetchone()

    if not row:
        return None

    candidate = dict(row)
    candidate["skills"] = get_candidate_skills(candidate["id"])

    return candidate


def create_or_update_candidate(candidate: dict):
    sap_id = candidate.get("sap_id")

    if not sap_id:
        return None

    existing_candidate = get_candidate_by_sap_id(sap_id)

    if existing_candidate:
        candidate_id = existing_candidate["id"]

        with get_connection() as connection:
            cursor = connection.cursor()

            cursor.execute(
                """
                UPDATE candidates
                SET
                    name = ?,
                    role = ?,
                    experience_years = ?,
                    location = ?,
                    summary = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
                """,
                (
                    candidate.get("name"),
                    candidate.get("role"),
                    candidate.get("experience_years"),
                    candidate.get("location"),
                    candidate.get("summary"),
                    candidate_id,
                ),
            )

            connection.commit()

        replace_candidate_skills(candidate_id, candidate.get("skills", []))

        return candidate_id

    candidate_id = str(uuid4())

    with get_connection() as connection:
        cursor = connection.cursor()

        cursor.execute(
            """
            INSERT INTO candidates (
                id,
                sap_id,
                name,
                role,
                experience_years,
                location,
                status,
                summary
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                candidate_id,
                candidate.get("sap_id"),
                candidate.get("name") or "Unknown",
                candidate.get("role"),
                candidate.get("experience_years"),
                candidate.get("location") or "Unknown",
                "Available",
                candidate.get("summary"),
            ),
        )

        connection.commit()

    replace_candidate_skills(candidate_id, candidate.get("skills", []))

    return candidate_id


def create_resume_record(
    resume_id: str,
    candidate_id: str | None,
    original_filename: str,
    stored_filename: str,
    file_path: str,
    file_type: str,
    processing_status: str,
    raw_text: str,
):
    with get_connection() as connection:
        cursor = connection.cursor()

        cursor.execute(
            """
            INSERT INTO resumes (
                id,
                candidate_id,
                original_filename,
                stored_filename,
                file_path,
                file_type,
                processing_status,
                raw_text
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                resume_id,
                candidate_id,
                original_filename,
                stored_filename,
                file_path,
                file_type,
                processing_status,
                raw_text,
            ),
        )

        connection.commit()


def replace_candidate_skills(candidate_id: str, skills: list[str]):
    with get_connection() as connection:
        cursor = connection.cursor()

        cursor.execute(
            """
            DELETE FROM candidate_skills
            WHERE candidate_id = ?
            """,
            (candidate_id,),
        )

        for skill_name in skills:
            if not isinstance(skill_name, str):
                continue

            skill_name = skill_name.strip()

            if not skill_name:
                continue

            skill_id = get_or_create_skill_with_cursor(cursor, skill_name)

            cursor.execute(
                """
                INSERT OR IGNORE INTO candidate_skills (
                    candidate_id,
                    skill_id
                )
                VALUES (?, ?)
                """,
                (candidate_id, skill_id),
            )

        connection.commit()


def get_or_create_skill_with_cursor(cursor, skill_name: str):
    cursor.execute(
        """
        SELECT
            id,
            name
        FROM skills
        WHERE LOWER(name) = LOWER(?)
        """,
        (skill_name,),
    )

    row = cursor.fetchone()

    if row:
        return row["id"]

    skill_id = str(uuid4())

    cursor.execute(
        """
        INSERT INTO skills (
            id,
            name
        )
        VALUES (?, ?)
        """,
        (skill_id, skill_name),
    )

    return skill_id


def get_candidate_skills(candidate_id: str):
    with get_connection() as connection:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                skills.name
            FROM skills
            INNER JOIN candidate_skills
                ON candidate_skills.skill_id = skills.id
            WHERE candidate_skills.candidate_id = ?
            ORDER BY skills.name
            """,
            (candidate_id,),
        )

        rows = cursor.fetchall()

    return [row["name"] for row in rows]