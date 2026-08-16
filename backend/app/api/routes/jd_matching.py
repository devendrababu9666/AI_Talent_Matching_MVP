from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.graphs.jd_matching.graph import jd_matching_graph
from app.db.repositories.match_repository import ( create_job_description_record, create_match_result_records)

router = APIRouter(
    prefix="/api/jd-matching",
    tags=["JD Matching"],
)

class JDMatchRequest(BaseModel):
    jd_text: str


@router.post("/match")
def match_jd(request: JDMatchRequest):
    jd_text = request.jd_text.strip()

    if not jd_text:
        raise HTTPException(
            status_code=400,
            detail="JD text is required.",
        )

    try:
        result = jd_matching_graph.invoke(
            {
                "jd_text": jd_text,
                "jd_id": None,

                "primary_skills": [],
                "experience_min": None,
                "experience_max": None,
                "role": None,
                "location": None,

                "matching_skills": [],

                "candidates": [],
                "matches": [],

                "business_decision": None,

                "errors": [],
                "status": "STARTED",
            },
            config={
                "configurable": {
                    "thread_id": "jd-12345"
                }
            },
        )
        # result = {'jd_text': 'Job Title: AI Solution Lead\n\nLocation: Bangalore\n\nExperience: 10–14 years\n\nJob Description:\n\nWe are looking for an experienced AI Solution Lead to design and deliver\nenterprise Generative AI solutions.\n\nKey Responsibilities:\n- Design and implement Retrieval-Augmented Generation (RAG) solutions.\n- Build enterprise AI applications using Azure OpenAI.\n- Develop AI solutions and backend services using Python.\n- Lead the architecture and implementation of scalable GenAI solutions.\n- Work with stakeholders to translate business requirements into AI solutions.\n- Experience with AI agents and agentic workflows is desirable.\n- Experience with FastAPI or similar Python backend frameworks is a plus.\n\nRequired Skills:\n- RAG\n- Azure OpenAI\n- Python\n- Generative AI\n- AI Solution Architecture\n- Enterprise AI\n\nPreferred Skills:\n- LangGraph\n- FastAPI\n- AI Agents\n\nLocation: Bangalore', 'jd_id': None, 'primary_skills': ['RAG', 'Azure OpenAI', 'Python', 'Generative AI', 'AI Solution Architecture', 'Enterprise AI'], 'experience_min': 10, 'experience_max': 14, 'role': 'AI Solution Lead', 'location': 'Bangalore', 'matching_skills': [{'skill': 'RAG', 'justification': 'Required for designing and implementing Retrieval-Augmented Generation solutions.'}, {'skill': 'Azure OpenAI', 'justification': 'Explicitly required for building enterprise AI applications.'}, {'skill': 'Python', 'justification': 'Necessary for developing AI solutions and backend services.'}, {'skill': 'Generative AI', 'justification': 'Core focus of the role, as the position involves designing and delivering Generative AI solutions.'}, {'skill': 'AI Solution Architecture', 'justification': 'Relevant for leading the architecture and implementation of scalable GenAI solutions.'}, {'skill': 'Enterprise AI', 'justification': 'Required for developing AI solutions that meet enterprise-level needs.'}, {'skill': 'LangGraph', 'justification': 'Preferred skill that may enhance the development of AI solutions.'}, {'skill': 'FastAPI', 'justification': 'Preferred framework for developing backend services in Python.'}, {'skill': 'AI Agents', 'justification': 'Desirable experience for working with AI agents and agentic workflows.'}], 'candidates': [{'sap_id': '100001', 'name': 'Mallikarjuna Patil', 'skills': [{'skill': 'RAG', 'justification': 'Experience building retrieval-augmented generation solutions.'}, {'skill': 'Azure OpenAI', 'justification': 'Hands-on experience with Azure OpenAI services.'}, {'skill': 'Python', 'justification': 'Strong experience developing AI solutions using Python.'}], 'experience': 13, 'role': 'AI Solution Lead', 'location': 'Bangalore', 'status': 'Available'}, {'sap_id': '100004', 'name': 'Siddesh', 'skills': [{'skill': 'FastAPI', 'justification': 'Experience developing Python-based REST APIs.'}, {'skill': 'RAG', 'justification': 'Experience implementing retrieval-augmented generation pipelines.'}, {'skill': 'LangGraph', 'justification': 'Experience building agentic AI workflows using LangGraph.'}], 'experience': 10, 'role': 'AI Engineer', 'location': 'Bangalore', 'status': 'In Pipeline'}], 'matches': [{'sap_id': '100001', 'name': 'Mallikarjuna Patil', 'skills': [{'skill': 'RAG', 'justification': 'Experience building retrieval-augmented generation solutions.'}, {'skill': 'Azure OpenAI', 'justification': 'Hands-on experience with Azure OpenAI services.'}, {'skill': 'Python', 'justification': 'Strong experience developing AI solutions using Python.'}], 'status': 'Available', 'match_score': 60, 'match_percentage': 33.33, 'reasoning': 'Consider for the role but recommend further training in Generative AI and related architecture.', 'skill_analysis': {'matching_summary': {'total_jd_skills': 9, 'total_candidate_skills': 3, 'exact_matches': 3, 'semantic_matches': 0, 'technology_family_matches': 0, 'total_matches': 3, 'match_percentage': 33.33}, 'matched_skills': [{'jd_skill': 'RAG', 'candidate_skill': 'RAG', 'match_type': 'exact', 'candidate_experience_years': 2, 'jd_justification': 'Required for designing and implementing Retrieval-Augmented Generation solutions.', 'candidate_justification': 'Experience building retrieval-augmented generation solutions.', 'match_strength': 'strong', 'match_reasoning': 'The candidate has direct experience with RAG, which is explicitly required for the role.'}, {'jd_skill': 'Azure OpenAI', 'candidate_skill': 'Azure OpenAI', 'match_type': 'exact', 'candidate_experience_years': 1, 'jd_justification': 'Explicitly required for building enterprise AI applications.', 'candidate_justification': 'Hands-on experience with Azure OpenAI services.', 'match_strength': 'strong', 'match_reasoning': "The candidate's hands-on experience aligns perfectly with the job's requirement for Azure OpenAI."}, {'jd_skill': 'Python', 'candidate_skill': 'Python', 'match_type': 'exact', 'candidate_experience_years': 3, 'jd_justification': 'Necessary for developing AI solutions and backend services.', 'candidate_justification': 'Strong experience developing AI solutions using Python.', 'match_strength': 'strong', 'match_reasoning': "The candidate's strong experience in Python directly meets the job's requirement."}], 'unmatched_jd_skills': [{'skill': 'Generative AI', 'justification': 'Core focus of the role, as the position involves designing and delivering Generative AI solutions.', 'criticality': 'critical'}, {'skill': 'AI Solution Architecture', 'justification': 'Relevant for leading the architecture and implementation of scalable GenAI solutions.', 'criticality': 'important'}, {'skill': 'Enterprise AI', 'justification': 'Required for developing AI solutions that meet enterprise-level needs.', 'criticality': 'critical'}, {'skill': 'LangGraph', 'justification': 'Preferred skill that may enhance the development of AI solutions.', 'criticality': 'nice-to-have'}, {'skill': 'FastAPI', 'justification': 'Preferred framework for developing backend services in Python.', 'criticality': 'nice-to-have'}, {'skill': 'AI Agents', 'justification': 'Desirable experience for working with AI agents and agentic workflows.', 'criticality': 'important'}], 'additional_candidate_skills': [], 'assessment_insights': {'strengths': ['Strong experience in RAG, Azure OpenAI, and Python.'], 'gaps': ['Generative AI, AI Solution Architecture, Enterprise AI'], 'transferable_skills': ['Experience in AI solutions development may provide a foundation for learning Generative AI.'], 'overall_fit_score': '60', 'recommendation': 'Consider for the role but recommend further training in Generative AI and related architecture.'}}, 'rank': 1}, {'sap_id': '100004', 'name': 'Siddesh', 'skills': [{'skill': 'FastAPI', 'justification': 'Experience developing Python-based REST APIs.'}, {'skill': 'RAG', 'justification': 'Experience implementing retrieval-augmented generation pipelines.'}, {'skill': 'LangGraph', 'justification': 'Experience building agentic AI workflows using LangGraph.'}], 'status': 'In Pipeline', 'match_score': 50, 'match_percentage': 33.33, 'reasoning': 'Consider for a role with a focus on RAG and FastAPI, but address critical gaps in Azure OpenAI and Generative AI.', 'skill_analysis': {'matching_summary': {'total_jd_skills': 9, 'total_candidate_skills': 3, 'exact_matches': 2, 'semantic_matches': 0, 'technology_family_matches': 1, 'total_matches': 3, 'match_percentage': 33.33}, 'matched_skills': [{'jd_skill': 'RAG', 'candidate_skill': 'RAG', 'match_type': 'exact', 'candidate_experience_years': 2, 'jd_justification': 'Required for designing and implementing Retrieval-Augmented Generation solutions.', 'candidate_justification': 'Experience implementing retrieval-augmented generation pipelines.', 'match_strength': 'strong', 'match_reasoning': 'The candidate has direct experience with RAG, which is explicitly required for the role.'}, {'jd_skill': 'LangGraph', 'candidate_skill': 'LangGraph', 'match_type': 'exact', 'candidate_experience_years': 1, 'jd_justification': 'Preferred skill that may enhance the development of AI solutions.', 'candidate_justification': 'Experience building agentic AI workflows using LangGraph.', 'match_strength': 'moderate', 'match_reasoning': 'The candidate has relevant experience with LangGraph, which is a preferred skill for the position.'}, {'jd_skill': 'FastAPI', 'candidate_skill': 'FastAPI', 'match_type': 'exact', 'candidate_experience_years': 2, 'jd_justification': 'Preferred framework for developing backend services in Python.', 'candidate_justification': 'Experience developing Python-based REST APIs.', 'match_strength': 'moderate', 'match_reasoning': "The candidate's experience with FastAPI aligns well with the job's preferred framework for backend services."}], 'unmatched_jd_skills': [{'skill': 'Azure OpenAI', 'justification': 'Explicitly required for building enterprise AI applications.', 'criticality': 'critical'}, {'skill': 'Python', 'justification': 'Necessary for developing AI solutions and backend services.', 'criticality': 'critical'}, {'skill': 'Generative AI', 'justification': 'Core focus of the role, as the position involves designing and delivering Generative AI solutions.', 'criticality': 'critical'}, {'skill': 'AI Solution Architecture', 'justification': 'Relevant for leading the architecture and implementation of scalable GenAI solutions.', 'criticality': 'important'}, {'skill': 'Enterprise AI', 'justification': 'Required for developing AI solutions that meet enterprise-level needs.', 'criticality': 'important'}, {'skill': 'AI Agents', 'justification': 'Desirable experience for working with AI agents and agentic workflows.', 'criticality': 'nice-to-have'}], 'additional_candidate_skills': [], 'assessment_insights': {'strengths': ['Experience with RAG and FastAPI', 'Familiarity with LangGraph'], 'gaps': ['Azure OpenAI', 'Python proficiency', 'Generative AI expertise', 'AI Solution Architecture', 'Enterprise AI knowledge'], 'transferable_skills': ['Experience in developing REST APIs', 'Knowledge of AI workflows'], 'overall_fit_score': '50', 'recommendation': 'Consider for a role with a focus on RAG and FastAPI, but address critical gaps in Azure OpenAI and Generative AI.'}}, 'rank': 2}], 'business_decision': {'supported': True, 'recommendation': 'Prioritize available talent; retain in-pipeline profiles as clearly flagged.'}, 'errors': [], 'status': 'COMPLETED'}


        jd_id = create_job_description_record(
            raw_text=jd_text,
            role=result.get("role"),
            location=result.get("location"),
            experience_min=result.get("experience_min"),
            experience_max=result.get("experience_max"),
        )

        matches = result.get("matches", [])

        saved_match_results = create_match_result_records(
            jd_id=jd_id,
            matches=matches,
        )

        return {
            "status": result.get("status"),
            "jd_id": jd_id,

            "jd": {
                "primary_skills": result.get("primary_skills", []),
                "matching_skills": result.get("matching_skills", []),
                "role": result.get("role"),
                "location": result.get("location"),
                "experience_min": result.get("experience_min"),
                "experience_max": result.get("experience_max"),
            },

            "matches": matches,
            "saved_match_results": saved_match_results,
            "business_decision": result.get("business_decision"),
            "errors": result.get("errors", []),
        }
    except Exception as exc:
        print(f"An error occurred during JD matching: {str(exc)}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during JD matching: {str(exc)}",
        )