import { prisma } from './prisma'

export interface User {
  id: number
  wallet_address: string
  name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Video {
  id: number
  user_id: number
  title: string
  description?: string
  video_url: string
  thumbnail_url?: string
  duration: number
  views: number
  likes: number
  is_short: boolean
  created_at: string
  updated_at: string
  creator_name?: string
  creator_avatar?: string
}

export const connectWallet = async (walletAddress: string): Promise<{ user: User; isNewUser: boolean }> => {
  const response = await fetch("/api/auth/wallet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress }),
  })

  if (!response.ok) {
    throw new Error("Failed to connect wallet")
  }

  return response.json()
}

export const updateProfile = async (walletAddress: string, name: string, avatarUrl?: string): Promise<User> => {
  const response = await fetch("/api/user/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress, name, avatarUrl }),
  })

  if (!response.ok) {
    throw new Error("Failed to update profile")
  }

  const data = await response.json()
  return data.user
}

export const uploadVideo = async (videoData: {
  userId: number
  title: string
  description?: string
  videoUrl: string
  thumbnailUrl?: string
  duration?: number
  isShort?: boolean
}): Promise<Video> => {
  const response = await fetch("/api/videos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(videoData),
  })

  if (!response.ok) {
    throw new Error("Upload failed")
  }

  const data = await response.json()
  return data.video
}

export const getUserVideos = async (userId: number): Promise<Video[]> => {
  try {
    const response = await fetch(`/api/videos?userId=${userId}`)
    const data = await response.json()
    return data.videos || []
  } catch (error) {
    return []
  }
}

export const getVideos = async (isShort = false): Promise<Video[]> => {
  try {
    const response = await fetch(`/api/videos?isShort=${isShort}`)
    const data = await response.json()
    return data.videos || []
  } catch (error) {
    return []
  }
}

export const deleteVideo = async (videoId: number, userId: number): Promise<void> => {
  const response = await fetch(`/api/videos/${videoId}?userId=${userId}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete video")
  }
}

// Database helper functions
export const getUserByWallet = async (walletAddress: string) => {
  return await prisma.user.findUnique({
    where: { walletAddress },
  })
}

export const createUser = async (walletAddress: string) => {
  try {
    // First try to find existing user
    const existingUser = await prisma.user.findUnique({
      where: { walletAddress },
    })
    
    if (existingUser) {
      return existingUser
    }
    
    // Create new user if doesn't exist
    return await prisma.user.create({
      data: { walletAddress },
    })
  } catch (error: any) {
    // If there's still a unique constraint error, try to get the existing user
    if (error.code === 'P2002') {
      return await prisma.user.findUnique({
        where: { walletAddress },
      })
    }
    throw error
  }
}

export const updateUserProfile = async (walletAddress: string, name: string, avatarUrl?: string) => {
  return await prisma.user.update({
    where: { walletAddress },
    data: { name, avatarUrl },
  })
}

export const getVideosFromDB = async (isShort?: boolean, userId?: number) => {
  const where: any = {}
  
  if (isShort !== undefined) {
    where.isShort = isShort
  }
  
  if (userId) {
    where.userId = userId
  }

  return await prisma.video.findMany({
    where,
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
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export const createVideo = async (videoData: {
  userId: number
  title: string
  description?: string
  videoUrl: string
  thumbnailUrl?: string
  duration?: number
  isShort?: boolean
}) => {
  return await prisma.video.create({
    data: {
      userId: videoData.userId,
      title: videoData.title,
      description: videoData.description,
      videoUrl: videoData.videoUrl,
      thumbnailUrl: videoData.thumbnailUrl,
      duration: videoData.duration || 0,
      isShort: videoData.isShort || false,
    },
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
        },
      },
    },
  })
}

export const deleteVideoFromDB = async (videoId: number, userId: number) => {
  return await prisma.video.deleteMany({
    where: {
      id: videoId,
      userId: userId,
    },
  })
}

export const incrementVideoViews = async (videoId: number) => {
  return await prisma.video.update({
    where: { id: videoId },
    data: {
      views: {
        increment: 1,
      },
    },
  })
}
