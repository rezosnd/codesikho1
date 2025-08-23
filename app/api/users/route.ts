import { type NextRequest, NextResponse } from "next/server"
import { getUsersCollection } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const uid = searchParams.get("uid")

    console.log("API: Fetching user profile for UID:", uid)

    if (!uid) {
      console.log("API: Missing UID parameter")
      return NextResponse.json({ error: "UID is required" }, { status: 400 })
    }

    const usersCollection = await getUsersCollection()
    console.log("API: MongoDB collection obtained")

    const userDoc = await usersCollection.findOne({ uid })
    console.log("API: User document found:", !!userDoc)

    return NextResponse.json(userDoc)
  } catch (error) {
    console.error("API: Error fetching user profile:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch user profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userProfile = await request.json()
    console.log("API: Creating user profile for:", userProfile.email)

    if (!userProfile.uid || !userProfile.email) {
      console.log("API: Missing required user profile fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const usersCollection = await getUsersCollection()
    console.log("API: MongoDB collection obtained for user creation")

    await usersCollection.insertOne(userProfile)
    console.log("API: User profile created successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API: Error creating user profile:", error)
    return NextResponse.json(
      {
        error: "Failed to create user profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { uid, updates } = await request.json()
    const usersCollection = await getUsersCollection()

    await usersCollection.updateOne({ uid }, { $set: updates })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 })
  }
}
