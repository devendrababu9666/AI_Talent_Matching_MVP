from fastapi import APIRouter, HTTPException

from app.db.repositories.candidate_repository import (
    get_candidates,
    get_candidate_by_sap_id,
)

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


@router.get("/{sap_id}")
def get_candidate(sap_id: str):
    candidate = get_candidate_by_sap_id(sap_id)

    if not candidate:
        raise HTTPException(
            status_code=404,
            detail=f"Candidate not found for SAP ID {sap_id}",
        )

    return candidate