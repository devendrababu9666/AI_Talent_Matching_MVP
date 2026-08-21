import json
from uuid import uuid4

from app.db.database import get_connection


def create_job_description_record(
    raw_text: str,
    role: str | None,
    location: str | None,
    experience_min: int | None,
    experience_max: int | None,
):
    jd_id = str(uuid4())

    with get_connection() as connection:
        cursor = connection.cursor()

        cursor.execute(
            """
            INSERT INTO job_descriptions (
                id,
                raw_text,
                role,
                location,
                experience_min,
                experience_max
            )
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                jd_id,
                raw_text,
                role,
                location,
                experience_min,
                experience_max,
            ),
        )

        connection.commit()

    return jd_id


def create_match_result_records(jd_id: str, matches: list[dict]):
    saved_results = []

    with get_connection() as connection:
        cursor = connection.cursor()

        for match in matches:
            match_result_id = str(uuid4())

            assessment_insights = match.get("assessment_insights") or {}

            reasoning = (
                match.get("recommendation")
                or assessment_insights.get("recommendation")
                or ""
            )

            score = int(match.get("match_score") or 0)

            cursor.execute(
                """
                INSERT INTO match_results (
                    id,
                    jd_id,
                    candidate_id,
                    sap_id,
                    candidate_name,
                    score,
                    rank,
                    reasoning,
                    matching_summary,
                    matched_skills,
                    unmatched_jd_skills,
                    additional_candidate_skills,
                    assessment_insights
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    match_result_id,
                    jd_id,
                    match.get("candidate_id"),
                    match.get("sap_id"),
                    match.get("name"),
                    score,
                    match.get("rank"),
                    reasoning,
                    json.dumps(match.get("matching_summary") or {}),
                    json.dumps(match.get("matched_skills") or []),
                    json.dumps(match.get("unmatched_jd_skills") or []),
                    json.dumps(match.get("additional_candidate_skills") or []),
                    json.dumps(assessment_insights),
                ),
            )

            saved_results.append(
                {
                    "match_result_id": match_result_id,
                    "candidate_id": match.get("candidate_id"),
                    "sap_id": match.get("sap_id"),
                    "score": score,
                    "rank": match.get("rank"),
                }
            )

        connection.commit()

    return saved_results


def get_match_results_by_jd_id(jd_id: str):
    with get_connection() as connection:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                id,
                jd_id,
                candidate_id,
                sap_id,
                candidate_name,
                score,
                rank,
                reasoning,
                matching_summary,
                matched_skills,
                unmatched_jd_skills,
                additional_candidate_skills,
                assessment_insights,
                created_at
            FROM match_results
            WHERE jd_id = ?
            ORDER BY rank ASC, score DESC
            """,
            (jd_id,),
        )

        rows = cursor.fetchall()

    results = []

    for row in rows:
        item = dict(row)

        item["matching_summary"] = parse_json(item.get("matching_summary"))
        item["matched_skills"] = parse_json(item.get("matched_skills"))
        item["unmatched_jd_skills"] = parse_json(item.get("unmatched_jd_skills"))
        item["additional_candidate_skills"] = parse_json(
            item.get("additional_candidate_skills")
        )
        item["assessment_insights"] = parse_json(item.get("assessment_insights"))

        results.append(item)

    return results


def parse_json(value: str | None):
    if not value:
        return None

    try:
        return json.loads(value)
    except Exception:
        return None