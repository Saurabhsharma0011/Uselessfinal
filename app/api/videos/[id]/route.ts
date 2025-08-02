import { type NextRequest, NextResponse } from "next/server"
import { deleteVideoFromDB, incrementVideoViews } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const videoId = parseInt(id)

    if (!videoId) {
      return NextResponse.json({ error: "Invalid video ID" }, { status: 400 })
    }

    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        user: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            likes: {
              where: { isLike: true },
            },
            comments: true,
          },
        },
      },
    })

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    // Increment view count
    await incrementVideoViews(videoId)

    return NextResponse.json({
      video: {
        id: video.id,
        user_id: video.userId,
        title: video.title,
        description: video.description,
        video_url: video.videoUrl,
        thumbnail_url: video.thumbnailUrl,
        duration: video.duration,
        views: video.views + 1, // Include the new view
        likes: video._count.likes,
        comments_count: video._count.comments,
        is_short: video.isShort,
        created_at: video.createdAt.toISOString(),
        updated_at: video.updatedAt.toISOString(),
        creator_name: video.user.name,
        creator_avatar: video.user.avatarUrl,
      }
    })
  } catch (error) {
    console.error("Get video error:", error)
    return NextResponse.json({ error: "Failed to get video" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const { id } = await params
    const videoId = parseInt(id)

    if (!userId || !videoId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Get video details before deletion
    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        userId: parseInt(userId),
      },
    })

    if (!video) {
      return NextResponse.json({ error: "Video not found or unauthorized" }, { status: 404 })
    }

    // Delete from database first
    await deleteVideoFromDB(videoId, parseInt(userId))

    // Delete files from local storage
    try {
      if (video.videoUrl && video.videoUrl.startsWith('/api/files/')) {
        const videoPath = video.videoUrl.replace('/api/files/', '')
        const fullVideoPath = join(process.env.LOCAL_STORAGE_PATH || './uploads', videoPath)
        
        if (existsSync(fullVideoPath)) {
          await unlink(fullVideoPath)
          console.log(`Deleted video file: ${fullVideoPath}`)
        }
      }
      
      if (video.thumbnailUrl && video.thumbnailUrl.startsWith('/api/files/')) {
        const thumbnailPath = video.thumbnailUrl.replace('/api/files/', '')
        const fullThumbnailPath = join(process.env.LOCAL_STORAGE_PATH || './uploads', thumbnailPath)
        
        if (existsSync(fullThumbnailPath)) {
          await unlink(fullThumbnailPath)
          console.log(`Deleted thumbnail file: ${fullThumbnailPath}`)
        }
      }
    } catch (storageError) {
      console.error("Failed to delete files from storage:", storageError)
      // Continue even if storage deletion fails - database deletion was successful
    }

    return NextResponse.json({ message: "Video deleted successfully" })
  } catch (error) {
    console.error("Delete video error:", error)
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 })
  }
}
