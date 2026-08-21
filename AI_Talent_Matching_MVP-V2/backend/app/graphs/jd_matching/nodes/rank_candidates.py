def rank_candidates(state):
    matches = state.get("matches") or []

    ranked_matches = sorted(
        matches,
        key=lambda item: item.get("match_score", 0),
        reverse=True,
    )

    for index, match in enumerate(ranked_matches, start=1):
        match["rank"] = index

    return {
        "matches": ranked_matches,
        "ranked_matches": ranked_matches,
        "status": "MATCHES_RANKED",
    }