from fastapi import FastAPI
from app.api.routes.candidates import router as candidates_router
from app.db.database import init_db
from app.graphs.jd_matching.graph import jd_matching_graph
app = FastAPI()

init_db()

print("Database initialized successfully.")

config = {
    "configurable": {
        "thread_id": "jd-12345"
    }
}

result = jd_matching_graph.invoke(
    {
        "jd_text": "jd",
        "jd_id": None,
        "extracted_skills": [],
        "experience_min": None,
        "experience_max": None,
        "role": None,
        "location": None,
        "candidates": [],
        "matches": [],
        "business_decision": None,
        "errors": [],
        "status": "STARTED",
    },
    config=config,
)


app.include_router(candidates_router)


@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/health")
def health():
    print("Health check endpoint called.")
    return {"status": "ok"}