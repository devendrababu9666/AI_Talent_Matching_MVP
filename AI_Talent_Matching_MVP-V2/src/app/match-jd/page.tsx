"use client"

import { useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"
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

type CandidateStatus = "Available" | "In Pipeline" | "Deployed"

type JDMatchingApiSkill = {
  skill: string
  justification: string
}

type JDMatchedSkill = {
  jd_skill: string
  candidate_skill: string
  match_type?: string
  candidate_experience_years?: number | string | null
  jd_justification?: string
  candidate_justification?: string
  match_strength?: string
  match_reasoning?: string
}

type RankedCandidate = {
  sapid: string
  name: string
  skills: string[]
  matchScore: number
  status: CandidateStatus
  matchResultId?: string
}

type ExtractedCriteria = {
  skills: string[]
  experience: string
  role: string
  location: string
}

type JDMatchingApiMatch = {
  candidate_id?: string
  sap_id: string
  name: string
  role?: string
  experience_years?: number
  location?: string
  status: CandidateStatus | string
  skills: Array<string | JDMatchingApiSkill>
  match_score: number
  recommendation?: string
  match_result_id?: string
  matched_skills?: JDMatchedSkill[]
  skill_analysis?: {
    matched_skills?: JDMatchedSkill[]
  }
}

type JDMatchingApiResponse = {
  status: string
  jd: {
    primary_skills?: string[]
    skills?: string[]
    matching_skills?: JDMatchingApiSkill[]
    role: string | null
    location: string | null
    experience_min: number | null
    experience_max: number | null
  }
  matches: JDMatchingApiMatch[]
  business_decision: {
    supported?: boolean
    recommendation?: string
    total_matches?: number
  } | null
  errors: string[]
}

export default function MatchJDPage() {
  const [inputMode, setInputMode] = useState<"upload" | "paste">("upload")
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [jdText, setJdText] = useState("")

  const [extractedCriteria, setExtractedCriteria] =
    useState<ExtractedCriteria>({
      skills: [],
      experience: "Not extracted yet",
      role: "Not extracted yet",
      location: "Not extracted yet",
    })

  const [rankedCandidates, setRankedCandidates] = useState<RankedCandidate[]>([])
  const [businessRecommendation, setBusinessRecommendation] = useState("")
  const [isMatching, setIsMatching] = useState(false)
  const [matchError, setMatchError] = useState("")

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (file) {
      setUploadedFile(file.name)
    }
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)

    const input = document.getElementById(
      "jd-file"
    ) as HTMLInputElement | null

    if (input) {
      input.value = ""
    }
  }

  const handleAnalyzeJD = async () => {
    if (!jdText.trim()) {
      setMatchError("Please paste a job description first.")
      return
    }

    setIsMatching(true)
    setMatchError("")
    setRankedCandidates([])
    setBusinessRecommendation("")

    try {
      const response = await fetch(
        "http://localhost:8000/api/jd-matching/match",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jd_text: jdText,
          }),
        }
      )

      if (!response.ok) {
        const errorResponse = await response.json().catch(() => null)

        throw new Error(
          errorResponse?.detail || "JD matching failed."
        )
      }

      const data: JDMatchingApiResponse = await response.json()

      const primarySkills = (
        data.jd.primary_skills ||
        data.jd.skills ||
        []
      ).slice(0, 4)

      setExtractedCriteria({
        skills: primarySkills,
        experience: getExperienceText(
          data.jd.experience_min,
          data.jd.experience_max
        ),
        role: data.jd.role || "Not specified",
        location: data.jd.location || "Not specified",
      })

      const mappedCandidates: RankedCandidate[] = data.matches.map(
        (match) => ({
          sapid: match.sap_id,
          name: match.name,
          skills: extractMatchedSkillNames(match),
          matchScore: match.match_score || 0,
          status: normalizeStatus(match.status),
          matchResultId: match.match_result_id,
        })
      )

      setRankedCandidates(mappedCandidates)
      setBusinessRecommendation(
        data.business_decision?.recommendation || ""
      )

      if (data.errors?.length > 0 && mappedCandidates.length === 0) {
        setMatchError(data.errors.join(" "))
      }
    } catch (error) {
      console.error(error)

      if (error instanceof Error) {
        setMatchError(error.message)
      } else {
        setMatchError("Something went wrong while matching JD.")
      }
    } finally {
      setIsMatching(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="space-y-6">
              <div className="space-y-4">
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

                {inputMode === "upload" && (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                    <p className="text-sm font-medium text-slate-700">
                      Upload job description
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      PDF, DOC, DOCX or TXT
                    </p>

                    <div className="mt-4">
                      <Input
                        id="jd-file"
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileUpload}
                        className="cursor-pointer bg-white"
                      />
                    </div>

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

                {inputMode === "paste" && (
                  <div className="space-y-3">
                    <Textarea
                      value={jdText}
                      onChange={(event) =>
                        setJdText(event.target.value)
                      }
                      placeholder="Paste the job description here..."
                      className="h-[300px] max-h-[300px] min-h-[300px] resize-none overflow-y-auto border-slate-300 bg-white"
                    />

                    <Button
                      className="w-full bg-[#0F5FDC] hover:bg-[#0A6DB4]"
                      disabled={!jdText.trim() || isMatching}
                      onClick={handleAnalyzeJD}
                    >
                      {isMatching ? "Matching..." : "Analyze JD"}
                    </Button>
                  </div>
                )}
              </div>

              {matchError ? (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                  {matchError}
                </div>
              ) : null}

              <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                  Extracted criteria
                </h3>

                <div className="flex flex-wrap gap-2">
                  {extractedCriteria.skills.length > 0 ? (
                    extractedCriteria.skills.map((skill) => (
                      <Badge
                        key={skill}
                        className="rounded-md bg-[#0F5FDC] px-3 py-1.5 text-xs hover:bg-[#0F5FDC]"
                      >
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500">
                      Analyze a JD to extract skills.
                    </p>
                  )}
                </div>
              </div>

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

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    Ranked matches
                  </CardTitle>
                </div>

                <Badge
                  variant="outline"
                  className="border-blue-200 bg-blue-50 text-[#0F5FDC]"
                >
                  {rankedCandidates.length}{" "}
                  {rankedCandidates.length === 1
                    ? "match"
                    : "matches"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {rankedCandidates.length > 0 ? (
                rankedCandidates.map((candidate, index) => (
                  <CandidateMatch
                    key={candidate.sapid}
                    candidate={candidate}
                    rank={index + 1}
                  />
                ))
              ) : (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                  Paste a JD and click Analyze JD to view ranked matches.
                </div>
              )}

              <div className="mt-6 grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Business decision
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {rankedCandidates.length > 0
                      ? "Supported"
                      : "Pending"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Recommendation
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {businessRecommendation ||
                      "Run JD matching to generate recommendation."}
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
  const summaryHref = candidate.matchResultId
    ? `/summary/${candidate.sapid}?matchResultId=${candidate.matchResultId}`
    : `/summary/${candidate.sapid}`

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-sm font-semibold text-[#0F5FDC]">
          {rank}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900">
            {candidate.name}
          </p>

          <p className="mt-1 truncate text-xs text-slate-500">
            {candidate.skills.length > 0
              ? candidate.skills.join(" | ")
              : "No matched skills"}
          </p>
        </div>

        <div className="w-20 text-center">
          <p className="text-2xl font-bold text-[#0F5FDC]">
            {candidate.matchScore}%
          </p>

          <Progress
            value={candidate.matchScore}
            className="mt-1 h-1.5"
          />
        </div>

        <div className="hidden w-28 sm:block">
          <StatusBadge status={candidate.status} />
        </div>

        <Button
          variant="link"
          className="shrink-0 font-medium text-slate-700 hover:text-[#0F5FDC]"
        >
          <Link href={summaryHref}>
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

function extractMatchedSkillNames(
  match: JDMatchingApiMatch
): string[] {
  const matchedSkills =
    match.matched_skills ||
    match.skill_analysis?.matched_skills ||
    []

  const skillNames = matchedSkills
    .map((item) => item.jd_skill || item.candidate_skill)
    .filter(
      (skill): skill is string =>
        typeof skill === "string" &&
        skill.trim().length > 0
    )
    .map((skill) => skill.trim())

  return Array.from(new Set(skillNames))
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

function getExperienceText(
  experienceMin: number | null,
  experienceMax: number | null
) {
  if (
    experienceMin !== null &&
    experienceMax !== null
  ) {
    return `${experienceMin}-${experienceMax} years`
  }

  if (experienceMin !== null) {
    return `${experienceMin}+ years`
  }

  if (experienceMax !== null) {
    return `Up to ${experienceMax} years`
  }

  return "Not specified"
}