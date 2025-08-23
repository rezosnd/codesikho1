// in app/api/quiz/submit/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { getUsersCollection, getQuizResultsCollection, getUserActivityCollection } from "@/lib/mongodb";

// Helper function to define your leveling curve.
// Example: Level 2 requires 1000 XP, Level 3 requires 2000 XP, etc.
const getXPForLevel = (level: number): number => {
  return (level - 1) * 1000;
};

export async function POST(request: NextRequest) {
  try {
    const { uid, quizId, score, totalQuestions, answers, timeSpent } = await request.json();

    const usersCollection = await getUsersCollection();
    const quizResultsCollection = await getQuizResultsCollection();
    const activityCollection = await getUserActivityCollection();

    // 1. Fetch the current user data first
    const user = await usersCollection.findOne({ uid });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentXp = user.xp || 0;
    const currentLevel = user.level || 1;

    // 2. Calculate new XP and total XP
    const xpGained = score * 10;
    const newTotalXp = currentXp + xpGained;

    //
    // --- 3. THIS IS THE MISSING LEVEL-UP LOGIC ---
    //
    let newLevel = currentLevel;
    // Use a 'while' loop in case they earn enough XP to level up multiple times
    while (newTotalXp >= getXPForLevel(newLevel + 1)) {
      newLevel++; // Level up!
    }
    // --- END OF LEVEL-UP LOGIC ---
    

    // Save quiz result
    await quizResultsCollection.insertOne({
      uid,
      quizId,
      score,
      totalQuestions,
      answers,
      timeSpent,
      completedAt: new Date(),
    });

    // 4. Prepare the database update object
    const updateData: { $inc: { xp: number }; $addToSet: { completedChallenges: string }; $set?: { level: number } } = {
      $inc: { xp: xpGained },
      $addToSet: { completedChallenges: quizId },
    };

    // Only set the new level if it has actually changed
    if (newLevel > currentLevel) {
      updateData.$set = { level: newLevel };
    }

    // 5. Update the user in the database
    await usersCollection.updateOne({ uid }, updateData);

    // Log activity
    await activityCollection.insertOne({
      uid,
      type: "quiz_completed",
      details: { quizId, score, xpGained },
      timestamp: new Date(),
    });

    return NextResponse.json({
      success: true,
      xpGained,
      newXp: newTotalXp,
      leveledUp: newLevel > currentLevel,
      newLevel: newLevel,
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 });
  }
}
