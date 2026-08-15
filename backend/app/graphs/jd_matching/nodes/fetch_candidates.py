from app.db.repositories.candidate_repository import get_candidates


def fetch_candidates(state):
    candidates = get_candidates()

    return {
        "candidates": candidates,
        "status": "CANDIDATES_LOADED",
    }