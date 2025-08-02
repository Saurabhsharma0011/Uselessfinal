import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { writeFile, unlink, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'useless-tube-videos'
const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER || 's3'
const LOCAL_STORAGE_PATH = process.env.LOCAL_STORAGE_PATH || './uploads'

export interface UploadResult {
  url: string
  key: string
}

// Local storage implementation
export class LocalStorageService {
  static async uploadFile(
    file: Buffer,
    fileName: string,
    contentType: string,
    folder: 'videos' | 'thumbnails' | 'avatars' = 'videos'
  ): Promise<UploadResult> {
    const timestamp = Date.now()
    const key = `${folder}/${timestamp}-${fileName}`
    const filePath = join(LOCAL_STORAGE_PATH, key)
    
    // Ensure directory exists
    const dirPath = join(LOCAL_STORAGE_PATH, folder)
    if (!existsSync(dirPath)) {
      await mkdir(dirPath, { recursive: true })
    }
    
    // Write file
    await writeFile(filePath, file)
    
    return {
      url: `/api/files/${key}`,
      key,
    }
  }

  static async deleteFile(key: string): Promise<void> {
    const filePath = join(LOCAL_STORAGE_PATH, key)
    try {
      await unlink(filePath)
    } catch (error) {
      console.error('Failed to delete local file:', error)
    }
  }

  static extractKeyFromUrl(url: string): string {
    return url.replace('/api/files/', '')
  }
}

export class StorageService {
  static async uploadFile(
    file: Buffer,
    fileName: string,
    contentType: string,
    folder: 'videos' | 'thumbnails' | 'avatars' = 'videos'
  ): Promise<UploadResult> {
    if (STORAGE_PROVIDER === 'local') {
      return LocalStorageService.uploadFile(file, fileName, contentType, folder)
    }
    
    const key = `${folder}/${Date.now()}-${fileName}`
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
      ACL: 'public-read',
    })

    await s3Client.send(command)

    return {
      url: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`,
      key,
    }
  }

  static async deleteFile(key: string): Promise<void> {
    if (STORAGE_PROVIDER === 'local') {
      return LocalStorageService.deleteFile(key)
    }
    
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    await s3Client.send(command)
  }

  static async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    if (STORAGE_PROVIDER === 'local') {
      return `/api/files/${key}`
    }
    
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    return getSignedUrl(s3Client, command, { expiresIn })
  }

  static extractKeyFromUrl(url: string): string {
    if (STORAGE_PROVIDER === 'local') {
      return LocalStorageService.extractKeyFromUrl(url)
    }
    
    const urlObj = new URL(url)
    return urlObj.pathname.substring(1) // Remove leading slash
  }
}

// Alternative: Cloudinary implementation
export class CloudinaryService {
  static async uploadFile(
    file: Buffer,
    fileName: string,
    folder: 'videos' | 'thumbnails' | 'avatars' = 'videos'
  ): Promise<UploadResult> {
    const formData = new FormData()
    formData.append('file', new Blob([file]), fileName)
    formData.append('folder', folder)
    formData.append('upload_preset', 'useless_tube')

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    const result = await response.json()

    return {
      url: result.secure_url,
      key: result.public_id,
    }
  }

  static async deleteFile(publicId: string): Promise<void> {
    const formData = new FormData()
    formData.append('public_id', publicId)

    await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/delete_by_token`,
      {
        method: 'POST',
        body: formData,
      }
    )
  }
} 