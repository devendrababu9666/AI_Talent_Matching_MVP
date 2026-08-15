"use client"

import { useState } from "react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"

type RankedCandidate = {
  sapid: string
  name: string
  skills: string[]
  matchScore: number
  status: "Available" | "In Pipeline" | "Deployed"
}

type ExtractedCriteria = {
  skills: string[]
  experience: string
  role: string
  location: string
}

const extractedCriteria: ExtractedCriteria = {
  skills: ["RAG", "LangGraph", "Azure OpenAI", "Python"],
  experience: "8–12 years",
  role: "AI Solution Lead",
  location: "Bangalore preferred",
}

const rankedCandidates: RankedCandidate[] = [
  {
    sapid: "100001",
    name: "Mallikarjuna Patil",
    skills: ["RAG", "Azure OpenAI", "Python"],
    matchScore: 92,
    status: "Available",
  },
  {
    sapid: "100004",
    name: "Siddesh",
    skills: ["FastAPI", "RAG", "Agents"],
    matchScore: 85,
    status: "Deployed",
  },
  {
    sapid: "100005",
    name: "Rihan Y",
    skills: ["GenAI", "LangGraph", "Python"],
    matchScore: 78,
    status: "In Pipeline",
  },
  {
    sapid: "100006",
    name: "Prachi Bhatt",
    skills: ["GenAI", "FastAPI", "Python"],
    matchScore: 68,
    status: "In Pipeline",
  }
]

export default function MatchJDPage() {
//   const [uploadedFile, setUploadedFile] = useState<string | null>(null)
    const [inputMode, setInputMode] = useState<"upload" | "paste">("upload")
    const [uploadedFile, setUploadedFile] = useState<string | null>(null)
    const [jdText, setJdText] = useState("")

    const handleFileUpload = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0]

        if (file) {
        setUploadedFile(file.name)

        // const response = await fetch("/api/match-jd", ...)
        }
    }
    const handleRemoveFile = () => {
        setUploadedFile(null)

    // Reset the actual file input
    const input = document.getElementById("jd-file") as HTMLInputElement | null

    if (input) {
        input.value = ""
    }
    }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Page heading */}
        {/* <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            JD Matching
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Upload a job description to identify and rank relevant talent.
          </p>
        </div> */}

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">

          {/* LEFT — JD Upload / Criteria */}
          <Card className="border-slate-200 shadow-sm">
            {/* <CardHeader>
              <CardTitle className="text-lg">
                Upload / Paste JD
              </CardTitle>
            </CardHeader> */}

            <CardContent className="space-y-6">

              {/* Upload */}
              {/* <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="cursor-pointer bg-white"
                />

                {uploadedFile && (
                  <div className="mt-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
                    <span className="font-medium">
                      {uploadedFile}
                    </span>
                    <br />
                    JD uploaded successfully
                  </div>
                )}
              </div> */}
              {/* JD Input */}
                <div className="space-y-4">

                {/* Input mode */}
                <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1">
                    <button
                    type="button"
                    onClick={() => setInputMode("upload")}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                        inputMode === "upload"
                        ? "bg-white text-[#0F5FDC] shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                    >
                    Upload JD
                    </button>

                    <button
                        type="button"
                        onClick={() => setInputMode("paste")}
                        className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                            inputMode === "paste"
                            ? "bg-white text-[#0F5FDC] shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                    Paste JD
                    </button>
                </div>

                {/* Upload mode */}
                {inputMode === "upload" && (
                    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                    <p className="text-sm font-medium text-slate-700">
                        Upload job description
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        PDF, DOC, DOCX or TXT
                    </p>

                    <div className="mt-4">
                        {/* <Input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileUpload}
                        className="cursor-pointer bg-white"
                        /> */}
                        <Input
                            id="jd-file"
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={handleFileUpload}
                            className="cursor-pointer bg-white"
                        />
                    </div>

                    {/* {uploadedFile && (
                        <div className="mt-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-left text-sm text-blue-700">
                        <span className="font-medium">
                            {uploadedFile}
                        </span>

                        <p className="mt-0.5 text-xs">
                            JD uploaded successfully
                        </p>
                        </div>
                    )} */}
                    {uploadedFile && (
                        <div className="mt-3 flex items-center justify-between rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-left">
                            <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-blue-700">
                                {uploadedFile}
                            </p>
                            <p className="text-xs text-blue-600">
                                JD uploaded successfully
                            </p>
                            </div>

                            <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="ml-3 rounded-md p-1 text-slate-500 hover:bg-white hover:text-slate-700"
                            aria-label="Remove uploaded file"
                            >
                            <X className="h-4 w-4" />
                            </button>
                        </div>
                        )}
                    </div>
                )}

                {/* Paste mode */}
                {inputMode === "paste" && (
                    <div className="space-y-3">
                    <Textarea
                        value={jdText}
                        onChange={(e) => setJdText(e.target.value)}
                        placeholder="Paste the job description here..."
                        className="min-h-[100px] resize-none border-slate-300 bg-white"
                    />

                    <Button
                        className="w-full bg-[#0F5FDC] hover:bg-[#0A6DB4]"
                        disabled={!jdText.trim()}
                        onClick={() => {
                        console.log("JD text submitted:", jdText)
                        // Later: call FastAPI
                        }}
                    >
                        Analyze JD
                    </Button>
                    </div>
                )}

                </div>

              {/* Extracted criteria */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                  Extracted criteria
                </h3>

                <div className="flex flex-wrap gap-2">
                  {extractedCriteria.skills.map((skill) => (
                    <Badge
                      key={skill}
                      className="rounded-md bg-[#0F5FDC] px-3 py-1.5 text-xs hover:bg-[#0F5FDC]"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Criteria details */}
              <div className="space-y-3 border-t border-slate-200 pt-4">
                <CriteriaRow
                  label="Experience"
                  value={extractedCriteria.experience}
                />

                <CriteriaRow
                  label="Role"
                  value={extractedCriteria.role}
                />

                <CriteriaRow
                  label="Location"
                  value={extractedCriteria.location}
                />
              </div>

            </CardContent>
          </Card>

          {/* RIGHT — Ranked matches */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    Ranked matches
                  </CardTitle>

                  {/* <p className="mt-1 text-sm text-slate-500">
                    Candidates ranked based on JD requirements.
                  </p> */}
                </div>

                <Badge
                  variant="outline"
                  className="border-blue-200 bg-blue-50 text-[#0F5FDC]"
                >
                  {rankedCandidates.length} matches
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">

              {rankedCandidates.map((candidate, index) => (
                <CandidateMatch
                  key={candidate.sapid}
                  candidate={candidate}
                  rank={index + 1}
                />
              ))}

              {/* Business decision */}
              <div className="mt-6 grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Business decision
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-800">
                    Supported
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Recommendation
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    Prioritize available talent; retain in-pipeline
                    profiles as clearly flagged.
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>

        </div>
      </div>
    </main>
  )
}

function CriteriaRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-0.5 text-sm text-slate-700">
        {value}
      </p>
    </div>
  )
}

function CandidateMatch({
  candidate,
  rank,
}: {
  candidate: RankedCandidate
  rank: number
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-center gap-4">

        {/* Rank */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-sm font-semibold text-[#0F5FDC]">
          {rank}
        </div>

        {/* Candidate */}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900">
            {candidate.name}
          </p>

          <p className="mt-1 truncate text-xs text-slate-500">
            {candidate.skills.join(" | ")}
          </p>
        </div>

        {/* Score */}
        <div className="w-20 text-center">
          <p className="text-2xl font-bold text-[#0F5FDC]">
            {candidate.matchScore}%
          </p>

          <Progress
            value={candidate.matchScore}
            className="mt-1 h-1.5"
          />
        </div>

        {/* Status */}
        <div className="hidden w-28 sm:block">
          <StatusBadge status={candidate.status} />
        </div>

        {/* Summary */}
        <Button
          variant="link"
          className="shrink-0 font-medium text-slate-700 hover:text-[#0F5FDC]"
        >
          <Link href={`/summary/${candidate.sapid}`}>
            View Summary
          </Link>
        </Button>

      </div>
    </div>
  )
}

function StatusBadge({
  status,
}: {
  status: RankedCandidate["status"]
}) {
  const styles = {
    Available:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    "In Pipeline":
      "border-amber-200 bg-amber-50 text-amber-700",
    Deployed:
      "border-blue-200 bg-blue-50 text-blue-700",
  }

  return (
    <Badge
      variant="outline"
      className={styles[status]}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </Badge>
  )
}