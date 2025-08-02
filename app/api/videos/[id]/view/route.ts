import { type NextRequest, NextResponse } from "next/server"
import { incrementVideoViews } from "@/lib/auth"

// Increment view count
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const videoId = parseInt(id)
    
    if (videoId) {
      await incrementVideoViews(videoId)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("View increment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
