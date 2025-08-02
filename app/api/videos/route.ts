import { type NextRequest, NextResponse } from "next/server"
import { createVideo, getVideosFromDB } from "@/lib/auth"
import { StorageService } from "@/lib/storage"

// Upload video
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, description, videoUrl, thumbnailUrl, duration, isShort } = body

    // Validate required fields
    if (!userId || !title || !videoUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create video in database
    const newVideo = await createVideo({
      userId,
      title,
      description,
      videoUrl,
      thumbnailUrl,
      duration,
      isShort,
    })

    return NextResponse.json({ 
      video: {
        id: newVideo.id,
        user_id: newVideo.userId,
        title: newVideo.title,
        description: newVideo.description,
        video_url: newVideo.videoUrl,
        thumbnail_url: newVideo.thumbnailUrl,
        duration: newVideo.duration,
        views: newVideo.views,
        likes: newVideo._count.likes,
        is_short: newVideo.isShort,
        created_at: newVideo.createdAt.toISOString(),
        updated_at: newVideo.updatedAt.toISOString(),
        creator_name: newVideo.user.name,
        creator_avatar: newVideo.user.avatarUrl,
      }
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

// Get videos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const isShort = searchParams.get("isShort")

    // Get videos from database
    const videos = await getVideosFromDB(
      isShort === "true" ? true : isShort === "false" ? false : undefined,
      userId ? parseInt(userId) : undefined
    )

    // Transform to match expected format
    const formattedVideos = videos.map(video => ({
      id: video.id,
      user_id: video.userId,
      title: video.title,
      description: video.description,
      video_url: video.videoUrl,
      thumbnail_url: video.thumbnailUrl,
      duration: video.duration,
      views: video.views,
      likes: video._count.likes,
      is_short: video.isShort,
      created_at: video.createdAt.toISOString(),
      updated_at: video.updatedAt.toISOString(),
      creator_name: video.user.name,
      creator_avatar: video.user.avatarUrl,
    }))

    return NextResponse.json({ videos: formattedVideos })
  } catch (error) {
    console.error("Get videos error:", error)
    return NextResponse.json({ videos: [] })
  }
}
