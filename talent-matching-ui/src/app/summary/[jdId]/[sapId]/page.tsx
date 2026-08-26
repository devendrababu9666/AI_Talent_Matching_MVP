"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";

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

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-6">
//       <button
//         onClick={() => router.back()}
//         className="text-sm text-gray-500 hover:text-gray-800"
//       >
//         ← Back to matches
//       </button>

//       {/* Header */}
//       <div className="border rounded-xl p-5">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-xl font-semibold">{data.candidate_name}</h1>
//             <p className="text-sm text-gray-500">SAP ID: {data.sap_id}</p>
//           </div>
//           <div className="text-right">
//             <div className="text-2xl font-bold">{data.score}</div>
//             <div className="text-xs text-gray-500">Rank #{data.rank}</div>
//           </div>
//         </div>
//         <p className="mt-3 text-sm text-gray-700">{data.reasoning}</p>
//       </div>

//       {/* Matching summary */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {[
//           ["Match %", `${data.matching_summary.match_percentage}%`],
//           ["Exact matches", data.matching_summary.exact_matches],
//           ["Semantic matches", data.matching_summary.semantic_matches],
//           ["Total matches", data.matching_summary.total_matches],
//         ].map(([label, value]) => (
//           <div key={label as string} className="border rounded-lg p-3 text-center">
//             <div className="text-lg font-semibold">{value}</div>
//             <div className="text-xs text-gray-500">{label}</div>
//           </div>
//         ))}
//       </div>

//       {/* Matched skills */}
//       <section>
//         <h2 className="font-semibold mb-2">Matched Skills</h2>
//         <div className="space-y-2">
//           {data.matched_skills.map((m, i) => (
//             <div key={i} className="border rounded-lg p-3">
//               <div className="flex justify-between text-sm font-medium">
//                 <span>{m.jd_skill}</span>
//                 <span className="text-gray-500">{m.match_type}</span>
//               </div>
//               <p className="text-xs text-gray-600 mt-1">{m.match_reasoning}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Unmatched skills */}
//       <section>
//         <h2 className="font-semibold mb-2">Skill Gaps</h2>
//         <div className="space-y-2">
//           {data.unmatched_jd_skills.map((s, i) => (
//             <div key={i} className="border rounded-lg p-3 flex justify-between">
//               <div>
//                 <div className="text-sm font-medium">{s.skill}</div>
//                 <p className="text-xs text-gray-600">{s.justification}</p>
//               </div>
//               <span
//                 className={`text-xs px-2 py-1 rounded-full h-fit ${criticalityColor[s.criticality]}`}
//               >
//                 {s.criticality}
//               </span>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Assessment insights */}
//       <section className="border rounded-xl p-5">
//         <h2 className="font-semibold mb-3">Assessment Insights</h2>
//         <div className="grid md:grid-cols-2 gap-4 text-sm">
//           <div>
//             <h3 className="font-medium mb-1">Strengths</h3>
//             <ul className="list-disc list-inside text-gray-700">
//               {data.assessment_insights.strengths.map((s, i) => (
//                 <li key={i}>{s}</li>
//               ))}
//             </ul>
//           </div>
//           <div>
//             <h3 className="font-medium mb-1">Gaps</h3>
//             <ul className="list-disc list-inside text-gray-700">
//               {data.assessment_insights.gaps.map((s, i) => (
//                 <li key={i}>{s}</li>
//               ))}
//             </ul>
//           </div>
//         </div>
//         <p className="mt-4 text-sm bg-gray-50 border rounded-lg p-3">
//           <span className="font-medium">Recommendation: </span>
//           {data.assessment_insights.recommendation}
//         </p>
//       </section>
//     </div>
//   );
// }
return (
  <AppShell title="Candidate Summary">
    <div className="space-y-8">
      {/* Header */}
      <section className="rounded-3xl border border-[#D9E2EF] bg-white p-7 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-6">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-[#EAF2FF] text-3xl font-bold text-[#0F5FDC]">
              {getInitials(data.candidate_name)}
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0F5FDC]">
                Candidate Profile
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                {data.candidate_name}
              </h2>

              <p className="mt-2 text-base text-slate-600">
                SAP ID: {data.sap_id}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
            <MetricCard
              label="JD Match"
              value={`${data.score}%`}
            />

            <MetricCard
              label="Rank"
              value={`#${data.rank}`}
            />
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-[#D9E2EF] bg-[#F8FBFF] p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Matching Rationale
          </p>

          <p className="mt-3 text-sm leading-7 text-slate-700">
            {data.reasoning}
          </p>
        </div>
      </section>

      {/* Matching Overview */}
      <section>
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-slate-950">
            Matching Overview
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Skill-level comparison between the job description and candidate profile.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Technology Family Matches"
            value={String(data.matching_summary.technology_family_matches)}
          />

          <MetricCard
            label="Exact Matches"
            value={String(data.matching_summary.exact_matches)}
          />

          <MetricCard
            label="Semantic Matches"
            value={String(data.matching_summary.semantic_matches)}
          />

          <MetricCard
            label="Total Matches"
            value={String(data.matching_summary.total_matches)}
          />
        </div>
      </section>

    

      {/* Assessment Insights */}
      <section className="rounded-3xl border border-[#D9E2EF] bg-white p-7 shadow-sm">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-950">
            Assessment Insights
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            AI-generated assessment of candidate strengths, gaps, and overall fit.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SummaryBlock title="Strengths" color="#0F5FDC">
            <ul className="space-y-3">
              {data.assessment_insights.strengths.length > 0 ? (
                data.assessment_insights.strengths.map((strength, index) => (
                  <li
                    key={index}
                    className="flex gap-3 text-sm leading-6 text-slate-700"
                  >
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#0F5FDC]" />
                    <span>{strength}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-slate-500">
                  No strengths available.
                </li>
              )}
            </ul>
          </SummaryBlock>

          <SummaryBlock title="Gaps" color="#DC2626">
            <ul className="space-y-3">
              {data.assessment_insights.gaps.length > 0 ? (
                data.assessment_insights.gaps.map((gap, index) => (
                  <li
                    key={index}
                    className="flex gap-3 text-sm leading-6 text-slate-700"
                  >
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                    <span>{gap}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-slate-500">
                  No significant gaps identified.
                </li>
              )}
            </ul>
          </SummaryBlock>

          <SummaryBlock title="Transferable Skills" color="#6B2BD9">
            <ul className="space-y-3">
              {data.assessment_insights.transferable_skills.length > 0 ? (
                data.assessment_insights.transferable_skills.map(
                  (skill, index) => (
                    <li
                      key={index}
                      className="flex gap-3 text-sm leading-6 text-slate-700"
                    >
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#6B2BD9]" />
                      <span>{skill}</span>
                    </li>
                  )
                )
              ) : (
                <li className="text-sm text-slate-500">
                  No transferable skills identified.
                </li>
              )}
            </ul>
          </SummaryBlock>

          <SummaryBlock title="Overall Fit" color="#14B8A6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#ECFDF3] text-xl font-bold text-[#16A34A]">
                {data.assessment_insights.overall_fit_score}
              </div>

              <p className="text-sm leading-6 text-slate-700">
                Overall assessment based on skills, matching evidence, and identified gaps.
              </p>
            </div>
          </SummaryBlock>
        </div>

        <div className="mt-6 rounded-2xl border border-[#D9E2EF] bg-[#F8FBFF] p-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0F5FDC]">
            Recommendation
          </p>

          <p className="mt-3 text-sm leading-7 text-slate-700">
            {data.assessment_insights.recommendation}
          </p>
        </div>
      </section>

      {/* Skill Intelligence */}

      <section className="grid gap-6 lg:grid-cols-2">
        {/* Matched Skills */}
        <div className="rounded-3xl border border-[#D9E2EF] bg-white p-7 shadow-sm">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-950">
              Matched Skills
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Skills from the JD supported by candidate experience or equivalent expertise.
            </p>
          </div>

          <div className="space-y-3">
            {data.matched_skills.length > 0 ? (
              data.matched_skills.map((match, index) => (
                <div
                  key={`${match.jd_skill}-${index}`}
                  className="rounded-2xl border border-[#D9E2EF] bg-[#F8FBFF] p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-base font-bold text-slate-950">
                        {match.jd_skill}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Candidate skill:{" "}
                        <span className="font-semibold text-slate-700">
                          {match.candidate_skill}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#EAF2FF] px-3 py-1 text-xs font-bold text-[#0F5FDC]">
                        {match.match_type}
                      </span>

                      <span className="rounded-full bg-[#ECFDF3] px-3 py-1 text-xs font-bold text-[#16A34A]">
                        {formatMatchStrength(match.match_strength)}
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {match.match_reasoning}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#D9E2EF] p-6 text-center text-sm text-slate-500">
                No matched skills available.
              </div>
            )}
          </div>
        </div>

        {/* Skill Gaps */}
        <div className="rounded-3xl border border-[#D9E2EF] bg-white p-7 shadow-sm">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-950">
              Skill Gaps
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              JD requirements that are not sufficiently supported by the candidate profile.
            </p>
          </div>

          <div className="space-y-3">
            {data.unmatched_jd_skills.length > 0 ? (
              data.unmatched_jd_skills.map((gap, index) => (
                <div
                  key={`${gap.skill}-${index}`}
                  className="rounded-2xl border border-[#D9E2EF] bg-[#F8FBFF] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-bold text-slate-950">
                        {gap.skill}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {gap.justification}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                        criticalityColor[gap.criticality]
                      }`}
                    >
                      {gap.criticality}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#D9E2EF] p-6 text-center text-sm text-slate-500">
                No significant skill gaps identified.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Additional Candidate Skills */}
      {data.additional_candidate_skills.length > 0 && (
        <section className="rounded-3xl border border-[#D9E2EF] bg-white p-7 shadow-sm">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-950">
              Additional Candidate Skills
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Additional expertise that may provide value beyond the core JD requirements.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.additional_candidate_skills.map((skill, index) => (
              <div
                key={`${skill.skill}-${index}`}
                className="rounded-2xl border border-[#D9E2EF] bg-[#F8FBFF] p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-bold text-slate-950">
                    {skill.skill}
                  </h4>

                  <span className="shrink-0 rounded-full bg-[#EAF2FF] px-2.5 py-1 text-xs font-bold text-[#0F5FDC]">
                    {skill.years_of_experience} yrs
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {skill.potential_value}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Business Output */}
      <div className="rounded-2xl border border-[#D9E2EF] bg-[#F8FBFF] px-6 py-5 text-center shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0F5FDC]">
          Suggested Business Output
        </p>

        <p className="mt-2 text-sm font-semibold text-slate-900">
          Concise candidate summary + key match points + transparent skill gaps
          for project discussion.
        </p>
      </div>
    </div>
  </AppShell>
)
}
function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#D9E2EF] bg-[#F8FBFF] p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 break-words text-2xl font-bold text-[#0F5FDC]">
        {value}
      </p>
    </div>
  )
}

function SummaryBlock({
  title,
  color,
  children,
}: {
  title: string
  color: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-[#D9E2EF] bg-[#F8FBFF] p-6">
      <h4 className="text-xl font-bold" style={{ color }}>
        {title}
      </h4>

      <div className="mt-5">
        {children}
      </div>
    </div>
  )
}
function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}
function formatMatchStrength(strength: string): string {
  if (!strength) {
    return "Relevant"
  }

  return strength.charAt(0).toUpperCase() + strength.slice(1)
}