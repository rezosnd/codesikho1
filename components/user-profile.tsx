// components/user-profile.tsx

"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, Trophy, Target, Clock, TrendingUp, Star, Code, ArrowLeft, Edit3, Save, X, Activity } from "lucide-react"
import { calculateUserStats, type UserStats } from "@/lib/achievements"
import { badges } from "@/lib/badges"
import { cn } from "@/lib/utils"

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
      if (response.ok) setRecentActivity(await response.json())
    } catch (error) { console.error("Error loading activity:", error) }
  }

  const handleSaveProfile = async () => {
    if (!user || !editedName.trim()) return
    setLoading(true)
    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, updates: { displayName: editedName.trim() } }),
      })
      if (response.ok) {
        setIsEditing(false)
        await refreshUserProfile()
      }
    } catch (error) { console.error("Error updating profile:", error)
    } finally { setLoading(false) }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "quiz_completed": return <Target className="h-5 w-5 text-cyan-400" />
      case "badge_earned": return <Trophy className="h-5 w-5 text-yellow-400" />
      case "coding_challenge": return <Code className="h-5 w-5 text-purple-400" />
      case "level_up": return <Star className="h-5 w-5 text-green-400" />
      default: return <User className="h-5 w-5 text-gray-400" />
    }
  }

  const formatTimeAgo = (date: Date) => {
    const diffInHours = Math.floor((new Date().getTime() - new Date(date).getTime()) / 3600000)
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  if (!userProfile || !userStats) {
    return <div className="min-h-screen cyber-bg-gradient cyber-grid flex items-center justify-center"><p className="cyber-text text-xl">Loading Transmission...</p></div>
  }

  const nextLevelProgress = ((userProfile.xp - userStats.currentLevelXP) / (userStats.nextLevelXP - userStats.currentLevelXP)) * 100
  const earnedBadges = badges.filter((badge) => userProfile.badges.includes(badge.id))

  return (
    <div className="min-h-screen cyber-bg-gradient cyber-grid p-6 animate-in fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <User className="h-10 w-10 cyber-text-primary cyber-glow" />
            <div><h1 className="text-4xl font-bold font-jura cyber-text-primary">User Profile</h1><p className="cyber-text">Your Personal Command Center</p></div>
          </div>
          <Button onClick={onBack} variant="outline" className="cyber-button-outline"><ArrowLeft className="mr-2" size={16} /> Back to Hub</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Info & Quick Stats */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="cyber-card text-center">
              <CardContent className="p-6">
                <div className="relative w-28 h-28 mx-auto mb-4">
                  <Avatar className="w-28 h-28 border-2 border-cyber-primary">
                    <AvatarImage src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${userProfile.displayName}`} />
                    <AvatarFallback className="text-3xl bg-cyber-bg-darker text-cyber-primary">{userProfile.displayName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 rounded-full border-2 border-cyber-primary animate-spin-slow opacity-50"></div>
                </div>
                {isEditing ? (
                  <div className="flex items-center gap-2 w-full"><Input value={editedName} onChange={(e) => setEditedName(e.target.value)} className="cyber-input" placeholder="Display Name" /><Button onClick={handleSaveProfile} disabled={loading} size="icon" className="cyber-button bg-green-500"><Save size={16} /></Button><Button onClick={() => setIsEditing(false)} size="icon" variant="outline" className="cyber-button-outline"><X size={16} /></Button></div>
                ) : (
                  <div className="flex items-center justify-center gap-2"><h2 className="text-2xl font-bold font-jura cyber-text-bright">{userProfile.displayName}</h2><Button onClick={() => setIsEditing(true)} size="icon" variant="ghost" className="text-cyber-text hover:text-cyber-primary"><Edit3 size={16} /></Button></div>
                )}
                <p className="cyber-text text-sm">{user?.email}</p>
                <div className="border-t border-cyber-border my-6"></div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center"><span className="cyber-text">Level</span><Badge className="cyber-badge-level">Level {userProfile.level}</Badge></div>
                  <div className="space-y-2"><div className="flex justify-between text-xs font-mono"><span className="cyber-text">XP PROGRESS</span><span className="cyber-text-primary">{userProfile.xp - userStats.currentLevelXP} / {userStats.nextLevelXP - userStats.currentLevelXP}</span></div><Progress value={nextLevelProgress} className="cyber-progress" /></div>
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-card">
              <CardHeader><CardTitle className="font-jura cyber-text-secondary flex items-center gap-2"><TrendingUp size={20} />Quick Stats</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                {[ { icon: <Target/>, label: "Quizzes", value: userStats.quizzesCompleted, color: "text-cyan-400" }, { icon: <Code/>, label: "Challenges", value: userStats.codingChallengesCompleted, color: "text-purple-400" }, { icon: <Star/>, label: "Perfect Scores", value: userStats.perfectScores, color: "text-yellow-400" }, { icon: <Clock/>, label: "Time (min)", value: userStats.timeSpentLearning, color: "text-orange-400" } ].map(stat => (
                  <div key={stat.label} className="text-center p-2 rounded-lg bg-cyber-bg-darker border border-cyber-border">
                    <div className={cn("text-3xl font-mono font-bold", stat.color)}>{stat.value}</div>
                    <div className="text-xs cyber-text">{stat.label}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Main Content Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="grid w-full grid-cols-3 cyber-tabs-list">
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="badges">Badges</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="activity">
                <Card className="cyber-card h-[calc(100vh-180px)] overflow-y-auto">
                  <CardHeader><CardTitle className="font-jura cyber-text-primary flex items-center gap-2"><Activity size={20}/>Recent Activity</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivity.map((act, i) => <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-cyber-bg-darker border border-cyber-border">
                      {getActivityIcon(act.type)}
                      <div className="flex-1"><p className="cyber-text-bright font-semibold">{(act.title || act.badgeName || `Level Up to ${act.newLevel}`).replace('Completed Quiz: ', '').replace('Earned Badge: ', '')}</p><p className="text-xs cyber-text">{act.score ? `Score: ${act.score}% • ` : ''}{act.xpEarned ? `+${act.xpEarned} XP` : ''}{act.description || ''}</p></div>
                      <div className="text-xs font-mono cyber-text">{formatTimeAgo(act.timestamp)}</div>
                    </div>)}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="badges">
                <Card className="cyber-card h-[calc(100vh-180px)] overflow-y-auto">
                  <CardHeader><CardTitle className="font-jura cyber-text-primary flex items-center gap-2"><Trophy size={20}/>Earned Badges ({earnedBadges.length})</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {earnedBadges.map(b => <div key={b.id} className="cyber-card p-4 flex items-center gap-4">
                      <div className="text-4xl">{b.icon}</div>
                      <div><p className="font-bold cyber-text-bright">{b.name}</p><p className="text-sm cyber-text">{b.description}</p><Badge className={cn("capitalize text-xs mt-2 rarity-badge", `rarity-${b.rarity}`)}>{b.rarity}</Badge></div>
                    </div>)}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card className="cyber-card h-[calc(100vh-180px)]">
                  <CardHeader><CardTitle className="font-jura cyber-text-primary flex items-center gap-2"><Settings size={20}/>Account Settings</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-bg-darker border border-cyber-border"><div><p className="cyber-text-bright">Email Notifications</p><p className="text-xs cyber-text">Receive updates on your progress</p></div><Button variant="outline" size="sm" className="cyber-button-outline">Enable</Button></div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-bg-darker border border-cyber-border"><div><p className="cyber-text-bright">Profile Visibility</p><p className="text-xs cyber-text">Control who can see your profile</p></div><Button variant="outline" size="sm" className="cyber-button-outline">Manage</Button></div>
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
