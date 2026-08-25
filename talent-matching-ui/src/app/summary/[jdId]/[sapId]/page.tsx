"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_BASE = "http://localhost:8000";

interface MatchSummary {
  jd_id: string;
  sap_id: string;
  candidate_name: string;
  score: number;
  rank: number;
  reasoning: string;
  matching_summary: {
    total_jd_skills: number;
    total_candidate_skills: number;
    exact_matches: number;
    semantic_matches: number;
    technology_family_matches: number;
    total_matches: number;
    match_percentage: number;
  };
  matched_skills: Array<{
    jd_skill: string;
    candidate_skill: string;
    match_type: string;
    match_strength: string;
    match_reasoning: string;
  }>;
  unmatched_jd_skills: Array<{
    skill: string;
    justification: string;
    criticality: "critical" | "important" | "nice-to-have";
  }>;
  additional_candidate_skills: Array<{
    skill: string;
    years_of_experience: number;
    potential_value: string;
  }>;
  assessment_insights: {
    strengths: string[];
    gaps: string[];
    transferable_skills: string[];
    overall_fit_score: string;
    recommendation: string;
  };
}

export default function CandidateSummaryPage() {
  const { jdId, sapId } = useParams<{ jdId: string; sapId: string }>();
  const router = useRouter();

  const [data, setData] = useState<MatchSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE}/api/jd-matching/summary/${jdId}/${sapId}`
        );
        if (!res.ok) {
          throw new Error(
            res.status === 404
              ? "No summary found for this candidate."
              : "Failed to load summary."
          );
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }
    if (jdId && sapId) fetchSummary();
  }, [jdId, sapId]);

  if (loading) return <div className="p-8">Loading summary…</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!data) return null;

  const criticalityColor: Record<string, string> = {
    critical: "bg-red-100 text-red-700",
    important: "bg-amber-100 text-amber-700",
    "nice-to-have": "bg-gray-100 text-gray-600",
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-500 hover:text-gray-800"
      >
        ← Back to matches
      </button>

      {/* Header */}
      <div className="border rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">{data.candidate_name}</h1>
            <p className="text-sm text-gray-500">SAP ID: {data.sap_id}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{data.score}</div>
            <div className="text-xs text-gray-500">Rank #{data.rank}</div>
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-700">{data.reasoning}</p>
      </div>

      {/* Matching summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          ["Match %", `${data.matching_summary.match_percentage}%`],
          ["Exact matches", data.matching_summary.exact_matches],
          ["Semantic matches", data.matching_summary.semantic_matches],
          ["Total matches", data.matching_summary.total_matches],
        ].map(([label, value]) => (
          <div key={label as string} className="border rounded-lg p-3 text-center">
            <div className="text-lg font-semibold">{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Matched skills */}
      <section>
        <h2 className="font-semibold mb-2">Matched Skills</h2>
        <div className="space-y-2">
          {data.matched_skills.map((m, i) => (
            <div key={i} className="border rounded-lg p-3">
              <div className="flex justify-between text-sm font-medium">
                <span>{m.jd_skill}</span>
                <span className="text-gray-500">{m.match_type}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">{m.match_reasoning}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Unmatched skills */}
      <section>
        <h2 className="font-semibold mb-2">Skill Gaps</h2>
        <div className="space-y-2">
          {data.unmatched_jd_skills.map((s, i) => (
            <div key={i} className="border rounded-lg p-3 flex justify-between">
              <div>
                <div className="text-sm font-medium">{s.skill}</div>
                <p className="text-xs text-gray-600">{s.justification}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full h-fit ${criticalityColor[s.criticality]}`}
              >
                {s.criticality}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Assessment insights */}
      <section className="border rounded-xl p-5">
        <h2 className="font-semibold mb-3">Assessment Insights</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium mb-1">Strengths</h3>
            <ul className="list-disc list-inside text-gray-700">
              {data.assessment_insights.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-1">Gaps</h3>
            <ul className="list-disc list-inside text-gray-700">
              {data.assessment_insights.gaps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm bg-gray-50 border rounded-lg p-3">
          <span className="font-medium">Recommendation: </span>
          {data.assessment_insights.recommendation}
        </p>
      </section>
    </div>
  );
}