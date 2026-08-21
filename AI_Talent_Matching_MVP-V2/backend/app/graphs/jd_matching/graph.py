from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.sqlite import SqliteSaver
from app.db.database import get_connection
from .state import JDMatchingState
from .nodes import (
    extract_jd,
    validate_jd,
    fetch_candidates,
    match_candidates,
    rank_candidates,
    business_decision,
)

graph = StateGraph(JDMatchingState)

# Nodes
graph.add_node("extract_jd", extract_jd)
graph.add_node("validate_jd", validate_jd)
graph.add_node("fetch_candidates", fetch_candidates)
graph.add_node("match_candidates", match_candidates)
graph.add_node("rank_candidates", rank_candidates)
graph.add_node("business_decision", business_decision)

# Flow
graph.add_edge(START, "extract_jd")
graph.add_edge("extract_jd", "validate_jd")
graph.add_edge("validate_jd", "fetch_candidates")
graph.add_edge("fetch_candidates", "match_candidates")
graph.add_edge("match_candidates", "rank_candidates")
graph.add_edge("rank_candidates", "business_decision")
graph.add_edge("business_decision", END)

# SQLite checkpointer
connection = get_connection()
checkpointer = SqliteSaver(connection)

jd_matching_graph = graph.compile( checkpointer=checkpointer)

print("JD Matching graph compiled successfully.")
