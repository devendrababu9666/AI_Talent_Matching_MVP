import re
from typing import Any

from app.services.llm_service import model


def extract_candidate_metadata(state: dict[str, Any]) -> dict[str, Any]:
    print("Extracting candidate metadata from resume text...")
    raw_text = state.get("raw_text", "")
    original_filename = state.get("original_filename", "")

    prompt = build_candidate_extraction_prompt(
        raw_text=raw_text,
        original_filename=original_filename,
    )
    print("Candidate extraction prompt built successfully.")
    try:
        extracted_candidate = model.generate_json(prompt)
        print("Candidate metadata extracted successfully:", extracted_candidate)

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
    else:
        for index, skill_item in enumerate(skills):
            if not isinstance(skill_item, dict):
                errors.append(f"Skill item at index {index} must be an object.")
                continue

            if not skill_item.get("skill"):
                errors.append(f"Skill item at index {index} is missing skill name.")

            if not skill_item.get("justification"):
                errors.append(f"Skill item at index {index} is missing justification.")

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
  "skills": [
    {{
      "skill": "string",
      "justification": "string",
      "experience_years": null
    }}
  ],
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
- Extract technical, domain, platform, framework, tool, cloud, AI, programming, and relevant professional skills.
- Return skills as a list of objects.
- Each skill object must have:
  - skill
  - justification
  - experience_years
- The structure must be conceptually identical to JD skills:
  {{
    "skill": "...",
    "justification": "..."
  }}
- Normalize obvious variations:
  - React.js -> React
  - Python Programming -> Python
  - Azure OpenAI Service -> Azure OpenAI
- Do not duplicate skills.
- Do not hallucinate skills that are not supported by the resume.
- Preserve meaningful technology distinctions.
- Do not convert LangGraph into generic Python.
- If skill-specific experience is available, preserve it in experience_years.
- If skill-specific experience is not clear, return null for that skill.
- Extract only skills useful for talent matching.
- Each justification must be short and evidence-based.

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

    normalized_skills = normalize_skill_records(skills)

    return {
        "sap_id": sap_id,
        "name": str(name).strip(),
        "role": str(role).strip(),
        "experience_years": experience_years,
        "location": str(location).strip(),
        "skills": normalized_skills,
        "summary": str(summary).strip(),
    }


def normalize_skill_records(skills: Any) -> list[dict[str, Any]]:
    if not isinstance(skills, list):
        return []

    normalized = []

    for item in skills:
        if isinstance(item, str):
            skill_name = item.strip()

            if not skill_name:
                continue

            normalized.append(
                {
                    "skill": skill_name,
                    "justification": "Extracted from resume skills or experience section.",
                    "experience_years": None,
                }
            )

        elif isinstance(item, dict):
            skill_name = (
                item.get("skill")
                or item.get("name")
                or item.get("skill_name")
            )

            if not skill_name:
                continue

            skill_name = str(skill_name).strip()

            if not skill_name:
                continue

            justification = item.get("justification")

            if not justification:
                justification = "Extracted from resume skills or experience section."

            skill_experience = item.get("experience_years")

            if skill_experience == "Unknown":
                skill_experience = None

            if isinstance(skill_experience, str):
                skill_experience = extract_number_from_text(skill_experience)

            if isinstance(skill_experience, float):
                skill_experience = round(skill_experience, 1)

            if not isinstance(skill_experience, (int, float)):
                skill_experience = None

            normalized.append(
                {
                    "skill": skill_name,
                    "justification": str(justification).strip(),
                    "experience_years": skill_experience,
                }
            )

    unique = {}

    for item in normalized:
        key = item["skill"].lower()

        if key not in unique:
            unique[key] = item

    return list(unique.values())


def extract_number_from_text(value: str) -> int | None:
    match = re.search(r"\d+", value)

    if match:
        return int(match.group(0))

    return None
