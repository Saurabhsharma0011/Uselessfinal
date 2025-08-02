"use client"

import { useState } from "react"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface VideoUploadValidatorProps {
  file: File | null
  onValidation: (isValid: boolean, message: string) => void
}

export function VideoUploadValidator({ file, onValidation }: VideoUploadValidatorProps) {
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean
    message: string
    details: string[]
  } | null>(null)

  const validateVideo = (videoFile: File) => {
    const maxSize = 50 * 1024 * 1024 // 50MB for better performance
    const supportedTypes = ["video/mp4", "video/webm", "video/ogg", "video/avi", "video/mov", "video/quicktime"]

    const details: string[] = []
    let isValid = true
    let message = ""

    // Check file size
    if (videoFile.size > maxSize) {
      isValid = false
      details.push(`File size (${(videoFile.size / 1024 / 1024).toFixed(1)}MB) exceeds 50MB limit`)
    } else {
      details.push(`✓ File size: ${(videoFile.size / 1024 / 1024).toFixed(1)}MB (under 50MB limit)`)
    }

    // Check file type
    if (!supportedTypes.includes(videoFile.type)) {
      isValid = false
      details.push(`Unsupported format: ${videoFile.type}`)
    } else {
      details.push(`✓ Format: ${videoFile.type}`)
    }

    // Set message
    if (isValid) {
      message = "Video is ready for upload!"
    } else {
      message = "Video has issues that need to be fixed"
    }

    const result = { isValid, message, details }
    setValidationResult(result)
    onValidation(isValid, message)

    return result
  }

  if (!file) {
    return null
  }

  if (!validationResult) {
    // Validate on first render
    setTimeout(() => validateVideo(file), 100)
    return (
      <Alert className="border-2 border-blue-500" style={{ borderStyle: "dashed" }}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription style={{ fontFamily: "Comic Sans MS, cursive" }}>Validating video...</AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert
      className={`border-2 ${validationResult.isValid ? "border-green-500" : "border-red-500"}`}
      style={{ borderStyle: "dashed" }}
    >
      {validationResult.isValid ? (
        <CheckCircle className="h-4 w-4 text-green-600" />
      ) : (
        <XCircle className="h-4 w-4 text-red-600" />
      )}
      <AlertDescription style={{ fontFamily: "Comic Sans MS, cursive" }}>
        <div className="font-semibold mb-2">{validationResult.message}</div>
        <ul className="text-sm space-y-1">
          {validationResult.details.map((detail, index) => (
            <li key={index} className={detail.startsWith("✓") ? "text-green-600" : "text-red-600"}>
              {detail}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  )
}
