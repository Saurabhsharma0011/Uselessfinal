"use client"

import Link from "next/link"
import { ArrowLeft, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function UselessVideos() {
  // Pre-loaded useless videos
  const uselessVideos = [
    {
      id: "useless-1",
      title: "Watching Paint Dry for 10 Minutes Straight",
      creator: "PaintWatcher2024",
      avatar: "/placeholder.svg?height=40&width=40&text=PW",
      views: "1.2M",
      duration: "10:00",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Paint+Drying",
      uploadTime: "2 days ago",
      description: "The most riveting paint drying experience you'll ever witness. Pure white paint on a wall.",
    },
    {
      id: "useless-2",
      title: "Staring at a Blank Wall for 5 Minutes",
      creator: "WallStarer",
      avatar: "/placeholder.svg?height=40&width=40&text=WS",
      views: "856K",
      duration: "5:00",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Blank+Wall",
      uploadTime: "1 week ago",
      description: "Just me, staring at a completely blank white wall. Nothing happens. Perfect.",
    },
    {
      id: "useless-3",
      title: "Counting to 100 Very Slowly",
      creator: "SlowCounter",
      avatar: "/placeholder.svg?height=40&width=40&text=SC",
      views: "2.1M",
      duration: "8:33",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Counting",
      uploadTime: "3 days ago",
      description: "One... Two... Three... You get the idea. I count to 100 at the pace of a sloth.",
    },
    {
      id: "useless-4",
      title: "My Pet Rock's Daily Routine",
      creator: "RockOwner",
      avatar: "/placeholder.svg?height=40&width=40&text=RO",
      views: "3.4M",
      duration: "12:45",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Pet+Rock",
      uploadTime: "5 days ago",
      description: "Follow my pet rock through its exciting daily activities. Spoiler: it doesn't move.",
    },
    {
      id: "useless-5",
      title: "Explaining Why This Video is Pointless",
      creator: "MetaUseless",
      avatar: "/placeholder.svg?height=40&width=40&text=MU",
      views: "4.2M",
      duration: "6:12",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Meta+Video",
      uploadTime: "1 day ago",
      description: "A deep philosophical dive into the meaninglessness of this very video. Very meta.",
    },
    {
      id: "useless-6",
      title: "Grass Growing in Real Time",
      creator: "GrassWatcher",
      avatar: "/placeholder.svg?height=40&width=40&text=GW",
      views: "987K",
      duration: "15:22",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Growing+Grass",
      uploadTime: "4 days ago",
      description: "Unedited footage of grass growing. You can literally watch it grow. Thrilling stuff.",
    },
    {
      id: "useless-7",
      title: "Reading the Dictionary: Letter A",
      creator: "DictionaryReader",
      avatar: "/placeholder.svg?height=40&width=40&text=DR",
      views: "654K",
      duration: "23:11",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Dictionary",
      uploadTime: "1 week ago",
      description: "I read every single word that starts with 'A' from the dictionary. Aardvark to Azygous.",
    },
    {
      id: "useless-8",
      title: "Watching Water Boil (Full Process)",
      creator: "BoilWatcher",
      avatar: "/placeholder.svg?height=40&width=40&text=BW",
      views: "1.8M",
      duration: "7:45",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Boiling+Water",
      uploadTime: "6 days ago",
      description: "From cold water to rolling boil. Every bubble captured in stunning 4K quality.",
    },
    {
      id: "useless-9",
      title: "My Ceiling Fan: A 10 Minute Documentary",
      creator: "FanEnthusiast",
      avatar: "/placeholder.svg?height=40&width=40&text=FE",
      views: "1.1M",
      duration: "10:00",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Ceiling+Fan",
      uploadTime: "3 days ago",
      description: "An in-depth look at my ceiling fan. It spins. That's about it. Riveting content.",
    },
    {
      id: "useless-10",
      title: "Sorting My Sock Drawer in Silence",
      creator: "SockSorter",
      avatar: "/placeholder.svg?height=40&width=40&text=SS",
      views: "743K",
      duration: "14:33",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Sock+Drawer",
      uploadTime: "2 weeks ago",
      description: "Watch me organize my socks by color, size, and material. No commentary. Pure sock action.",
    },
    {
      id: "useless-11",
      title: "Staring Contest with My Cat (I Lost)",
      creator: "CatStarer",
      avatar: "/placeholder.svg?height=40&width=40&text=CS",
      views: "2.7M",
      duration: "4:22",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Cat+Staring",
      uploadTime: "5 days ago",
      description: "Epic staring contest with my cat. Spoiler alert: cats are unbeatable at staring.",
    },
    {
      id: "useless-12",
      title: "Watching Ice Melt in My Freezer",
      creator: "IceMelter",
      avatar: "/placeholder.svg?height=40&width=40&text=IM",
      views: "892K",
      duration: "18:44",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Melting+Ice",
      uploadTime: "1 week ago",
      description: "Time-lapse of ice cubes slowly melting. The most exciting 18 minutes of your life.",
    },
    {
      id: "useless-13",
      title: "My Morning Routine: Staring at Coffee",
      creator: "CoffeeStarer",
      avatar: "/placeholder.svg?height=40&width=40&text=CF",
      views: "1.5M",
      duration: "6:55",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Coffee+Cup",
      uploadTime: "4 days ago",
      description: "I stare at my coffee cup for 7 minutes before taking the first sip. Peak content.",
    },
    {
      id: "useless-14",
      title: "Explaining Why Explaining is Useless",
      creator: "ExplainMaster",
      avatar: "/placeholder.svg?height=40&width=40&text=EM",
      views: "3.1M",
      duration: "9:17",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Explaining",
      uploadTime: "2 days ago",
      description: "A comprehensive explanation of why explanations are fundamentally pointless. Ironic.",
    },
    {
      id: "useless-15",
      title: "Watching My Screen Saver for 20 Minutes",
      creator: "ScreenSaverFan",
      avatar: "/placeholder.svg?height=40&width=40&text=SF",
      views: "1.9M",
      duration: "20:00",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Screen+Saver",
      uploadTime: "1 week ago",
      description: "Pure nostalgia. Just me watching the bouncing DVD logo screen saver. Does it hit the corner?",
    },
  ]

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23f1f1f1' fillOpacity='0.3'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      {/* Header */}
      <div className="bg-white border-b-4 border-gray-800 shadow-lg" style={{ borderStyle: "dashed" }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-gray-800 hover:bg-gray-100 border-2 border-gray-600 rounded-lg transform -rotate-1"
              style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Button>
          </Link>

          <h1
            className="text-3xl font-bold text-gray-900 transform rotate-1"
            style={{
              fontFamily: "Comic Sans MS, cursive",
              textShadow: "2px 2px 0px #ef4444",
            }}
          >
            Useless Videos Collection
          </h1>

          <div className="w-32" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Description */}
        <Card
          className="bg-gradient-to-br from-red-100 to-orange-100 border-3 border-gray-800 shadow-lg transform -rotate-0.5 mb-8"
          style={{ borderStyle: "dashed" }}
        >
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "Comic Sans MS, cursive" }}>
              🗑️ The Most Useless Videos Ever Created 🗑️
            </h2>
            <p className="text-gray-700 text-lg" style={{ fontFamily: "Comic Sans MS, cursive" }}>
              Curated collection of the most pointless, meaningless, and utterly useless videos on the internet. Perfect
              for wasting your precious time!
            </p>
          </CardContent>
        </Card>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {uselessVideos.map((video, index) => (
            <Link key={video.id} href={`/watch/${video.id}`}>
              <Card
                className="bg-white border-3 border-gray-800 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
                style={{
                  borderStyle: "dashed",
                  transform: `rotate(${(index % 2 === 0 ? 1 : -1) * ((index % 3) + 1) * 0.3}deg)`,
                }}
              >
                <CardContent className="p-0">
                  {/* Thumbnail */}
                  <div
                    className="relative aspect-video border-b-3 border-gray-800 flex items-center justify-center overflow-hidden"
                    style={{
                      borderStyle: "dashed",
                      backgroundImage: `linear-gradient(135deg, 
                        ${
                          index % 4 === 0
                            ? "#fee2e2, #fecaca"
                            : index % 4 === 1
                              ? "#dbeafe, #bfdbfe"
                              : index % 4 === 2
                                ? "#dcfce7, #bbf7d0"
                                : "#fef3c7, #fde68a"
                        })`,
                    }}
                  >
                    <div className="text-center">
                      <Play className="w-12 h-12 text-red-600 mx-auto mb-2 fill-current" />
                      <p
                        className="text-gray-800 font-bold text-xs px-2"
                        style={{ fontFamily: "Comic Sans MS, cursive" }}
                      >
                        USELESS
                      </p>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs font-bold">
                      {video.duration}
                    </div>

                    {/* Useless Badge */}
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold transform -rotate-12">
                      100% USELESS
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="p-4">
                    <h3
                      className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm"
                      style={{ fontFamily: "Comic Sans MS, cursive" }}
                    >
                      {video.title}
                    </h3>

                    <div className="flex items-center space-x-2 mb-2">
                      <Avatar className="w-6 h-6 border-2 border-black transform -rotate-6">
                        <AvatarImage src={video.avatar || "/placeholder.svg"} alt={video.creator} />
                        <AvatarFallback className="bg-red-600 text-white font-bold text-xs">
                          {video.creator.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className="text-xs text-gray-700 font-semibold truncate"
                        style={{ fontFamily: "Comic Sans MS, cursive" }}
                      >
                        {video.creator}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                      {video.views} views • {video.uploadTime}
                    </div>

                    {/* Description Preview */}
                    <p
                      className="text-xs text-gray-500 mt-2 line-clamp-2"
                      style={{ fontFamily: "Comic Sans MS, cursive" }}
                    >
                      {video.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <Card
          className="bg-gradient-to-br from-purple-100 to-pink-100 border-3 border-gray-800 shadow-lg transform rotate-0.5 mt-12"
          style={{ borderStyle: "dashed" }}
        >
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "Comic Sans MS, cursive" }}>
              Want to Add Your Own Useless Content?
            </h3>
            <p className="text-gray-700 mb-6" style={{ fontFamily: "Comic Sans MS, cursive" }}>
              Join our community of useless creators and share your most pointless videos!
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/upload">
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white border-2 border-black transform hover:scale-105"
                  style={{ borderStyle: "solid", fontFamily: "Comic Sans MS, cursive" }}
                >
                  Upload Useless Video
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  className="border-2 border-gray-600 bg-white text-gray-800 transform hover:scale-105"
                  style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
                >
                  Browse More Content
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
