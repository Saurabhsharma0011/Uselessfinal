import { type NextRequest, NextResponse } from "next/server"
import { StorageService } from "@/lib/storage"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as 'videos' | 'thumbnails' | 'avatars' || 'videos'

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file size (50MB for videos, 5MB for others)
    const maxSize = folder === 'videos' ? 50 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `File too large. Maximum size is ${maxSize / 1024 / 1024}MB` 
      }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Upload to cloud storage
    const result = await StorageService.uploadFile(
      buffer,
      file.name,
      file.type,
      folder
    )

    return NextResponse.json({
      url: result.url,
      key: result.key,
      fileName: file.name,
      size: file.size,
      type: file.type
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
} 