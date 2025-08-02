"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Trash2, Edit, Play, Eye, Heart, Calendar, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { getUserVideos, deleteVideo, type User, type Video } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { VerifiedBadge } from "@/components/verified-badge"

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const savedUser = localStorage.getItem("useless-user")
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      loadUserVideos(userData.id)
    } else {
      router.push("/")
    }
  }, [router])

  const loadUserVideos = async (userId: number) => {
    try {
      const userVideos = await getUserVideos(userId)
      setVideos(userVideos)
    } catch (error) {
      toast({
        title: "Failed to Load Videos",
        description: "Could not load your videos. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteVideo = async (videoId: number) => {
    if (!user) return

    setDeletingId(videoId)
    try {
      await deleteVideo(videoId, user.id)
      setVideos(videos.filter((video) => video.id !== videoId))
      toast({
        title: "Video Deleted",
        description: "Your useless video has been permanently deleted.",
      })
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete video. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
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
      {/* Header */}
      <div className="bg-white border-b-4 border-gray-800 shadow-lg" style={{ borderStyle: "dashed" }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
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
            className="text-2xl font-bold text-gray-900 transform rotate-1"
            style={{
              fontFamily: "Comic Sans MS, cursive",
              textShadow: "2px 2px 0px #ef4444",
            }}
          >
            My Useless Videos
          </h1>

          <Link href="/upload">
            <Button
              className="bg-red-600 hover:bg-red-700 text-white border-2 border-black transform rotate-2"
              style={{ borderStyle: "solid", fontFamily: "Comic Sans MS, cursive" }}
            >
              Upload More Useless Content
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* User Stats */}
        <Card
          className="bg-white border-3 border-gray-800 shadow-lg transform -rotate-0.5 mb-8"
          style={{ borderStyle: "dashed" }}
        >
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16 border-3 border-black transform rotate-3">
                <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name || ""} />
                <AvatarFallback className="bg-red-600 text-white font-bold text-2xl">
                  {(user.name || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                    {user.name || "Unnamed Useless Creator"}
                  </h2>
                  <VerifiedBadge
                    isVerified={user.name === "UselessTube Official" || user.wallet_address === "DBoZreu2...AEYTBKEA"}
                  />
                </div>
                <p className="text-gray-600" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                  Total Useless Videos: {videos.length}
                </p>
                <p className="text-gray-600" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                  Total Views: {videos.reduce((sum, video) => sum + video.views, 0)}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Videos Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl font-bold text-gray-600" style={{ fontFamily: "Comic Sans MS, cursive" }}>
              Loading your useless content...
            </div>
          </div>
        ) : videos.length === 0 ? (
          <Card
            className="bg-white border-3 border-gray-800 shadow-lg transform rotate-0.5"
            style={{ borderStyle: "dashed" }}
          >
            <CardContent className="text-center py-12">
              <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                No Useless Videos Yet!
              </h3>
              <p className="text-gray-500 mb-6" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                Start creating some wonderfully useless content.
              </p>
              <Link href="/upload">
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white border-2 border-black transform hover:scale-105"
                  style={{ borderStyle: "solid", fontFamily: "Comic Sans MS, cursive" }}
                >
                  Upload Your First Useless Video
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <Card
                key={video.id}
                className="bg-white border-3 border-gray-800 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                style={{
                  borderStyle: "dashed",
                  transform: `rotate(${(index % 2 === 0 ? 1 : -1) * ((index % 3) + 1) * 0.3}deg)`,
                }}
              >
                <CardContent className="p-0">
                  {/* Video Thumbnail */}
                  <div
                    className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300 border-b-3 border-gray-800 flex items-center justify-center overflow-hidden"
                    style={{ borderStyle: "dashed" }}
                  >
                    {video.thumbnail_url ? (
                      <img
                        src={video.thumbnail_url || "/placeholder.svg"}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <Play className="w-12 h-12 text-red-600 mx-auto mb-2 fill-current" />
                        <p className="text-gray-800 font-bold" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                          {video.is_short ? "SHORT" : "VIDEO"}
                        </p>
                      </div>
                    )}

                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs font-bold">
                      {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, "0")}
                    </div>

                    {/* Short Badge */}
                    {video.is_short && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                        SHORT
                      </div>
                    )}
                  </div>

                  {/* Video Info */}
                  <div className="p-4">
                    <h3
                      className="font-bold text-gray-900 mb-2 line-clamp-2"
                      style={{ fontFamily: "Comic Sans MS, cursive" }}
                    >
                      {video.title}
                    </h3>

                    {video.description && (
                      <p
                        className="text-sm text-gray-600 mb-3 line-clamp-2"
                        style={{ fontFamily: "Comic Sans MS, cursive" }}
                      >
                        {video.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{video.views}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>{video.likes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(video.created_at).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-2 border-gray-600 hover:bg-gray-100 transform hover:scale-105 bg-transparent"
                        style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const videoUrl = `${window.location.origin}/watch/${video.id}`
                          navigator.clipboard.writeText(videoUrl)
                          toast({
                            title: "Link Copied!",
                            description: "Video link copied! Share your useless content.",
                          })
                        }}
                        className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transform hover:scale-105 bg-transparent"
                        style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
                      >
                        <Share className="w-3 h-3 mr-1" />
                        Share
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={deletingId === video.id}
                            className="border-2 border-red-600 text-red-600 hover:bg-red-50 transform hover:scale-105 bg-transparent"
                            style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            {deletingId === video.id ? "..." : "Delete"}
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
                              onClick={() => handleDeleteVideo(video.id)}
                              className="bg-red-600 hover:bg-red-700 text-white border-2 border-black"
                              style={{ borderStyle: "solid", fontFamily: "Comic Sans MS, cursive" }}
                            >
                              Delete Forever
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
