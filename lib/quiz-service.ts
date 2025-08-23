import { badges, checkBadgeEligibility } from "./badges"

export interface QuizResult {
  quizId: string
  score: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: number
  xpEarned: number
  completedAt: Date
}

export async function submitQuizResult(userId: string, result: QuizResult, userProfile: any) {
  try {
    const response = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: userId,
        quizId: result.quizId,
        score: result.score,
        totalQuestions: result.totalQuestions,
        answers: result.correctAnswers,
        timeSpent: result.timeSpent,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to submit quiz result")
    }

    const data = await response.json()

    // Calculate level progression
    const newXP = userProfile.xp + result.xpEarned
    const newLevel = Math.floor(newXP / 100) + 1

    // Check for new badges
    const tempProfile = {
      ...userProfile,
      xp: newXP,
      completedChallenges: [...userProfile.completedChallenges, result.quizId],
    }
    const newBadges = checkBadgeEligibility(tempProfile, badges)

    // Check for perfect score badge
    if (result.correctAnswers === result.totalQuestions) {
      const perfectBadge = badges.find((b) => b.id === "perfectionist")
      if (perfectBadge && !userProfile.badges.includes(perfectBadge.id)) {
        newBadges.push(perfectBadge)
      }
    }

    return { newBadges, newLevel, newXP: data.newXp }
  } catch (error) {
    console.error("Error submitting quiz result:", error)
    throw error
  }
}
