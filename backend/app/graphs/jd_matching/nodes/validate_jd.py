def validate_jd(state):
    print("validating",state)
    errors = []

    if not state["primary_skills"]:
        errors.append("No primary skills could be extracted from the JD for UI display.")

    if not state["matching_skills"]:
        errors.append("No matching skills could be extracted from the JD for detailed comparison.")

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