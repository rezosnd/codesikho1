"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Star, Target, Zap, Crown, ArrowLeft } from "lucide-react"
import { badges } from "@/lib/badges"
import { getAchievementProgress, calculateUserStats, type Achievement, type UserStats } from "@/lib/achievements"

interface AchievementsProps {
  onBack: () => void
}

export function Achievements({ onBack }: AchievementsProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const { userProfile } = useAuth()

  useEffect(() => {
    if (userProfile) {
      // Calculate achievements with progress
      const achievementsWithProgress = badges.map((badge) => getAchievementProgress(userProfile, badge))
      setAchievements(achievementsWithProgress)

      // Calculate user stats
      const stats = calculateUserStats(userProfile)
      setUserStats(stats)
    }
  }, [userProfile])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-400 bg-gray-400/10 text-gray-400"
      case "rare":
        return "border-blue-400 bg-blue-400/10 text-blue-400"
      case "epic":
        return "border-purple-400 bg-purple-400/10 text-purple-400"
      case "legendary":
        return "border-yellow-400 bg-yellow-400/10 text-yellow-400"
      default:
        return "border-gray-400 bg-gray-400/10 text-gray-400"
    }
  }

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "common":
        return <Star className="text-gray-400" size={20} />
      case "rare":
        return <Target className="text-blue-400" size={20} />
      case "epic":
        return <Zap className="text-purple-400" size={20} />
      case "legendary":
        return <Crown className="text-yellow-400" size={20} />
      default:
        return <Star className="text-gray-400" size={20} />
    }
  }

  const filteredAchievements = achievements.filter((achievement) => {
    switch (activeTab) {
      case "unlocked":
        return achievement.unlockedAt
      case "locked":
        return !achievement.unlockedAt
      case "common":
      case "rare":
      case "epic":
      case "legendary":
        return achievement.rarity === activeTab
      default:
        return true
    }
  })

  const unlockedCount = achievements.filter((a) => a.unlockedAt).length

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
              Achievements
            </h1>
          </div>
          <div className="flex items-center gap-2 text-cyan-400">
            <Trophy size={20} />
            <span>
              {unlockedCount}/{achievements.length} Unlocked
            </span>
          </div>
        </div>

        {/* User Stats Overview */}
        {userStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-400/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400">{userStats.totalXP.toLocaleString()}</div>
                <div className="text-gray-400 text-sm">Total XP</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-400/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{userStats.currentLevel}</div>
                <div className="text-gray-400 text-sm">Current Level</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-yellow-400/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{userStats.quizzesCompleted}</div>
                <div className="text-gray-400 text-sm">Quizzes Done</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-400/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{userStats.currentStreak}</div>
                <div className="text-gray-400 text-sm">Current Streak</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Achievement Filters */}
        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-slate-800">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unlocked" className="text-green-400">
                Unlocked
              </TabsTrigger>
              <TabsTrigger value="locked" className="text-gray-400">
                Locked
              </TabsTrigger>
              <TabsTrigger value="common" className="text-gray-400">
                Common
              </TabsTrigger>
              <TabsTrigger value="rare" className="text-blue-400">
                Rare
              </TabsTrigger>
              <TabsTrigger value="epic" className="text-purple-400">
                Epic
              </TabsTrigger>
              <TabsTrigger value="legendary" className="text-yellow-400">
                Legendary
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={`transition-all duration-300 hover:scale-105 ${
                achievement.unlockedAt
                  ? `bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-2 ${getRarityColor(achievement.rarity)}`
                  : "bg-slate-800/30 border-slate-700/50 opacity-60"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getRarityIcon(achievement.rarity)}
                    <div>
                      <CardTitle className="text-white text-lg">{achievement.name}</CardTitle>
                      <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                        {achievement.rarity}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-4xl">{achievement.icon}</div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">{achievement.description}</p>

                {achievement.progress && !achievement.unlockedAt && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-cyan-400">
                        {achievement.progress.current}/{achievement.progress.target}
                      </span>
                    </div>
                    <Progress value={achievement.progress.percentage} className="h-2" />
                  </div>
                )}

                {achievement.unlockedAt && (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <Trophy size={16} />
                    <span>Unlocked!</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No achievements found for this filter.</div>
          </div>
        )}
      </div>
    </div>
  )
}
