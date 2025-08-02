import { type NextRequest, NextResponse } from "next/server"


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ videos: [] })
    }

    const searchTerm = `%${query.trim().toLowerCase()}%`

    // No database: only search in preloaded videos
    let dbVideos = []

    // Search in preloaded videos
    const preloadedVideos = [
      {
        id: "pre-1",
        title: "Watching Paint Dry for 10 Minutes Straight",
        creator_name: "PaintWatcher2024",
        creator_avatar: "/placeholder.svg?height=40&width=40&text=PW",
        views: 1200000,
        duration: 600,
        thumbnail_url: "/placeholder.svg?height=180&width=320&text=Paint+Drying",
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        description: "The most riveting paint drying experience you'll ever witness.",
        is_short: false,
        likes: 45000,
        user_id: 0,
      },
      {
        id: "pre-2",
        title: "Staring at a Blank Wall for 5 Minutes",
        creator_name: "WallStarer",
        creator_avatar: "/placeholder.svg?height=40&width=40&text=WS",
        views: 856000,
        duration: 300,
        thumbnail_url: "/placeholder.svg?height=180&width=320&text=Blank+Wall",
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Just me, staring at a completely blank white wall.",
        is_short: false,
        likes: 32000,
        user_id: 0,
      },
      {
        id: "pre-16",
        title: "Watching my screensaver for life time",
        creator_name: "LifetimeScreenWatcher",
        creator_avatar: "/placeholder.svg?height=40&width=40&text=LSW",
        views: 5600000,
        duration: 3600,
        thumbnail_url: "/placeholder.svg?height=180&width=320&text=Lifetime+Screensaver",
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        description:
          "The ultimate screensaver watching experience. I dedicate my entire lifetime to watching this mesmerizing screensaver.",
        is_short: false,
        likes: 234000,
        user_id: 0,
        video_url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Make_a_video_202508011057_nqjtg-CHAwHGXgiWo7vZinMSOPJEGVwSlI76.mp4",
      },
    ]

    const filteredPreloaded = preloadedVideos.filter(
      (video) =>
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.description.toLowerCase().includes(query.toLowerCase()) ||
        video.creator_name.toLowerCase().includes(query.toLowerCase()),
    )

    // Combine results
    const allResults = [...dbVideos, ...filteredPreloaded]

    return NextResponse.json({ videos: allResults })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ videos: [] })
  }
}
