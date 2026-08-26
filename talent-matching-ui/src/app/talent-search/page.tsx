"use client"

import { useEffect, useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { useRouter } from "next/navigation"

type CandidateStatus = "Available" | "In Pipeline" | "Deployed"

type Candidate = {
  sapid: string
  name: string
  role: string
  skills: string[]
  experience: number
  location: string
  status: CandidateStatus
}

type ApiCandidate = {
  id: string
  sap_id: string
  name: string
  role: string | null
  experience_years: number | null
  location: string | null
  status: string | null
  summary?: string | null
  skills: string[]
}

type CandidatesApiResponse = {
  count: number
  candidates: ApiCandidate[]
}

export default function TalentSearchPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("All")
  const [role, setRole] = useState("All")
  const [location, setLocation] = useState("All")
  const [experience, setExperience] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  const pageSize = 5

  useEffect(() => {
    fetchCandidates()
  }, [])

  async function fetchCandidates() {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:8000/api/candidates")

      if (!response.ok) {
        throw new Error("Failed to load candidates.")
      }

      const data: CandidatesApiResponse = await response.json()

      const mappedCandidates: Candidate[] = data.candidates.map((candidate) => ({
        sapid: candidate.sap_id,
        name: candidate.name,
        role: candidate.role || "Unknown",
        skills: candidate.skills || [],
        experience: candidate.experience_years || 0,
        location: candidate.location || "Unknown",
        status: normalizeStatus(candidate.status),
      }))

      setCandidates(mappedCandidates)
      setCurrentPage(1)
    } catch (loadError) {
      console.error(loadError)
      setError("Unable to load candidates from backend.")
    } finally {
      setIsLoading(false)
    }
  }

 function handleViewSummary(sapid: string) {
    router.push(`/cd-summary/${sapid}`)
  }

  function handleSearch() {
    setCurrentPage(1)
  }

  const roleOptions = useMemo(() => {
    const values = candidates
      .map((candidate) => candidate.role)
      .filter(Boolean)

    return ["All", ...Array.from(new Set(values))]
  }, [candidates])

  const locationOptions = useMemo(() => {
    const values = candidates
      .map((candidate) => candidate.location)
      .filter(Boolean)

    return ["All", ...Array.from(new Set(values))]
  }, [candidates])

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const searchableText = [
        candidate.sapid,
        candidate.name,
        candidate.skills.join(" "),
        candidate.location,
        candidate.role,
        candidate.status,
        `${candidate.experience} years`,
      ]
        .join(" ")
        .toLowerCase()

      const searchMatch =
        search.trim() === "" ||
        searchableText.includes(search.trim().toLowerCase())

      const statusMatch =
        status === "All" || candidate.status === status

      const roleMatch =
        role === "All" || candidate.role === role

      const locationMatch =
        location === "All" || candidate.location === location

      const experienceMatch =
        experience === "All" ||
        (experience === "1+" && candidate.experience >= 1) ||
        (experience === "3+" && candidate.experience >= 3) ||
        (experience === "5+" && candidate.experience >= 5) ||
        (experience === "8+" && candidate.experience >= 8) ||
        (experience === "10+" && candidate.experience >= 10) ||
        (experience === "12+" && candidate.experience >= 12)

      return (
        searchMatch &&
        statusMatch &&
        roleMatch &&
        locationMatch &&
        experienceMatch
      )
    })
  }, [candidates, search, status, role, location, experience])

  const totalPages = Math.max(1, Math.ceil(filteredCandidates.length / pageSize))

  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-semibold text-slate-900">
                Search Talent Pool
              </CardTitle>

              <Button
                type="button"
                variant="outline"
                onClick={fetchCandidates}
                disabled={isLoading}
              >
                {isLoading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            ) : null}

            <div className="flex gap-4">
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Search name, SAP ID, skills, role, location..."
                className="h-14 flex-1 border-slate-300 bg-gray-100 px-5 text-sm"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearch()
                  }
                }}
              />

              <Button
                type="button"
                onClick={handleSearch}
                className="h-14 w-32 bg-[#0F5FDC] font-medium hover:bg-[#0A6DB4]"
              >
                Search
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-6">
              <FilterSelect
                label="Status"
                value={status}
                onChange={(value) => {
                  setStatus(value)
                  setCurrentPage(1)
                }}
                options={["All", "Available", "In Pipeline", "Deployed"]}
              />

              <FilterSelect
                label="Role"
                value={role}
                onChange={(value) => {
                  setRole(value)
                  setCurrentPage(1)
                }}
                options={roleOptions}
              />

              <FilterSelect
                label="Location"
                value={location}
                onChange={(value) => {
                  setLocation(value)
                  setCurrentPage(1)
                }}
                options={locationOptions}
              />

              <FilterSelect
                label="Experience"
                value={experience}
                onChange={(value) => {
                  setExperience(value)
                  setCurrentPage(1)
                }}
                options={["All", "1+", "3+", "5+", "8+", "10+", "12+"]}
              />
            </div>

            <div className="overflow-hidden rounded-md border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-50 hover:bg-blue-50">
                    <TableHead className="font-semibold text-[#0F5FDC]">
                      Candidate
                    </TableHead>

                    <TableHead className="font-semibold text-[#0F5FDC]">
                      SAP ID
                    </TableHead>

                    <TableHead className="font-semibold text-[#0F5FDC]">
                      Primary Skills
                    </TableHead>

                    <TableHead className="font-semibold text-[#0F5FDC]">
                      Experience
                    </TableHead>

                    <TableHead className="font-semibold text-[#0F5FDC]">
                      Location
                    </TableHead>

                    <TableHead className="font-semibold text-[#0F5FDC]">
                      Status
                    </TableHead>

                    <TableHead className="font-semibold text-[#0F5FDC]">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-24 text-center text-slate-500"
                      >
                        Loading candidates...
                      </TableCell>
                    </TableRow>
                  ) : paginatedCandidates.length > 0 ? (
                    paginatedCandidates.map((candidate) => (
                      <TableRow
                        key={candidate.sapid}
                        className="hover:bg-slate-50"
                      >
                        <TableCell className="font-medium text-slate-900">
                          <div>
                            <p>{candidate.name}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              {candidate.role}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell className="text-slate-600">
                          {candidate.sapid}
                        </TableCell>

                        <TableCell className="text-slate-600">
                          <div className="flex max-w-md flex-wrap gap-2">
                            {candidate.skills.length > 0 ? (
                              candidate.skills.slice(0, 5).map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="outline"
                                  className="border-blue-200 bg-blue-50 text-[#0F5FDC]"
                                >
                                  {skill}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-slate-500">
                                No skills
                              </span>
                            )}

                            {candidate.skills.length > 5 ? (
                              <Badge variant="outline">
                                +{candidate.skills.length - 5}
                              </Badge>
                            ) : null}
                          </div>
                        </TableCell>

                        <TableCell className="text-slate-600">
                          {candidate.experience > 0
                            ? `${candidate.experience} years`
                            : "Unknown"}
                        </TableCell>

                        <TableCell className="text-slate-600">
                          {candidate.location}
                        </TableCell>

                        <TableCell>
                          <StatusText status={candidate.status} />
                        </TableCell>

                        <TableCell>
                          <Button
                            type="button"
                            variant="link"
                            onClick={() => handleViewSummary(candidate.sapid)}
                            className="h-auto p-0 font-medium text-slate-800 hover:text-[#0F5FDC]"
                          >
                            View Summary
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-24 text-center text-slate-500"
                      >
                        No candidates found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between">
              <Badge className="rounded-md bg-[#0F5FDC] px-5 py-2 text-sm font-medium hover:bg-[#0F5FDC]">
                {filteredCandidates.length}{" "}
                {filteredCandidates.length === 1 ? "RESULT" : "RESULTS"}
              </Badge>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                >
                  Previous
                </Button>

                <span className="px-3 text-sm text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}) {
  return (
    <div className="space-y-1.5">
      <label className="px-1 text-[11px] font-medium text-slate-500">
        {label}
      </label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-14 w-full border-slate-200 bg-white shadow-sm">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function StatusText({ status }: { status: CandidateStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-sm font-medium ${
        status === "Available"
          ? "text-emerald-600"
          : status === "Deployed"
            ? "text-blue-500"
            : "text-amber-500"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          status === "Available"
            ? "bg-emerald-500"
            : status === "Deployed"
              ? "bg-blue-500"
              : "bg-amber-500"
        }`}
      />

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
