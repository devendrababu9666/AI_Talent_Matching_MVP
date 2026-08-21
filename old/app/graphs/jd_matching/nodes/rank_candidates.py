def rank_candidates(state):
    matches = sorted(
        state["matches"],
        key=lambda item: item["match_score"],
        reverse=True,
    )

    for index, match in enumerate(matches, start=1):
        match["rank"] = index

    return {
        "matches": matches,
        "status": "MATCHES_RANKED",
    }