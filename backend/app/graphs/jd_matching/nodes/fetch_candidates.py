from app.db.repositories.candidate_repository import get_candidates

# def fetch_candidates(state):
#     candidates = get_candidates()

#     return {
#         "candidates": candidates,
#         "status": "CANDIDATES_LOADED",
#     }

# def fetch_candidates(state):
#     print("fetching", state)
#     candidates = [
#         {
#             "sap_id": "100001",
#             "name": "Mallikarjuna Patil",
#             "skills": [
#                 {
#                     "skill": "RAG",
#                     "justification": "Experience building retrieval-augmented generation solutions."
#                 },
#                 {
#                     "skill": "Azure OpenAI",
#                     "justification": "Hands-on experience with Azure OpenAI services."
#                 },
#                 {
#                     "skill": "Python",
#                     "justification": "Strong experience developing AI solutions using Python."
#                 },
#             ],
#             "experience": 13,
#             "role": "AI Solution Lead",
#             "location": "Bangalore",
#             "status": "Available",
#         },
#         {
#             "sap_id": "100004",
#             "name": "Siddesh",
#             "skills": [
#                 {
#                     "skill": "FastAPI",
#                     "justification": "Experience developing Python-based REST APIs."
#                 },
#                 {
#                     "skill": "RAG",
#                     "justification": "Experience implementing retrieval-augmented generation pipelines."
#                 },
#                 {
#                     "skill": "LangGraph",
#                     "justification": "Experience building agentic AI workflows using LangGraph."
#                 },
#             ],
#             "experience": 10,
#             "role": "AI Engineer",
#             "location": "Bangalore",
#             "status": "In Pipeline",
#         },
#     ]

#     return {
#         "candidates": candidates,
#         "status": "CANDIDATES_LOADED",
#     }

from app.db.repositories.candidate_repository import get_candidates


def fetch_candidates(state):
    try:
        db_candidates = get_candidates()

        candidates = []

        for candidate in db_candidates:
            skill_details = candidate.get("skill_details") or []

            if not skill_details:
                skill_details = convert_skill_names_to_details(
                    candidate.get("skills") or []
                )

            skill_names = [
                skill.get("skill")
                for skill in skill_details
                if isinstance(skill, dict) and skill.get("skill")
            ]

            candidates.append(
                {
                    "id": candidate.get("id"),
                    "sap_id": candidate.get("sap_id"),
                    "name": candidate.get("name"),
                    "role": candidate.get("role") or "Unknown",
                    "experience": candidate.get("experience_years") or 0,
                    "experience_years": candidate.get("experience_years") or 0,
                    "location": candidate.get("location") or "Unknown",
                    "status": candidate.get("status") or "Available",
                    "summary": candidate.get("summary") or "",

                    # For UI display
                    "skills": skill_names,

                    # For JD matching prompt
                    "skill_details": skill_details,
                }
            )

        print("Fetched candidates from SQLite:", candidates)

        return {
            "candidates": candidates,
            "status": "CANDIDATES_LOADED",
        }

    except Exception as exc:
        return {
            "candidates": [],
            "errors": [f"Failed to fetch candidates: {str(exc)}"],
            "status": "FAILED",
        }


def convert_skill_names_to_details(skills: list):
    skill_details = []

    for skill in skills:
        if not isinstance(skill, str):
            continue

        skill_name = skill.strip()

        if not skill_name:
            continue

        skill_details.append(
            {
                "skill": skill_name,
                "justification": "Candidate skill extracted from saved profile.",
                "experience_years": None,
                "source_resume_id": None,
            }
        )

    return skill_details