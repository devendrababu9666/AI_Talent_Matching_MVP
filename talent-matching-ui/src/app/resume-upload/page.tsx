"use client"

import { useRef, useState } from "react"
import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type UploadedFileResult = {
  resume_id: string
  original_filename: string
  stored_filename: string
  file_path: string
  status: string
}

export default function ResumeUploadPage() {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileResult[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || [])

    const docxFiles = files.filter((file) =>
      file.name.toLowerCase().endsWith(".docx")
    )

    if (docxFiles.length !== files.length) {
      setError("Only .docx files are supported right now.")
    } else {
      setError("")
    }

    setSelectedFiles((previousFiles) => {
      const existingFileNames = new Set(
        previousFiles.map((file) => file.name)
      )

      const newFiles = docxFiles.filter(
        (file) => !existingFileNames.has(file.name)
      )

      return [...previousFiles, ...newFiles]
    })

    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const handleRemoveFile = (fileName: string) => {
    setSelectedFiles((files) =>
      files.filter((file) => file.name !== fileName)
    )
  }

  const handleClearAll = () => {
    setSelectedFiles([])
    setUploadedFiles([])
    setError("")

    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one resume.")
      return
    }

    setIsUploading(true)
    setError("")
    setUploadedFiles([])

    try {
      const formData = new FormData()

      selectedFiles.forEach((file) => {
        formData.append("files", file)
      })

      const response = await fetch("http://localhost:8000/api/resumes/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorResponse = await response.json().catch(() => null)

        throw new Error(
          errorResponse?.detail || "Resume upload failed."
        )
      }

      const data = await response.json()

      setUploadedFiles(data.files || [])
      setSelectedFiles([])
    } catch (uploadError) {
      console.error(uploadError)

      if (uploadError instanceof Error) {
        setError(uploadError.message)
      } else {
        setError("Something went wrong while uploading resumes.")
      }
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-semibold text-slate-900">
                  Bulk Resume Upload
                </CardTitle>

                <p className="mt-1 text-sm text-slate-500">
                  Upload multiple DOCX resumes. Files will be stored in the
                  backend folder first.
                </p>
              </div>

              <Badge
                variant="outline"
                className="border-blue-200 bg-blue-50 text-[#0F5FDC]"
              >
                DOCX only
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <p className="text-sm font-medium text-slate-700">
                Select resume files
              </p>

              <p className="mt-1 text-xs text-slate-500">
                You can select and upload multiple .docx files at once.
              </p>

              <div className="mt-4">
                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  accept=".docx"
                  onChange={handleFileSelect}
                  className="block w-full cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-[#0F5FDC] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
                />
              </div>
            </div>

            {error ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            ) : null}

            {selectedFiles.length > 0 ? (
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Selected resumes
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Review files before uploading.
                    </p>
                  </div>

                  <Badge className="rounded-md bg-[#0F5FDC] px-4 py-1.5 text-xs hover:bg-[#0F5FDC]">
                    {selectedFiles.length} selected
                  </Badge>
                </div>

                <div className="space-y-2">
                  {selectedFiles.map((file) => (
                    <div
                      key={file.name}
                      className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800">
                          {file.name}
                        </p>

                        <p className="text-xs text-slate-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveFile(file.name)}
                        className="ml-3 rounded-md p-1 text-slate-500 hover:bg-white hover:text-slate-700"
                        aria-label="Remove selected file"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                disabled={
                  selectedFiles.length === 0 &&
                  uploadedFiles.length === 0 &&
                  !error
                }
                onClick={handleClearAll}
              >
                Clear
              </Button>

              <Button
                type="button"
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || isUploading}
                className="bg-[#0F5FDC] px-8 font-medium hover:bg-[#0A6DB4]"
              >
                {isUploading ? "Uploading..." : "Upload Resumes"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {uploadedFiles.length > 0 ? (
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-slate-900">
                  Uploaded Files
                </CardTitle>

                <Badge
                  variant="outline"
                  className="border-emerald-200 bg-emerald-50 text-emerald-700"
                >
                  {uploadedFiles.length} stored
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {uploadedFiles.map((file) => (
                <div
                  key={file.resume_id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {file.original_filename}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Stored filename: {file.stored_filename}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Path: {file.file_path}
                  </p>

                  <p className="mt-1 text-xs font-medium text-emerald-600">
                    Status: {file.status}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </main>
  )
}
