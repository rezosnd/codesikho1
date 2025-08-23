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

const getXPForLevel = (level: number): number => {
  return (level - 1) * 1000
}

export function calculateUserStats(userProfile: any, quizResults: any[] = []): UserStats {
  const currentLevelXP = getXPForLevel(userProfile.level || 1)
  const nextLevelXP = getXPForLevel((userProfile.level || 1) + 1)
  
  const completedQuizzes = userProfile.completedChallenges?.filter((id: string) => !id.startsWith("coding-")).length || 0
  const completedCodingChallenges = userProfile.completedChallenges?.filter((id: string) => id.startsWith("coding-")).length || 0

  return {
    totalXP: userProfile.xp || 0,
    currentLevel: userProfile.level || 1,
    nextLevelXP,
    currentLevelXP,
    quizzesCompleted: completedQuizzes,
    codingChallengesCompleted: completedCodingChallenges,
    perfectScores: quizResults.filter((result) => result.score === 100).length,
    currentStreak: 0, // This would require more complex logic tracking daily activity
    longestStreak: 0,
    averageScore: 0,
    timeSpentLearning: 0,
  }
}

export function getAchievementProgress(userProfile: any, badge: Badge): Achievement {
  let progress = undefined;

  const quizzesCompleted = userProfile.completedChallenges?.filter((id: string) => !id.startsWith("coding-")).length || 0;
  const codingChallengesCompleted = userProfile.completedChallenges?.filter((id: string) => id.startsWith("coding-")).length || 0;

  switch (badge.requirement.type) {
    case "xp":
      progress = {
        current: userProfile.xp || 0,
        target: badge.requirement.value,
        percentage: Math.min(100, ((userProfile.xp || 0) / badge.requirement.value) * 100),
      };
      break;
    
    case "quizzes_completed":
      progress = {
        current: quizzesCompleted,
        target: badge.requirement.value,
        percentage: Math.min(100, (quizzesCompleted / badge.requirement.value) * 100),
      };
      break;

    case "coding_challenges_completed":
      progress = {
        current: codingChallengesCompleted,
        target: badge.requirement.value,
        percentage: Math.min(100, (codingChallengesCompleted / badge.requirement.value) * 100),
      };
      break;

    case "level":
      progress = {
        current: userProfile.level || 1,
        target: badge.requirement.value,
        percentage: Math.min(100, ((userProfile.level || 1) / badge.requirement.value) * 100),
      };
      break;
  }

  return {
    ...badge,
    unlockedAt: userProfile.badges?.includes(badge.id) ? new Date() : undefined,
    progress,
  };
}
