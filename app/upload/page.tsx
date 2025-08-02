"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, Play, ImageIcon, Save, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { uploadVideo, type User } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function UploadVideo() {
  const [user, setUser] = useState<User | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [isShort, setIsShort] = useState(false)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const savedUser = localStorage.getItem("useless-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else {
      router.push("/")
    }
  }, [router])

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select a video under 5MB",
          variant: "destructive",
        })
        return
      }
      setVideoFile(file)
    }
  }

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailFile(file)
    }
  }

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsDataURL(file)
    })
  }

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement("video")
      video.onloadedmetadata = () => {
        resolve(Math.floor(video.duration) || 30)
        URL.revokeObjectURL(video.src)
      }
      video.onerror = () => resolve(30)
      video.src = URL.createObjectURL(file)
    })
  }

  const uploadFileToCloud = async (file: File, folder: 'videos' | 'thumbnails' | 'avatars'): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Upload failed')
    }

    const result = await response.json()
    return result.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !title.trim() || !videoFile) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setProgress("Starting upload...")

    try {
      setProgress("Uploading video to cloud...")
      const videoUrl = await uploadFileToCloud(videoFile, 'videos')

      setProgress("Processing thumbnail...")
      const thumbnailUrl = thumbnailFile ? await uploadFileToCloud(thumbnailFile, 'thumbnails') : undefined

      setProgress("Getting video info...")
      const duration = await getVideoDuration(videoFile)

      setProgress("Saving to database...")
      await uploadVideo({
        userId: user.id,
        title: title.trim(),
        description: description.trim(),
        videoUrl,
        thumbnailUrl,
        duration,
        isShort,
      })

      toast({
        title: "Success!",
        description: "Video uploaded successfully!",
      })

      router.push("/dashboard")
    } catch (error: any) {
      console.error("Upload error:", error)
      toast({
        title: "Upload Failed",
        description: error.message || "Please try again with a smaller file or check your connection.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setProgress("")
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "Comic Sans MS, cursive" }}>
            Please connect your wallet first!
          </h1>
          <Link href="/">
            <Button className="bg-red-600 hover:bg-red-700 text-white">Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23f1f1f1' fillOpacity='0.3'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      <div className="bg-white border-b-4 border-gray-800 shadow-lg" style={{ borderStyle: "dashed" }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <Link href="/">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-gray-800 hover:bg-gray-100 border-2 border-gray-600 rounded-lg transform -rotate-1 w-full sm:w-auto"
              style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Useless Home</span>
            </Button>
          </Link>
          <h1
            className="text-xl sm:text-2xl font-bold text-gray-900 transform rotate-1 text-center sm:text-left"
            style={{
              fontFamily: "Comic Sans MS, cursive",
              textShadow: "2px 2px 0px #ef4444",
            }}
          >
            Upload Useless Video
          </h1>
          <div className="w-full sm:w-32" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <Card
          className="bg-white border-3 border-gray-800 shadow-lg transform -rotate-0.5"
          style={{ borderStyle: "dashed" }}
        >
          <CardHeader>
            <CardTitle
              className="text-center text-gray-900 flex items-center justify-center space-x-2"
              style={{ fontFamily: "Comic Sans MS, cursive" }}
            >
              <Upload className="w-6 h-6 text-red-600" />
              <span>Share Your Useless Content</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-base sm:text-lg font-semibold text-gray-800" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                  Video File *
                </Label>
                <div className="border-3 border-gray-600 border-dashed rounded-lg p-4 sm:p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                    required
                  />
                  <Label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center space-y-2">
                    <Play className="w-8 h-8 sm:w-12 sm:h-12 text-red-600" />
                    <span className="text-gray-700 font-semibold text-sm sm:text-base" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                      {videoFile ? videoFile.name : "Click to upload your useless video"}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500">Max 5MB for best results</span>
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base sm:text-lg font-semibold text-gray-800" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                  Thumbnail (Optional)
                </Label>
                <div className="border-3 border-gray-600 border-dashed rounded-lg p-4 sm:p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <Label htmlFor="thumbnail-upload" className="cursor-pointer flex flex-col items-center space-y-2">
                    <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
                    <span className="text-gray-700 font-semibold text-sm sm:text-base" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                      {thumbnailFile ? thumbnailFile.name : "Upload a useless thumbnail"}
                    </span>
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base sm:text-lg font-semibold text-gray-800" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                  Useless Title *
                </Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your video a perfectly useless title..."
                  className="border-3 border-gray-600 rounded-lg text-base sm:text-lg p-3 sm:p-4"
                  style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base sm:text-lg font-semibold text-gray-800" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                  Useless Description
                </Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe how useless this video is..."
                  className="border-3 border-gray-600 rounded-lg min-h-24 sm:min-h-32"
                  style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is-short"
                  checked={isShort}
                  onCheckedChange={(checked) => setIsShort(checked as boolean)}
                  className="border-2 border-gray-600"
                />
                <Label
                  htmlFor="is-short"
                  className="text-gray-800 font-semibold cursor-pointer text-sm sm:text-base"
                  style={{ fontFamily: "Comic Sans MS, cursive" }}
                >
                  This is a Useless Short
                </Label>
              </div>

              {loading && progress && (
                <Alert className="border-2 border-blue-500" style={{ borderStyle: "dashed" }}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm sm:text-base" style={{ fontFamily: "Comic Sans MS, cursive" }}>{progress}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  disabled={loading || !title.trim() || !videoFile}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-8 py-3 sm:py-4 text-base sm:text-lg border-3 border-black transform hover:scale-105 transition-all w-full sm:w-auto"
                  style={{ borderStyle: "solid", fontFamily: "Comic Sans MS, cursive" }}
                >
                  <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  {loading ? "Uploading..." : "Upload Useless Video"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
