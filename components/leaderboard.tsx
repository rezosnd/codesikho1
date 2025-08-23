"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Crown, Star, Users, ArrowLeft, BarChart, Calendar, Award } from "lucide-react"
import { getLeaderboard, getUserRank, type LeaderboardEntry, type LeaderboardFilters } from "@/lib/leaderboard"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface LeaderboardProps {
  onBack: () => void
}

export function Leaderboard({ onBack }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<LeaderboardFilters>({
    timeframe: "all-time",
    category: "overall",
  })
  const { user, userProfile } = useAuth()

  useEffect(() => {
    loadLeaderboard()
  }, [filters, user])

  const loadLeaderboard = async () => {
    setLoading(true)
    try {
      const data = await getLeaderboard(filters, 50)
      setLeaderboard(data)
      if (user) {
        // This function now returns the full LeaderboardEntry object or null
        const rankData = await getUserRank(user.uid, filters)
        setUserRank(rankData)
      }
    } catch (error) {
      console.error("Error loading leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }
  
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-7 w-7 text-yellow-400" />
    if (rank === 2) return <Medal className="h-7 w-7 text-gray-300" />
    if (rank === 3) return <Award className="h-7 w-7 text-amber-500" />
    return <span className="font-mono text-xl cyber-text-bright">{rank}</span>
  }

  return (
    <div className="min-h-screen cyber-bg-gradient cyber-grid p-6 animate-in fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Trophy className="h-10 w-10 cyber-text-primary cyber-glow" />
            <div>
              <h1 className="text-4xl font-bold font-jura cyber-text-primary">Global Ranking Network</h1>
              <p className="cyber-text">Top Operatives</p>
            </div>
          </div>
          <Button onClick={onBack} variant="outline" className="cyber-button-outline"><ArrowLeft className="mr-2" size={16} /> Back to Hub</Button>
        </div>

        {/* User's Current Position */}
        {userProfile && userRank && (
          <Card className="mb-8 cyber-card border-2 border-cyber-primary shadow-lg shadow-cyber-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="leaderboard-rank-badge self-start">{getRankIcon(userRank.rank)}</div>
                  <Avatar className="h-12 w-12 border-2 border-cyber-primary"><AvatarImage src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${userProfile.displayName}`} /><AvatarFallback>{userProfile.displayName.charAt(0)}</AvatarFallback></Avatar>
                  <div><p className="font-bold text-lg cyber-text-bright">{userProfile.displayName} (You)</p><p className="text-sm cyber-text">Level {userProfile.level}</p></div>
                </div>
                <div className="hidden md:flex items-center gap-6 text-sm">
                  <div className="text-center"><div className="font-mono text-lg font-bold text-cyan-400">{userRank.xp.toLocaleString()}</div><div className="text-xs cyber-text">XP</div></div>
                  <div className="text-center"><div className="font-mono text-lg font-bold text-purple-400">{userRank.badges.length}</div><div className="text-xs cyber-text">Badges</div></div>
                  <div className="text-center"><div className="font-mono text-lg font-bold text-yellow-400">{userRank.completedChallenges.length}</div><div className="text-xs cyber-text">Challenges</div></div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4 justify-between items-center">
          <Tabs value={filters.category} onValueChange={(v) => setFilters({ ...filters, category: v as any })}>
            <TabsList className="cyber-tabs-list"><TabsTrigger value="overall"><BarChart size={16} className="mr-2"/>Overall</TabsTrigger><TabsTrigger value="quizzes"><Star size={16} className="mr-2"/>Quizzes</TabsTrigger><TabsTrigger value="coding"><Users size={16} className="mr-2"/>Coding</TabsTrigger></TabsList>
          </Tabs>
          <Tabs value={filters.timeframe} onValueChange={(v) => setFilters({ ...filters, timeframe: v as any })}>
            <TabsList className="cyber-tabs-list"><TabsTrigger value="all-time"><Calendar size={16} className="mr-2"/>All Time</TabsTrigger><TabsTrigger value="weekly"><Calendar size={16} className="mr-2"/>Weekly</TabsTrigger></TabsList>
          </Tabs>
        </div>

        {/* Leaderboard */}
        <Card className="cyber-card">
          <CardContent className="p-4">
            {loading ? (
              <div className="text-center py-16 cyber-text">Loading Rankings...</div>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <div key={entry.uid} className={cn("leaderboard-entry", entry.rank === 1 && "rank-1", entry.rank === 2 && "rank-2", entry.rank === 3 && "rank-3")} style={{ "--delay": `${index * 30}ms` } as React.CSSProperties}>
                    <div className="flex items-center gap-4">
                      <div className="leaderboard-rank-badge">{getRankIcon(entry.rank)}</div>
                      <Avatar className="h-10 w-10 border-2 border-cyber-border"><AvatarImage src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${entry.displayName}`} /><AvatarFallback>{entry.displayName.charAt(0)}</AvatarFallback></Avatar>
                      <div><p className="font-semibold cyber-text-bright">{entry.displayName}</p><p className="text-xs cyber-text">Level {entry.level}</p></div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center"><div className="font-mono font-bold text-cyan-400">{entry.xp.toLocaleString()}</div><div className="text-xs cyber-text">XP</div></div>
                      <div className="text-center hidden sm:block"><div className="font-mono font-bold text-purple-400">{entry.badges.length}</div><div className="text-xs cyber-text">Badges</div></div>
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
