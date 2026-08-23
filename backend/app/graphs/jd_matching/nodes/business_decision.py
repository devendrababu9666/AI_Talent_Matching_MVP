# def business_decision(state):
#     matches = state["matches"]

#     available = [
#         match
#         for match in matches
#         if match["status"] == "Available"
#     ]

#     return {
#         "business_decision": {
#             "supported": len(matches) > 0,
#             "recommendation": (
#                 "Prioritize available talent; "
#                 "retain in-pipeline profiles as clearly flagged."
#                 if available
#                 else "No immediately available candidates found."
#             ),
#         },
#         "status": "COMPLETED",
#     }
from app.services.llm_service import model
from app.graphs.jd_matching.nodes.prompts import build_business_decision_prompt
def business_decision(state: dict) -> dict:
    print("Generating business decision from JD and candidate insights...")

    jd_text = state.get("jd_text", "")
    primary_skills = state.get("primary_skills", [])
    matching_skills = state.get("matching_skills", [])
    matches = state.get("matches", [])

    prompt = build_business_decision_prompt(
        jd_text=jd_text,
        primary_skills=primary_skills,
        matching_skills=matching_skills,
        matches=matches,
    )

    try:
        decision = model.generate_json(prompt)

        print("Business decision generated:")
        print(decision)

        return {
            "business_decision": decision,
            "status": "COMPLETED",
        }

    except Exception as exc:
        print("Business decision generation failed:", str(exc))

        return {
            "business_decision": None,
            "errors": [
                f"Business decision generation failed: {str(exc)}"
            ],
            "status": "BUSINESS_DECISION_FAILED",
        }