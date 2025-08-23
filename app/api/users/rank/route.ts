import { type NextRequest, NextResponse } from "next/server"
import { getUsersCollection } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const uid = searchParams.get("uid")

    if (!uid) {
      return NextResponse.json({ error: "UID is required" }, { status: 400 })
    }

    const usersCollection = await getUsersCollection()

    const userDoc = await usersCollection.findOne({ uid })
    if (!userDoc) {
      return NextResponse.json({ rank: -1 })
    }

    const usersWithHigherXP = await usersCollection.countDocuments({
      xp: { $gt: userDoc.xp },
    })

    return NextResponse.json({ rank: usersWithHigherXP + 1 })
  } catch (error) {
    console.error("Error getting user rank:", error)
    return NextResponse.json({ error: "Failed to get user rank" }, { status: 500 })
  }
}
