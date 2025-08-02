"use client"

import { useState } from "react"
import { Play, AlertCircle, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface VideoPlayerFallbackProps {
  videoUrl: string
  title: string
  onRetry: () => void
}

export function VideoPlayerFallback({ videoUrl, title, onRetry }: VideoPlayerFallbackProps) {
  const [showDetails, setShowDetails] = useState(false)

  const downloadVideo = () => {
    try {
      const link = document.createElement("a")
      link.href = videoUrl
      link.download = `${title}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  return (
    <Card className="bg-gray-900 border-3 border-red-600" style={{ borderStyle: "dashed" }}>
      <CardContent className="p-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "Comic Sans MS, cursive" }}>
          Video Playback Error
        </h3>
        <p className="text-gray-300 mb-4" style={{ fontFamily: "Comic Sans MS, cursive" }}>
          This useless video couldn't be played in your browser.
        </p>

        <div className="flex justify-center space-x-4 mb-4">
          <Button
            onClick={onRetry}
            className="bg-red-600 hover:bg-red-700 text-white border-2 border-white"
            style={{ borderStyle: "solid", fontFamily: "Comic Sans MS, cursive" }}
          >
            <Play className="w-4 h-4 mr-2" />
            Try Again
          </Button>

          <Button
            onClick={downloadVideo}
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-gray-900 bg-transparent"
            style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>

        <Button
          variant="ghost"
          onClick={() => setShowDetails(!showDetails)}
          className="text-gray-400 hover:text-white text-sm"
          style={{ fontFamily: "Comic Sans MS, cursive" }}
        >
          {showDetails ? "Hide" : "Show"} Technical Details
        </Button>

        {showDetails && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg text-left">
            <p className="text-xs text-gray-400 font-mono break-all">Video URL: {videoUrl.substring(0, 100)}...</p>
            <p className="text-xs text-gray-400 mt-2">Try refreshing the page or using a different browser.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
