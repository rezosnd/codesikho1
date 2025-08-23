import { type NextRequest, NextResponse } from "next/server";
import { getUsersCollection, getQuizResultsCollection, getUserActivityCollection } from "@/lib/mongodb";
import { badges } from "@/lib/badges"; // Make sure this is imported

const getXPForLevel = (level: number): number => {
  return (level - 1) * 1000;
};

export async function POST(request: NextRequest) {
  try {
    const { uid, quizId, score } = await request.json();

    const usersCollection = await getUsersCollection();
    const quizResultsCollection = await getQuizResultsCollection();
    const activityCollection = await getUserActivityCollection();
    
    const user = await usersCollection.findOne({ uid });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // --- Check if quiz was already completed to prevent earning XP again ---
    const isAlreadyCompleted = user.completedChallenges?.includes(quizId);
    if (isAlreadyCompleted) {
      // Still save the result for history, but don't award anything
      await quizResultsCollection.insertOne({ uid, quizId, score, completedAt: new Date() });
      return NextResponse.json({ success: true, replayed: true, xpGained: 0, message: "Quiz already completed. No XP awarded." });
    }
    
    // --- Calculate XP and Level Up ---
    const xpGained = score * 10;
    const newTotalXp = (user.xp || 0) + xpGained;
    const currentLevel = user.level || 1;
    let newLevel = currentLevel;
    while (newTotalXp >= getXPForLevel(newLevel + 1)) {
      newLevel++;
    }

    // --- Check for newly earned badges ---
    const newlyEarnedBadges: string[] = [];
    const updatedCompletedQuizzes = (user.completedChallenges?.filter((id: string) => !id.startsWith("coding-")).length || 0) + 1;

    for (const badge of badges) {
      if (user.badges?.includes(badge.id)) continue;
      
      let eligible = false;
      switch (badge.requirement.type) {
        case "xp":
          if (newTotalXp >= badge.requirement.value) eligible = true;
          break;
        case "level":
          if (newLevel >= badge.requirement.value) eligible = true;
          break;
        case "quizzes_completed":
          if (updatedCompletedQuizzes >= badge.requirement.value) eligible = true;
          break;
        case "perfect_scores":
           if (score === 100) eligible = true;
           break;
      }
      if (eligible) {
        newlyEarnedBadges.push(badge.id);
      }
    }

    // --- Prepare and execute all database updates ---
    await quizResultsCollection.insertOne({ uid, quizId, score, completedAt: new Date() });

    const updateData: any = {
      $inc: { xp: xpGained },
      $addToSet: { completedChallenges: quizId },
    };

    if (newLevel > currentLevel) {
      updateData.$set = { level: newLevel };
      await activityCollection.insertOne({ uid, type: "level_up", details: { newLevel, oldLevel: currentLevel }, timestamp: new Date() });
    }
    
    if (newlyEarnedBadges.length > 0) {
      updateData.$addToSet.badges = { $each: newlyEarnedBadges };
      for (const badgeId of newlyEarnedBadges) {
        const badgeInfo = badges.find(b => b.id === badgeId);
        await activityCollection.insertOne({ uid, type: "badge_earned", details: { badgeName: badgeInfo?.name }, timestamp: new Date() });
      }
    }

    await usersCollection.updateOne({ uid }, updateData);
    await activityCollection.insertOne({ uid, type: "quiz_completed", details: { quizId, score, xpGained }, timestamp: new Date() });

    return NextResponse.json({ success: true, replayed: false, xpGained, newXp: newTotalXp, leveledUp: newLevel > currentLevel, newLevel: newLevel });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 });
  }
}
