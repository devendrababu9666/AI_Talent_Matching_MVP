from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.graphs.jd_matching.graph import jd_matching_graph
from app.db.repositories.match_repository import (
    create_job_description_record,
    create_match_result_records,
    get_match_result_by_id,
)


router = APIRouter(
    prefix="/api/jd-matching",
    tags=["JD Matching"],
)


class JDMatchRequest(BaseModel):
    jd_text: str


@router.post("/match")
def match_jd(request: JDMatchRequest):
    jd_text = request.jd_text.strip()

    if not jd_text:
        raise HTTPException(
            status_code=400,
            detail="JD text is required.",
        )

    try:
        result = jd_matching_graph.invoke(
            {
                "jd_text": jd_text,
                "jd_id": None,

                "primary_skills": [],
                "experience_min": None,
                "experience_max": None,
                "role": None,
                "location": None,

                "matching_skills": [],

                "candidates": [],
                "matches": [],
                "ranked_matches": [],

                "business_decision": None,

                "errors": [],
                "status": "STARTED",
            },
            config={
                "configurable": {
                    "thread_id": "jd-12345",
                }
            },
        )

        jd_id = create_job_description_record(
            raw_text=jd_text,
            role=result.get("role"),
            location=result.get("location"),
            experience_min=result.get("experience_min"),
            experience_max=result.get("experience_max"),
        )

        matches = result.get("ranked_matches") or result.get("matches") or []

        saved_match_results = create_match_result_records(
            jd_id=jd_id,
            matches=matches,
        )

        saved_result_map = {
            item.get("sap_id"): item.get("match_result_id")
            for item in saved_match_results
        }

        for match in matches:
            match["match_result_id"] = saved_result_map.get(match.get("sap_id"))
            match["jd_id"] = jd_id

        return {
            "status": result.get("status"),
            "jd_id": jd_id,
            "jd": {
                "primary_skills": result.get("primary_skills", []),
                "matching_skills": result.get("matching_skills", []),
                "role": result.get("role"),
                "location": result.get("location"),
                "experience_min": result.get("experience_min"),
                "experience_max": result.get("experience_max"),
            },
            "matches": matches,
            "saved_match_results": saved_match_results,
            "business_decision": result.get("business_decision"),
            "errors": result.get("errors", []),
        }

    except Exception as exc:
        print(f"An error occurred during JD matching: {str(exc)}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during JD matching: {str(exc)}",
        )


@router.get("/results/{match_result_id}")
def get_match_result(match_result_id: str):
    result = get_match_result_by_id(match_result_id)

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Match result not found.",
        )

    return result