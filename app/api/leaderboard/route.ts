import { type NextRequest, NextResponse } from "next/server"
import { getUsersCollection } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || "xp"
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const usersCollection = await getUsersCollection()

    let sortField = "xp"
    if (category === "badges") sortField = "badges"
    if (category === "challenges") sortField = "completedChallenges"

    const leaderboard = await usersCollection
      .find({})
      .sort({ [sortField]: -1 })
      .limit(limit)
      .toArray()

    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
  }
}
