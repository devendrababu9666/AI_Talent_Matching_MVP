from fastapi import FastAPI
from app.api.routes.candidates import router as candidates_router
from app.db.database import init_db

app = FastAPI()

init_db()

print("Database initialized successfully.")


app.include_router(candidates_router)


@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/health")
def health():
    print("Health check endpoint called.")
    return {"status": "ok"}