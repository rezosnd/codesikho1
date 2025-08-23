"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Star, Zap } from "lucide-react"

interface LevelUpAnimationProps {
  newLevel: number
  xpEarned: number
  newBadges: string[]
  onClose: () => void
}

export function LevelUpAnimation({ newLevel, xpEarned, newBadges, onClose }: LevelUpAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    setShowAnimation(true)
  }, [])

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card
        className={`bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-400/50 max-w-md w-full transform transition-all duration-1000 ${
          showAnimation ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      >
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold text-yellow-400 mb-2">Level Up!</h2>
            <p className="text-gray-300">You've reached Level {newLevel}!</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-cyan-400">
                <Zap size={20} />
                <span className="text-xl font-bold">+{xpEarned} XP</span>
              </div>
            </div>

            {newBadges.length > 0 && (
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-purple-400 mb-2">
                  <Trophy size={20} />
                  <span className="font-semibold">New Badges Earned!</span>
                </div>
                <div className="flex justify-center gap-2">
                  {newBadges.map((badgeId, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center animate-pulse"
                    >
                      <Star size={16} className="text-white" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-bold"
          >
            Continue Learning!
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
