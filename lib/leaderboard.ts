export interface LeaderboardEntry {
  uid: string
  displayName: string
  level: number
  xp: number
  badges: string[]
  completedChallenges: string[]
  rank: number
  avatar?: string
}

export interface LeaderboardFilters {
  timeframe: "all-time" | "monthly" | "weekly"
  category: "overall" | "quizzes" | "coding" | "badges"
}

export async function getLeaderboard(
  filters: LeaderboardFilters = { timeframe: "all-time", category: "overall" },
  limitCount = 50,
): Promise<LeaderboardEntry[]> {
  try {
    const response = await fetch(`/api/leaderboard?category=${filters.category}&limit=${limitCount}`)

    if (!response.ok) {
      throw new Error("Failed to fetch leaderboard")
    }

    const users = await response.json()

    const leaderboard: LeaderboardEntry[] = users.map((user: any, index: number) => ({
      uid: user.uid,
      displayName: user.displayName || "Anonymous",
      level: user.level || 1,
      xp: user.xp || 0,
      badges: user.badges || [],
      completedChallenges: user.completedChallenges || [],
      rank: index + 1,
      avatar: user.avatar,
    }))

    return leaderboard
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return []
  }
}

export async function getUserRank(userId: string): Promise<number> {
  try {
    const response = await fetch(`/api/users/rank?uid=${userId}`)

    if (!response.ok) {
      return -1
    }

    const data = await response.json()
    return data.rank || -1
  } catch (error) {
    console.error("Error getting user rank:", error)
    return -1
  }
}
