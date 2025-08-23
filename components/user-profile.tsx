"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, Trophy, Target, Clock, TrendingUp, Star, Code, ArrowLeft, Edit3, Save, X } from "lucide-react"
import { calculateUserStats, type UserStats } from "@/lib/achievements"
import { badges } from "@/lib/badges"

interface UserProfileProps {
  onBack: () => void
}

export function UserProfile({ onBack }: UserProfileProps) {
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [loading, setLoading] = useState(false)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const { user, userProfile, refreshUserProfile } = useAuth()

  useEffect(() => {
    if (userProfile) {
      const stats = calculateUserStats(userProfile)
      setUserStats(stats)
      setEditedName(userProfile.displayName)
      loadRecentActivity()
    }
  }, [userProfile])

  const loadRecentActivity = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/activity?uid=${user.uid}`)
      if (response.ok) {
        const activities = await response.json()
        setRecentActivity(activities)
      } else {
        // Fallback to mock data if API fails
        setRecentActivity([
          {
            type: "quiz_completed",
            title: "Programming Fundamentals",
            score: 85,
            xp: 42,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          },
          {
            type: "badge_earned",
            title: "Knowledge Seeker",
            description: "Earned 100 XP",
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          },
        ])
      }
    } catch (error) {
      console.error("Error loading activity:", error)
      // Fallback to mock data
      setRecentActivity([
        {
          type: "quiz_completed",
          title: "Programming Fundamentals",
          score: 85,
          xp: 42,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          type: "badge_earned",
          title: "Knowledge Seeker",
          description: "Earned 100 XP",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        },
      ])
    }
  }

  const handleSaveProfile = async () => {
    if (!user || !editedName.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          updates: { displayName: editedName.trim() },
        }),
      })

      if (response.ok) {
        setIsEditing(false)
        await refreshUserProfile()
      }
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "quiz_completed":
        return <Target className="text-cyan-400" size={16} />
      case "badge_earned":
        return <Trophy className="text-yellow-400" size={16} />
      case "coding_challenge":
        return <Code className="text-purple-400" size={16} />
      case "level_up":
        return <Star className="text-green-400" size={16} />
      default:
        return <User className="text-gray-400" size={16} />
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  if (!userProfile || !userStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-gray-400">Loading profile...</div>
          </div>
        </div>
      </div>
    )
  }

  const nextLevelProgress =
    ((userProfile.xp - userStats.currentLevelXP) / (userStats.nextLevelXP - userStats.currentLevelXP)) * 100
  const earnedBadges = badges.filter((badge) => userProfile.badges.includes(badge.id))

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
              Profile
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User size={20} />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center">
                  <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.displayName}`} />
                    <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-2xl">
                      {userProfile.displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {isEditing ? (
                    <div className="flex items-center gap-2 w-full">
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="bg-slate-800 border-slate-600 text-white"
                        placeholder="Display Name"
                      />
                      <Button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save size={16} />
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditing(false)
                          setEditedName(userProfile.displayName)
                        }}
                        size="sm"
                        variant="outline"
                        className="border-slate-600"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white">{userProfile.displayName}</h2>
                      <Button
                        onClick={() => setIsEditing(true)}
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-white"
                      >
                        <Edit3 size={16} />
                      </Button>
                    </div>
                  )}

                  <p className="text-gray-400 text-sm">{user?.email}</p>
                </div>

                {/* ... existing code for profile stats ... */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Level</span>
                    <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500">Level {userProfile.level}</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progress to Level {userProfile.level + 1}</span>
                      <span className="text-cyan-400">
                        {userProfile.xp - userStats.currentLevelXP}/{userStats.nextLevelXP - userStats.currentLevelXP}{" "}
                        XP
                      </span>
                    </div>
                    <Progress value={nextLevelProgress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400">{userStats.totalXP}</div>
                      <div className="text-gray-400 text-sm">Total XP</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{userStats.currentStreak}</div>
                      <div className="text-gray-400 text-sm">Current Streak</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ... existing code for quick stats and other components ... */}
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp size={20} />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Quizzes Completed</span>
                    <span className="text-cyan-400 font-semibold">{userStats.quizzesCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Coding Challenges</span>
                    <span className="text-purple-400 font-semibold">{userStats.codingChallengesCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Perfect Scores</span>
                    <span className="text-yellow-400 font-semibold">{userStats.perfectScores}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Average Score</span>
                    <span className="text-green-400 font-semibold">{userStats.averageScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Time Learning</span>
                    <span className="text-orange-400 font-semibold">{userStats.timeSpentLearning}m</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ... existing code for main content tabs ... */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-slate-800">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="badges">Badges</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white">Learning Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-white font-semibold">Skill Areas</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">JavaScript</span>
                              <span className="text-cyan-400">75%</span>
                            </div>
                            <Progress value={75} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">Python</span>
                              <span className="text-purple-400">60%</span>
                            </div>
                            <Progress value={60} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">Algorithms</span>
                              <span className="text-yellow-400">45%</span>
                            </div>
                            <Progress value={45} className="h-2" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-white font-semibold">Weekly Goal</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">XP This Week</span>
                              <span className="text-green-400">180/250</span>
                            </div>
                            <Progress value={72} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">Challenges This Week</span>
                              <span className="text-blue-400">3/5</span>
                            </div>
                            <Progress value={60} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Trophy size={20} />
                      Recent Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {earnedBadges.slice(0, 4).map((badge) => (
                        <div
                          key={badge.id}
                          className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50"
                        >
                          <div className="text-2xl">{badge.icon}</div>
                          <div>
                            <div className="text-white font-semibold">{badge.name}</div>
                            <div className="text-gray-400 text-sm">{badge.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="badges" className="space-y-6">
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white">Earned Badges ({earnedBadges.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {earnedBadges.map((badge) => (
                        <div
                          key={badge.id}
                          className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-lg border border-slate-600/50"
                        >
                          <div className="text-3xl">{badge.icon}</div>
                          <div className="flex-1">
                            <div className="text-white font-semibold">{badge.name}</div>
                            <div className="text-gray-400 text-sm">{badge.description}</div>
                            <Badge
                              className={`mt-1 ${
                                badge.rarity === "legendary"
                                  ? "bg-yellow-500"
                                  : badge.rarity === "epic"
                                    ? "bg-purple-500"
                                    : badge.rarity === "rare"
                                      ? "bg-blue-500"
                                      : "bg-gray-500"
                              }`}
                            >
                              {badge.rarity}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Clock size={20} />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50"
                        >
                          <div className="flex-shrink-0">{getActivityIcon(activity.type)}</div>
                          <div className="flex-1">
                            {activity.type === "quiz_completed" && (
                              <>
                                <div className="text-white font-semibold">
                                  Completed Quiz: {activity.title || activity.quizId}
                                </div>
                                <div className="text-gray-400 text-sm">
                                  Score: {activity.score}% • +{activity.xpEarned || activity.xp} XP
                                </div>
                              </>
                            )}
                            {activity.type === "badge_earned" && (
                              <>
                                <div className="text-white font-semibold">
                                  Earned Badge: {activity.badgeName || activity.title}
                                </div>
                                <div className="text-gray-400 text-sm">
                                  {activity.description || "New achievement unlocked!"}
                                </div>
                              </>
                            )}
                            {activity.type === "coding_challenge" && (
                              <>
                                <div className="text-white font-semibold">Solved: {activity.title}</div>
                                <div className="text-gray-400 text-sm">
                                  Difficulty: {activity.difficulty} • +{activity.xp} XP
                                </div>
                              </>
                            )}
                            {activity.type === "level_up" && (
                              <>
                                <div className="text-white font-semibold">Level Up!</div>
                                <div className="text-gray-400 text-sm">Reached Level {activity.newLevel}</div>
                              </>
                            )}
                          </div>
                          <div className="text-gray-500 text-sm">{formatTimeAgo(new Date(activity.timestamp))}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Settings size={20} />
                      Account Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="text-white font-semibold mb-4">Preferences</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-white">Email Notifications</div>
                            <div className="text-gray-400 text-sm">Receive updates about your progress</div>
                          </div>
                          <Button variant="outline" size="sm" className="border-slate-600 bg-transparent">
                            Enable
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-white">Weekly Goals</div>
                            <div className="text-gray-400 text-sm">Set weekly learning targets</div>
                          </div>
                          <Button variant="outline" size="sm" className="border-slate-600 bg-transparent">
                            Configure
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-white">Privacy Settings</div>
                            <div className="text-gray-400 text-sm">Control your profile visibility</div>
                          </div>
                          <Button variant="outline" size="sm" className="border-slate-600 bg-transparent">
                            Manage
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
