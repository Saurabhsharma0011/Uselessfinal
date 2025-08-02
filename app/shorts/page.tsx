"use client"

import { useState, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface ShortVideo {
  id: number
  title: string
  description: string
  videoUrl: string
  thumbnailUrl: string
  duration: number
  views: number
  creator: string
  creatorAvatar: string
}

export default function ShortsPage() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null)
  const [shortVideos, setShortVideos] = useState<ShortVideo[]>([])
  const [loading, setLoading] = useState(true)

  // Fallback videos if database is empty
  const fallbackVideos: ShortVideo[] = [
    {
      id: 1,
      title: "Watching a Candle Burn for 30 Seconds",
      description: "Experience the mesmerizing art of candle watching. No edits, no cuts, just pure flame action.",
      videoUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Make_a_video_202508011057_nqjtg-CHAwHGXgiWo7vZinMSOPJEGVwSlI76.mp4",
      thumbnailUrl: "/placeholder.svg?height=400&width=300&text=Candle+Flame",
      duration: 30,
      views: 125000,
      creator: "FlameWatcher",
      creatorAvatar: "/placeholder.svg?height=40&width=40&text=FW"
    },
    {
      id: 2,
      title: "Counting Rice Grains - Part 1",
      description: "Join us as we count exactly 47 rice grains. Riveting content that will change your life.",
      videoUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Create_a_video_202508011424_d33tt.mp4",
      thumbnailUrl: "/placeholder.svg?height=400&width=300&text=Rice+Grains",
      duration: 45,
      views: 89000,
      creator: "RiceCounter",
      creatorAvatar: "/placeholder.svg?height=40&width=40&text=RC"
    },
    {
      id: 3,
      title: "Paper Airplane That Never Flies",
      description: "Watch as we fold and attempt to fly a paper airplane that defies all laws of aerodynamics.",
      videoUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Make_a_video_202508011057_nqjtg (1).mp4",
      thumbnailUrl: "/placeholder.svg?height=400&width=300&text=Paper+Plane",
      duration: 60,
      views: 156000,
      creator: "AeroFail",
      creatorAvatar: "/placeholder.svg?height=40&width=40&text=AF"
    },
    {
      id: 4,
      title: "Bubble Wrap Popping Marathon",
      description: "Satisfy your ASMR cravings with 2 minutes of pure bubble wrap popping satisfaction.",
      videoUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cartoonish_Video_Creation_Request.mp4",
      thumbnailUrl: "/placeholder.svg?height=400&width=300&text=Bubble+Wrap",
      duration: 120,
      views: 234000,
      creator: "PopMaster",
      creatorAvatar: "/placeholder.svg?height=40&width=40&text=PM"
    },
    {
      id: 5,
      title: "Staring Contest with a Plant",
      description: "Can you beat a plant in a staring contest? Find out in this intense 90-second showdown.",
      videoUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Make_a_video_202508011057_nqjtg-CHAwHGXgiWo7vZinMSOPJEGVwSlI76.mp4",
      thumbnailUrl: "/placeholder.svg?height=400&width=300&text=Plant+Stare",
      duration: 90,
      views: 178000,
      creator: "PlantWhisperer",
      creatorAvatar: "/placeholder.svg?height=40&width=40&text=PW"
    }
  ]

  useEffect(() => {
    loadShortVideos()
  }, [])

  const loadShortVideos = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/videos?isShort=true')
      const data = await response.json()
      
      if (data.videos && data.videos.length > 0) {
        // Transform database videos to match our interface
        const transformedVideos = data.videos.map((video: any) => ({
          id: video.id,
          title: video.title,
          description: video.description,
          videoUrl: video.videoUrl,
          thumbnailUrl: video.thumbnailUrl,
          duration: video.duration,
          views: video.views,
          creator: video.user?.name || "Anonymous",
          creatorAvatar: video.user?.avatarUrl || "/placeholder.svg?height=40&width=40&text=A"
        }))
        setShortVideos(transformedVideos)
      } else {
        // Use fallback videos if no shorts in database
        setShortVideos(fallbackVideos)
      }
    } catch (error) {
      console.error('Failed to load short videos:', error)
      setShortVideos(fallbackVideos)
    } finally {
      setLoading(false)
    }
  }

  const currentVideo = shortVideos[currentVideoIndex]

  useEffect(() => {
    if (videoRef) {
      videoRef.addEventListener('ended', handleVideoEnd)
      return () => videoRef.removeEventListener('ended', handleVideoEnd)
    }
  }, [videoRef])

  const handleVideoEnd = () => {
    // Auto-play next video
    setCurrentVideoIndex((prev) => (prev + 1) % shortVideos.length)
    setIsPlaying(true)
  }

  const togglePlay = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause()
      } else {
        videoRef.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef) {
      videoRef.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (videoRef) {
      if (!isFullscreen) {
        videoRef.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
      setIsFullscreen(!isFullscreen)
    }
  }

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % shortVideos.length)
    setIsPlaying(true)
  }

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + shortVideos.length) % shortVideos.length)
    setIsPlaying(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl" style={{ fontFamily: "Comic Sans MS, cursive" }}>
          Loading Useless Shorts...
        </div>
      </div>
    )
  }

  if (!currentVideo) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "Comic Sans MS, cursive" }}>
            No Useless Shorts Available
          </h2>
          <p className="mb-4" style={{ fontFamily: "Comic Sans MS, cursive" }}>
            Be the first to upload some wonderfully useless shorts!
          </p>
          <Link href="/upload">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              Upload Short Video
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-white">
            <ArrowLeft className="w-6 h-6" />
            <span className="text-xl font-bold" style={{ fontFamily: "Comic Sans MS, cursive" }}>
              Useless Shorts
            </span>
          </Link>
          <div className="text-white text-sm" style={{ fontFamily: "Comic Sans MS, cursive" }}>
            {currentVideoIndex + 1} of {shortVideos.length}
          </div>
        </div>
      </header>

      {/* Main Video Player */}
      <div className="flex-1 flex justify-center items-center relative">
        <div className="relative w-full max-w-md h-screen">
          {/* Video Element */}
          <video
            ref={setVideoRef}
            className="w-full h-full object-cover"
            poster={currentVideo.thumbnailUrl}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            autoPlay={isPlaying}
            muted={isMuted}
            loop={false}
          >
            <source src={currentVideo.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Video Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <h2 className="text-white text-lg font-bold mb-2" style={{ fontFamily: "Comic Sans MS, cursive" }}>
              {currentVideo.title}
            </h2>
            <p className="text-gray-300 text-sm mb-2" style={{ fontFamily: "Comic Sans MS, cursive" }}>
              {currentVideo.description}
            </p>
            <div className="flex items-center space-x-2 text-white text-sm">
              <span style={{ fontFamily: "Comic Sans MS, cursive" }}>{currentVideo.creator}</span>
              <span>•</span>
              <span>{currentVideo.views.toLocaleString()} views</span>
            </div>
          </div>

          {/* Video Controls */}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <Button
              onClick={toggleMute}
              size="sm"
              variant="ghost"
              className="bg-black/50 text-white hover:bg-black/70"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <Button
              onClick={toggleFullscreen}
              size="sm"
              variant="ghost"
              className="bg-black/50 text-white hover:bg-black/70"
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation Buttons */}
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <Button
              onClick={prevVideo}
              size="sm"
              variant="ghost"
              className="bg-black/50 text-white hover:bg-black/70"
            >
              ←
            </Button>
            <Button
              onClick={togglePlay}
              size="lg"
              variant="ghost"
              className="bg-black/50 text-white hover:bg-black/70"
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </Button>
            <Button
              onClick={nextVideo}
              size="sm"
              variant="ghost"
              className="bg-black/50 text-white hover:bg-black/70"
            >
              →
            </Button>
          </div>
        </div>
      </div>

      {/* Video List */}
      <div className="bg-gray-900 p-4">
        <h3 className="text-white text-lg font-bold mb-4" style={{ fontFamily: "Comic Sans MS, cursive" }}>
          More Useless Shorts
        </h3>
        <div className="flex space-x-4 overflow-x-auto">
          {shortVideos.map((video, index) => (
            <Card
              key={video.id}
              className={`min-w-[200px] cursor-pointer transition-all ${
                index === currentVideoIndex ? 'ring-2 ring-red-500' : 'hover:scale-105'
              }`}
              onClick={() => {
                setCurrentVideoIndex(index)
                setIsPlaying(true)
              }}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                    {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, "0")}
                  </div>
                </div>
                <div className="p-2">
                  <h4 className="text-sm font-semibold line-clamp-2" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                    {video.title}
                  </h4>
                  <p className="text-xs text-gray-600" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                    {video.views.toLocaleString()} views
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
