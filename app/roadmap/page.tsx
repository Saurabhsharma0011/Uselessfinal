"use client"

import Link from "next/link"
import { ArrowLeft, CheckCircle, Circle, Clock, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function UselessRoadmap() {
  const roadmapItems = [
    {
      phase: "Phase 1",
      title: "The Beginning of Uselessness",
      status: "completed",
      date: "Q1 2024",
      items: [
        "✅ Create the most useless website ever",
        "✅ Launch $USELESS token with zero utility",
        "✅ Build a community of useless people",
        "✅ Waste everyone's time effectively",
      ],
    },
    {
      phase: "Phase 2",
      title: "Expanding the Uselessness",
      status: "completed",
      date: "Q2 2024",
      items: [
        "✅ Launch UselessTube video platform",
        "✅ Enable useless video uploads",
        "✅ Add Phantom wallet integration",
        "✅ Create useless shorts feature",
      ],
    },
    {
      phase: "Phase 3",
      title: "Peak Uselessness",
      status: "in-progress",
      date: "Q3 2024",
      items: [
        "🔄 Add NFT profile pictures (useless ones)",
        "🔄 Create useless token rewards system",
        "🔄 Launch useless merchandise store",
        "⏳ Partner with other useless projects",
      ],
    },
    {
      phase: "Phase 4",
      title: "Ultimate Uselessness",
      status: "upcoming",
      date: "Q4 2024",
      items: [
        "⏳ Launch UselessTube mobile app",
        "⏳ Create useless gaming platform",
        "⏳ Add useless AI chatbot",
        "⏳ Organize first UselessCon event",
      ],
    },
    {
      phase: "Phase 5",
      title: "Beyond Uselessness",
      status: "upcoming",
      date: "2025",
      items: [
        "⏳ Launch UselessTube in the metaverse",
        "⏳ Create useless space program",
        "⏳ Achieve world domination (uselessly)",
        "⏳ Make everything useless",
      ],
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-green-600" />
      case "in-progress":
        return <Clock className="w-6 h-6 text-yellow-600" />
      default:
        return <Circle className="w-6 h-6 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge
            className="bg-green-100 text-green-800 border-green-300"
            style={{ fontFamily: "Comic Sans MS, cursive" }}
          >
            Completed
          </Badge>
        )
      case "in-progress":
        return (
          <Badge
            className="bg-yellow-100 text-yellow-800 border-yellow-300"
            style={{ fontFamily: "Comic Sans MS, cursive" }}
          >
            In Progress
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-100 text-gray-600 border-gray-300" style={{ fontFamily: "Comic Sans MS, cursive" }}>
            Upcoming
          </Badge>
        )
    }
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
            Useless Roadmap
          </h1>

          <div className="w-32" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <Card
          className="bg-gradient-to-br from-purple-100 to-pink-100 border-3 border-gray-800 shadow-lg transform -rotate-0.5"
          style={{ borderStyle: "dashed" }}
        >
          <CardContent className="p-8 text-center">
            <div className="w-24 h-24 bg-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-white transform rotate-12">
              <Zap className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "Comic Sans MS, cursive" }}>
              Our Journey to Ultimate Uselessness
            </h2>
            <p className="text-xl text-gray-700" style={{ fontFamily: "Comic Sans MS, cursive" }}>
              Follow our carefully planned path to achieve absolutely nothing meaningful!
            </p>
          </CardContent>
        </Card>

        {/* Roadmap Timeline */}
        <div className="space-y-6">
          {roadmapItems.map((item, index) => (
            <Card
              key={item.phase}
              className="bg-white border-3 border-gray-800 shadow-lg transform hover:scale-102 transition-all"
              style={{
                borderStyle: "dashed",
                transform: `rotate(${(index % 2 === 0 ? 1 : -1) * 0.3}deg)`,
              }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <CardTitle className="text-xl text-gray-900" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                        {item.phase}: {item.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                        {item.date}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(item.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {item.items.map((task, taskIndex) => (
                    <div
                      key={taskIndex}
                      className="p-3 bg-gray-50 rounded-lg border-2 border-gray-200 transform"
                      style={{
                        borderStyle: "dashed",
                        transform: `rotate(${(taskIndex % 2 === 0 ? 1 : -1) * 0.2}deg)`,
                      }}
                    >
                      <p className="text-gray-800" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                        {task}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card
          className="bg-gradient-to-br from-red-100 to-orange-100 border-3 border-gray-800 shadow-lg transform rotate-0.5"
          style={{ borderStyle: "dashed" }}
        >
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "Comic Sans MS, cursive" }}>
              Join the Useless Revolution!
            </h3>
            <p className="text-gray-700 mb-6" style={{ fontFamily: "Comic Sans MS, cursive" }}>
              Be part of our journey to create the most meaningless ecosystem in the universe. Your contribution to
              uselessness matters!
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/token">
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white border-2 border-black transform hover:scale-105"
                  style={{ borderStyle: "solid", fontFamily: "Comic Sans MS, cursive" }}
                >
                  Get $USELESS Token
                </Button>
              </Link>
              <Link href="/upload">
                <Button
                  variant="outline"
                  className="border-2 border-gray-600 bg-white text-gray-800 transform hover:scale-105"
                  style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
                >
                  Upload Useless Content
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
