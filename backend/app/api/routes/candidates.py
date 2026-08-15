from fastapi import APIRouter

from app.db.repositories.candidate_repository import get_candidates

router = APIRouter(
    prefix="/api/candidates",
    tags=["Candidates"],
)


@router.get("")
def list_candidates():
    candidates = get_candidates()

    return {
        "count": len(candidates),
        "candidates": candidates,
    }