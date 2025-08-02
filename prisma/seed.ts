import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create some sample users
  const user1 = await prisma.user.upsert({
    where: { walletAddress: 'DBoZreu2...AEYTBKEA' },
    update: {},
    create: {
      walletAddress: 'DBoZreu2...AEYTBKEA',
      name: 'UselessTube Official',
      avatarUrl: '/placeholder.svg?height=40&width=40&text=UO',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { walletAddress: 'PaintWatcher2024' },
    update: {},
    create: {
      walletAddress: 'PaintWatcher2024',
      name: 'PaintWatcher2024',
      avatarUrl: '/placeholder.svg?height=40&width=40&text=PW',
    },
  })

  const user3 = await prisma.user.upsert({
    where: { walletAddress: 'WallStarer' },
    update: {},
    create: {
      walletAddress: 'WallStarer',
      name: 'WallStarer',
      avatarUrl: '/placeholder.svg?height=40&width=40&text=WS',
    },
  })

  // Create sample videos
  const video1 = await prisma.video.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: user1.id,
      title: 'Official Useless Content Guidelines',
      description: 'The official guide to creating perfectly useless content. Verified by the Useless Team.',
      videoUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Make_a_video_202508011057_nqjtg-CHAwHGXgiWo7vZinMSOPJEGVwSlI76.mp4',
      thumbnailUrl: '/placeholder.svg?height=180&width=320&text=Official+Guidelines',
      duration: 420,
      views: 8500000,
      isShort: false,
    },
  })

  const video2 = await prisma.video.upsert({
    where: { id: 2 },
    update: {},
    create: {
      userId: user2.id,
      title: 'Watching Paint Dry for 10 Minutes Straight',
      description: 'The most riveting paint drying experience you\'ll ever witness.',
      videoUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Make_a_video_202508011057_nqjtg-CHAwHGXgiWo7vZinMSOPJEGVwSlI76.mp4',
      thumbnailUrl: '/placeholder.svg?height=180&width=320&text=Paint+Drying',
      duration: 600,
      views: 1200000,
      isShort: false,
    },
  })

  const video3 = await prisma.video.upsert({
    where: { id: 3 },
    update: {},
    create: {
      userId: user3.id,
      title: 'Staring at a Blank Wall for 5 Minutes',
      description: 'Just me, staring at a completely blank white wall.',
      videoUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Make_a_video_202508011057_nqjtg-CHAwHGXgiWo7vZinMSOPJEGVwSlI76.mp4',
      thumbnailUrl: '/placeholder.svg?height=180&width=320&text=Blank+Wall',
      duration: 300,
      views: 856000,
      isShort: false,
    },
  })

  // Create some sample comments
  await prisma.comment.upsert({
    where: { id: 1 },
    update: {},
    create: {
      videoId: video1.id,
      userId: user2.id,
      content: 'This is exactly what I needed! Thank you for the useless guidelines.',
    },
  })

  await prisma.comment.upsert({
    where: { id: 2 },
    update: {},
    create: {
      videoId: video2.id,
      userId: user3.id,
      content: 'I can\'t believe I watched the whole thing. This is peak uselessness.',
    },
  })

  // Create some sample likes
  await prisma.videoLike.upsert({
    where: { id: 1 },
    update: {},
    create: {
      videoId: video1.id,
      userId: user2.id,
      isLike: true,
    },
  })

  await prisma.videoLike.upsert({
    where: { id: 2 },
    update: {},
    create: {
      videoId: video1.id,
      userId: user3.id,
      isLike: true,
    },
  })

  await prisma.videoLike.upsert({
    where: { id: 3 },
    update: {},
    create: {
      videoId: video2.id,
      userId: user1.id,
      isLike: true,
    },
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 