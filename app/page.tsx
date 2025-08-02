"use client"

import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, UserIcon, Play, ChevronDown, Upload, Check, Trash2, Copy } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PhantomWalletButton } from "@/components/phantom-wallet-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { VerifiedBadge } from "@/components/verified-badge"
import { updateProfile, getVideos, type User, type Video } from "@/lib/auth"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

export default function UselessTube() {
  const [user, setUser] = useState<User | null>(null)
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [tempProfile, setTempProfile] = useState({ name: "", image: "" })
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Video[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "The text has been copied to your clipboard.",
    })
  }

  const sidebarItems = [
    { name: "Home", href: "/" },
    { name: "Useless Videos", href: "/useless-videos" },
    { name: "Useless Shorts", href: "/shorts" },
    { name: "Upload Video", href: "/upload" },
    { name: "My Videos", href: "/dashboard" },
  ]

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("useless-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    // Load videos
    loadVideos()
  }, [])

  const loadVideos = async () => {
    try {
      // Only get user-uploaded videos from database
      const fetchedVideos = (await getVideos(false)) || []
      setVideos(fetchedVideos)
    } catch (error) {
      console.error("Failed to load videos:", error)
      setVideos([])
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setSearchResults(data.videos || [])

      toast({
        title: "Search Complete!",
        description: `Found ${data.videos?.length || 0} useless videos matching "${searchQuery}"`,
      })
    } catch (error) {
      console.error("Search error:", error)
      toast({
        title: "Search Failed",
        description: "Failed to search videos. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
  }

  const handleWalletConnected = (connectedUser: User, isNewUser: boolean) => {
    setUser(connectedUser)
    localStorage.setItem("useless-user", JSON.stringify(connectedUser))

    if (isNewUser || !connectedUser.name) {
      setShowProfileSetup(true)
      setTempProfile({
        name: connectedUser.name || "",
        image: connectedUser.avatar_url || "",
      })
    }
  }

  const handleWalletDisconnected = () => {
    setUser(null)
    localStorage.removeItem("useless-user")
    setShowProfileSetup(false)
  }

  const handleSaveProfile = async () => {
    if (!user || !tempProfile.name.trim()) return

    setLoading(true)
    try {
      const updatedUser = await updateProfile(user.wallet_address, tempProfile.name, tempProfile.image)
      setUser(updatedUser)
      localStorage.setItem("useless-user", JSON.stringify(updatedUser))
      setShowProfileSetup(false)

      toast({
        title: "Profile Updated!",
        description: "Your useless profile has been saved.",
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setTempProfile((prev) => ({
          ...prev,
          image: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteVideo = async (videoId: number) => {
    if (!user) return

    try {
      const response = await fetch(`/api/videos/${videoId}?userId=${user.id}`, {
        method: "DELETE",
      })
      
      if (response.ok) {
        setVideos((prevVideos) => prevVideos.filter((video) => video.id !== videoId))
        toast({
          title: "Video Deleted!",
          description: "Your useless video has been permanently deleted.",
        })
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

  const displayVideos = searchResults.length > 0 ? searchResults : videos

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b-4 border-gray-800 dark:border-gray-600 shadow-lg transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" style={{ transform: "rotate(0.3deg)" }}>
            <Image src="/logo.png" alt="UselessTube Logo" width={50} height={50} />
            <div>
              <h1
                className="text-2xl font-bold text-gray-900 dark:text-gray-100"
                style={{
                  fontFamily: "Comic Sans MS, cursive",
                  textShadow: "2px 2px 0px #ef4444",
                }}
              >
                UselessTube
              </h1>
              <p
                className="text-xs text-gray-600 dark:text-gray-400 -mt-1"
                style={{ fontFamily: "Comic Sans MS, cursive" }}
              >
                place where things become useless
              </p>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8" style={{ transform: "rotate(-0.1deg)" }}>
            <div className="relative">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search something useless..."
                className="w-full pl-4 pr-12 py-3 text-lg border-3 border-gray-800 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 shadow-inner dark:text-gray-100"
                style={{
                  fontFamily: "Comic Sans MS, cursive",
                  borderStyle: "dashed",
                }}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isSearching}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700 border-2 border-gray-800 dark:border-gray-600 rounded-full"
                style={{ transform: "rotate(5deg)" }}
              >
                <Search className="w-4 h-4 text-white" />
              </Button>
            </div>
          </form>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full border-3 border-black dark:border-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer flex items-center space-x-2">
                  {user && user.name ? (
                    <Avatar className="w-8 h-8 border-2 border-black dark:border-gray-300">
                      <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-red-600 text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <UserIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
                  )}
                  <ChevronDown className="w-4 h-4 text-gray-800 dark:text-gray-200" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-80 bg-white dark:bg-gray-800 border-3 border-gray-800 dark:border-gray-600 shadow-lg"
                style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
              >
                {!user ? (
                  <div className="p-4">
                    <PhantomWalletButton
                      onWalletConnected={handleWalletConnected}
                      onWalletDisconnected={handleWalletDisconnected}
                      loading={loading}
                      setLoading={setLoading}
                    />
                  </div>
                ) : (
                  <>
                    {showProfileSetup ? (
                      <div className="p-4 space-y-4">
                        <h3
                          className="font-bold text-gray-900 dark:text-gray-100 text-center border-b-2 border-gray-300 dark:border-gray-600 pb-2"
                          style={{ borderStyle: "dashed" }}
                        >
                          Setup Your Useless Profile
                        </h3>

                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Profile Picture
                          </Label>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-16 h-16 border-3 border-gray-800 dark:border-gray-300 transform rotate-3">
                              <AvatarImage src={tempProfile.image || "/placeholder.svg"} alt="Profile" />
                              <AvatarFallback className="bg-red-600 text-white font-bold text-xl">
                                {tempProfile.name.charAt(0).toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="profile-upload"
                              />
                              <Label
                                htmlFor="profile-upload"
                                className="inline-flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-700 border-2 border-gray-600 dark:border-gray-500 rounded-lg cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                style={{ borderStyle: "dashed" }}
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload
                              </Label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Your Useless Name
                          </Label>
                          <Input
                            value={tempProfile.name}
                            onChange={(e) => setTempProfile((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter your useless name..."
                            className="border-2 border-gray-600 dark:border-gray-500 rounded-lg bg-white dark:bg-gray-700"
                            style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
                          />
                        </div>

                        <Button
                          onClick={handleSaveProfile}
                          disabled={!tempProfile.name.trim() || loading}
                          className="w-full bg-red-600 hover:bg-red-700 text-white border-2 border-black dark:border-gray-300 transition-colors"
                          style={{ borderStyle: "solid", fontFamily: "Comic Sans MS, cursive" }}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          {loading ? "Saving..." : "Save Useless Profile"}
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div
                          className="p-4 border-b-2 border-gray-300 dark:border-gray-600"
                          style={{ borderStyle: "dashed" }}
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-12 h-12 border-2 border-black dark:border-gray-300 transform -rotate-2">
                              <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name || ""} />
                              <AvatarFallback className="bg-red-600 text-white font-bold">
                                {(user.name || "U").charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-2">
                                <p className="font-bold text-gray-900 dark:text-gray-100">
                                  {user.name || "Unnamed User"}
                                </p>
                                <VerifiedBadge
                                  isVerified={
                                    user.name === "UselessTube Official" ||
                                    user.wallet_address === "DBoZreu2...AEYTBKEA"
                                  }
                                />
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                                {user.wallet_address?.slice(0, 8)}...{user.wallet_address?.slice(-8)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <DropdownMenuItem
                          onClick={() => {
                            setShowProfileSetup(true)
                            setTempProfile({ name: user.name || "", image: user.avatar_url || "" })
                          }}
                          className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          <UserIcon className="w-4 h-4 mr-3 text-gray-600 dark:text-gray-400" />
                          <span className="text-gray-800 dark:text-gray-200">Edit Profile</span>
                        </DropdownMenuItem>

                        <Link href="/dashboard">
                          <DropdownMenuItem className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                            <span className="text-gray-800 dark:text-gray-200">My Useless Videos</span>
                          </DropdownMenuItem>
                        </Link>

                        <Link href="/upload">
                          <DropdownMenuItem className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                            <Upload className="w-4 h-4 mr-3 text-gray-600 dark:text-gray-400" />
                            <span className="text-gray-800 dark:text-gray-200">Upload Video</span>
                          </DropdownMenuItem>
                        </Link>

                        <DropdownMenuSeparator
                          className="border-gray-300 dark:border-gray-600"
                          style={{ borderStyle: "dashed" }}
                        />

                        <div className="p-4">
                          <PhantomWalletButton
                            onWalletConnected={handleWalletConnected}
                            onWalletDisconnected={handleWalletDisconnected}
                            loading={loading}
                            setLoading={setLoading}
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className="w-64 p-6" style={{ transform: "rotate(0.2deg)" }}>
          <Card
            className="bg-gray-100 dark:bg-gray-800 border-3 border-gray-800 dark:border-gray-600 shadow-lg transform -rotate-1 transition-colors duration-300"
            style={{ borderStyle: "dashed" }}
          >
            <CardContent className="p-4">
              <nav className="space-y-3">
                {sidebarItems.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block p-3 bg-white dark:bg-gray-700 border-2 border-gray-600 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-md transform hover:scale-105"
                    style={{
                      fontFamily: "Comic Sans MS, cursive",
                      transform: `rotate(${(index % 2 === 0 ? 1 : -1) * (index + 1) * 0.5}deg)`,
                      borderStyle: "solid",
                    }}
                  >
                    <span className="text-gray-800 dark:text-gray-200 font-semibold">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Social Section */}
          <Card
            className="mt-6 bg-gray-100 dark:bg-gray-800 border-3 border-gray-800 dark:border-gray-600 shadow-lg transform rotate-1 transition-colors duration-300"
            style={{ borderStyle: "dashed" }}
          >
            <CardContent className="p-4">
              <h3
                className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 text-center"
                style={{ fontFamily: "Comic Sans MS, cursive" }}
              >
                Socials
              </h3>
              <nav className="space-y-3">
                <a
                  href="https://x.com/UselesssTube"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 text-center bg-white dark:bg-gray-700 border-2 border-gray-600 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-md transform hover:scale-105"
                  style={{
                    fontFamily: "Comic Sans MS, cursive",
                    borderStyle: "solid",
                  }}
                >
                  <span className="text-gray-800 dark:text-gray-200 font-semibold">Twitter</span>
                </a>
                <a
                  href="https://t.me/uselessstube"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 text-center bg-white dark:bg-gray-700 border-2 border-gray-600 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-md transform hover:scale-105"
                  style={{
                    fontFamily: "Comic Sans MS, cursive",
                    borderStyle: "solid",
                  }}
                >
                  <span className="text-gray-800 dark:text-gray-200 font-semibold">Telegram</span>
                </a>
              </nav>
            </CardContent>
          </Card>

          {/* CA Section */}
          <Card
            className="mt-6 bg-gray-100 dark:bg-gray-800 border-3 border-gray-800 dark:border-gray-600 shadow-lg transform -rotate-1 transition-colors duration-300"
            style={{ borderStyle: "dashed" }}
          >
            <CardContent className="p-4">
              <h3
                className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 text-center"
                style={{ fontFamily: "Comic Sans MS, cursive" }}
              >
                CA
              </h3>
              <div className="p-3 text-center bg-white dark:bg-gray-700 border-2 border-gray-600 dark:border-gray-500 rounded-lg">
                <p
                  className="text-sm text-gray-800 dark:text-gray-200 font-semibold break-all"
                  style={{ fontFamily: "Comic Sans MS, cursive" }}
                >
                  CA Will live soon
                </p>
              </div>
              <Button
                onClick={() => handleCopy("CA Will live soon")}
                className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white border-2 border-black dark:border-gray-300 transition-colors"
                style={{ borderStyle: "solid", fontFamily: "Comic Sans MS, cursive" }}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Search Results Header */}
          {searchResults.length > 0 && (
            <div className="mb-6">
              <Card
                className="bg-yellow-50 dark:bg-yellow-900/20 border-3 border-yellow-500 dark:border-yellow-600 shadow-lg transform rotate-0.5 transition-colors duration-300"
                style={{ borderStyle: "dashed" }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2
                        className="text-xl font-bold text-gray-900 dark:text-gray-100"
                        style={{ fontFamily: "Comic Sans MS, cursive" }}
                      >
                        Search Results for "{searchQuery}"
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                        Found {searchResults.length} useless videos
                      </p>
                    </div>
                    <Button
                      onClick={clearSearch}
                      variant="outline"
                      className="border-2 border-gray-600 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transform hover:scale-105"
                      style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
                    >
                      Clear Search
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayVideos.length > 0
              ? displayVideos.map((video, index) => (
                  <div key={video.id} className="relative group">
                    <Link href={`/watch/${video.id}`}>
                      <Card
                        className="bg-white dark:bg-gray-800 border-3 border-gray-800 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105 duration-300"
                        style={{
                          borderStyle: "dashed",
                          transform: `rotate(${(index % 2 === 0 ? 1 : -1) * ((index % 3) + 1) * 0.3}deg)`,
                        }}
                      >
                        <CardContent className="p-0">
                          {/* Video Thumbnail Section */}
                          <div
                            className="relative aspect-video border-b-3 border-gray-800 dark:border-gray-600 overflow-hidden"
                            style={{ borderStyle: "dashed" }}
                          >
                            {video.thumbnail_url ? (
                              <img
                                src={video.thumbnail_url}
                                alt={video.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.onerror = null // prevent infinite loop
                                  target.src = "/placeholder.svg"
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                                <Play className="w-12 h-12 text-red-600 fill-current" />
                              </div>
                            )}
                            {/* Duration Badge */}
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs font-bold">
                              {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, "0")}
                            </div>
                            
                            {/* Verified Badge for UselessTube Official */}
                            {video.creator_name === "UselessTube Official" && (
                              <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center space-x-1">
                                <VerifiedBadge isVerified={true} size="sm" className="text-white" />
                                <span>VERIFIED</span>
                              </div>
                            )}
                          </div>

                          <div className="p-4">
                            <h3
                              className="font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2"
                              style={{ fontFamily: "Comic Sans MS, cursive" }}
                            >
                              {video.title}
                            </h3>
                            <div className="flex items-center space-x-2 mb-2">
                              <Avatar className="w-8 h-8 border-2 border-black dark:border-gray-300">
                                <AvatarImage
                                  src={video.creator_avatar || "/placeholder.svg"}
                                  alt={video.creator_name || ""}
                                />
                                <AvatarFallback className="bg-red-600 text-white font-bold text-xs">
                                  {(video.creator_name || "U").charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex items-center space-x-1">
                                <span
                                  className="text-sm text-gray-700 dark:text-gray-300 font-semibold"
                                  style={{ fontFamily: "Comic Sans MS, cursive" }}
                                >
                                  {video.creator_name || "Anonymous"}
                                </span>
                                <VerifiedBadge isVerified={video.creator_name === "UselessTube Official"} />
                              </div>
                            </div>
                            <div
                              className="text-xs text-gray-600 dark:text-gray-400"
                              style={{ fontFamily: "Comic Sans MS, cursive" }}
                            >
                              {video.views.toLocaleString()} views • {new Date(video.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>

                    {/* Delete Button - Only show for user's own videos */}
                    {user && video.user_id === user.id && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="bg-red-600 hover:bg-red-700 text-white border-2 border-black shadow-lg"
                              style={{ borderStyle: "solid", fontFamily: "Comic Sans MS, cursive" }}
                              onClick={(e) => e.preventDefault()}
                            >
                              <Trash2 className="w-3 h-3" />
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
                                onClick={(e) => {
                                  e.preventDefault()
                                  handleDeleteVideo(video.id)
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white border-2 border-black"
                                style={{ borderStyle: "solid", fontFamily: "Comic Sans MS, cursive" }}
                              >
                                Delete Forever
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                ))
              : (
                // Empty state when no videos exist
                <div className="col-span-full text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-red-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white fill-current" />
                    </div>
                    <h3
                      className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4"
                      style={{ fontFamily: "Comic Sans MS, cursive" }}
                    >
                      No Useless Videos Yet!
                    </h3>
                    <p
                      className="text-gray-600 dark:text-gray-400 mb-6"
                      style={{ fontFamily: "Comic Sans MS, cursive" }}
                    >
                      Be the first to upload some wonderfully useless content!
                    </p>
                    <Link href="/upload">
                      <Button
                        className="bg-red-600 hover:bg-red-700 text-white border-2 border-black transform hover:scale-105"
                        style={{ borderStyle: "solid", fontFamily: "Comic Sans MS, cursive" }}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Your First Useless Video
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
          </div>
        </main>
      </div>
      <footer className="bg-white dark:bg-gray-800 border-t-4 border-gray-800 dark:border-gray-600 shadow-lg mt-8">
        <div className="max-w-7xl mx-auto py-6 px-4 text-center text-gray-600 dark:text-gray-400">
          <p style={{ fontFamily: "Comic Sans MS, cursive" }}>© 2025 UselessTube. All rights reserved. Or not. Whatever.</p>
        </div>
      </footer>
    </div>
  )
}
