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
      views: 100000,
      creator: "UselessTube Official",
      creatorAvatar: "/placeholder.svg?height=40&width=40&text=UO"
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
          videoUrl: video.video_url,
          thumbnailUrl: video.thumbnail_url,
          duration: video.duration,
          views: video.views,
          creator: video.creator_name || "Anonymous",
          creatorAvatar: video.creator_avatar || "/placeholder.svg?height=40&width=40&text=A"
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
  }, [videoRef, shortVideos.length])

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
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-red-500 mx-auto mb-4"></div>
          <p style={{ fontFamily: "Comic Sans MS, cursive" }}>Loading Useless Shorts...</p>
        </div>
      </div>
    )
  }

  if (!currentVideo) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "Comic Sans MS, cursive" }}>
            No Useless Shorts Here!
          </h2>
          <p className="mb-8" style={{ fontFamily: "Comic Sans MS, cursive" }}>
            Be the first to upload a wonderfully useless short video.
          </p>
          <Link href="/upload">
            <Button className="bg-red-600 hover:bg-red-700 text-white border-2 border-black">Upload a Short</Button>
          </Link>
          <Link href="/" className="block mt-4 text-sm text-gray-400 hover:text-white">
            Go Back Home
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
            key={currentVideo.id}
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
            <div className="flex items-center space-x-2 mb-2">
              <img
                src={currentVideo.creatorAvatar}
                alt={currentVideo.creator}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <span className="text-white font-semibold">{currentVideo.creator}</span>
            </div>
            <p className="text-white text-sm line-clamp-2">{currentVideo.description}</p>
          </div>

          {/* Controls Overlay */}
          <div className="absolute inset-0 flex items-center justify-center" onClick={togglePlay}>
            {!isPlaying && (
              <div className="bg-black bg-opacity-50 rounded-full p-4">
                <Play className="w-16 h-16 text-white fill-current" />
              </div>
            )}
          </div>

          {/* Side Controls */}
          <div className="absolute right-2 bottom-24 flex flex-col space-y-4">
            <Button variant="ghost" size="icon" className="text-white" onClick={toggleMute}>
              {isMuted ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
            </Button>
            <Button variant="ghost" size="icon" className="text-white" onClick={toggleFullscreen}>
              <Maximize className="w-8 h-8" />
            </Button>
          </div>

          {/* Navigation Arrows */}
          <div
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 rounded-full p-2 cursor-pointer"
            onClick={prevVideo}
          >
            <ArrowLeft className="w-8 h-8 text-white" />
          </div>
          <div
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 rounded-full p-2 cursor-pointer"
            onClick={nextVideo}
          >
            <ArrowLeft className="w-8 h-8 text-white transform rotate-180" />
          </div>
        </div>
      </div>
    </div>
  )
}
