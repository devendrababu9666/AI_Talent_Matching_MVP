// "use client"

// import { useEffect, useMemo, useState } from "react"

// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"

// type CandidateStatus = "Available" | "In Pipeline" | "Deployed"

// type Candidate = {
//   sapid: string
//   name: string
//   role: string
//   skills: string[]
//   experience: number
//   location: string
//   status: CandidateStatus
// }

// type ApiCandidate = {
//   id: string
//   sap_id: string
//   name: string
//   role: string | null
//   experience_years: number | null
//   location: string | null
//   status: string | null
//   summary?: string | null
//   skills: string[]
// }

// type CandidatesApiResponse = {
//   count: number
//   candidates: ApiCandidate[]
// }

// export default function TalentSearchPage() {
//   const [candidates, setCandidates] = useState<Candidate[]>([])
//   const [search, setSearch] = useState("")
//   const [status, setStatus] = useState("All")
//   const [role, setRole] = useState("All")
//   const [location, setLocation] = useState("All")
//   const [experience, setExperience] = useState("All")
//   const [currentPage, setCurrentPage] = useState(1)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState("")

//   const pageSize = 5

//   useEffect(() => {
//     fetchCandidates()
//   }, [])

//   async function fetchCandidates() {
//     setIsLoading(true)
//     setError("")

//     try {
//       const response = await fetch("http://localhost:8000/api/candidates")

//       if (!response.ok) {
//         throw new Error("Failed to load candidates.")
//       }

//       const data: CandidatesApiResponse = await response.json()

//       const mappedCandidates: Candidate[] = data.candidates.map((candidate) => ({
//         sapid: candidate.sap_id,
//         name: candidate.name,
//         role: candidate.role || "Unknown",
//         skills: candidate.skills || [],
//         experience: candidate.experience_years || 0,
//         location: candidate.location || "Unknown",
//         status: normalizeStatus(candidate.status),
//       }))

//       setCandidates(mappedCandidates)
//       setCurrentPage(1)
//     } catch (loadError) {
//       console.error(loadError)
//       setError("Unable to load candidates from backend.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   function handleViewSummary(sapid: string) {
//     window.location.href = `/cd-summary/${sapid}`
//   }

//   function handleSearch() {
//     setCurrentPage(1)
//   }

//   const roleOptions = useMemo(() => {
//     const values = candidates
//       .map((candidate) => candidate.role)
//       .filter(Boolean)

//     return ["All", ...Array.from(new Set(values))]
//   }, [candidates])

//   const locationOptions = useMemo(() => {
//     const values = candidates
//       .map((candidate) => candidate.location)
//       .filter(Boolean)

//     return ["All", ...Array.from(new Set(values))]
//   }, [candidates])

//   const filteredCandidates = useMemo(() => {
//     return candidates.filter((candidate) => {
//       const searchableText = [
//         candidate.sapid,
//         candidate.name,
//         candidate.skills.join(" "),
//         candidate.location,
//         candidate.role,
//         candidate.status,
//         `${candidate.experience} years`,
//       ]
//         .join(" ")
//         .toLowerCase()

//       const searchMatch =
//         search.trim() === "" ||
//         searchableText.includes(search.trim().toLowerCase())

//       const statusMatch =
//         status === "All" || candidate.status === status

//       const roleMatch =
//         role === "All" || candidate.role === role

//       const locationMatch =
//         location === "All" || candidate.location === location

//       const experienceMatch =
//         experience === "All" ||
//         (experience === "1+" && candidate.experience >= 1) ||
//         (experience === "3+" && candidate.experience >= 3) ||
//         (experience === "5+" && candidate.experience >= 5) ||
//         (experience === "8+" && candidate.experience >= 8) ||
//         (experience === "10+" && candidate.experience >= 10) ||
//         (experience === "12+" && candidate.experience >= 12)

//       return (
//         searchMatch &&
//         statusMatch &&
//         roleMatch &&
//         locationMatch &&
//         experienceMatch
//       )
//     })
//   }, [candidates, search, status, role, location, experience])

//   const totalPages = Math.max(1, Math.ceil(filteredCandidates.length / pageSize))

//   const paginatedCandidates = filteredCandidates.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   )

//   return (
//     <main className="min-h-screen bg-slate-50 px-6 py-8">
//       <div className="mx-auto max-w-7xl">
//         <Card className="border-slate-200 shadow-sm">
//           <CardHeader className="pb-4">
//             <div className="flex items-center justify-between">
//               <CardTitle className="text-2xl font-semibold text-slate-900">
//                 Search Talent Pool
//               </CardTitle>

//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={fetchCandidates}
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Refreshing..." : "Refresh"}
//               </Button>
//             </div>
//           </CardHeader>

//           <CardContent className="space-y-6">
//             {error ? (
//               <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
//                 {error}
//               </div>
//             ) : null}

//             <div className="flex gap-4">
//               <Input
//                 value={search}
//                 onChange={(event) => {
//                   setSearch(event.target.value)
//                   setCurrentPage(1)
//                 }}
//                 placeholder="Search name, SAP ID, skills, role, location..."
//                 className="h-14 flex-1 border-slate-300 bg-gray-100 px-5 text-sm"
//                 onKeyDown={(event) => {
//                   if (event.key === "Enter") {
//                     handleSearch()
//                   }
//                 }}
//               />

//               <Button
//                 type="button"
//                 onClick={handleSearch}
//                 className="h-14 w-32 bg-[#0F5FDC] font-medium hover:bg-[#0A6DB4]"
//               >
//                 Search
//               </Button>
//             </div>

//             <div className="grid grid-cols-4 gap-6">
//               <FilterSelect
//                 label="Status"
//                 value={status}
//                 onChange={(value) => {
//                   setStatus(value)
//                   setCurrentPage(1)
//                 }}
//                 options={["All", "Available", "In Pipeline", "Deployed"]}
//               />

//               <FilterSelect
//                 label="Role"
//                 value={role}
//                 onChange={(value) => {
//                   setRole(value)
//                   setCurrentPage(1)
//                 }}
//                 options={roleOptions}
//               />

//               <FilterSelect
//                 label="Location"
//                 value={location}
//                 onChange={(value) => {
//                   setLocation(value)
//                   setCurrentPage(1)
//                 }}
//                 options={locationOptions}
//               />

//               <FilterSelect
//                 label="Experience"
//                 value={experience}
//                 onChange={(value) => {
//                   setExperience(value)
//                   setCurrentPage(1)
//                 }}
//                 options={["All", "1+", "3+", "5+", "8+", "10+", "12+"]}
//               />
//             </div>

//             <div className="overflow-hidden rounded-md border border-slate-200">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-blue-50 hover:bg-blue-50">
//                     <TableHead className="font-semibold text-[#0F5FDC]">
//                       Candidate
//                     </TableHead>

//                     <TableHead className="font-semibold text-[#0F5FDC]">
//                       SAP ID
//                     </TableHead>

//                     <TableHead className="font-semibold text-[#0F5FDC]">
//                       Primary Skills
//                     </TableHead>

//                     <TableHead className="font-semibold text-[#0F5FDC]">
//                       Experience
//                     </TableHead>

//                     <TableHead className="font-semibold text-[#0F5FDC]">
//                       Location
//                     </TableHead>

//                     <TableHead className="font-semibold text-[#0F5FDC]">
//                       Status
//                     </TableHead>

//                     <TableHead className="font-semibold text-[#0F5FDC]">
//                       Action
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                   {isLoading ? (
//                     <TableRow>
//                       <TableCell
//                         colSpan={7}
//                         className="h-24 text-center text-slate-500"
//                       >
//                         Loading candidates...
//                       </TableCell>
//                     </TableRow>
//                   ) : paginatedCandidates.length > 0 ? (
//                     paginatedCandidates.map((candidate) => (
//                       <TableRow
//                         key={candidate.sapid}
//                         className="hover:bg-slate-50"
//                       >
//                         <TableCell className="font-medium text-slate-900">
//                           <div>
//                             <p>{candidate.name}</p>
//                             <p className="mt-1 text-xs text-slate-500">
//                               {candidate.role}
//                             </p>
//                           </div>
//                         </TableCell>

//                         <TableCell className="text-slate-600">
//                           {candidate.sapid}
//                         </TableCell>

//                         <TableCell className="text-slate-600">
//                           <div className="flex max-w-md flex-wrap gap-2">
//                             {candidate.skills.length > 0 ? (
//                               candidate.skills.slice(0, 5).map((skill) => (
//                                 <Badge
//                                   key={skill}
//                                   variant="outline"
//                                   className="border-blue-200 bg-blue-50 text-[#0F5FDC]"
//                                 >
//                                   {skill}
//                                 </Badge>
//                               ))
//                             ) : (
//                               <span className="text-xs text-slate-500">
//                                 No skills
//                               </span>
//                             )}

//                             {candidate.skills.length > 5 ? (
//                               <Badge variant="outline">
//                                 +{candidate.skills.length - 5}
//                               </Badge>
//                             ) : null}
//                           </div>
//                         </TableCell>

//                         <TableCell className="text-slate-600">
//                           {candidate.experience > 0
//                             ? `${candidate.experience} years`
//                             : "Unknown"}
//                         </TableCell>

//                         <TableCell className="text-slate-600">
//                           {candidate.location}
//                         </TableCell>

//                         <TableCell>
//                           <StatusText status={candidate.status} />
//                         </TableCell>

//                         <TableCell>
//                           <Button
//                             type="button"
//                             variant="link"
//                             onClick={() => handleViewSummary(candidate.sapid)}
//                             className="h-auto p-0 font-medium text-slate-800 hover:text-[#0F5FDC]"
//                           >
//                             View Summary
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell
//                         colSpan={7}
//                         className="h-24 text-center text-slate-500"
//                       >
//                         No candidates found.
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </div>

//             <div className="flex items-center justify-between">
//               <Badge className="rounded-md bg-[#0F5FDC] px-5 py-2 text-sm font-medium hover:bg-[#0F5FDC]">
//                 {filteredCandidates.length}{" "}
//                 {filteredCandidates.length === 1 ? "RESULT" : "RESULTS"}
//               </Badge>

//               <div className="flex items-center gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   disabled={currentPage === 1}
//                   onClick={() =>
//                     setCurrentPage((page) => Math.max(1, page - 1))
//                   }
//                 >
//                   Previous
//                 </Button>

//                 <span className="px-3 text-sm text-slate-600">
//                   Page {currentPage} of {totalPages}
//                 </span>

//                 <Button
//                   variant="outline"
//                   size="sm"
//                   disabled={currentPage === totalPages}
//                   onClick={() =>
//                     setCurrentPage((page) => Math.min(totalPages, page + 1))
//                   }
//                 >
//                   Next
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </main>
//   )
// }

// function FilterSelect({
//   label,
//   value,
//   onChange,
//   options,
// }: {
//   label: string
//   value: string
//   onChange: (value: string) => void
//   options: string[]
// }) {
//   return (
//     <div className="space-y-1.5">
//       <label className="px-1 text-[11px] font-medium text-slate-500">
//         {label}
//       </label>

//       <Select value={value} onValueChange={onChange}>
//         <SelectTrigger className="h-14 w-full border-slate-200 bg-white shadow-sm">
//           <SelectValue />
//         </SelectTrigger>

//         <SelectContent>
//           {options.map((option) => (
//             <SelectItem key={option} value={option}>
//               {option}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//     </div>
//   )
// }

// function StatusText({ status }: { status: CandidateStatus }) {
//   return (
//     <span
//       className={`inline-flex items-center gap-2 text-sm font-medium ${
//         status === "Available"
//           ? "text-emerald-600"
//           : status === "Deployed"
//             ? "text-blue-500"
//             : "text-amber-500"
//       }`}
//     >
//       <span
//         className={`h-2 w-2 rounded-full ${
//           status === "Available"
//             ? "bg-emerald-500"
//             : status === "Deployed"
//               ? "bg-blue-500"
//               : "bg-amber-500"
//         }`}
//       />

//       {status}
//     </span>
//   )
// }

// function normalizeStatus(status: string | null): CandidateStatus {
//   if (status === "In Pipeline") {
//     return "In Pipeline"
//   }

//   if (status === "Deployed") {
//     return "Deployed"
//   }

//   return "Available"
// }
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Target,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

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
    criticality: "critical" | "important" | "nice-to-have"
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

export default function CandidateSummaryPage() {
  const { jdId, sapId } = useParams<{
    jdId: string
    sapId: string
  }>()

  const router = useRouter()

  const [data, setData] = useState<MatchSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSummary() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(
          `${API_BASE}/api/jd-matching/summary/${jdId}/${sapId}`
        )

        if (!res.ok) {
          throw new Error(
            res.status === 404
              ? "No summary found for this candidate."
              : "Failed to load candidate summary."
          )
        }

        const json: MatchSummary = await res.json()

        setData(json)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        )
      } finally {
        setLoading(false)
      }
    }

    if (jdId && sapId) {
      fetchSummary()
    }
  }, [jdId, sapId])

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <Card>
            <CardContent className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0F5FDC]" />

                <p className="text-sm text-slate-500">
                  Loading candidate summary...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <Card className="border-red-200">
            <CardContent className="flex min-h-[250px] flex-col items-center justify-center text-center">
              <AlertCircle className="mb-3 h-10 w-10 text-red-500" />

              <h2 className="text-lg font-semibold text-slate-900">
                Unable to load summary
              </h2>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>

              <Button
                variant="outline"
                className="mt-5"
                onClick={() => router.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to matches
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  if (!data) {
    return null
  }

  const matchPercentage =
    data.matching_summary.match_percentage || 0

  const criticalityStyles: Record<string, string> = {
    critical:
      "border-red-200 bg-red-50 text-red-700",
    important:
      "border-amber-200 bg-amber-50 text-amber-700",
    "nice-to-have":
      "border-slate-200 bg-slate-50 text-slate-600",
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Back */}
        <Button
          variant="ghost"
          className="px-0 text-slate-500 hover:bg-transparent hover:text-[#0F5FDC]"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to matches
        </Button>

        {/* Candidate Header */}
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-lg font-semibold text-[#0F5FDC]">
                    {data.candidate_name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <h1 className="text-2xl font-semibold text-slate-900">
                      {data.candidate_name}
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                      SAP ID: {data.sap_id}
                    </p>
                  </div>
                </div>

                <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-600">
                  {data.reasoning}
                </p>
              </div>

              {/* Score */}
              <div className="min-w-[150px] rounded-xl border border-blue-100 bg-blue-50 p-5 text-center">
                <p className="text-4xl font-bold text-[#0F5FDC]">
                  {data.score}%
                </p>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  Match Score
                </p>

                <Separator className="my-3" />

                <p className="text-sm font-medium text-slate-700">
                  Rank #{data.rank}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Matching Overview */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Target className="h-5 w-5 text-[#0F5FDC]" />

            <h2 className="text-lg font-semibold text-slate-900">
              Matching Overview
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <MetricCard
              label="Match Percentage"
              value={`${matchPercentage}%`}
              icon={<TrendingUp className="h-4 w-4" />}
            />

            <MetricCard
              label="Exact Matches"
              value={data.matching_summary.exact_matches}
              icon={<CheckCircle2 className="h-4 w-4" />}
            />

            <MetricCard
              label="Semantic Matches"
              value={data.matching_summary.semantic_matches}
              icon={<Sparkles className="h-4 w-4" />}
            />

            <MetricCard
              label="Total Matches"
              value={data.matching_summary.total_matches}
              icon={<Target className="h-4 w-4" />}
            />

          </div>
        </div>

        {/* Match Progress */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">
              Overall Match
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Candidate fit against JD requirements
              </span>

              <span className="text-sm font-semibold text-[#0F5FDC]">
                {matchPercentage}%
              </span>
            </div>

            <Progress
              value={matchPercentage}
              className="mt-3 h-2"
            />
          </CardContent>
        </Card>

        {/* Matched Skills */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Matched Skills
              </CardTitle>

              <Badge
                variant="outline"
                className="border-emerald-200 bg-emerald-50 text-emerald-700"
              >
                {data.matched_skills.length} matched
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {data.matched_skills.length > 0 ? (
              data.matched_skills.map((skill, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-slate-200 bg-white p-4"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-[#0F5FDC] hover:bg-[#0F5FDC]">
                        {skill.jd_skill}
                      </Badge>

                      <span className="text-slate-400">
                        →
                      </span>

                      <Badge
                        variant="outline"
                        className="border-slate-300"
                      >
                        {skill.candidate_skill}
                      </Badge>
                    </div>

                    <Badge
                      variant="outline"
                      className="w-fit"
                    >
                      {skill.match_type}
                    </Badge>
                  </div>

                  <p className="mt-3 text-sm leading-5 text-slate-600">
                    {skill.match_reasoning}
                  </p>

                  {skill.match_strength && (
                    <p className="mt-2 text-xs font-medium text-slate-500">
                      Match strength:{" "}
                      <span className="text-slate-700">
                        {skill.match_strength}
                      </span>
                    </p>
                  )}
                </div>
              ))
            ) : (
              <EmptyState message="No matched skills found." />
            )}
          </CardContent>
        </Card>

        {/* Skill Gaps */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Skill Gaps
              </CardTitle>

              <Badge
                variant="outline"
                className="border-red-200 bg-red-50 text-red-700"
              >
                {data.unmatched_jd_skills.length} gaps
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {data.unmatched_jd_skills.length > 0 ? (
              data.unmatched_jd_skills.map((skill, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-medium text-slate-900">
                        {skill.skill}
                      </p>

                      <p className="mt-1 text-sm leading-5 text-slate-600">
                        {skill.justification}
                      </p>
                    </div>

                    <Badge
                      variant="outline"
                      className={
                        criticalityStyles[
                          skill.criticality
                        ]
                      }
                    >
                      {skill.criticality}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                No significant skill gaps identified.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Candidate Skills */}
        {data.additional_candidate_skills.length > 0 && (
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">
                Additional Candidate Skills
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {data.additional_candidate_skills.map(
                (skill, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {skill.skill}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {skill.years_of_experience} years
                        experience
                      </p>
                    </div>

                    <p className="max-w-xl text-sm text-slate-600">
                      {skill.potential_value}
                    </p>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        )}

        {/* Assessment Insights */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#0F5FDC]" />

              <CardTitle className="text-lg">
                Assessment Insights
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">

            {/* Strengths / Gaps */}
            <div className="grid gap-6 md:grid-cols-2">

              <InsightList
                title="Strengths"
                items={data.assessment_insights.strengths}
                variant="success"
              />

              <InsightList
                title="Gaps"
                items={data.assessment_insights.gaps}
                variant="danger"
              />

            </div>

            {/* Transferable Skills */}
            {data.assessment_insights
              .transferable_skills.length > 0 && (
              <>
                <Separator />

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-slate-900">
                    Transferable Skills
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {data.assessment_insights.transferable_skills.map(
                      (skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-blue-200 bg-blue-50 text-[#0F5FDC]"
                        >
                          {skill}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Overall Fit */}
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Overall Fit
                  </p>

                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {data.assessment_insights.overall_fit_score}
                  </p>
                </div>

                <Sparkles className="h-6 w-6 text-[#0F5FDC]" />
              </div>
            </div>

            {/* Recommendation */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Recommendation
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-700">
                {data.assessment_insights.recommendation}
              </p>
            </div>

          </CardContent>
        </Card>

        {/* IDs / Debug information */}
        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
              <span>
                <strong>JD ID:</strong> {data.jd_id}
              </span>

              <span>
                <strong>SAP ID:</strong> {data.sap_id}
              </span>
            </div>
          </CardContent>
        </Card>

      </div>
    </main>
  )
}

/* ---------------------------------- */
/* Metric Card */
/* ---------------------------------- */

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
}) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#0F5FDC]">
            {icon}
          </div>
        </div>

        <p className="mt-4 text-2xl font-bold text-slate-900">
          {value}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {label}
        </p>
      </CardContent>
    </Card>
  )
}

/* ---------------------------------- */
/* Insight List */
/* ---------------------------------- */

function InsightList({
  title,
  items,
  variant,
}: {
  title: string
  items: string[]
  variant: "success" | "danger"
}) {
  const isSuccess = variant === "success"

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        {isSuccess ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        ) : (
          <AlertCircle className="h-4 w-4 text-red-500" />
        )}

        <h3 className="text-sm font-semibold text-slate-900">
          {title}
        </h3>
      </div>

      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className={`rounded-md border p-3 text-sm ${
                isSuccess
                  ? "border-emerald-100 bg-emerald-50 text-emerald-800"
                  : "border-red-100 bg-red-50 text-red-800"
              }`}
            >
              {item}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          No {title.toLowerCase()} identified.
        </p>
      )}
    </div>
  )
}

function EmptyState({
  message,
}: {
  message: string
}) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
      {message}
    </div>
  )
}