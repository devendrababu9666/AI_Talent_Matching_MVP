from app.services.llm_service import model
from app.graphs.jd_matching.nodes.prompts import JD_EXTRACTION_PROMPT

def extract_jd(state):
    jd_text = state["jd_text"]

    try:
        prompt = JD_EXTRACTION_PROMPT.format(jd_text=jd_text)

        extracted = model.generate_json(prompt)
        # extracted = {
        #     "extracted_skills" : "skills",
        #     "experience_min"   : "experience_min",
        #     "experience_max"   : "experience_max",
        #     "role"             : "role",
        #     "location"         : "location",
        #     "status"           : "JD_EXTRACTED",
        # }

        return {
            "extracted_skills": extracted.get("skills", []),
            "experience_min": extracted.get("experience_min"),
            "experience_max": extracted.get("experience_max"),
            "role": extracted.get("role"),
            "location": extracted.get("location"),
            "status": "JD_EXTRACTED",
        }

    except Exception as exc:
        return {
            "errors": [str(exc)],
            "status": "FAILED",
        }