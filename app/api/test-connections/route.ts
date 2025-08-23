import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    // Test MongoDB connection
    const client = await clientPromise
    const db = client.db("coding_platform")
    await db.admin().ping()

    // Test Firebase environment variables
    const firebaseConfigValid = !!(
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    )

    return NextResponse.json({
      mongodb: "Connected successfully",
      firebase: firebaseConfigValid ? "Environment variables present" : "Missing environment variables",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Connection test failed:", error)
    return NextResponse.json(
      {
        error: "Connection test failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
