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
        candidate["skill_details"] = get_candidate_skill_details(candidate["id"])

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
    candidate["skill_details"] = get_candidate_skill_details(candidate["id"])

    return candidate


def create_or_update_candidate(
    candidate: dict,
    source_resume_id: str | None = None,
):
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
                    candidate.get("name") or "Unknown",
                    candidate.get("role"),
                    candidate.get("experience_years"),
                    candidate.get("location") or "Unknown",
                    candidate.get("summary"),
                    candidate_id,
                ),
            )

            connection.commit()

        replace_candidate_skills(
            candidate_id=candidate_id,
            skills=candidate.get("skills", []),
            source_resume_id=source_resume_id,
        )

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
                candidate.get("status") or "Available",
                candidate.get("summary"),
            ),
        )

        connection.commit()

    replace_candidate_skills(
        candidate_id=candidate_id,
        skills=candidate.get("skills", []),
        source_resume_id=source_resume_id,
    )

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


def update_resume_candidate_and_status(
    resume_id: str,
    candidate_id: str | None,
    processing_status: str,
):
    with get_connection() as connection:
        cursor = connection.cursor()

        cursor.execute(
            """
            UPDATE resumes
            SET
                candidate_id = ?,
                processing_status = ?
            WHERE id = ?
            """,
            (
                candidate_id,
                processing_status,
                resume_id,
            ),
        )

        connection.commit()


def replace_candidate_skills(
    candidate_id: str,
    skills: list,
    source_resume_id: str | None = None,
):
    normalized_skills = normalize_skill_records(skills)

    with get_connection() as connection:
        cursor = connection.cursor()

        cursor.execute(
            """
            DELETE FROM candidate_skills
            WHERE candidate_id = ?
            """,
            (candidate_id,),
        )

        for skill_record in normalized_skills:
            skill_name = skill_record.get("skill")

            if not skill_name:
                continue

            skill_id = get_or_create_skill_with_cursor(cursor, skill_name)

            cursor.execute(
                """
                INSERT OR REPLACE INTO candidate_skills (
                    candidate_id,
                    skill_id,
                    justification,
                    experience_years,
                    source_resume_id
                )
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    candidate_id,
                    skill_id,
                    skill_record.get("justification"),
                    skill_record.get("experience_years"),
                    source_resume_id,
                ),
            )

        connection.commit()


def normalize_skill_records(skills: list):
    normalized = []

    for item in skills:
        if isinstance(item, str):
            skill_name = item.strip()

            if not skill_name:
                continue

            normalized.append(
                {
                    "skill": skill_name,
                    "justification": "Candidate skill extracted from saved profile.",
                    "experience_years": None,
                }
            )

        elif isinstance(item, dict):
            skill_name = (
                item.get("skill")
                or item.get("name")
                or item.get("skill_name")
            )

            if not skill_name:
                continue

            skill_name = str(skill_name).strip()

            if not skill_name:
                continue

            justification = item.get("justification")

            if not justification:
                justification = "Candidate skill extracted from saved profile."

            experience_years = item.get("experience_years")

            if experience_years == "Unknown":
                experience_years = None

            if isinstance(experience_years, str):
                try:
                    experience_years = float(experience_years)
                except ValueError:
                    experience_years = None

            if isinstance(experience_years, float):
                experience_years = round(experience_years, 1)

            if not isinstance(experience_years, (int, float)):
                experience_years = None

            normalized.append(
                {
                    "skill": skill_name,
                    "justification": str(justification).strip(),
                    "experience_years": experience_years,
                }
            )

    unique = {}

    for item in normalized:
        key = item["skill"].lower()

        if key not in unique:
            unique[key] = item

    return list(unique.values())


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


def get_candidate_skill_details(candidate_id: str):
    with get_connection() as connection:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                skills.name AS skill,
                candidate_skills.justification,
                candidate_skills.experience_years,
                candidate_skills.source_resume_id
            FROM skills
            INNER JOIN candidate_skills
                ON candidate_skills.skill_id = skills.id
            WHERE candidate_skills.candidate_id = ?
            ORDER BY skills.name
            """,
            (candidate_id,),
        )

        rows = cursor.fetchall()

    skill_details = []

    for row in rows:
        item = dict(row)

        if not item.get("justification"):
            item["justification"] = "Candidate skill extracted from saved profile."

        skill_details.append(item)

    return skill_details