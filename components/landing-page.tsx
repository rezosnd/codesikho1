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
import { FuturisticLogin } from "./futuristic-login"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Code2,
  Zap,
  Trophy,
  Users,
  Brain,
  Gamepad2,
  Star,
  ChevronRight,
  Play,
  User,
  Medal,
  Target,
  Crown,
  TrendingUp,
} from "lucide-react"

interface LeaderboardEntry {
  displayName: string
  xp: number
  level: number
  badges: number
  rank: number
}

// NOTE: This component assumes you have added the cyberpunk styles to your global CSS.
// You will need to add the necessary CSS for classes like 'cyber-bg-gradient', 'cyber-grid',
// 'cyber-particles', 'cyber-text-primary', 'cyber-glow', 'font-jura', etc. for the UI to render correctly.

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

  // --- LOGGED IN USER DASHBOARD ---
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
      <div className="min-h-screen cyber-bg-gradient cyber-grid relative overflow-hidden text-white">
        <div className="cyber-particles"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-2">
              <Code2 className="h-8 w-8 cyber-text-primary cyber-glow" />
              <span className="text-2xl font-bold cyber-text-primary cyber-glow font-jura">SIKHOCode</span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setCurrentView("profile")}
                variant="outline"
                className="cyber-button-outline"
              >
                <User className="mr-2" size={16} />
                Profile
              </Button>
              <Button onClick={logout} variant="outline" className="cyber-button-outline-red">
                Logout
              </Button>
            </div>
          </header>

          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 cyber-text-primary cyber-glow font-jura">
              Welcome back, {userProfile.displayName}!
            </h1>
            <p className="text-xl cyber-text-bright max-w-2xl mx-auto">Ready to level up your coding skills?</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="cyber-card p-6 text-center">
              <div className="text-3xl font-bold cyber-text-primary mb-2">Level {userProfile.level}</div>
              <div className="cyber-text-bright text-sm mb-4">Current Level</div>
              <Progress value={(userProfile.xp % 1000) / 10} className="cyber-progress h-2" />
            </Card>
            <Card className="cyber-card p-6 text-center">
              <div className="text-3xl font-bold cyber-text-secondary mb-2">{userProfile.xp}</div>
              <div className="cyber-text-bright text-sm">Experience Points</div>
            </Card>
            <Card className="cyber-card p-6 text-center">
              <div className="text-3xl font-bold cyber-text-accent mb-2">{userProfile.badges.length}</div>
              <div className="cyber-text-bright text-sm">Badges Earned</div>
            </Card>
            <Card className="cyber-card p-6 text-center">
              <div className="text-3xl font-bold cyber-text-primary mb-2">
                {userProfile.completedChallenges.length}
              </div>
              <div className="cyber-text-bright text-sm">Challenges Done</div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto mb-16">
            <Button onClick={() => setCurrentView("quiz")} className="cyber-button w-full py-4 font-jura">
              <Target className="mr-2" size={20} /> Take Quiz
            </Button>
            <Button onClick={() => setCurrentView("coding")} className="cyber-button w-full py-4 font-jura">
              <Code2 className="mr-2" size={20} /> Code Challenge
            </Button>
            <Button onClick={() => setCurrentView("games")} className="cyber-button w-full py-4 font-jura">
              <Gamepad2 className="mr-2" size={20} /> Mini Games
            </Button>
            <Button onClick={() => setCurrentView("leaderboard")} className="cyber-button w-full py-4 font-jura">
              <Trophy className="mr-2" size={20} /> Leaderboard
            </Button>
            <Button onClick={() => setCurrentView("achievements")} className="cyber-button w-full py-4 font-jura">
              <Medal className="mr-2" size={20} /> Achievements
            </Button>
          </div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Leaderboard Preview */}
            <Card className="cyber-card cyber-holo">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 cyber-text-secondary font-jura">
                  <Trophy size={24} /> Top Coders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topUsers.map((u, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-black/20">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full cyber-bg-secondary text-black font-bold">
                        {index === 0 ? <Crown size={16} /> : index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold cyber-text-bright">{u.displayName}</div>
                        <div className="text-sm cyber-text-bright opacity-70">
                          Level {u.level} • {u.xp} XP
                        </div>
                      </div>
                      <div className="cyber-text-secondary font-bold flex items-center gap-1">
                        {u.badges} <Star size={14} />
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => setCurrentView("leaderboard")}
                  variant="outline"
                  className="w-full mt-4 cyber-button-outline"
                >
                  View Full Leaderboard
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="cyber-card cyber-holo">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 cyber-text-accent font-jura">
                  <TrendingUp size={24} /> Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-black/20">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 cyber-glow"></div>
                        <div className="flex-1">
                          <div className="cyber-text-bright">{activity.description}</div>
                          <div className="text-sm cyber-text-bright opacity-70">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 cyber-text-bright opacity-60">
                      <TrendingUp size={48} className="mx-auto mb-4" />
                      <p>Start learning to see your activity here!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // --- LOGGED OUT LANDING PAGE ---
  return (
    <div className="min-h-screen cyber-bg-gradient cyber-grid relative overflow-hidden">
      <div className="cyber-particles"></div>
      <header className="relative z-10 p-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 cyber-text-primary cyber-glow" />
            <span className="text-2xl font-bold cyber-text-primary cyber-glow font-jura">SIKHOCode</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="cyber-text-primary hover:cyber-text-secondary transition-colors">
              Features
            </a>
            <a href="#courses" className="cyber-text-primary hover:cyber-text-secondary transition-colors">
              Courses
            </a>
          </div>
        </nav>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 cyber-text-primary cyber-glow font-jura">
          <span className="cyber-glitch" data-text="LEARN">LEARN</span><br />
          <span className="cyber-text-secondary">CODE</span><br />
          <span className="cyber-text-accent">CONQUER</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 cyber-text-bright max-w-3xl mx-auto">
          Enter the future of coding education. Master JavaScript, Python, and more through gamified challenges in a
          cyberpunk universe.
        </p>

        {/* This button now triggers the login modal from the original logic */}
        <Button
          onClick={() => setShowLogin(true)}
          size="lg"
          className="cyber-button text-xl px-8 py-4 font-jura"
        >
          Start Your Journey
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </main>

      {/* Features Grid */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-12 cyber-text-primary font-jura">System Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Brain className="h-8 w-8" />,
              title: "AI-Powered Quizzes",
              description: "Adaptive learning with intelligent question generation",
              color: "cyber-text-primary",
            },
            {
              icon: <Code2 className="h-8 w-8" />,
              title: "Live Code Challenges",
              description: "Real-time coding with Monaco Editor and test validation",
              color: "cyber-text-secondary",
            },
            {
              icon: <Gamepad2 className="h-8 w-8" />,
              title: "Mini-Games",
              description: "Drag-drop builders and algorithm sequencing games",
              color: "cyber-text-accent",
            },
          ].map((feature, index) => (
            <Card key={index} className="cyber-card cyber-holo p-6 hover:scale-105 transition-transform">
              <CardHeader>
                <div className={`${feature.color} cyber-glow mb-4`}>{feature.icon}</div>
                <CardTitle className="cyber-text-bright font-jura">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="cyber-text-bright">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Login Modal (Original Logic) */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
