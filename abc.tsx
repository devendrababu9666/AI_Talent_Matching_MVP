// "use client";

// import { useEffect, useState } from "react";
// // import { useParams, useRouter } from "next/navigation";
// import { useParams, useSearchParams,useRouter } from "next/navigation"

// import AppShell from "@/components/AppShell";

// const API_BASE = "http://localhost:8000";

// interface MatchSummary {
//   jd_id: string;
//   sap_id: string;
//   candidate_name: string;
//   score: number;
//   rank: number;
//   reasoning: string;
//   matching_summary: {
//     total_jd_skills: number;
//     total_candidate_skills: number;
//     exact_matches: number;
//     semantic_matches: number;
//     technology_family_matches: number;
//     total_matches: number;
//     match_percentage: number;
//   };
//   matched_skills: Array<{
//     jd_skill: string;
//     candidate_skill: string;
//     match_type: string;
//     match_strength: string;
//     match_reasoning: string;
//   }>;
//   unmatched_jd_skills: Array<{
//     skill: string;
//     justification: string;
//     criticality: "critical" | "important" | "nice-to-have";
//   }>;
//   additional_candidate_skills: Array<{
//     skill: string;
//     years_of_experience: number;
//     potential_value: string;
//   }>;
//   assessment_insights: {
//     strengths: string[];
//     gaps: string[];
//     transferable_skills: string[];
//     overall_fit_score: string;
//     recommendation: string;
//   };
// }

// type CandidateStatus = "Available" | "In Pipeline" | "Deployed"

// type ApiCandidate = {
//   id: string
//   sap_id: string
//   name: string
//   role: string | null
//   experience_years: number | null
//   location: string | null
//   status: CandidateStatus | string | null
//   summary?: string | null
//   skills: string[]
// }

// type CandidatesApiResponse = {
//   count: number
//   candidates: ApiCandidate[]
// }

// type Candidate = {
//   id: string
//   sapid: string
//   name: string
//   role: string
//   experience: number
//   location: string
//   status: CandidateStatus
//   matchScore: number
//   summary: string
//   evidence: string[]
//   currentStatus: string[]
// }

// type MatchResultSkill = {
//   jd_skill: string
//   candidate_skill: string
//   match_type?: string
//   candidate_experience_years?: number
//   jd_justification?: string
//   candidate_justification?: string
//   match_strength: string
//   match_reasoning?: string
// }

// type MatchResult = {
//   id: string
//   jd_id: string
//   candidate_id: string | null
//   sap_id: string
//   candidate_name: string
//   score: number
//   rank: number | null
//   reasoning: string
//   matching_summary: Record<string, unknown>
//   matched_skills: MatchResultSkill[]
//   unmatched_jd_skills: unknown[]
//   additional_candidate_skills: unknown[]
//   assessment_insights: {
//     recommendation?: string
//     strengths?: string[]
//     gaps?: string[]
//     transferable_skills?: string[]
//     overall_fit_score?: string | number
//   }
//   created_at: string
// }

// //------

// export default function CandidateSummaryPage() {
//   const params = useParams()
//   const searchParams = useSearchParams()

  
//   const { jdId, sapId } = useParams<{ jdId: string; sapId: string }>();
//   const router = useRouter();

//   const [data, setData] = useState<MatchSummary | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchSummary() {
//       try {
//         setLoading(true);
//         const res = await fetch(
//           `${API_BASE}/api/jd-matching/summary/${jdId}/${sapId}`
//         );
//         if (!res.ok) {
//           throw new Error(
//             res.status === 404
//               ? "No summary found for this candidate."
//               : "Failed to load summary."
//           );
//         }
//         const json = await res.json();
//         setData(json);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Something went wrong.");
//       } finally {
//         setLoading(false);
//       }
//     }
//     if (jdId && sapId) fetchSummary();
//   }, [jdId, sapId]);

//   // if (loading) return <div className="p-8">Loading summary…</div>;
//   // if (error) return <div className="p-8 text-red-600">{error}</div>;
//   // if (!data) return null;

//   const criticalityColor: Record<string, string> = {
//     critical: "bg-red-100 text-red-700",
//     important: "bg-amber-100 text-amber-700",
//     "nice-to-have": "bg-gray-100 text-gray-600",
//   };

//   //-------

//   // const candidateKey = String(params.id || "")
//   const candidateKey = sapId
//   const matchResultId = searchParams.get("matchResultId")

//   const [candidate, setCandidate] = useState<Candidate | null>(null)
//   const [matchResult, setMatchResult] = useState<MatchResult | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   // const [error, setError] = useState("")

 
//   useEffect(() => {
//     async function loadData() {
//       setIsLoading(true)
//       setError("")

//       try {
//         const response = await fetch("http://localhost:8000/api/candidates")
//         const data: CandidatesApiResponse = await response.json()
//         const matchedCandidate = data.candidates.find(
//           (item) => item.sap_id === candidateKey || item.id === candidateKey
//         )
//         setCandidate(matchedCandidate ? mapApiCandidateToSummary(matchedCandidate) : null)
//       } catch {
//         setError("Unable to load candidate summary from backend.")
//       } finally {
//         setIsLoading(false)
//       }

//       if (matchResultId) {
//         try {
//           const response = await fetch(`http://localhost:8000/api/jd-matching/results/${matchResultId}`)
//           const data: MatchResult = await response.json()
//           setMatchResult(data)
//         } catch {
//           setMatchResult(null)
//         }
//       }
//     }

//     loadData()
//   }, [candidateKey, matchResultId])


//   if (isLoading) {
//     return (
//       <AppShell title="Candidate Summary">
//         <div className="flex min-h-[520px] items-center justify-center">
//           <div className="w-full max-w-xl rounded-3xl border border-[#D9E2EF] bg-white p-10 text-center shadow-sm">
//             <p className="text-sm font-medium text-slate-500">
//               Loading candidate summary...
//             </p>
//           </div>
//         </div>
//       </AppShell>
//     )
//   }

//   if (error) {
//     return (
//       <AppShell title="Candidate Summary">
//         <div className="flex min-h-[520px] items-center justify-center">
//           <div className="w-full max-w-xl rounded-3xl border border-red-200 bg-red-50 p-10 text-center shadow-sm">
//             <h2 className="text-2xl font-bold text-red-700">
//               Unable to load summary
//             </h2>

//             <p className="mt-3 text-sm leading-6 text-red-600">
//               {error}
//             </p>
//           </div>
//         </div>
//       </AppShell>
//     )
//   }

//   if (!candidate) {
//     return (
//       <AppShell title="Candidate Summary">
//         <div className="flex min-h-[520px] items-center justify-center">
//           <div className="w-full max-w-xl rounded-3xl border border-[#D9E2EF] bg-white p-10 text-center shadow-sm">
//             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF2FF] text-2xl font-bold text-[#0F5FDC]">
//               ?
//             </div>

//             <h2 className="mt-6 text-2xl font-bold text-slate-950">
//               Candidate not found
//             </h2>

//             <p className="mt-3 text-sm leading-6 text-slate-500">
//               No candidate profile is available for ID or SAP ID{" "}
//               <span className="font-bold text-slate-700">{candidateKey}</span>.
//             </p>
//           </div>
//         </div>
//       </AppShell>
//     )
//   }

//   const jdMatchValue = getJdMatchValue(candidate, matchResult)
//   const evidenceItems = getEvidenceItems(candidate, matchResult)

  

// return (<>

//     <AppShell title="Candidate Summary">
//       <div className="space-y-8">
//         <section className="rounded-3xl border border-[#D9E2EF] bg-white p-7 shadow-sm">
//           <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
//             <div className="flex items-start gap-6">
//               <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-[#EAF2FF] text-3xl font-bold text-[#0F5FDC]">
//                 {getInitials(candidate.name)}
//               </div>

//               <div>
//                 <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0F5FDC]">
//                   Candidate Profile
//                 </p>

//                 <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
//                   {candidate.name}
//                 </h2>

//                 <p className="mt-2 text-base text-slate-600">
//                   {candidate.role} |{" "}
//                   {candidate.experience > 0
//                     ? `${candidate.experience} years`
//                     : "Experience unavailable"}{" "}
//                   | {candidate.location}
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
//               <MetricCard label="SAP ID" value={candidate.sapid} />
//               <MetricCard label="JD Match" value={jdMatchValue} />
//             </div>
//           </div>
//         </section>

//         <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
//           <div className="rounded-3xl border border-[#D9E2EF] bg-white p-7 shadow-sm">
//             <div className="mb-6 flex items-center justify-between gap-4">
//               <div>
//                 <h3 className="text-2xl font-bold text-slate-950">
//                   Profile Intelligence
//                 </h3>

//                 <p className="mt-1 text-sm text-slate-500">
//                   AI-generated summary and matching rationale for project discussion.
//                 </p>
//               </div>

//               <CandidateStatusBadge status={candidate.status} />
//             </div>

//             <div className="grid gap-6 lg:grid-cols-2">
//               <SummaryBlock title="AI Summary" color="#0F5FDC">
//                 <p className="text-sm leading-7 text-slate-700">
//                   {candidate.summary}
//                 </p>
//               </SummaryBlock>

//               <SummaryBlock title="Match Evidence" color="#6B2BD9">
//                 <ul className="space-y-3 text-sm text-slate-700">
//                   {evidenceItems.map((item) => (
//                     <li key={item} className="flex gap-2">
//                       <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#0F5FDC]" />
//                       <span>{item}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </SummaryBlock>
//             </div>
//           </div>

//           <div className="rounded-3xl border border-[#D9E2EF] bg-white p-7 shadow-sm">
//             <h3 className="text-2xl font-bold text-slate-950">
//               Current Status
//             </h3>

//             <div className="mt-5">
//               <CandidateStatusBadge status={candidate.status} />
//             </div>

//             <ul className="mt-6 space-y-4 text-sm text-slate-700">
//               {candidate.currentStatus.map((item) => (
//                 <li key={item} className="flex gap-3">
//                   <span className="mt-2 h-2 w-2 rounded-full bg-[#14B8A6]" />
//                   <span>{item}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </section>

//         <div className="rounded-2xl border border-[#D9E2EF] bg-[#F8FBFF] px-6 py-5 text-center text-sm font-bold text-slate-900 shadow-sm">
//           Suggested business output: concise email-ready summary + key match points + transparent availability.
//         </div>
//       </div>
//     </AppShell>


// //------------------

//   <AppShell title="Candidate Summary">
//     <div className="space-y-8">
//       {/* Header */}
//       <section className="rounded-3xl border border-[#D9E2EF] bg-white p-7 shadow-sm">
//         <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
//           <div className="flex items-start gap-6">
//             <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-[#EAF2FF] text-3xl font-bold text-[#0F5FDC]">
//               {getInitials(data.candidate_name)}
//             </div>

//             <div>
//               <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0F5FDC]">
//                 Candidate Profile
//               </p>

//               <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
//                 {data.candidate_name}
//               </h2>

//               <p className="mt-2 text-base text-slate-600">
//                 SAP ID: {data.sap_id}
//               </p>
//             </div>
//           </div>

//           <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
//             <MetricCard
//               label="JD Match"
//               value={`${data.score}%`}
//             />

//             <MetricCard
//               label="Rank"
//               value={`#${data.rank}`}
//             />
//           </div>
//         </div>

//         <div className="mt-6 rounded-2xl border border-[#D9E2EF] bg-[#F8FBFF] p-5">
//           <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
//             Matching Rationale
//           </p>

//           <p className="mt-3 text-sm leading-7 text-slate-700">
//             {data.reasoning}
//           </p>
//         </div>
//       </section>

//       {/* Matching Overview */}
//       <section>
//         <div className="mb-4">
//           <h3 className="text-2xl font-bold text-slate-950">
//             Matching Overview
//           </h3>

//           <p className="mt-1 text-sm text-slate-500">
//             Skill-level comparison between the job description and candidate profile.
//           </p>
//         </div>

//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           <MetricCard
//             label="Technology Family Matches"
//             value={String(data.matching_summary.technology_family_matches)}
//           />

//           <MetricCard
//             label="Exact Matches"
//             value={String(data.matching_summary.exact_matches)}
//           />

//           <MetricCard
//             label="Semantic Matches"
//             value={String(data.matching_summary.semantic_matches)}
//           />

//           <MetricCard
//             label="Total Matches"
//             value={String(data.matching_summary.total_matches)}
//           />
//         </div>
//       </section>

    

//       {/* Assessment Insights */}
//       <section className="rounded-3xl border border-[#D9E2EF] bg-white p-7 shadow-sm">
//         <div className="mb-6">
//           <h3 className="text-2xl font-bold text-slate-950">
//             Assessment Insights
//           </h3>

//           <p className="mt-1 text-sm text-slate-500">
//             AI-generated assessment of candidate strengths, gaps, and overall fit.
//           </p>
//         </div>

//         <div className="grid gap-6 lg:grid-cols-2">
//           <SummaryBlock title="Strengths" color="#0F5FDC">
//             <ul className="space-y-3">
//               {data.assessment_insights.strengths.length > 0 ? (
//                 data.assessment_insights.strengths.map((strength, index) => (
//                   <li
//                     key={index}
//                     className="flex gap-3 text-sm leading-6 text-slate-700"
//                   >
//                     <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#0F5FDC]" />
//                     <span>{strength}</span>
//                   </li>
//                 ))
//               ) : (
//                 <li className="text-sm text-slate-500">
//                   No strengths available.
//                 </li>
//               )}
//             </ul>
//           </SummaryBlock>

//           <SummaryBlock title="Gaps" color="#DC2626">
//             <ul className="space-y-3">
//               {data.assessment_insights.gaps.length > 0 ? (
//                 data.assessment_insights.gaps.map((gap, index) => (
//                   <li
//                     key={index}
//                     className="flex gap-3 text-sm leading-6 text-slate-700"
//                   >
//                     <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-500" />
//                     <span>{gap}</span>
//                   </li>
//                 ))
//               ) : (
//                 <li className="text-sm text-slate-500">
//                   No significant gaps identified.
//                 </li>
//               )}
//             </ul>
//           </SummaryBlock>

//           <SummaryBlock title="Transferable Skills" color="#6B2BD9">
//             <ul className="space-y-3">
//               {data.assessment_insights.transferable_skills.length > 0 ? (
//                 data.assessment_insights.transferable_skills.map(
//                   (skill, index) => (
//                     <li
//                       key={index}
//                       className="flex gap-3 text-sm leading-6 text-slate-700"
//                     >
//                       <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#6B2BD9]" />
//                       <span>{skill}</span>
//                     </li>
//                   )
//                 )
//               ) : (
//                 <li className="text-sm text-slate-500">
//                   No transferable skills identified.
//                 </li>
//               )}
//             </ul>
//           </SummaryBlock>

//           <SummaryBlock title="Overall Fit" color="#14B8A6">
//             <div className="flex items-center gap-4">
//               <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#ECFDF3] text-xl font-bold text-[#16A34A]">
//                 {data.assessment_insights.overall_fit_score}
//               </div>

//               <p className="text-sm leading-6 text-slate-700">
//                 Overall assessment based on skills, matching evidence, and identified gaps.
//               </p>
//             </div>
//           </SummaryBlock>
//         </div>

//         <div className="mt-6 rounded-2xl border border-[#D9E2EF] bg-[#F8FBFF] p-6">
//           <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0F5FDC]">
//             Recommendation
//           </p>

//           <p className="mt-3 text-sm leading-7 text-slate-700">
//             {data.assessment_insights.recommendation}
//           </p>
//         </div>
//       </section>

//       {/* Skill Intelligence */}

//       <section className="grid gap-6 lg:grid-cols-2">
//         {/* Matched Skills */}
//         <div className="rounded-3xl border border-[#D9E2EF] bg-white p-7 shadow-sm">
//           <div className="mb-6">
//             <h3 className="text-2xl font-bold text-slate-950">
//               Matched Skills
//             </h3>

//             <p className="mt-1 text-sm text-slate-500">
//               Skills from the JD supported by candidate experience or equivalent expertise.
//             </p>
//           </div>

//           <div className="space-y-3">
//             {data.matched_skills.length > 0 ? (
//               data.matched_skills.map((match, index) => (
//                 <div
//                   key={`${match.jd_skill}-${index}`}
//                   className="rounded-2xl border border-[#D9E2EF] bg-[#F8FBFF] p-5"
//                 >
//                   <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
//                     <div>
//                       <p className="text-base font-bold text-slate-950">
//                         {match.jd_skill}
//                       </p>

//                       <p className="mt-1 text-sm text-slate-500">
//                         Candidate skill:{" "}
//                         <span className="font-semibold text-slate-700">
//                           {match.candidate_skill}
//                         </span>
//                       </p>
//                     </div>

//                     <div className="flex flex-wrap gap-2">
//                       <span className="rounded-full bg-[#EAF2FF] px-3 py-1 text-xs font-bold text-[#0F5FDC]">
//                         {match.match_type}
//                       </span>

//                       <span className="rounded-full bg-[#ECFDF3] px-3 py-1 text-xs font-bold text-[#16A34A]">
//                         {formatMatchStrength(match.match_strength)}
//                       </span>
//                     </div>
//                   </div>

//                   <p className="mt-4 text-sm leading-6 text-slate-600">
//                     {match.match_reasoning}
//                   </p>
//                 </div>
//               ))
//             ) : (
//               <div className="rounded-2xl border border-dashed border-[#D9E2EF] p-6 text-center text-sm text-slate-500">
//                 No matched skills available.
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Skill Gaps */}
//         <div className="rounded-3xl border border-[#D9E2EF] bg-white p-7 shadow-sm">
//           <div className="mb-6">
//             <h3 className="text-2xl font-bold text-slate-950">
//               Skill Gaps
//             </h3>

//             <p className="mt-1 text-sm text-slate-500">
//               JD requirements that are not sufficiently supported by the candidate profile.
//             </p>
//           </div>

//           <div className="space-y-3">
//             {data.unmatched_jd_skills.length > 0 ? (
//               data.unmatched_jd_skills.map((gap, index) => (
//                 <div
//                   key={`${gap.skill}-${index}`}
//                   className="rounded-2xl border border-[#D9E2EF] bg-[#F8FBFF] p-5"
//                 >
//                   <div className="flex items-start justify-between gap-4">
//                     <div>
//                       <p className="text-base font-bold text-slate-950">
//                         {gap.skill}
//                       </p>

//                       <p className="mt-2 text-sm leading-6 text-slate-600">
//                         {gap.justification}
//                       </p>
//                     </div>

//                     <span
//                       className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
//                         criticalityColor[gap.criticality]
//                       }`}
//                     >
//                       {gap.criticality}
//                     </span>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="rounded-2xl border border-dashed border-[#D9E2EF] p-6 text-center text-sm text-slate-500">
//                 No significant skill gaps identified.
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Additional Candidate Skills */}
//       {data.additional_candidate_skills.length > 0 && (
//         <section className="rounded-3xl border border-[#D9E2EF] bg-white p-7 shadow-sm">
//           <div className="mb-6">
//             <h3 className="text-2xl font-bold text-slate-950">
//               Additional Candidate Skills
//             </h3>

//             <p className="mt-1 text-sm text-slate-500">
//               Additional expertise that may provide value beyond the core JD requirements.
//             </p>
//           </div>

//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//             {data.additional_candidate_skills.map((skill, index) => (
//               <div
//                 key={`${skill.skill}-${index}`}
//                 className="rounded-2xl border border-[#D9E2EF] bg-[#F8FBFF] p-5"
//               >
//                 <div className="flex items-start justify-between gap-3">
//                   <h4 className="font-bold text-slate-950">
//                     {skill.skill}
//                   </h4>

//                   <span className="shrink-0 rounded-full bg-[#EAF2FF] px-2.5 py-1 text-xs font-bold text-[#0F5FDC]">
//                     {skill.years_of_experience} yrs
//                   </span>
//                 </div>

//                 <p className="mt-3 text-sm leading-6 text-slate-600">
//                   {skill.potential_value}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* Business Output */}
//       <div className="rounded-2xl border border-[#D9E2EF] bg-[#F8FBFF] px-6 py-5 text-center shadow-sm">
//         <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0F5FDC]">
//           Suggested Business Output
//         </p>

//         <p className="mt-2 text-sm font-semibold text-slate-900">
//           Concise candidate summary + key match points + transparent skill gaps
//           for project discussion.
//         </p>
//       </div>
//     </div>
//   </AppShell>

//   </>
// )

// }



// function getInitials(name: string) {
//   return name
//     .split(" ")
//     .map((part) => part[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase()
// }
// function formatMatchStrength(strength: string): string {
//   if (!strength) {
//     return "Relevant"
//   }

//   return strength.charAt(0).toUpperCase() + strength.slice(1)
// }

// //----
// function mapApiCandidateToSummary(apiCandidate: ApiCandidate): Candidate {
//   return {
//     id: apiCandidate.id,
//     sapid: apiCandidate.sap_id,
//     name: apiCandidate.name,
//     role: apiCandidate.role || "Unknown",
//     experience: apiCandidate.experience_years || 0,
//     location: apiCandidate.location || "Unknown",
//     status: normalizeStatus(apiCandidate.status),
//     matchScore: 0,
//     summary:
//       apiCandidate.summary ||
//       "Candidate profile summary is not available yet.",
//     evidence: [
//       "Profile extracted from uploaded resume",
//       "Candidate data stored in SQLite",
//       "Available for Talent Search",
//       "Available for JD Matching",
//     ],
//     currentStatus: [
//       "Candidate profile is active and ready for evaluation",
//       "Resume information has been successfully processed",
//       "Candidate is available for suitable project opportunities",
//     ],
//   }
// }

// function MetricCard({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="rounded-2xl border border-[#D9E2EF] bg-[#F8FBFF] p-5">
//       <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
//         {label}
//       </p>

//       <p className="mt-2 break-words text-2xl font-bold text-[#0F5FDC]">
//         {value}
//       </p>
//     </div>
//   )
// }

// function SummaryBlock({
//   title,
//   color,
//   children,
// }: {
//   title: string
//   color: string
//   children: React.ReactNode
// }) {
//   return (
//     <div className="rounded-2xl border border-[#D9E2EF] bg-[#F8FBFF] p-6">
//       <h4 className="text-xl font-bold" style={{ color }}>
//         {title}
//       </h4>

//       <div className="mt-5">
//         {children}
//       </div>
//     </div>
//   )
// }

// function CandidateStatusBadge({ status }: { status: CandidateStatus }) {
//   const classes =
//     status === "Available"
//       ? "bg-[#ECFDF3] text-[#16A34A]"
//       : status === "In Pipeline"
//         ? "bg-[#FFF7E6] text-[#F59E0B]"
//         : "bg-[#EAF2FF] text-[#0F5FDC]"

//   const dotClass =
//     status === "Available"
//       ? "bg-[#16A34A]"
//       : status === "In Pipeline"
//         ? "bg-[#F59E0B]"
//         : "bg-[#0F5FDC]"

//   return (
//     <span
//       className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold ${classes}`}
//     >
//       <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
//       {status}
//     </span>
//   )
// }

// function normalizeStatus(status: string | null | undefined): CandidateStatus {
//   if (status === "In Pipeline") {
//     return "In Pipeline"
//   }

//   if (status === "Deployed") {
//     return "Deployed"
//   }

//   return "Available"
// }


// function getJdMatchValue(
//   candidate: Candidate,
//   matchResult: MatchResult | null
// ): string {
//   if (matchResult && typeof matchResult.score === "number") {
//     return `${matchResult.score}%`
//   }

//   if (candidate.matchScore > 0) {
//     return `${candidate.matchScore}%`
//   }

//   return "Not available"
// }

// function getEvidenceItems(
//   candidate: Candidate,
//   matchResult: MatchResult | null
// ): string[] {
//   if (matchResult?.matched_skills?.length) {
//     return matchResult.matched_skills.map((skill) => {
//       const skillName = skill.jd_skill || skill.candidate_skill
//       const strength = formatMatchStrength(skill.match_strength)

//       return `${skillName}: ${strength} evidence`
//     })
//   }

//   return candidate.evidence
// }



//-===-==-=-=-=-=-=-=-=

"use client"

import { useEffect, useState } from "react"
import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation"

import AppShell from "@/components/AppShell"

const API_BASE = "http://localhost:8000"

interface MatchSummary {
  jd_id: string
  sap_id: string
  candidate_name: string
  score: number
  rank: number
  reasoning: string

  matching_summary: {
    total_jd_skills: number
    total_candidate_skills: number
    exact_matches: number
    semantic_matches: number
    technology_family_matches: number
    total_matches: number
    match_percentage: number
  }

  matched_skills: Array<{
    jd_skill: string
    candidate_skill: string
    match_type: string
    match_strength: string
    match_reasoning: string
  }>

  unmatched_jd_skills: Array<{
    skill: string
    justification: string
    criticality:
      | "critical"
      | "important"
      | "nice-to-have"
  }>

  additional_candidate_skills: Array<{
    skill: string
    years_of_experience: number
    potential_value: string
  }>

  assessment_insights: {
    strengths: string[]
    gaps: string[]
    transferable_skills: string[]
    overall_fit_score: string
    recommendation: string
  }
}

type CandidateStatus =
  | "Available"
  | "In Pipeline"
  | "Deployed"

type ApiCandidate = {
  id: string
  sap_id: string
  name: string
  role: string | null
  experience_years: number | null
  location: string | null
  status: CandidateStatus | string | null
  summary?: string | null
  skills: string[]
}

type CandidatesApiResponse = {
  count: number
  candidates: ApiCandidate[]
}

type Candidate = {
  id: string
  sapid: string
  name: string
  role: string
  experience: number
  location: string
  status: CandidateStatus
  matchScore: number
  summary: string
  evidence: string[]
  currentStatus: string[]
}

type MatchResultSkill = {
  jd_skill: string
  candidate_skill: string
  match_type?: string
  candidate_experience_years?: number
  jd_justification?: string
  candidate_justification?: string
  match_strength: string
  match_reasoning?: string
}

type MatchResult = {
  id: string
  jd_id: string
  candidate_id: string | null
  sap_id: string
  candidate_name: string
  score: number
  rank: number | null
  reasoning: string
  matching_summary: Record<string, unknown>
  matched_skills: MatchResultSkill[]
  unmatched_jd_skills: unknown[]
  additional_candidate_skills: unknown[]

  assessment_insights: {
    recommendation?: string
    strengths?: string[]
    gaps?: string[]
    transferable_skills?: string[]
    overall_fit_score?: string | number
  }

  created_at: string
}

export default function CandidateSummaryPage() {
  /*
   * All navigation hooks are declared first.
   */
  const { jdId, sapId } = useParams<{
    jdId: string
    sapId: string
  }>()

  const searchParams = useSearchParams()
  const router = useRouter()

  const candidateKey = sapId || ""
  const matchResultId =
    searchParams.get("matchResultId")

  /*
   * All state hooks are declared before effects
   * and conditional returns.
   */
  const [data, setData] =
    useState<MatchSummary | null>(null)

  const [candidate, setCandidate] =
    useState<Candidate | null>(null)

  const [matchResult, setMatchResult] =
    useState<MatchResult | null>(null)

  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const [error, setError] =
    useState<string | null>(null)

  /*
   * Load the JD-specific summary.
   */
  useEffect(() => {
    async function fetchSummary() {
      if (!jdId || !sapId) {
        setError(
          "JD ID or SAP ID is missing from the URL."
        )
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          `${API_BASE}/api/jd-matching/summary/${encodeURIComponent(
            jdId
          )}/${encodeURIComponent(sapId)}`
        )

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "No summary found for this candidate."
              : "Failed to load summary."
          )
        }

        const result: MatchSummary =
          await response.json()

        setData(result)
      } catch (loadError) {
        console.error(
          "Failed to load JD summary:",
          loadError
        )

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Something went wrong."
        )
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [jdId, sapId])

  /*
   * Load the reusable candidate profile.
   */
  useEffect(() => {
    async function fetchCandidate() {
      if (!candidateKey) {
        setCandidate(null)
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)

        const response = await fetch(
          `${API_BASE}/api/candidates`
        )

        if (!response.ok) {
          throw new Error(
            "Failed to load candidate data."
          )
        }

        const result: CandidatesApiResponse =
          await response.json()

        const matchedCandidate =
          result.candidates.find(
            (item) =>
              item.sap_id === candidateKey ||
              item.id === candidateKey
          )

        setCandidate(
          matchedCandidate
            ? mapApiCandidateToSummary(
                matchedCandidate
              )
            : null
        )
      } catch (loadError) {
        console.error(
          "Failed to load candidate:",
          loadError
        )

        setError(
          "Unable to load candidate summary from backend."
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchCandidate()
  }, [candidateKey])

  /*
   * Load the optional old match-result endpoint only
   * when matchResultId is included in the URL.
   */
  useEffect(() => {
    async function fetchMatchResult() {
      if (!matchResultId) {
        setMatchResult(null)
        return
      }

      try {
        const response = await fetch(
          `${API_BASE}/api/jd-matching/results/${encodeURIComponent(
            matchResultId
          )}`
        )

        if (!response.ok) {
          throw new Error(
            "Failed to load match result."
          )
        }

        const result: MatchResult =
          await response.json()

        setMatchResult(result)
      } catch (loadError) {
        console.error(
          "Failed to load match result:",
          loadError
        )

        setMatchResult(null)
      }
    }

    fetchMatchResult()
  }, [matchResultId])

  /*
   * Non-hook values can be declared after hooks.
   */
  const criticalityColor: Record<
    string,
    string
  > = {
    critical: "bg-red-100 text-red-700",
    important: "bg-amber-100 text-amber-700",
    "nice-to-have":
      "bg-gray-100 text-gray-600",
  }

  /*
   * Conditional returns are now below all hooks.
   */
  if (loading || isLoading) {
    return (
      <AppShell title="Candidate Summary">
        <div className="flex min-h-[520px] items-center justify-center">
          <div className="w-full max-w-xl rounded-3xl border border-[#D9E2EF] bg-white p-10 text-center shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Loading candidate summary...
            </p>
          </div>
        </div>
      </AppShell>
    )
  }

  if (error) {
    return (
      <AppShell title="Candidate Summary">
        <div className="flex min-h-[520px] items-center justify-center">
          <div className="w-full max-w-xl rounded-3xl border border-red-200 bg-red-50 p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-red-700">
              Unable to load summary
            </h2>

            <p className="mt-3 text-sm leading-6 text-red-600">
              {error}
            </p>
          </div>
        </div>
      </AppShell>
    )
  }

  if (!data) {
    return null
  }

  if (!candidate) {
    return (
      <AppShell title="Candidate Summary">
        <div className="flex min-h-[520px] items-center justify-center">
          <div className="w-full max-w-xl rounded-3xl border border-[#D9E2EF] bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF2FF] text-2xl font-bold text-[#0F5FDC]">
              ?
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-950">
              Candidate not found
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              No candidate profile is available for SAP ID{" "}
              <span className="font-bold text-slate-700">
                {candidateKey}
              </span>
              .
            </p>
          </div>
        </div>
      </AppShell>
    )
  }

  const jdMatchValue = getJdMatchValue(
    candidate,
    matchResult
  )

  const evidenceItems = getEvidenceItems(
    candidate,
    matchResult
  )

  return (
    <>
      <AppShell title="Candidate Summary">
        <div className="space-y-8">
          <section className="rounded-3xl border border-[#D9E2EF] bg-white p-7 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-6">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-[#EAF2FF] text-3xl font-bold text-[#0F5FDC]">
                  {getInitials(candidate.name)}
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0F5FDC]">
                    Candidate Profile
                  </p>

                  <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                    {candidate.name}
                  </h2>

                  <p className="mt-2 text-base text-slate-600">
                    {candidate.role} |{" "}
                    {candidate.experience > 0
                      ? `${candidate.experience} years`
                      : "Experience unavailable"}{" "}
                    | {candidate.location}
                  </p>
                </div>
              </div>

              {/* <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
                <MetricCard
                  label="SAP ID"
                  value={candidate.sapid}
                />

                <MetricCard
                  label="JD Match"
                  value={jdMatchValue}
                />
              </div> */}
              <div className="grid gap-3 sm:grid-cols-3 ">
                <MetricCard
                  label="SAP ID"
                  value={candidate.sapid}
                />
                
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
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="rounded-3xl border border-[#D9E2EF] bg-white p-7 shadow-sm">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-950">
                    Profile Intelligence
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    AI-generated summary and matching rationale
                    for project discussion.
                  </p>
                </div>

                <CandidateStatusBadge
                  status={candidate.status}
                />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <SummaryBlock
                  title="AI Summary"
                  color="#0F5FDC"
                >
                  <p className="text-sm leading-7 text-slate-700">
                    {candidate.summary}
                  </p>
                </SummaryBlock>

                {/* <SummaryBlock
                  title="Match Evidence"
                  color="#6B2BD9"
                >
                  <ul className="space-y-3 text-sm text-slate-700">
                    {evidenceItems.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F5FDC]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </SummaryBlock> */}
                <SummaryBlock
                title="Match Evidence"
                color="#0F5FDC"
              >
                <ul className="space-y-3">
                  {data.assessment_insights.strengths
                    .length > 0 ? (
                    data.assessment_insights.strengths.map(
                      (strength, index) => (
                        <li
                          key={index}
                          className="flex gap-3 text-sm leading-6 text-slate-700"
                        >
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#0F5FDC]" />
                          <span>{strength}</span>
                        </li>
                      )
                    )
                  ) : (
                    <li className="text-sm text-slate-500">
                      No strengths available.
                    </li>
                  )}
                </ul>
              </SummaryBlock>
              </div>
            </div>

            <div className="rounded-3xl border border-[#D9E2EF] bg-white p-7 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-950">
                Current Status
              </h3>

              <div className="mt-5">
                <CandidateStatusBadge
                  status={candidate.status}
                />
              </div>

              <ul className="mt-6 space-y-4 text-sm text-slate-700">
                {candidate.currentStatus.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3"
                  >
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#14B8A6]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* <div className="rounded-2xl border border-[#D9E2EF] bg-[#F8FBFF] px-6 py-5 text-center text-sm font-bold text-slate-900 shadow-sm">
            Suggested business output: concise email-ready
            summary + key match points + transparent
            availability.
          </div> */}
          <div className="rounded-2xl border border-[#D9E2EF] bg-[#F8FBFF] px-6 py-5 text-center shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0F5FDC]">
              Suggested Business Output
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-900">
              {data.reasoning}
            </p>
          </div>
          {/* <div className="mt-6 rounded-2xl border border-[#D9E2EF] bg-[#F8FBFF] p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Matching Rationale
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
             
                {data.reasoning}
              </p>
            </div> */}
        </div>
      </AppShell>

      <AppShell title="Candidate Summary">
        <div className="space-y-8">
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

          <section>
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-slate-950">
                Matching Overview
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Skill-level comparison between the job
                description and candidate profile.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label="Technology Family Matches"
                value={String(
                  data.matching_summary
                    .technology_family_matches
                )}
              />

              <MetricCard
                label="Exact Matches"
                value={String(
                  data.matching_summary.exact_matches
                )}
              />

              <MetricCard
                label="Semantic Matches"
                value={String(
                  data.matching_summary.semantic_matches
                )}
              />

              <MetricCard
                label="Total Matches"
                value={String(
                  data.matching_summary.total_matches
                )}
              />
            </div>
          </section>

          <section className="rounded-3xl border border-[#D9E2EF] bg-white p-7 shadow-sm">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-950">
                Assessment Insights
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                AI-generated assessment of candidate
                strengths, gaps, and overall fit.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <SummaryBlock
                title="Strengths"
                color="#0F5FDC"
              >
                <ul className="space-y-3">
                  {data.assessment_insights.strengths
                    .length > 0 ? (
                    data.assessment_insights.strengths.map(
                      (strength, index) => (
                        <li
                          key={index}
                          className="flex gap-3 text-sm leading-6 text-slate-700"
                        >
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#0F5FDC]" />
                          <span>{strength}</span>
                        </li>
                      )
                    )
                  ) : (
                    <li className="text-sm text-slate-500">
                      No strengths available.
                    </li>
                  )}
                </ul>
              </SummaryBlock>

              <SummaryBlock
                title="Gaps"
                color="#DC2626"
              >
                <ul className="space-y-3">
                  {data.assessment_insights.gaps.length >
                  0 ? (
                    data.assessment_insights.gaps.map(
                      (gap, index) => (
                        <li
                          key={index}
                          className="flex gap-3 text-sm leading-6 text-slate-700"
                        >
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                          <span>{gap}</span>
                        </li>
                      )
                    )
                  ) : (
                    <li className="text-sm text-slate-500">
                      No significant gaps identified.
                    </li>
                  )}
                </ul>
              </SummaryBlock>

              <SummaryBlock
                title="Transferable Skills"
                color="#6B2BD9"
              >
                <ul className="space-y-3">
                  {data.assessment_insights
                    .transferable_skills.length > 0 ? (
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

              <SummaryBlock
                title="Overall Fit"
                color="#14B8A6"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#ECFDF3] text-xl font-bold text-[#16A34A]">
                    {
                      data.assessment_insights
                        .overall_fit_score
                    }
                  </div>

                  <p className="text-sm leading-6 text-slate-700">
                    Overall assessment based on skills,
                    matching evidence, and identified gaps.
                  </p>
                </div>
              </SummaryBlock>
            </div>

            <div className="mt-6 rounded-2xl border border-[#D9E2EF] bg-[#F8FBFF] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0F5FDC]">
                Recommendation
              </p>

              <p className="mt-3 text-sm leading-7 text-slate-700">
                {
                  data.assessment_insights
                    .recommendation
                }
              </p>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-[#D9E2EF] bg-white p-7 shadow-sm">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-950">
                  Matched Skills
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Skills from the JD supported by candidate
                  experience or equivalent expertise.
                </p>
              </div>

              <div className="space-y-3">
                {data.matched_skills.length > 0 ? (
                  data.matched_skills.map(
                    (match, index) => (
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
                              {formatMatchStrength(
                                match.match_strength
                              )}
                            </span>
                          </div>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-slate-600">
                          {match.match_reasoning}
                        </p>
                      </div>
                    )
                  )
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#D9E2EF] p-6 text-center text-sm text-slate-500">
                    No matched skills available.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-[#D9E2EF] bg-white p-7 shadow-sm">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-950">
                  Skill Gaps
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  JD requirements that are not sufficiently
                  supported by the candidate profile.
                </p>
              </div>

              <div className="space-y-3">
                {data.unmatched_jd_skills.length >
                0 ? (
                  data.unmatched_jd_skills.map(
                    (gap, index) => (
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
                              criticalityColor[
                                gap.criticality
                              ] ||
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {gap.criticality}
                          </span>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#D9E2EF] p-6 text-center text-sm text-slate-500">
                    No significant skill gaps identified.
                  </div>
                )}
              </div>
            </div>
          </section>

          {data.additional_candidate_skills.length >
            0 && (
            <section className="rounded-3xl border border-[#D9E2EF] bg-white p-7 shadow-sm">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-950">
                  Additional Candidate Skills
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Additional expertise that may provide
                  value beyond the core JD requirements.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.additional_candidate_skills.map(
                  (skill, index) => (
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
                  )
                )}
              </div>
            </section>
          )}

          <div className="rounded-2xl border border-[#D9E2EF] bg-[#F8FBFF] px-6 py-5 text-center shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0F5FDC]">
              Suggested Business Output
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-900">
              Concise candidate summary + key match points +
              transparent skill gaps for project discussion.
            </p>
          </div>
        </div>
      </AppShell>
    </>
  )
}

function mapApiCandidateToSummary(
  apiCandidate: ApiCandidate
): Candidate {
  return {
    id: apiCandidate.id,
    sapid: apiCandidate.sap_id,
    name: apiCandidate.name,
    role: apiCandidate.role || "Unknown",
    experience: apiCandidate.experience_years || 0,
    location: apiCandidate.location || "Unknown",
    status: normalizeStatus(apiCandidate.status),
    matchScore: 0,
    summary:
      apiCandidate.summary ||
      "Candidate profile summary is not available yet.",

    evidence: [
      "Profile extracted from uploaded resume",
      "Candidate data stored in SQLite",
      "Available for Talent Search",
      "Available for JD Matching",
    ],

    currentStatus: [
      "Candidate profile is active and ready for evaluation",
      "Resume information has been successfully processed",
      "Candidate is available for suitable project opportunities",
    ],
  }
}

function MetricCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
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
      <h4
        className="text-xl font-bold"
        style={{ color }}
      >
        {title}
      </h4>

      <div className="mt-5">
        {children}
      </div>
    </div>
  )
}

function CandidateStatusBadge({
  status,
}: {
  status: CandidateStatus
}) {
  const classes =
    status === "Available"
      ? "bg-[#ECFDF3] text-[#16A34A]"
      : status === "In Pipeline"
        ? "bg-[#FFF7E6] text-[#F59E0B]"
        : "bg-[#EAF2FF] text-[#0F5FDC]"

  const dotClass =
    status === "Available"
      ? "bg-[#16A34A]"
      : status === "In Pipeline"
        ? "bg-[#F59E0B]"
        : "bg-[#0F5FDC]"

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold ${classes}`}
    >
      <span
        className={`h-2.5 w-2.5 rounded-full ${dotClass}`}
      />
      {status}
    </span>
  )
}

function normalizeStatus(
  status: string | null | undefined
): CandidateStatus {
  if (status === "In Pipeline") {
    return "In Pipeline"
  }

  if (status === "Deployed") {
    return "Deployed"
  }

  return "Available"
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function getJdMatchValue(
  candidate: Candidate,
  matchResult: MatchResult | null
): string {
  if (
    matchResult &&
    typeof matchResult.score === "number"
  ) {
    return `${matchResult.score}%`
  }

  if (candidate.matchScore > 0) {
    return `${candidate.matchScore}%`
  }

  return "Not available"
}

function getEvidenceItems(
  candidate: Candidate,
  matchResult: MatchResult | null
): string[] {
  if (matchResult?.matched_skills?.length) {
    return matchResult.matched_skills.map(
      (skill) => {
        const skillName =
          skill.jd_skill ||
          skill.candidate_skill

        const strength = formatMatchStrength(
          skill.match_strength
        )

        return `${skillName}: ${strength} evidence`
      }
    )
  }

  return candidate.evidence
}

function formatMatchStrength(
  strength: string
): string {
  if (!strength) {
    return "Relevant"
  }

  return (
    strength.charAt(0).toUpperCase() +
    strength.slice(1)
  )
}
