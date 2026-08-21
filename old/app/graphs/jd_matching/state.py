from typing import TypedDict, Optional

from typing import TypedDict, Optional

class Candidate(TypedDict):
    id: str
    name: str
    skills: list[dict]
    experience: int
    role: str
    location: str

class JDMatchingState(TypedDict):
    jd_text: str
    jd_id: Optional[str]

    # For frontend
    primary_skills: list[str]
    experience_min: Optional[int]
    experience_max: Optional[int]
    role: Optional[str]
    location: Optional[str]

    # For matching
    matching_skills: list[dict]

    candidates: list[Candidate]
    matches: list[dict]

    business_decision: Optional[dict]

    errors: list[str]
    status: str