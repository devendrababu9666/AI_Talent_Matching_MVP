from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.jd_matching import router as jd_matching_router
from app.api.routes.candidates import router as candidates_router
from app.api.routes.resumes import router as resumes_router
from app.db.database import init_db

app = FastAPI(
    title="AI Talent Matching API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

init_db()

print("Database initialized successfully.")

app.include_router(candidates_router)
app.include_router(resumes_router)
app.include_router(jd_matching_router)

config = {
    "configurable": {
        "thread_id": "jd-12345"
    }
}

# result = jd_matching_graph.invoke(
#     {
#         "jd_text": "jd",
#         "jd_id": None,
#         "extracted_skills": [],
#         "experience_min": None,
#         "experience_max": None,
#         "role": None,
#         "location": None,
#         "candidates": [],
#         "matches": [],
#         "business_decision": None,
#         "errors": [],
#         "status": "STARTED",
#     },
#     config=config,
# )


# app.include_router(candidates_router)


