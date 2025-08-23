import { type NextRequest, NextResponse } from "next/server"
import { getUsersCollection, getQuizResultsCollection, getUserActivityCollection } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { uid, quizId, score, totalQuestions, answers, timeSpent } = await request.json()

    const usersCollection = await getUsersCollection()
    const quizResultsCollection = await getQuizResultsCollection()
    const activityCollection = await getUserActivityCollection()

    // Save quiz result
    const quizResult = {
      uid,
      quizId,
      score,
      totalQuestions,
      answers,
      timeSpent,
      completedAt: new Date(),
    }
    await quizResultsCollection.insertOne(quizResult)

    // Calculate XP and update user
    const xpGained = score * 10
    const updateResult = await usersCollection.findOneAndUpdate(
      { uid },
      {
        $inc: { xp: xpGained },
        $addToSet: { completedChallenges: quizId },
      },
      { returnDocument: "after" },
    )

    // Log activity
    await activityCollection.insertOne({
      uid,
      type: "quiz_completed",
      details: { quizId, score, xpGained },
      timestamp: new Date(),
    })

    return NextResponse.json({
      success: true,
      xpGained,
      newXp: updateResult?.xp || 0,
    })
  } catch (error) {
    console.error("Error submitting quiz:", error)
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 })
  }
}
