import re
from typing import Any

from app.services.llm_service import model


def extract_candidate_metadata(state: dict[str, Any]) -> dict[str, Any]:
    raw_text = state.get("raw_text", "")
    original_filename = state.get("original_filename", "")

    prompt = build_candidate_extraction_prompt(
        raw_text=raw_text,
        original_filename=original_filename,
    )

    try:
        extracted_candidate = model.generate_json(prompt)

        return {
            "extracted_candidate": normalize_candidate(extracted_candidate),
            "processing_status": "CANDIDATE_EXTRACTED",
        }

    except Exception as exc:
        return {
            "extracted_candidate": None,
            "validation_errors": [
                f"Candidate metadata extraction failed: {str(exc)}"
            ],
            "processing_status": "EXTRACTION_FAILED",
        }


def validate_candidate_metadata(state: dict[str, Any]) -> dict[str, Any]:
    candidate = state.get("extracted_candidate")
    errors = []

    if not candidate:
        return {
            "validation_errors": ["No candidate data was extracted."],
            "processing_status": "REQUIRES_REVIEW",
        }

    sap_id = candidate.get("sap_id")
    name = candidate.get("name")
    role = candidate.get("role")
    experience_years = candidate.get("experience_years")
    skills = candidate.get("skills")

    if not sap_id:
        errors.append("SAP ID could not be identified.")
    elif not re.fullmatch(r"\d{6,10}", str(sap_id)):
        errors.append("SAP ID must be a valid numeric employee ID.")

    if not name or name == "Unknown":
        errors.append("Candidate name could not be identified.")

    if not role or role == "Unknown":
        errors.append("Role could not be identified.")

    if experience_years is not None and not isinstance(experience_years, int):
        errors.append("Experience must be an integer or null.")

    if not isinstance(skills, list):
        errors.append("Skills must be returned as a list.")
    elif len(skills) == 0:
        errors.append("No skills could be extracted.")

    if errors:
        return {
            "validation_errors": errors,
            "processing_status": "REQUIRES_REVIEW",
        }

    return {
        "validation_errors": [],
        "processing_status": "VALIDATED",
    }


def build_candidate_extraction_prompt(
    raw_text: str,
    original_filename: str,
) -> str:
    return f"""
You are an expert resume information extraction system.

Extract structured candidate information from the resume text below.

Return ONLY valid JSON.
Do not return markdown.
Do not wrap the response in ```json or ```.

Use exactly this JSON structure:

{{
  "sap_id": null,
  "name": "string",
  "role": "string",
  "experience_years": null,
  "location": "string",
  "skills": ["string"],
  "summary": "string"
}}

Extraction rules:

1. sap_id
- Extract SAP ID only if clearly present.
- SAP ID is usually a numeric employee ID.
- SAP ID can be 6 to 10 digits.
- First check filename.
- Then check resume text.
- Do not invent SAP ID.
- If not found, return null.

2. name
- Extract candidate name from resume text.
- If not clear, infer carefully from filename.
- If still unknown, return "Unknown".

3. role
- Extract current role or most likely target role.
- Examples: AI Architect, AI Engineer, GenAI Engineer, Software Engineer, Senior Software Engineer, Solution Architect.
- If not found, return "Unknown".

4. experience_years
- Extract total years of experience as an integer.
- If resume says "13 years", return 13.
- If resume says "8 months", return 1.
- If resume says less than 1 year, return 1.
- If unclear, return null.

5. location
- Extract current or preferred location if clearly available.
- Examples: Bangalore, Hyderabad, Chennai, Noida, Pune, Mumbai, Delhi, Gurgaon.
- If unavailable, return "Unknown".
- Location is optional. Do not invent location.

6. skills
- Extract important technical and professional skills.
- Return a clean list of strings.
- Normalize duplicates.
- Do not include generic filler words.
- Prefer specific technologies, tools, frameworks, cloud services, AI skills, and programming languages.

7. summary
- Write a short 2-3 sentence professional candidate summary.
- Base it only on resume evidence.

Original filename:
{original_filename}

Resume text:
{raw_text}
"""


def normalize_candidate(candidate: dict[str, Any]) -> dict[str, Any]:
    sap_id = candidate.get("sap_id")
    name = candidate.get("name") or "Unknown"
    role = candidate.get("role") or "Unknown"
    experience_years = candidate.get("experience_years")
    location = candidate.get("location") or "Unknown"
    skills = candidate.get("skills") or []
    summary = candidate.get("summary") or ""

    if sap_id is not None:
        sap_id = str(sap_id).strip()
        sap_id = re.sub(r"\D", "", sap_id)

        if not sap_id:
            sap_id = None

    if isinstance(experience_years, str):
        experience_years = extract_number_from_text(experience_years)

    if isinstance(experience_years, float):
        experience_years = int(round(experience_years))

    if not isinstance(experience_years, int):
        experience_years = None

    if not isinstance(skills, list):
        skills = []

    cleaned_skills = []

    for skill in skills:
        if isinstance(skill, str):
            cleaned_skill = skill.strip()

            if cleaned_skill:
                cleaned_skills.append(cleaned_skill)

    cleaned_skills = sorted(set(cleaned_skills))

    return {
        "sap_id": sap_id,
        "name": str(name).strip(),
        "role": str(role).strip(),
        "experience_years": experience_years,
        "location": str(location).strip(),
        "skills": cleaned_skills,
        "summary": str(summary).strip(),
    }


def extract_number_from_text(value: str) -> int | None:
    match = re.search(r"\d+", value)

    if match:
        return int(match.group(0))

    return None