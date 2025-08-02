import { type NextRequest, NextResponse } from "next/server"
import { getUserByWallet, createUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json()

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    // Check if user exists in database
    let user = await getUserByWallet(walletAddress)

    if (user) {
      return NextResponse.json({
        user: {
          id: user.id,
          wallet_address: user.walletAddress,
          name: user.name,
          avatar_url: user.avatarUrl,
          created_at: user.createdAt.toISOString(),
          updated_at: user.updatedAt.toISOString(),
        },
        isNewUser: false,
      })
    }

    // Create new user in database
    const newUser = await createUser(walletAddress)

    return NextResponse.json({
      user: {
        id: newUser.id,
        wallet_address: newUser.walletAddress,
        name: newUser.name,
        avatar_url: newUser.avatarUrl,
        created_at: newUser.createdAt.toISOString(),
        updated_at: newUser.updatedAt.toISOString(),
      },
      isNewUser: true,
    })
  } catch (error) {
    console.error("Wallet connection error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
