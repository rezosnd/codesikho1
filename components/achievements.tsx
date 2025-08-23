"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Award, Crown, CheckCircle, Lock, ArrowLeft } from "lucide-react"
import { badges } from "@/lib/badges"
import { getAchievementProgress, calculateUserStats, type Achievement, type UserStats } from "@/lib/achievements"
import { cn } from "@/lib/utils"

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
      const achievementsWithProgress = badges.map((badge) => getAchievementProgress(userProfile, badge))
      setAchievements(achievementsWithProgress)
      const stats = calculateUserStats(userProfile)
      setUserStats(stats)
    }
  }, [userProfile])

  const filteredAchievements = achievements.filter((achievement) => {
    switch (activeTab) {
      case "unlocked": return !!achievement.unlockedAt
      case "locked": return !achievement.unlockedAt
      case "common": case "rare": case "epic": case "legendary": return achievement.rarity === activeTab
      default: return true
    }
  }).sort((a, b) => (a.unlockedAt ? 0 : 1) - (b.unlockedAt ? 0 : 1)); // Show unlocked first

  const unlockedCount = achievements.filter((a) => a.unlockedAt).length

  return (
    <div className="min-h-screen cyber-bg-gradient cyber-grid p-6 animate-in fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Award className="h-10 w-10 cyber-text-primary cyber-glow" />
            <div><h1 className="text-4xl font-bold font-jura cyber-text-primary">Trophy Room</h1><p className="cyber-text">Your Unlocked Achievements</p></div>
          </div>
          <Button onClick={onBack} variant="outline" className="cyber-button-outline"><ArrowLeft className="mr-2" size={16} /> Back to Hub</Button>
        </div>

        {/* User Stats Overview */}
        {userStats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="cyber-card text-center"><CardContent className="p-4"><div className="text-3xl font-mono font-bold cyber-text-primary">{userStats.totalXP.toLocaleString()}</div><div className="text-sm cyber-text">Total XP</div></CardContent></Card>
            <Card className="cyber-card text-center"><CardContent className="p-4"><div className="text-3xl font-mono font-bold cyber-text-secondary">{userStats.currentLevel}</div><div className="text-sm cyber-text">Current Level</div></CardContent></Card>
            <Card className="cyber-card text-center"><CardContent className="p-4"><div className="text-3xl font-mono font-bold cyber-text-accent">{unlockedCount}</div><div className="text-sm cyber-text">Achievements</div></CardContent></Card>
            <Card className="cyber-card text-center"><CardContent className="p-4"><div className="text-3xl font-mono font-bold cyber-text-warning">{userStats.currentStreak}</div><div className="text-sm cyber-text">Current Streak</div></CardContent></Card>
          </div>
        )}

        {/* Achievement Filters */}
        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="cyber-tabs-list">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
              <TabsTrigger value="locked">Locked</TabsTrigger>
              <TabsTrigger value="rare">Rare</TabsTrigger>
              <TabsTrigger value="epic">Epic</TabsTrigger>
              <TabsTrigger value="legendary">Legendary</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAchievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={cn("achievement-card",
                achievement.unlockedAt ? "unlocked cyber-holo" : "locked",
                `rarity-${achievement.rarity}`
              )}
            >
              <div className="card-glow"></div>
              <CardContent className="p-5 flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-start">
                    <div className={cn("text-5xl mb-4", achievement.unlockedAt ? `rarity-text-${achievement.rarity}` : 'text-cyber-border')}>
                      {achievement.icon}
                    </div>
                    {achievement.unlockedAt ?
                      <CheckCircle className="h-6 w-6 text-cyber-accent flex-shrink-0" /> :
                      <Lock className="h-6 w-6 text-cyber-border flex-shrink-0" />
                    }
                  </div>
                  <CardTitle className="text-lg font-jura cyber-text-bright">{achievement.name}</CardTitle>
                  <p className="text-sm cyber-text mt-1 h-12 line-clamp-2">{achievement.description}</p>
                </div>
                <div className="mt-4">
                  {achievement.progress && !achievement.unlockedAt ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="cyber-text">PROGRESS</span>
                        <span className="cyber-text-primary">{achievement.progress.current}/{achievement.progress.target}</span>
                      </div>
                      <Progress value={achievement.progress.percentage} className="cyber-progress h-2" />
                    </div>
                  ) : achievement.unlockedAt ? (
                     <p className="text-xs font-mono cyber-text-accent">Unlocked!</p>
                  ) : (
                     <p className="text-xs font-mono cyber-text">Locked</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-16"><p className="cyber-text text-lg">No achievements match this filter.</p></div>
        )}
      </div>
    </div>
  )
}
