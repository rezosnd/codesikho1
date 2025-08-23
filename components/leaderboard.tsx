"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Crown, Star, TrendingUp, Users, ArrowLeft } from "lucide-react"
import { getLeaderboard, getUserRank, type LeaderboardEntry, type LeaderboardFilters } from "@/lib/leaderboard"

interface LeaderboardProps {
  onBack: () => void
}

export function Leaderboard({ onBack }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<number>(-1)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<LeaderboardFilters>({
    timeframe: "all-time",
    category: "overall",
  })
  const { user, userProfile } = useAuth()

  useEffect(() => {
    loadLeaderboard()
  }, [filters])

  const loadLeaderboard = async () => {
    setLoading(true)
    try {
      const data = await getLeaderboard(filters, 50)
      setLeaderboard(data)

      if (user) {
        const rank = await getUserRank(user.uid)
        setUserRank(rank)
      }
    } catch (error) {
      console.error("Error loading leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-400" size={24} />
      case 2:
        return <Medal className="text-gray-400" size={24} />
      case 3:
        return <Medal className="text-amber-600" size={24} />
      default:
        return <span className="text-gray-400 font-bold text-lg">#{rank}</span>
    }
  }

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-400/50"
      case 2:
        return "bg-gradient-to-r from-gray-500/20 to-slate-500/20 border-gray-400/50"
      case 3:
        return "bg-gradient-to-r from-amber-600/20 to-orange-500/20 border-amber-600/50"
      default:
        return "bg-slate-800/50 border-slate-700/50"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="border-slate-600 text-gray-400 bg-transparent"
            >
              <ArrowLeft size={16} />
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Leaderboard
            </h1>
          </div>
          <div className="flex items-center gap-2 text-cyan-400">
            <TrendingUp size={20} />
            <span>Your Rank: #{userRank > 0 ? userRank : "Unranked"}</span>
          </div>
        </div>

        {/* User's Current Position */}
        {userProfile && userRank > 0 && (
          <Card className="mb-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-400/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getRankIcon(userRank)}
                    <span className="text-white font-semibold">{userProfile.displayName}</span>
                  </div>
                  <Badge variant="outline" className="border-cyan-400 text-cyan-400">
                    Level {userProfile.level}
                  </Badge>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-cyan-400 font-bold">{userProfile.xp}</div>
                    <div className="text-gray-400">XP</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-400 font-bold">{userProfile.badges.length}</div>
                    <div className="text-gray-400">Badges</div>
                  </div>
                  <div className="text-center">
                    <div className="text-yellow-400 font-bold">{userProfile.completedChallenges.length}</div>
                    <div className="text-gray-400">Completed</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="mb-6">
          <Tabs value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value as any })}>
            <TabsList className="bg-slate-800">
              <TabsTrigger value="overall" className="text-cyan-400">
                <Trophy className="mr-2" size={16} />
                Overall
              </TabsTrigger>
              <TabsTrigger value="quizzes" className="text-purple-400">
                <Star className="mr-2" size={16} />
                Quizzes
              </TabsTrigger>
              <TabsTrigger value="coding" className="text-green-400">
                <Users className="mr-2" size={16} />
                Coding
              </TabsTrigger>
              <TabsTrigger value="badges" className="text-yellow-400">
                <Medal className="mr-2" size={16} />
                Badges
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Leaderboard */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="text-yellow-400" size={24} />
              Top Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-400">Loading leaderboard...</div>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.uid}
                    className={`p-4 rounded-lg border transition-all duration-300 hover:scale-105 ${getRankBg(entry.rank)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          {getRankIcon(entry.rank)}
                          <div>
                            <div className="text-white font-semibold">{entry.displayName}</div>
                            <div className="text-gray-400 text-sm">Level {entry.level}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {entry.badges.slice(0, 3).map((badgeId, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-xs"
                            >
                              ⭐
                            </div>
                          ))}
                          {entry.badges.length > 3 && (
                            <div className="text-gray-400 text-sm">+{entry.badges.length - 3}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="text-cyan-400 font-bold">{entry.xp.toLocaleString()}</div>
                          <div className="text-gray-400">XP</div>
                        </div>
                        <div className="text-center">
                          <div className="text-purple-400 font-bold">{entry.badges.length}</div>
                          <div className="text-gray-400">Badges</div>
                        </div>
                        <div className="text-center">
                          <div className="text-yellow-400 font-bold">{entry.completedChallenges.length}</div>
                          <div className="text-gray-400">Completed</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
