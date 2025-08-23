import { type NextRequest, NextResponse } from "next/server";
import { getUserActivityCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json({ error: "User ID (uid) is required" }, { status: 400 });
    }

    const activityCollection = await getUserActivityCollection();

    const recentActivities = await activityCollection
      .find({ uid: uid })
      .sort({ timestamp: -1 })
      .limit(20)
      .toArray();

    return NextResponse.json(recentActivities);

  } catch (error) {
    console.error("Error fetching user activity:", error);
    return NextResponse.json({ error: "Failed to fetch user activity" }, { status: 500 });
  }
}
