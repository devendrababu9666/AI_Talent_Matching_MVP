"use client"

import { useMemo, useState } from "react"
import Link from "next/link"

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

type Candidate = {
  sapid: string
  name: string
  role: string
  skills: string[]
  experience: number
  location: string
  status: "Available" | "In Pipeline" | "Deployed"
}

// const candidates: Candidate[] = [
//   {
//     sapid: "100001",
//     name: "Mallikarjuna Patil",
//     role: "AI Architect",
//     skills: ["RAG", "Azure OpenAI", "Python"],
//     experience: 13,
//     location: "Bangalore",
//     status: "Available",
//   },
//   {
//     sapid: "100002",
//     name: "Devendra",
//     role: "AI Architect",
//     skills: ["Agents", "LangGraph"],
//     experience: 10,
//     location: "Hyderabad",
//     status: "Available",
//   },
//   {
//     sapid: "100003",
//     name: "Prachi Bhatt",
//     role: "AI Engineer",
//     skills: ["Python", "FastAPI", "RAG"],
//     experience: 9,
//     location: "Noida",
//     status: "In Pipeline",
//   },
// ]


const candidates: Candidate[] = Array.from({ length: 15 }, (_, i) => ({
  sapid: `1000${i + 1}`,
  name: `Candidate ${i + 1}`,
  role: i % 2 === 0 ? "AI Architect" : "AI Engineer",
  skills: ["Python", "RAG", "Azure"],
  experience: 8 + (i % 5),
  location: ["Bangalore", "Hyderabad", "Noida", "Chennai"][i % 4],
  status: ["Available" ,"In Pipeline","Deployed"] [i % 3] as "Available" | "In Pipeline" | "Deployed",
}))


export default function TalentSearchPage() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("All")
  const [role, setRole] = useState("All")
  const [location, setLocation] = useState("All")
  const [experience, setExperience] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  
  

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const searchMatch =
        search.trim() === "" ||
        `${candidate.name} ${candidate.skills.join(" ")} ${candidate.location} ${candidate.role}`
          .toLowerCase()
          .includes(search.toLowerCase())

      const statusMatch =
        status === "All" || candidate.status === status

      const roleMatch =
        role === "All" || candidate.role === role

      const locationMatch =
        location === "All" || candidate.location === location

      const experienceMatch =
        experience === "All" ||
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
  }, [search, status, role, location, experience])

  const totalPages = Math.ceil(filteredCandidates.length / pageSize)

  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold text-slate-900">
              Search Talent Pool
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">

            {/* Search */}
            <div className="flex gap-4">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search skills..."
                className="h-14 flex-1 border-slate-300 bg-gray-100 px-5 text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    console.log("Search:", search)
                  }
                }}
              />

              <Button
                onClick={() => console.log("Search:", search)}
                className="h-14 w-32 bg-[#0F5FDC] font-medium hover:bg-[#0A6DB4]"
              >
                Search
              </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-4 gap-6">
                <FilterSelect
                    label="Status"
                    value={status}
                    onChange={(value) => {
                          setStatus(value)
                          setCurrentPage(1)
                        }}
                    options={["Available", "In Pipeline", "Deployed", "All"]}
                />

                <FilterSelect
                    label="Role"
                    value={role}
                    onChange={(value) => {
                          setRole(value)
                          setCurrentPage(1)
                        }}
                    options={["AI Architect", "AI Engineer", "Developer", "All"]}
                />

                <FilterSelect
                    label="Location"
                    value={location}
                    onChange={(value) => {
                          setLocation(value)
                          setCurrentPage(1)
                        }}
                    options={["Bangalore", "Hyderabad", "Chennai", "All"]}
                />

                <FilterSelect
                    label="Experience"
                    value={experience}
                    onChange={(value) => {
                          setExperience(value)
                          setCurrentPage(1)
                        }}
                    options={["8+", "10+", "12+", "All"]}
                />
                </div>

            {/* Results */}
            <div className="overflow-hidden rounded-md border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-50 hover:bg-blue-50">
                    <TableHead className="font-semibold text-[#0F5FDC]">
                      Candidate
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
                  {paginatedCandidates.length > 0 ? (
                    paginatedCandidates.map((candidate) => (
                      <TableRow
                        key={candidate.sapid}
                        className="hover:bg-slate-50"
                      >
                        <TableCell className="font-medium text-slate-900">
                          {candidate.name}
                        </TableCell>

                        <TableCell className="text-slate-600">
                          {candidate.skills.join(", ")}
                        </TableCell>

                        <TableCell className="text-slate-600">
                          {candidate.experience} years
                        </TableCell>

                        <TableCell className="text-slate-600">
                          {candidate.location}
                        </TableCell>

                        <TableCell>
                          <span
                            className={`inline-flex items-center gap-2 text-sm font-medium ${
                              candidate.status === "Available"
                                ? "text-emerald-600"
                                : candidate.status === "Deployed"
                                  ? "text-blue-500"
                                  : "text-amber-500"
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                candidate.status === "Available"
                                  ? "bg-emerald-500"
                                : candidate.status === "Deployed"
                                    ? "bg-blue-500"
                                    : "bg-amber-500"
                              }`}
                            />

                            {candidate.status}
                          </span>
                        </TableCell>

                        <TableCell>
                          <Button
                            variant="link"
                            className="h-auto p-0 font-medium text-slate-800 hover:text-[#0F5FDC]"
                          >
                            <Link href={`/summary/${candidate.sapid}`}>
                              View Summary
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-24 text-center text-slate-500"
                      >
                        No candidates found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
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
                  onClick={() => setCurrentPage((page) => page - 1)}
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
                  onClick={() => setCurrentPage((page) => page + 1)}
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