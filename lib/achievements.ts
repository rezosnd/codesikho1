import type { Badge } from "./badges"

export interface Achievement extends Badge {
  unlockedAt?: Date
  progress?: {
    current: number
    target: number
    percentage: number
  }
}

export interface UserStats {
  totalXP: number
  currentLevel: number
  nextLevelXP: number
  currentLevelXP: number
  quizzesCompleted: number
  codingChallengesCompleted: number
  perfectScores: number
  currentStreak: number
  longestStreak: number
  averageScore: number
  timeSpentLearning: number // in minutes
}

export function calculateUserStats(userProfile: any, quizResults: any[] = []): UserStats {
  const currentLevelXP = (userProfile.level - 1) * 100
  const nextLevelXP = userProfile.level * 100

  return {
    totalXP: userProfile.xp || 0,
    currentLevel: userProfile.level || 1,
    nextLevelXP,
    currentLevelXP,
    quizzesCompleted: userProfile.completedChallenges?.length || 0,
    codingChallengesCompleted:
      userProfile.completedChallenges?.filter(
        (id: string) => id.includes("two-sum") || id.includes("reverse-string") || id.includes("fibonacci"),
      ).length || 0,
    perfectScores: quizResults.filter((result) => result.score === 100).length,
    currentStreak: calculateCurrentStreak(quizResults),
    longestStreak: calculateLongestStreak(quizResults),
    averageScore: calculateAverageScore(quizResults),
    timeSpentLearning: calculateTimeSpent(quizResults),
  }
}

function calculateCurrentStreak(results: any[]): number {
  if (!results.length) return 0

  const sortedResults = results.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())

  let streak = 0
  for (const result of sortedResults) {
    if (result.score >= 70) {
      // Consider 70%+ as success
      streak++
    } else {
      break
    }
  }

  return streak
}

function calculateLongestStreak(results: any[]): number {
  if (!results.length) return 0

  const sortedResults = results.sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime())

  let maxStreak = 0
  let currentStreak = 0

  for (const result of sortedResults) {
    if (result.score >= 70) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 0
    }
  }

  return maxStreak
}

function calculateAverageScore(results: any[]): number {
  if (!results.length) return 0

  const totalScore = results.reduce((sum, result) => sum + result.score, 0)
  return Math.round(totalScore / results.length)
}

function calculateTimeSpent(results: any[]): number {
  if (!results.length) return 0

  const totalSeconds = results.reduce((sum, result) => sum + (result.timeSpent || 0), 0)
  return Math.round(totalSeconds / 60) // Convert to minutes
}

export function getAchievementProgress(userProfile: any, badge: Badge): Achievement {
  let progress = undefined

  switch (badge.requirement.type) {
    case "xp":
      progress = {
        current: userProfile.xp || 0,
        target: badge.requirement.value,
        percentage: Math.min(100, ((userProfile.xp || 0) / badge.requirement.value) * 100),
      }
      break
    case "quizzes_completed":
      const completed = userProfile.completedChallenges?.length || 0
      progress = {
        current: completed,
        target: badge.requirement.value,
        percentage: Math.min(100, (completed / badge.requirement.value) * 100),
      }
      break
  }

  return {
    ...badge,
    unlockedAt: userProfile.badges?.includes(badge.id) ? new Date() : undefined,
    progress,
  }
}
