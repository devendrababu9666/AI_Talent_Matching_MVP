"use client";
 
import { useMemo } from "react";
import { useParams } from "next/navigation";
 
import AppShell from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
 
type CandidateStatus = "Available" | "In Pipeline" | "Deployed";
 
type Candidate = {
  id: string;
  sapid: string;
  name: string;
  role: string;
  skills: string[];
  experience: number;
  location: string;
  status: CandidateStatus;
  matchScore: number;
  summary: string;
  evidence: string[];
  currentStatus: string[];
};
 
const candidates: Candidate[] = [
  {
    id: "1",
    sapid: "100001",
    name: "Mallikarjuna Patil",
    role: "AI Architect",
    skills: ["RAG", "Azure OpenAI", "Python"],
    experience: 13,
    location: "Bangalore",
    status: "Available",
    matchScore: 92,
    summary:
      "Senior AI professional with strong experience in RAG solution design, Azure OpenAI implementation and Python-based AI integration. Suitable for AI architecture, solution leadership and customer-facing technical discussions.",
    evidence: [
      "RAG: Strong evidence",
      "Azure OpenAI: Strong evidence",
      "Python: Strong evidence",
      "Enterprise AI solution design: Good evidence",
    ],
    currentStatus: [
      "Ready to be shared with project team",
      "No active project pipeline",
      "Available for customer discussion",
    ],
  },
  {
    id: "2",
    sapid: "100002",
    name: "Profile B",
    role: "AI Architect",
    skills: ["Agents", "LangGraph"],
    experience: 10,
    location: "Bangalore",
    status: "Available",
    matchScore: 86,
    summary:
      "AI architect profile with experience in agentic AI solution patterns and LangGraph-based orchestration. Suitable for AI workflow design, agent architecture and technical discovery discussions.",
    evidence: [
      "Agents: Strong evidence",
      "LangGraph: Strong evidence",
      "Architecture: Good evidence",
      "RAG: Partial evidence",
    ],
    currentStatus: [
      "Ready to be shared",
      "Available for project mapping",
      "Suitable for architecture discussions",
    ],
  },
  {
    id: "3",
    sapid: "100003",
    name: "Profile C",
    role: "AI Architect",
    skills: ["Python", "FastAPI", "RAG"],
    experience: 9,
    location: "Bangalore",
    status: "In Pipeline",
    matchScore: 82,
    summary:
      "AI engineering profile with Python, FastAPI and RAG implementation experience. Suitable for backend AI integration, API development and search-based AI solution implementation.",
    evidence: [
      "Python: Strong evidence",
      "FastAPI: Strong evidence",
      "RAG: Strong evidence",
      "Azure OpenAI: Partial evidence",
    ],
    currentStatus: [
      "Profile already shared",
      "Pipeline stage needs confirmation",
      "Visible with project context",
    ],
  },
  {
    id: "4",
    sapid: "100004",
    name: "Siddesh",
    role: "AI Engineer",
    skills: ["FastAPI", "RAG", "Agents"],
    experience: 10,
    location: "Hyderabad",
    status: "In Pipeline",
    matchScore: 88,
    summary:
      "AI engineering professional with experience in backend APIs, RAG implementation and agent-based solution patterns. Suitable for technical implementation and AI platform integration roles.",
    evidence: [
      "FastAPI: Strong evidence",
      "RAG: Strong evidence",
      "Agents: Strong evidence",
      "Azure OpenAI: Partial evidence",
    ],
    currentStatus: [
      "Profile already shared",
      "Screening or discussion may be in progress",
      "Visible with project context",
    ],
  },
  {
    id: "5",
    sapid: "100005",
    name: "Rihan Y",
    role: "GenAI Engineer",
    skills: ["GenAI", "LangGraph", "Python"],
    experience: 9,
    location: "Chennai",
    status: "Deployed",
    matchScore: 84,
    summary:
      "GenAI professional with Python, LangGraph and AI workflow implementation experience. Suitable for AI application engineering and orchestration-focused assignments.",
    evidence: [
      "GenAI: Strong evidence",
      "LangGraph: Strong evidence",
      "Python: Strong evidence",
      "RAG: Partial evidence",
    ],
    currentStatus: [
      "Currently allocated to active project",
      "Excluded from active shortlist by default",
      "Can be reviewed for future demand",
    ],
  },
];
 
export default function CandidateSummaryPage() {
  const params = useParams();
  const candidateKey = String(params.id);
 
  const candidate = useMemo(() => {
    return candidates.find(
      (item) => item.sapid === candidateKey || item.id === candidateKey
    );
  }, [candidateKey]);
 
  /*
    Future dynamic database/API integration:
 
    Replace the mock candidates array with an API call.
 
    Example:
    GET /api/candidates/{candidateKey}
 
    const response = await fetch(`/api/candidates/${candidateKey}`);
    const candidate = await response.json();
 
    The UI below can remain mostly the same if the API returns:
    {
      id,
      sapid,
      name,
      role,
      skills,
      experience,
      location,
      status,
      matchScore,
      summary,
      evidence,
      currentStatus
    }
  */
 
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
              No candidate profile is available for ID or SAP ID{" "}
              <span className="font-bold text-slate-700">{candidateKey}</span>.
            </p>
          </div>
        </div>
      </AppShell>
    );
  }
 
  return (
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
                  {candidate.role} | {candidate.experience} years |{" "}
                  {candidate.location}
                </p>
 
                <div className="mt-4 flex flex-wrap gap-2">
                  {candidate.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="rounded-full bg-[#EAF2FF] px-3 py-1 text-xs font-bold text-[#0F5FDC]"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
 
            <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
              <MetricCard label="SAP ID" value={candidate.sapid} />
              <MetricCard label="JD Match" value={`${candidate.matchScore}%`} />
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
                  AI-generated summary and matching rationale for project
                  discussion.
                </p>
              </div>
 
              <CandidateStatusBadge status={candidate.status} />
            </div>
 
            <div className="grid gap-6 lg:grid-cols-2">
              <SummaryBlock title="AI Summary" color="#0F5FDC">
                <p className="text-sm leading-7 text-slate-700">
                  {candidate.summary}
                </p>
              </SummaryBlock>
 
              <SummaryBlock title="Match Evidence" color="#6B2BD9">
                <ul className="space-y-3 text-sm text-slate-700">
                  {candidate.evidence.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#0F5FDC]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </SummaryBlock>
            </div>
          </div>
 
          <div className="rounded-3xl border border-[#D9E2EF] bg-white p-7 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-950">
              Current Status
            </h3>
 
            <div className="mt-5">
              <CandidateStatusBadge status={candidate.status} />
            </div>
 
            <ul className="mt-6 space-y-4 text-sm text-slate-700">
              {candidate.currentStatus.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#14B8A6]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
 
function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#D9E2EF] bg-[#F8FBFF] p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
 
      <p className="mt-2 text-2xl font-bold text-[#0F5FDC]">{value}</p>
    </div>
  );
}
 
function SummaryBlock({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#D9E2EF] bg-[#F8FBFF] p-6">
      <h4 className="text-xl font-bold" style={{ color }}>
        {title}
      </h4>
 
      <div className="mt-5">{children}</div>
    </div>
  );
}
 
function CandidateStatusBadge({ status }: { status: CandidateStatus }) {
  const classes =
    status === "Available"
      ? "bg-[#ECFDF3] text-[#16A34A]"
      : status === "In Pipeline"
        ? "bg-[#FFF7E6] text-[#F59E0B]"
        : "bg-[#EAF2FF] text-[#0F5FDC]";
 
  const dotClass =
    status === "Available"
      ? "bg-[#16A34A]"
      : status === "In Pipeline"
        ? "bg-[#F59E0B]"
        : "bg-[#0F5FDC]";
 
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold ${classes}`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
      {status}
    </span>
  );
}
 
function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}