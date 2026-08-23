from app.services.llm_service import model
from app.graphs.jd_matching.nodes.prompts import JD_UI_EXTRACTION_PROMPT, JD_MATCHING_SKILLS_PROMPT


def extract_jd(state):
    jd_text = state["jd_text"]

    try:
        status = "JD_EXTRACTING"

        prompt = JD_UI_EXTRACTION_PROMPT.format(jd_text=jd_text)
        print("prompt extracted")
        extracted = model.generate_json(prompt)
        status = "JD_EXTRACTED"
        print("extracted", extracted)

        prompt = JD_MATCHING_SKILLS_PROMPT.format(jd_text=state["jd_text"])
        print("prompt2 done")
        result = model.generate_json(prompt)
        print("result",result)
        status = "JD_SKILLS_EXTRACTED"

        return {
            "primary_skills": extracted.get("primary_skills", []),
            "experience_min": extracted.get("experience_min"),
            "experience_max": extracted.get("experience_max"),
            "role": extracted.get("role"),
            "location": extracted.get("location"),
            "matching_skills": result.get("matching_skills", []),
            "status": status,
        }

    except Exception as exc:
        print(status)
        # raise Exception(f"Error in extract_jd: {exc}")
        print(f"Error in extract_jd: {exc}")

        return {
            "errors": [str(exc)],
            "status": "FAILED AT EXTRACTING JD",
        }