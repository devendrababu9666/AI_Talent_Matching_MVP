from typing import Any, Optional, TypedDict


class ResumeIngestionState(TypedDict):
    # File identity
    resume_id: str
    original_filename: str
    stored_filename: str
    file_path: str
    file_type: str

    # Extracted document text
    raw_text: str

    # LLM extracted candidate data
    extracted_candidate: Optional[dict[str, Any]]

    # Validation output
    validation_errors: list[str]

    # Processing status
    processing_status: str