def business_decision(state):
    matches = state["matches"]

    available = [
        match
        for match in matches
        if match["status"] == "Available"
    ]

    return {
        "business_decision": {
            "supported": len(matches) > 0,
            "recommendation": (
                "Prioritize available talent; "
                "retain in-pipeline profiles as clearly flagged."
                if available
                else "No immediately available candidates found."
            ),
        },
        "status": "COMPLETED",
    }