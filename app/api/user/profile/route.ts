import { type NextRequest, NextResponse } from "next/server"
import { updateUserProfile } from "@/lib/auth"

export async function PUT(request: NextRequest) {
  try {
    const { walletAddress, name, avatarUrl } = await request.json()

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    // Update user profile in database
    const updatedUser = await updateUserProfile(walletAddress, name, avatarUrl)

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        wallet_address: updatedUser.walletAddress,
        name: updatedUser.name,
        avatar_url: updatedUser.avatarUrl,
        created_at: updatedUser.createdAt.toISOString(),
        updated_at: updatedUser.updatedAt.toISOString(),
      }
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
