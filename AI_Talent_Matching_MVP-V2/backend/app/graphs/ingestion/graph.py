from langgraph.graph import StateGraph, START, END

from app.graphs.ingestion.state import ResumeIngestionState
from app.graphs.ingestion.nodes import (
    extract_candidate_metadata,
    validate_candidate_metadata,
)


graph = StateGraph(ResumeIngestionState)

graph.add_node("extract_candidate_metadata", extract_candidate_metadata)
graph.add_node("validate_candidate_metadata", validate_candidate_metadata)

graph.add_edge(START, "extract_candidate_metadata")
graph.add_edge("extract_candidate_metadata", "validate_candidate_metadata")
graph.add_edge("validate_candidate_metadata", END)

resume_ingestion_graph = graph.compile()

print("Resume ingestion graph compiled successfully.")