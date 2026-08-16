from app.services.llm_service import model
from app.graphs.jd_matching.nodes.prompts import compare_skills

def match_candidates(state):
    print("matching", state)
    matches = []

    jd_skills = state["matching_skills"]

    for candidate in state["candidates"]:

        candidate_skills = candidate.get("skills", [])

        prompt = compare_skills(
            candidate_skills=candidate_skills,
            jd_skills=jd_skills,
        )

        result = model.generate_json(prompt)

        assessment = result.get("assessment_insights", {})
        summary = result.get("matching_summary", {})

        matches.append({
            "sap_id": candidate["sap_id"],
            "name": candidate["name"],
            "skills": candidate_skills,
            "status": candidate.get("status"),

            "match_score": int(
                assessment.get("overall_fit_score", 0)
            ),

            "match_percentage": summary.get(
                "match_percentage", 0
            ),

            "reasoning": assessment.get(
                "recommendation", ""
            ),

            "skill_analysis": result,
        })

    return {
        "matches": matches,
        "status": "MATCHING_COMPLETED",
    }
