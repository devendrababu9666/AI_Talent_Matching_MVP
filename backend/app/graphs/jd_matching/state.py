from typing import TypedDict, Optional


class JDMatchingState(TypedDict):
    # Input
    jd_text: str
    jd_id: Optional[str]

    # Extracted JD information
    extracted_skills: list[str]
    experience_min: Optional[int]
    experience_max: Optional[int]
    role: Optional[str]
    location: Optional[str]

    # Candidate data loaded from DB
    candidates: list[dict]

    # Matching output
    matches: list[dict]

    # Final output
    business_decision: Optional[dict]

    # Workflow control/debugging
    errors: list[str]
    status: str