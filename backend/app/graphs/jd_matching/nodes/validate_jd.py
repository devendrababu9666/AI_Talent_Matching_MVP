def validate_jd(state):
    errors = []

    if not state["extracted_skills"]:
        errors.append("No skills could be extracted from the JD.")

    if not state["role"]:
        errors.append("Role could not be identified.")

    if state["experience_min"] is not None:
        if state["experience_min"] < 0:
            errors.append("Invalid minimum experience.")

    if errors:
        return {
            "errors": errors,
            "status": "VALIDATION_FAILED",
        }

    return {
        "status": "JD_VALIDATED",
    }