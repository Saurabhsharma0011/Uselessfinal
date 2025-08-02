"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  ThumbsUp,
  ThumbsDown,
  Share,
  Download,
  Flag,
  ArrowLeft,
  Heart,
  Send,
  Bell,
  BellRing,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { VideoPlayerFallback } from "@/components/video-player-fallback"
import { VerifiedBadge } from "@/components/verified-badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface VideoData {
  id: number
  title: string
  description: string
  video_url: string
  thumbnail_url: string
  duration: number
  views: number
  likes: number
  is_short: boolean
  created_at: string
  creator_name: string
  creator_avatar: string
  user_id: number
}

interface Comment {
  id: number
  user_name: string
  user_avatar: string
  content: string
  created_at: string
  likes: number
}

export default function WatchVideo() {
  const params = useParams()
  const router = useRouter()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [video, setVideo] = useState<VideoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [user, setUser] = useState<any>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscriberCount, setSubscriberCount] = useState(0)
  const [subscribing, setSubscribing] = useState(false)
  const { toast } = useToast()
  const [videoError, setVideoError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [videoLoading, setVideoLoading] = useState(true)

  useEffect(() => {
    // Get user from localStorage
    const savedUser = localStorage.getItem("useless-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    // Load video data
    loadVideo()
    loadComments()

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [params.id])

  useEffect(() => {
    // Check subscription status when user or video changes
    if (user && video && video.user_id !== user.id) {
      checkSubscriptionStatus()
    }
  }, [user, video])

  const checkSubscriptionStatus = async () => {
    if (!user || !video) return

    try {
      const response = await fetch(`/api/subscriptions?subscriberId=${user.id}&channelId=${video.user_id}`)
      const data = await response.json()
      setIsSubscribed(data.isSubscribed)
      setSubscriberCount(data.subscriberCount)
    } catch (error) {
      console.error("Failed to check subscription status:", error)
    }
  }

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please connect your wallet to subscribe.",
        variant: "destructive",
      })
      return
    }

    if (!video || video.user_id === user.id) return

    setSubscribing(true)
    try {
      const action = isSubscribed ? "unsubscribe" : "subscribe"
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriberId: user.id,
          channelId: video.user_id,
          action,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setIsSubscribed(data.isSubscribed)
        setSubscriberCount(data.subscriberCount)

        toast({
          title: data.isSubscribed ? "Subscribed!" : "Unsubscribed",
          description: data.isSubscribed
            ? `You're now subscribed to ${video.creator_name}!`
            : `Unsubscribed from ${video.creator_name}`,
        })
      }
    } catch (error) {
      console.error("Subscription error:", error)
      toast({
        title: "Subscription Failed",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubscribing(false)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration
      if (videoDuration && !isNaN(videoDuration) && isFinite(videoDuration)) {
        setDuration(videoDuration)
      } else if (video?.duration) {
        // Fallback to database duration
        setDuration(video.duration)
      }
    }
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.muted = false
        setIsMuted(false)
      } else {
        videoRef.current.muted = true
        setIsMuted(true)
      }
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
      setIsFullscreen(!isFullscreen)
    }
  }

  const loadVideo = async () => {
    try {
      // Fetch real video data from API
      const response = await fetch(`/api/videos/${params.id}`)
      if (!response.ok) {
        throw new Error("Video not found")
      }

      const data = await response.json()
      const videoData = data.video

      setVideo(videoData)

      // Set duration from database
      if (videoData.duration) {
        setDuration(videoData.duration)
      }

      // Increment view count
      await fetch(`/api/videos/${params.id}/view`, { method: "POST" })
    } catch (error) {
      console.error("Video load error:", error)
      toast({
        title: "Error Loading Video",
        description: "Failed to load video. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }

    // Handle pre-loaded videos including your screensaver video
    if (params.id === "pre-16") {
      const preloadedVideo = {
        id: 16, // Convert to number
        title: "Watching my screensaver for life time",
        description:
          "The ultimate screensaver watching experience. I dedicate my entire lifetime to watching this mesmerizing screensaver. Pure dedication to uselessness at its finest. Watch as I stare at bouncing logos, flying toasters, and geometric patterns for what feels like an eternity.",
        video_url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Make_a_video_202508011057_nqjtg-CHAwHGXgiWo7vZinMSOPJEGVwSlI76.mp4",
        thumbnail_url: "/placeholder.svg?height=180&width=320&text=Lifetime+Screensaver",
        duration: 3600,
        views: 5600000,
        likes: 234000,
        is_short: false,
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        creator_name: "LifetimeScreenWatcher",
        creator_avatar: "/placeholder.svg?height=40&width=40&text=LSW",
        user_id: 0,
      }

      setVideo(preloadedVideo)
      setDuration(preloadedVideo.duration)
      setSubscriberCount(Math.floor(Math.random() * 50000) + 10000) // Mock subscriber count for preloaded videos
      setLoading(false)
      return
    }
  }

  const loadComments = () => {
    // Mock comments data
    const mockComments: Comment[] = Array.from({ length: Math.floor(Math.random() * 20) + 5 }, (_, i) => ({
      id: i + 1,
      user_name: `UselessUser${Math.floor(Math.random() * 1000) + 1}`,
      user_avatar: `/placeholder.svg?height=32&width=32&text=U${i + 1}`,
      content: [
        "This is exactly the kind of useless content I was looking for!",
        "Finally, a video that serves no purpose. Perfect! 👌",
        "I watched this entire thing and I regret nothing.",
        "This is peak uselessness. Subscribed!",
        "My productivity has never been lower. Thanks!",
        "I came here to waste time and I'm not disappointed.",
        "This video changed my life... by making it more meaningless.",
        "Quality useless content right here!",
        "I don't know why I'm here but I'm glad I am.",
        "This is art. Useless, pointless art.",
      ][Math.floor(Math.random() * 10)],
      created_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      likes: Math.floor(Math.random() * 50),
    }))

    setComments(mockComments)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleLike = () => {
    setLiked(!liked)
    if (disliked) setDisliked(false)
    toast({
      title: liked ? "Like Removed" : "Video Liked!",
      description: liked ? "Removed your useless like" : "Thanks for liking this useless content!",
    })
  }

  const handleDislike = () => {
    setDisliked(!disliked)
    if (liked) setLiked(false)
    toast({
      title: disliked ? "Dislike Removed" : "Video Disliked",
      description: disliked ? "Removed your dislike" : "Your feedback has been noted.",
    })
  }

  const handleShare = () => {
    const videoUrl = `${window.location.origin}/watch/${video?.id}`
    navigator.clipboard.writeText(videoUrl)
    toast({
      title: "Link Copied!",
      description: "Video link copied to clipboard. Share the uselessness!",
    })
  }

  const handleAddComment = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please connect your wallet to comment.",
        variant: "destructive",
      })
      return
    }

    if (!newComment.trim()) return

    const comment: Comment = {
      id: comments.length + 1,
      user_name: user.name || "Anonymous User",
      user_avatar: user.avatar_url || "/placeholder.svg?height=32&width=32&text=U",
      content: newComment,
      created_at: new Date().toISOString(),
      likes: 0,
    }

    setComments([comment, ...comments])
    setNewComment("")
    toast({
      title: "Comment Added!",
      description: "Your useless comment has been posted.",
    })
  }

  const handleDeleteVideo = async () => {
    if (!user || !video) return

    try {
      const response = await fetch(`/api/videos/${video.id}?userId=${user.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Video Deleted!",
          description: "Your useless video has been permanently deleted.",
        })
        router.push("/")
      } else {
        throw new Error("Failed to delete video")
      }
    } catch (error) {
      console.error("Failed to delete video:", error)
      toast({
        title: "Delete Failed",
        description: "Failed to delete video. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <Play className="w-8 h-8 text-white fill-current" />
          </div>
          <p className="text-xl font-bold text-gray-900" style={{ fontFamily: "Comic Sans MS, cursive" }}>
            Loading useless content...
          </p>
        </div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "Comic Sans MS, cursive" }}>
            Video not found!
          </h1>
          <Link href="/">
            <Button className="bg-red-600 hover:bg-red-700 text-white">Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const hasValidVideoUrl =
    video?.video_url && (
      video.video_url.startsWith("data:video/") || 
      video.video_url.startsWith("/videos/") ||
      video.video_url.startsWith("/api/files/") ||
      video.video_url.startsWith("http")
    )

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23f1f1f1' fillOpacity='0.3'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      {/* Header */}
      <div
        className="bg-white dark:bg-gray-800 border-b-4 border-gray-800 dark:border-gray-600 shadow-lg transition-colors duration-300"
        style={{ borderStyle: "dashed" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-gray-800 hover:bg-gray-100 border-2 border-gray-600 rounded-lg transform -rotate-1"
              style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Useless Home</span>
            </Button>
          </Link>

          <h1
            className="text-xl font-bold text-gray-900 transform rotate-1"
            style={{
              fontFamily: "Comic Sans MS, cursive",
              textShadow: "2px 2px 0px #ef4444",
            }}
          >
            UselessTube Player
          </h1>

          <div className="w-32" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Main Video Section */}
        <div className="space-y-6">
          {/* Video Player */}
          <Card
            className="bg-black border-3 border-gray-800 shadow-lg overflow-hidden transform -rotate-0.5"
            style={{ borderStyle: "dashed" }}
          >
            <div className="relative aspect-video">
              {videoError || !hasValidVideoUrl ? (
                <VideoPlayerFallback
                  videoUrl={video?.video_url || ""}
                  title={video?.title || ""}
                  onRetry={() => {
                    setVideoError(false)
                    setRetryCount(0)
                    if (videoRef.current) {
                      videoRef.current.load()
                    }
                  }}
                />
              ) : (
                <>
                  {/* Real Video Player */}
                  <video
                    ref={videoRef}
                    key={retryCount}
                    className="w-full h-full object-cover"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => {
                      setIsPlaying(false)
                      setCurrentTime(duration)
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLVideoElement
                      const error = target.error

                      console.error("Video playback error details:", {
                        code: error?.code,
                        message: error?.message,
                        networkState: target.networkState,
                        readyState: target.readyState,
                        currentSrc: target.currentSrc,
                        retryCount,
                      })

                      if (retryCount < 2) {
                        setRetryCount(retryCount + 1)
                        setTimeout(() => {
                          if (videoRef.current) {
                            videoRef.current.load()
                          }
                        }, 1000)
                      } else {
                        setVideoError(true)
                        toast({
                          title: "Playback Error",
                          description: `Video failed to load after ${retryCount + 1} attempts.`,
                          variant: "destructive",
                        })
                      }
                    }}
                    onCanPlay={() => {
                      setVideoError(false)
                      setVideoLoading(false)
                    }}
                    onLoadStart={() => setVideoLoading(true)}
                    onLoadedData={() => setVideoLoading(false)}
                    poster={video?.thumbnail_url}
                    crossOrigin="anonymous"
                    preload="metadata"
                    controls={false}
                  >
                    <source src={video.video_url} type="video/mp4" />
                    <p className="text-white text-center p-4">
                      Your browser does not support the video tag or the video format is not supported.
                    </p>
                  </video>

                  {videoLoading && !videoError && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p style={{ fontFamily: "Comic Sans MS, cursive" }}>Loading useless content...</p>
                      </div>
                    </div>
                  )}

                  {/* Video Controls Overlay */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
                      showControls ? "opacity-100" : "opacity-0"
                    }`}
                    onMouseEnter={() => setShowControls(true)}
                    onMouseLeave={() => setShowControls(false)}
                  >
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <Slider
                        value={[currentTime]}
                        max={duration}
                        step={1}
                        onValueChange={handleSeek}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-white mt-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={togglePlay}
                          className="text-white hover:bg-white/20"
                        >
                          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                        </Button>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleMute}
                            className="text-white hover:bg-white/20"
                          >
                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                          </Button>
                          <Slider
                            value={[isMuted ? 0 : volume]}
                            max={1}
                            step={0.1}
                            onValueChange={handleVolumeChange}
                            className="w-20"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                          <Settings className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleFullscreen}
                          className="text-white hover:bg-white/20"
                        >
                          <Maximize className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Click to Play Overlay */}
                  {!isPlaying && (
                    <div
                      className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/20"
                      onClick={togglePlay}
                      onMouseEnter={() => setShowControls(true)}
                    >
                      <div className="bg-black/50 rounded-full p-4">
                        <Play className="w-16 h-16 text-white fill-current" />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </Card>

          {/* Video Info */}
          <Card
            className="bg-white border-3 border-gray-800 shadow-lg transform rotate-0.3"
            style={{ borderStyle: "dashed" }}
          >
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                {video?.title}
              </h1>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12 border-2 border-black transform -rotate-2">
                    <AvatarImage src={video?.creator_avatar || "/placeholder.svg"} alt={video?.creator_name} />
                    <AvatarFallback className="bg-red-600 text-white font-bold">
                      {video?.creator_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-bold text-gray-900" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                        {video?.creator_name}
                      </p>
                      <VerifiedBadge isVerified={video?.creator_name === "UselessTube Official"} />
                    </div>
                    <p className="text-sm text-gray-600" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                      {subscriberCount.toLocaleString()} subscribers • {video?.views.toLocaleString()} views •{" "}
                      {new Date(video?.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {user && video && video.user_id !== user.id && (
                  <Button
                    onClick={handleSubscribe}
                    disabled={subscribing}
                    className={`border-2 border-black transform rotate-2 transition-all ${
                      isSubscribed
                        ? "bg-gray-600 hover:bg-gray-700 text-white"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                    style={{ borderStyle: "solid", fontFamily: "Comic Sans MS, cursive" }}
                  >
                    {subscribing ? (
                      "Loading..."
                    ) : isSubscribed ? (
                      <>
                        <BellRing className="w-4 h-4 mr-2" />
                        Subscribed
                      </>
                    ) : (
                      <>
                        <Bell className="w-4 h-4 mr-2" />
                        Subscribe
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 mb-6">
                <Button
                  variant="outline"
                  onClick={handleLike}
                  className={`border-2 border-gray-600 transform hover:scale-105 ${
                    liked ? "bg-red-100 text-red-600" : "bg-white text-gray-800"
                  }`}
                  style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
                >
                  <ThumbsUp className={`w-4 h-4 mr-2 ${liked ? "fill-current" : ""}`} />
                  {liked ? "Liked!" : "Like"}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleDislike}
                  className={`border-2 border-gray-600 transform hover:scale-105 ${
                    disliked ? "bg-gray-100 text-gray-600" : "bg-white text-gray-800"
                  }`}
                  style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
                >
                  <ThumbsDown className={`w-4 h-4 mr-2 ${disliked ? "fill-current" : ""}`} />
                  Dislike
                </Button>

                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="border-2 border-gray-600 bg-white text-gray-800 transform hover:scale-105"
                  style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
                >
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>

                <Button
                  variant="outline"
                  className="border-2 border-gray-600 bg-white text-gray-800 transform hover:scale-105"
                  style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>

                {/* Delete Button - Only show for user's own videos */}
                {user && video && video.user_id === user.id && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-2 border-red-600 text-red-600 hover:bg-red-50 transform hover:scale-105"
                        style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent
                      className="border-3 border-gray-800"
                      style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
                    >
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Useless Video?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{video.title}"? This action cannot be undone and your
                          useless content will be lost forever.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          className="border-2 border-gray-600"
                          style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
                        >
                          Keep It Useless
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteVideo}
                          className="bg-red-600 hover:bg-red-700 text-white border-2 border-black"
                          style={{ borderStyle: "solid", fontFamily: "Comic Sans MS, cursive" }}
                        >
                          Delete Forever
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}

                <Button
                  variant="outline"
                  className="border-2 border-gray-600 bg-white text-gray-800 transform hover:scale-105"
                  style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Report
                </Button>
              </div>

              {/* Description */}
              <div
                className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300 transform -rotate-0.5"
                style={{ borderStyle: "dashed" }}
              >
                <p className="text-gray-800 whitespace-pre-line" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                  {video?.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card
            className="bg-white border-3 border-gray-800 shadow-lg transform rotate-0.2"
            style={{ borderStyle: "dashed" }}
          >
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                {comments.length} Useless Comments
              </h3>

              {/* Add Comment */}
              {user ? (
                <div className="flex space-x-3 mb-6">
                  <Avatar className="w-10 h-10 border-2 border-black transform rotate-3">
                    <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name || ""} />
                    <AvatarFallback className="bg-red-600 text-white font-bold">
                      {(user.name || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a useless comment..."
                      className="border-2 border-gray-600 rounded-lg resize-none"
                      style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
                      rows={3}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setNewComment("")}
                        className="border-2 border-gray-600 bg-white text-gray-800"
                        style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="bg-red-600 hover:bg-red-700 text-white border-2 border-black"
                        style={{ borderStyle: "solid", fontFamily: "Comic Sans MS, cursive" }}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Comment
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="text-center p-4 bg-gray-100 rounded-lg border-2 border-gray-300 mb-6"
                  style={{ borderStyle: "dashed" }}
                >
                  <p className="text-gray-600" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                    Connect your wallet to leave useless comments!
                  </p>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment, index) => (
                  <div
                    key={comment.id}
                    className="flex space-x-3 p-3 bg-gray-50 rounded-lg border-2 border-gray-200 transform"
                    style={{
                      borderStyle: "dashed",
                      transform: `rotate(${(index % 2 === 0 ? 1 : -1) * 0.2}deg)`,
                    }}
                  >
                    <Avatar className="w-8 h-8 border-2 border-black">
                      <AvatarImage src={comment.user_avatar || "/placeholder.svg"} alt={comment.user_name} />
                      <AvatarFallback className="bg-red-600 text-white font-bold text-xs">
                        {comment.user_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-semibold text-gray-900" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                          {comment.user_name}
                        </p>
                        <p className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</p>
                      </div>
                      <p className="text-gray-800 mb-2" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                        {comment.content}
                      </p>
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-600 p-0 h-auto">
                          <Heart className="w-3 h-3 mr-1" />
                          {comment.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 p-0 h-auto">
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
