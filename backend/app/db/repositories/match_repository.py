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
            candidate_id = match.get("candidate_id") or match.get("id")

            skill_analysis = match.get("skill_analysis") or {}

            matching_summary = (
                match.get("matching_summary")
                or skill_analysis.get("matching_summary")
                or {}
            )

            matched_skills = (
                match.get("matched_skills")
                or skill_analysis.get("matched_skills")
                or []
            )

            unmatched_jd_skills = (
                match.get("unmatched_jd_skills")
                or skill_analysis.get("unmatched_jd_skills")
                or []
            )

            additional_candidate_skills = (
                match.get("additional_candidate_skills")
                or skill_analysis.get("additional_candidate_skills")
                or []
            )

            assessment_insights = (
                match.get("assessment_insights")
                or skill_analysis.get("assessment_insights")
                or {}
            )

            reasoning = (
                match.get("reasoning")
                or match.get("recommendation")
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
                    candidate_id,
                    match.get("sap_id"),
                    match.get("name"),
                    score,
                    match.get("rank"),
                    reasoning,
                    json.dumps(matching_summary),
                    json.dumps(matched_skills),
                    json.dumps(unmatched_jd_skills),
                    json.dumps(additional_candidate_skills),
                    json.dumps(assessment_insights),
                ),
            )

            # saved_results.append(
            #     {
            #         "match_result_id": match_result_id,
            #         "candidate_id": match.get("candidate_id"),
            #         "sap_id": match.get("sap_id"),
            #         "score": score,
            #         "rank": match.get("rank"),
            #     }
            # )
            saved_results.append(
                {
                    "match_result_id": match_result_id,
                    "jd_id": jd_id,
                    "candidate_id": candidate_id,
                    "sap_id": match.get("sap_id"),
                    "candidate_name": match.get("name"),
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
        results.append(format_match_result_row(row))

    return results


def get_match_result_by_id(match_result_id: str):
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
            WHERE id = ?
            """,
            (match_result_id,),
        )

        row = cursor.fetchone()

    if not row:
        return None

    return format_match_result_row(row)


def format_match_result_row(row):
    item = dict(row)

    item["matching_summary"] = parse_json(item.get("matching_summary")) or {}
    item["matched_skills"] = parse_json(item.get("matched_skills")) or []
    item["unmatched_jd_skills"] = parse_json(item.get("unmatched_jd_skills")) or []
    item["additional_candidate_skills"] = parse_json(
        item.get("additional_candidate_skills")
    ) or []
    item["assessment_insights"] = parse_json(item.get("assessment_insights")) or {}

    return item


def parse_json(value: str | None):
    if not value:
        return None

    try:
        return json.loads(value)
    except Exception:
        return None

def get_match_summary_by_jd_and_sap_id(jd_id: str, sap_id: str):
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
              AND sap_id = ?
            LIMIT 1
            """,
            (jd_id, sap_id),
        )

        row = cursor.fetchone()

    if not row:
        return None

    return format_match_result_row(row)