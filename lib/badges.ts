export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  requirement: {
    type: "xp" | "quizzes_completed" | "perfect_score" | "streak"
    value: number
  }
  rarity: "common" | "rare" | "epic" | "legendary"
}

export const badges: Badge[] = [
  {
    id: "first-steps",
    name: "First Steps",
    description: "Complete your first quiz",
    icon: "🎯",
    requirement: { type: "quizzes_completed", value: 1 },
    rarity: "common",
  },
  {
    id: "knowledge-seeker",
    name: "Knowledge Seeker",
    description: "Earn 100 XP",
    icon: "📚",
    requirement: { type: "xp", value: 100 },
    rarity: "common",
  },
  {
    id: "quiz-master",
    name: "Quiz Master",
    description: "Complete 10 quizzes",
    icon: "🏆",
    requirement: { type: "quizzes_completed", value: 10 },
    rarity: "rare",
  },
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "Get a perfect score on any quiz",
    icon: "⭐",
    requirement: { type: "perfect_score", value: 1 },
    rarity: "epic",
  },
  {
    id: "coding-legend",
    name: "Coding Legend",
    description: "Earn 1000 XP",
    icon: "👑",
    requirement: { type: "xp", value: 1000 },
    rarity: "legendary",
  },
]

export function checkBadgeEligibility(userProfile: any, badges: Badge[]): Badge[] {
  const earnedBadges: Badge[] = []

  badges.forEach((badge) => {
    if (userProfile.badges.includes(badge.id)) return

    let eligible = false

    switch (badge.requirement.type) {
      case "xp":
        eligible = userProfile.xp >= badge.requirement.value
        break
      case "quizzes_completed":
        eligible = userProfile.completedChallenges.length >= badge.requirement.value
        break
      case "perfect_score":
        // This would be checked when completing a quiz with perfect score
        eligible = false
        break
    }

    if (eligible) {
      earnedBadges.push(badge)
    }
  })

  return earnedBadges
}
