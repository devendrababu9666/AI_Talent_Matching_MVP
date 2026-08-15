from app.services.llm_service import model
from app.graphs.jd_matching.nodes.prompts import compare_skills


def match_candidates(state):
    matches = []

    jd_skills = state["extracted_skills"]

    for candidate in state["candidates"]:

        candidate_skills = candidate.get("skills", [])

        prompt = compare_skills(
            candidate_skills=candidate_skills,
            jd_skills=jd_skills,
        )

        result = model.generate_json(prompt)

        assessment = result.get("assessment_insights", {})

        matches.append({
            "sap_id": candidate["sap_id"],
            "name": candidate["name"],
            "skills": candidate_skills,
            "status": candidate.get("status"),

            "match_score": int(
                assessment.get("overall_fit_score", 0)
            ),

            "reasoning": assessment.get(
                "recommendation",
                ""
            ),

            # Keep detailed comparison available
            "skill_analysis": result,
        })

    return {
        "matches": matches,
        "status": "MATCHING_COMPLETED",
    }

# from app.services.llm_service import model

# def match_candidates(state):
#     matches = []

#     for candidate in state["candidates"]:
#         result = model.generate_json(prompt=f"""
#             You are a job matching expert. Given the following job description and candidate information, evaluate how well the candidate matches the job description. Provide a match score between 0 and 100, and provide reasoning for your score.
#             jd={
#                 "skills": state["extracted_skills"],
#                 "experience_min": state["experience_min"],
#                 "experience_max": state["experience_max"],
#                 "role": state["role"],
#                 "location": state["location"],
#             },
#             candidate=candidate,"""
#         )

#         matches.append({
#             "sap_id": candidate["sap_id"],
#             "name": candidate["name"],
#             "skills": candidate.get("skills", []),
#             "status": candidate.get("status"),
#             "match_score": result["match_score"],
#             "reasoning": result["reasoning"],
#         })

#     return {
#         "matches": matches,
#         "status": "MATCHING_COMPLETED",
#     }