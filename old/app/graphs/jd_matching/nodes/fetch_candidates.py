from app.db.repositories.candidate_repository import get_candidates

# def fetch_candidates(state):
#     candidates = get_candidates()

#     return {
#         "candidates": candidates,
#         "status": "CANDIDATES_LOADED",
#     }

def fetch_candidates(state):
    print("fetching", state)
    candidates = [
        {
            "sap_id": "100001",
            "name": "Mallikarjuna Patil",
            "skills": [
                {
                    "skill": "RAG",
                    "justification": "Experience building retrieval-augmented generation solutions."
                },
                {
                    "skill": "Azure OpenAI",
                    "justification": "Hands-on experience with Azure OpenAI services."
                },
                {
                    "skill": "Python",
                    "justification": "Strong experience developing AI solutions using Python."
                },
            ],
            "experience": 13,
            "role": "AI Solution Lead",
            "location": "Bangalore",
            "status": "Available",
        },
        {
            "sap_id": "100004",
            "name": "Siddesh",
            "skills": [
                {
                    "skill": "FastAPI",
                    "justification": "Experience developing Python-based REST APIs."
                },
                {
                    "skill": "RAG",
                    "justification": "Experience implementing retrieval-augmented generation pipelines."
                },
                {
                    "skill": "LangGraph",
                    "justification": "Experience building agentic AI workflows using LangGraph."
                },
            ],
            "experience": 10,
            "role": "AI Engineer",
            "location": "Bangalore",
            "status": "In Pipeline",
        },
    ]

    return {
        "candidates": candidates,
        "status": "CANDIDATES_LOADED",
    }