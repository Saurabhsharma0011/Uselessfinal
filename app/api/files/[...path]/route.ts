import { type NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params
    
    // Decode URL-encoded path components
    const decodedPath = path.map(segment => decodeURIComponent(segment))
    
    const filePath = join(process.env.LOCAL_STORAGE_PATH || './uploads', ...decodedPath)
    
    if (!existsSync(filePath)) {
      console.log(`File not found: ${filePath}`)
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const fileBuffer = await readFile(filePath)
    
    // Determine content type based on file extension
    const ext = decodedPath[decodedPath.length - 1].split('.').pop()?.toLowerCase()
    let contentType = 'application/octet-stream'
    
    switch (ext) {
      case 'mp4':
        contentType = 'video/mp4'
        break
      case 'webm':
        contentType = 'video/webm'
        break
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg'
        break
      case 'png':
        contentType = 'image/png'
        break
      case 'gif':
        contentType = 'image/gif'
        break
      case 'svg':
        contentType = 'image/svg+xml'
        break
    }

    // Add cache-busting headers for thumbnails
    const isThumbnail = decodedPath.some(segment => segment.includes('thumbnail'))
    const cacheHeaders: Record<string, string> = isThumbnail 
      ? {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      : {
          'Cache-Control': 'public, max-age=31536000' // Cache for 1 year
        }

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        ...cacheHeaders,
      },
    })
  } catch (error) {
    console.error("File serving error:", error)
    return NextResponse.json({ error: "Failed to serve file" }, { status: 500 })
  }
} 