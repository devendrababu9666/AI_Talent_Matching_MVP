"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import AppShell from "@/components/AppShell"

type CandidateStatus = "Available" | "In Pipeline" | "Deployed"

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

export default function CandidateSummaryPage() {
  const params = useParams()
  const candidateKey = String(params.id || "")

  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchCandidate()
  }, [candidateKey])

  async function fetchCandidate() {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:8000/api/candidates")

      if (!response.ok) {
        throw new Error("Failed to load candidate data.")
      }

      const data: CandidatesApiResponse = await response.json()

      const matchedCandidate = data.candidates.find(
        (item) => item.sap_id === candidateKey || item.id === candidateKey
      )

      if (!matchedCandidate) {
        setCandidate(null)
        return
      }

      setCandidate(mapApiCandidateToSummary(matchedCandidate))
    } catch (loadError) {
      console.error(loadError)
      setError("Unable to load candidate summary from backend.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
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
    )
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
                  {candidate.role} |{" "}
                  {candidate.experience > 0
                    ? `${candidate.experience} years`
                    : "Experience unavailable"}{" "}
                  | {candidate.location}
                </p>
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
                  AI-generated summary and matching rationale for project discussion.
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
  )
}

function mapApiCandidateToSummary(apiCandidate: ApiCandidate): Candidate {
  return {
    id: apiCandidate.id,
    sapid: apiCandidate.sap_id,
    name: apiCandidate.name,
    role: apiCandidate.role || "Unknown",
    experience: apiCandidate.experience_years || 0,
    location: apiCandidate.location || "Unknown",
    status: normalizeStatus(apiCandidate.status),
    matchScore: 92,
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
      "Profile extracted from uploaded resume",
      "Candidate data stored in SQLite",
      "Available for Talent Search and JD Matching",
    ],
  }
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

function CandidateStatusBadge({ status }: { status: CandidateStatus }) {
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
      <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
      {status}
    </span>
  )
}

function normalizeStatus(status: string | null): CandidateStatus {
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