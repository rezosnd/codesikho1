"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { QuizInterface } from "./quiz-interface"
import { CodingChallengeInterface } from "./coding-challenge-interface"
import { Leaderboard } from "./leaderboard"
import { Achievements } from "./achievements"
import { UserProfile } from "./user-profile"
import { MiniGamesInterface } from "./mini-games-interface"
import { HeroSlider } from "./hero-slider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Code, Trophy, Zap, Target, Gamepad2, Medal, User, Crown, Star, TrendingUp } from "lucide-react"
import { FuturisticLogin } from "./futuristic-login"

interface LeaderboardEntry {
  displayName: string
  xp: number
  level: number
  badges: number
  rank: number
}

export function LandingPage() {
  const [showLogin, setShowLogin] = useState(false)
  const [currentView, setCurrentView] = useState<
    "landing" | "quiz" | "coding" | "leaderboard" | "achievements" | "profile" | "games"
  >("landing")
  const [topUsers, setTopUsers] = useState<LeaderboardEntry[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const { user, userProfile, logout } = useAuth()

  useEffect(() => {
    if (user && userProfile) {
      loadDashboardData()
    }
  }, [user, userProfile])

  const loadDashboardData = async () => {
    try {
      // Load top 5 users for leaderboard preview
      const leaderboardResponse = await fetch("/api/leaderboard")
      if (leaderboardResponse.ok) {
        const data = await leaderboardResponse.json()
        setTopUsers(data.slice(0, 5))
      }

      // Load recent activity
      const activityResponse = await fetch("/api/activity")
      if (activityResponse.ok) {
        const activity = await activityResponse.json()
        setRecentActivity(activity.slice(0, 5))
      }
    } catch (error) {
      console.error("[v0] Error loading dashboard data:", error)
    }
  }

  if (user && userProfile) {
    if (currentView === "quiz") {
      return <QuizInterface onBack={() => setCurrentView("landing")} />
    }

    if (currentView === "coding") {
      return <CodingChallengeInterface onBack={() => setCurrentView("landing")} />
    }

    if (currentView === "leaderboard") {
      return <Leaderboard onBack={() => setCurrentView("landing")} />
    }

    if (currentView === "achievements") {
      return <Achievements onBack={() => setCurrentView("landing")} />
    }

    if (currentView === "profile") {
      return <UserProfile onBack={() => setCurrentView("landing")} />
    }

    if (currentView === "games") {
      return <MiniGamesInterface onBack={() => setCurrentView("landing")} />
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        {/* Header */}
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center">
                  <Code className="text-white" size={24} />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  CodeMaster Pro
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setCurrentView("profile")}
                  variant="outline"
                  className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 bg-transparent backdrop-blur-sm"
                >
                  <User className="mr-2" size={16} />
                  Profile
                </Button>
                <Button
                  onClick={logout}
                  variant="outline"
                  className="border-red-400 text-red-400 hover:bg-red-400/10 bg-transparent backdrop-blur-sm"
                >
                  Logout
                </Button>
              </div>
            </div>

            {/* Welcome Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                Welcome back, {userProfile.displayName}!
              </h2>
              <p className="text-xl text-gray-300 mb-8">Ready to level up your coding skills?</p>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-cyan-400 mb-2">Level {userProfile.level}</div>
                    <div className="text-gray-400">Current Level</div>
                    <Progress value={(userProfile.xp % 1000) / 10} className="mt-2" />
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:border-purple-400/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">{userProfile.xp}</div>
                    <div className="text-gray-400">Experience Points</div>
                    <div className="text-sm text-purple-300 mt-2">+{Math.floor(Math.random() * 50)} today</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:border-yellow-400/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">{userProfile.badges.length}</div>
                    <div className="text-gray-400">Badges Earned</div>
                    <div className="text-sm text-yellow-300 mt-2">🏆 Achievement Hunter</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:border-green-400/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {userProfile.completedChallenges.length}
                    </div>
                    <div className="text-gray-400">Challenges Completed</div>
                    <div className="text-sm text-green-300 mt-2">🚀 Keep going!</div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto mb-12">
                <Button
                  onClick={() => setCurrentView("quiz")}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-4 text-lg font-semibold rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/25"
                >
                  <Target className="mr-2" size={20} />
                  Take Quiz
                </Button>
                <Button
                  onClick={() => setCurrentView("coding")}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-4 text-lg font-semibold rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg shadow-pink-500/25"
                >
                  <Code className="mr-2" size={20} />
                  Code Challenge
                </Button>
                <Button
                  onClick={() => setCurrentView("games")}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 py-4 text-lg font-semibold rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg shadow-pink-500/25"
                >
                  <Gamepad2 className="mr-2" size={20} />
                  Mini Games
                </Button>
                <Button
                  onClick={() => setCurrentView("leaderboard")}
                  className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white px-6 py-4 text-lg font-semibold rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg shadow-yellow-500/25"
                >
                  <Trophy className="mr-2" size={20} />
                  Leaderboard
                </Button>
                <Button
                  onClick={() => setCurrentView("achievements")}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-4 text-lg font-semibold rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/25"
                >
                  <Medal className="mr-2" size={20} />
                  Achievements
                </Button>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Leaderboard Preview */}
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-400">
                    <Trophy size={24} />
                    Top Coders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topUsers.map((user, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-slate-700/30">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold">
                          {index === 0 ? <Crown size={16} /> : index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-white">{user.displayName}</div>
                          <div className="text-sm text-gray-400">
                            Level {user.level} • {user.xp} XP
                          </div>
                        </div>
                        <div className="text-yellow-400 font-bold">{user.badges} 🏆</div>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => setCurrentView("leaderboard")}
                    variant="outline"
                    className="w-full mt-4 border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
                  >
                    View Full Leaderboard
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-400">
                    <TrendingUp size={24} />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-slate-700/30">
                          <div className="w-2 h-2 rounded-full bg-green-400"></div>
                          <div className="flex-1">
                            <div className="text-white">{activity.description}</div>
                            <div className="text-sm text-gray-400">
                              {new Date(activity.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                          <Star className="text-yellow-400" size={16} />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Start learning to see your activity here!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Dynamic Hero Slider */}
      <HeroSlider />

      {/* Features Section */}
      <div className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-16">Level Up Your Coding Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Code className="text-cyan-400" size={32} />}
              title="Interactive Coding"
              description="Write and execute code in our browser-based editor with real-time feedback"
            />
            <FeatureCard
              icon={<Target className="text-purple-400" size={32} />}
              title="Smart Quizzes"
              description="Test your knowledge with AI-generated quizzes tailored to your skill level"
            />
            <FeatureCard
              icon={<Gamepad2 className="text-pink-400" size={32} />}
              title="Mini Games"
              description="Learn programming concepts through fun, interactive games and puzzles"
            />
            <FeatureCard
              icon={<Trophy className="text-yellow-400" size={32} />}
              title="Achievements"
              description="Earn badges and climb the leaderboard as you master new skills"
            />
            <FeatureCard
              icon={<Zap className="text-green-400" size={32} />}
              title="AI Assistant"
              description="Get personalized hints and explanations powered by artificial intelligence"
            />
            <FeatureCard
              icon={<Medal className="text-orange-400" size={32} />}
              title="Progress Tracking"
              description="Monitor your learning journey with detailed analytics and insights"
            />
          </div>
        </div>
      </div>

      {/* Floating Login Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={() => setShowLogin(true)}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 text-lg font-semibold rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/25"
        >
          <Zap className="mr-2" size={20} />
          Start Learning
        </Button>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="relative">
            <Button
              onClick={() => setShowLogin(false)}
              variant="ghost"
              className="absolute -top-4 -right-4 text-white hover:text-gray-300 z-10"
            >
              ✕
            </Button>
            <FuturisticLogin />
          </div>
        </div>
      )}
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 transform hover:scale-105">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-xl font-semibold text-white ml-3">{title}</h3>
      </div>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}
