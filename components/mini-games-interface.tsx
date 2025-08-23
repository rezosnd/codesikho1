"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Trophy, Target, Gamepad2, ArrowLeft, CheckCircle, RotateCcw } from "lucide-react"
import { miniGames, type DragDropGame, type MatchingGame, type SequenceGame } from "@/lib/mini-games"
import { submitQuizResult } from "@/lib/quiz-service"

interface MiniGamesInterfaceProps {
  onBack: () => void
}

export function MiniGamesInterface({ onBack }: MiniGamesInterfaceProps) {
  const [selectedGame, setSelectedGame] = useState<DragDropGame | MatchingGame | SequenceGame | null>(null)
  const [gameState, setGameState] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [gameStartTime, setGameStartTime] = useState<Date | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const { user, userProfile } = useAuth()

  useEffect(() => {
    if (selectedGame && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && selectedGame && !showResults) {
      handleGameComplete()
    }
  }, [timeLeft, selectedGame, showResults])

  const startGame = (game: DragDropGame | MatchingGame | SequenceGame) => {
    setSelectedGame(game)
    setTimeLeft(game.timeLimit || 300)
    setGameStartTime(new Date())
    setShowResults(false)
    setScore(0)

    // Initialize game state based on type
    if (game.type === "drag-drop") {
      setGameState({
        availableBlocks: [...game.codeBlocks].sort(() => Math.random() - 0.5),
        droppedBlocks: [],
      })
    } else if (game.type === "matching") {
      const shuffledLeft = [...game.pairs].sort(() => Math.random() - 0.5)
      const shuffledRight = [...game.pairs].map((p) => ({ id: p.id, content: p.right })).sort(() => Math.random() - 0.5)
      setGameState({
        leftItems: shuffledLeft.map((p) => ({ id: p.id, content: p.left, matched: false })),
        rightItems: shuffledRight.map((r) => ({ ...r, matched: false })),
        matches: [],
        selectedLeft: null,
        selectedRight: null,
      })
    } else if (game.type === "sequence") {
      setGameState({
        items: [...game.items].sort(() => Math.random() - 0.5),
        sequence: [],
      })
    }
  }

  const handleGameComplete = async () => {
    if (!selectedGame || !user || !userProfile || !gameStartTime) return

    let finalScore = 0
    let isCorrect = false

    // Calculate score based on game type
    if (selectedGame.type === "drag-drop" && gameState) {
      const correctSequence = (selectedGame as DragDropGame).correctSequence
      isCorrect = JSON.stringify(gameState.droppedBlocks.map((b: any) => b.id)) === JSON.stringify(correctSequence)
      finalScore = isCorrect ? 100 : 0
    } else if (selectedGame.type === "matching" && gameState) {
      const totalPairs = (selectedGame as MatchingGame).pairs.length
      const correctMatches = gameState.matches.length
      finalScore = Math.round((correctMatches / totalPairs) * 100)
      isCorrect = correctMatches === totalPairs
    } else if (selectedGame.type === "sequence" && gameState) {
      const correctOrder = (selectedGame as SequenceGame).items.sort((a, b) => a.correctPosition - b.correctPosition)
      isCorrect =
        JSON.stringify(gameState.sequence.map((s: any) => s.id)) === JSON.stringify(correctOrder.map((c) => c.id))
      finalScore = isCorrect ? 100 : 0
    }

    setScore(finalScore)

    const timeSpent = Math.floor((Date.now() - gameStartTime.getTime()) / 1000)
    const xpEarned = Math.floor((finalScore / 100) * selectedGame.points)

    try {
      await submitQuizResult(
        user.uid,
        {
          quizId: selectedGame.id,
          score: finalScore,
          totalQuestions: 1,
          correctAnswers: isCorrect ? 1 : 0,
          timeSpent,
          xpEarned,
          completedAt: new Date(),
        },
        userProfile,
      )
    } catch (error) {
      console.error("Error submitting game result:", error)
    }

    setShowResults(true)
  }

  const resetGame = () => {
    if (selectedGame) {
      startGame(selectedGame)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!selectedGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Mini Games
            </h1>
            <Button
              onClick={onBack}
              variant="outline"
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 bg-transparent"
            >
              <ArrowLeft className="mr-2" size={16} />
              Back to Dashboard
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {miniGames.map((game) => (
              <Card
                key={game.id}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 transform hover:scale-105"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">{game.title}</CardTitle>
                    <Badge
                      variant={
                        game.difficulty === "easy"
                          ? "secondary"
                          : game.difficulty === "medium"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {game.difficulty}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="border-purple-400 text-purple-400 w-fit">
                    {game.topic}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm mb-4">{game.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {Math.floor((game.timeLimit || 300) / 60)} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy size={16} />
                      {game.points} XP
                    </span>
                    <span className="flex items-center gap-1">
                      <Gamepad2 size={16} />
                      {game.type}
                    </span>
                  </div>
                  <Button
                    onClick={() => startGame(game)}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  >
                    <Target className="mr-2" size={16} />
                    Play Game
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl font-bold text-white mb-4">Game Complete!</CardTitle>
              <div className="text-6xl mb-4">{score >= 80 ? "🎉" : score >= 60 ? "👍" : "🎮"}</div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-cyan-400">{score}%</div>
                  <div className="text-gray-400">Score</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-purple-400">
                    +{Math.floor((score / 100) * selectedGame.points)}
                  </div>
                  <div className="text-gray-400">XP Earned</div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={resetGame} className="bg-gradient-to-r from-cyan-500 to-blue-500">
                  <RotateCcw className="mr-2" size={16} />
                  Play Again
                </Button>
                <Button
                  onClick={() => setSelectedGame(null)}
                  variant="outline"
                  className="border-purple-400 text-purple-400 bg-transparent"
                >
                  Choose Another Game
                </Button>
                <Button onClick={onBack} variant="outline" className="border-slate-600 text-gray-400 bg-transparent">
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setSelectedGame(null)}
              variant="outline"
              size="sm"
              className="border-slate-600 text-gray-400 bg-transparent"
            >
              <ArrowLeft size={16} />
            </Button>
            <h1 className="text-2xl font-bold text-white">{selectedGame.title}</h1>
            <Badge
              variant={
                selectedGame.difficulty === "easy"
                  ? "secondary"
                  : selectedGame.difficulty === "medium"
                    ? "default"
                    : "destructive"
              }
            >
              {selectedGame.difficulty}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <Clock size={20} />
              <span className="text-xl font-mono">{formatTime(timeLeft)}</span>
            </div>
            <Button
              onClick={handleGameComplete}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              Finish Game
            </Button>
          </div>
        </div>

        {/* Game Content */}
        {selectedGame.type === "drag-drop" && (
          <DragDropGameComponent
            game={selectedGame as DragDropGame}
            gameState={gameState}
            setGameState={setGameState}
          />
        )}
        {selectedGame.type === "matching" && (
          <MatchingGameComponent
            game={selectedGame as MatchingGame}
            gameState={gameState}
            setGameState={setGameState}
          />
        )}
        {selectedGame.type === "sequence" && (
          <SequenceGameComponent
            game={selectedGame as SequenceGame}
            gameState={gameState}
            setGameState={setGameState}
          />
        )}
      </div>
    </div>
  )
}

// Drag and Drop Game Component
function DragDropGameComponent({ game, gameState, setGameState }: any) {
  const handleDrop = (block: any) => {
    setGameState((prev: any) => ({
      ...prev,
      droppedBlocks: [...prev.droppedBlocks, block],
      availableBlocks: prev.availableBlocks.filter((b: any) => b.id !== block.id),
    }))
  }

  const handleRemove = (block: any) => {
    setGameState((prev: any) => ({
      ...prev,
      availableBlocks: [...prev.availableBlocks, block],
      droppedBlocks: prev.droppedBlocks.filter((b: any) => b.id !== block.id),
    }))
  }

  if (!gameState) return null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Available Code Blocks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {gameState.availableBlocks.map((block: any) => (
              <div
                key={block.id}
                onClick={() => handleDrop(block)}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  block.type === "correct"
                    ? "border-green-400/50 bg-green-400/10 hover:bg-green-400/20"
                    : block.type === "incorrect"
                      ? "border-red-400/50 bg-red-400/10 hover:bg-red-400/20"
                      : "border-gray-400/50 bg-gray-400/10 hover:bg-gray-400/20"
                }`}
              >
                <code className="text-gray-300 font-mono text-sm">{block.code}</code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Your Function</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-48 border-2 border-dashed border-slate-600 rounded-lg p-4">
            {gameState.droppedBlocks.length === 0 ? (
              <div className="text-gray-400 text-center py-8">Drop code blocks here to build your function</div>
            ) : (
              <div className="space-y-2">
                {gameState.droppedBlocks.map((block: any, index: number) => (
                  <div
                    key={`${block.id}-${index}`}
                    onClick={() => handleRemove(block)}
                    className="p-3 bg-slate-700/50 rounded-lg border border-slate-600 cursor-pointer hover:bg-slate-600/50 transition-colors"
                  >
                    <code className="text-cyan-400 font-mono text-sm">{block.code}</code>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Matching Game Component
function MatchingGameComponent({ game, gameState, setGameState }: any) {
  const handleLeftClick = (item: any) => {
    setGameState((prev: any) => ({
      ...prev,
      selectedLeft: prev.selectedLeft?.id === item.id ? null : item,
    }))
  }

  const handleRightClick = (item: any) => {
    if (!gameState.selectedLeft) return

    const pair = game.pairs.find((p: any) => p.id === gameState.selectedLeft.id && p.right === item.content)
    if (pair) {
      setGameState((prev: any) => ({
        ...prev,
        matches: [...prev.matches, { left: prev.selectedLeft, right: item }],
        leftItems: prev.leftItems.map((l: any) => (l.id === prev.selectedLeft.id ? { ...l, matched: true } : l)),
        rightItems: prev.rightItems.map((r: any) => (r.id === item.id ? { ...r, matched: true } : r)),
        selectedLeft: null,
      }))
    } else {
      setGameState((prev: any) => ({ ...prev, selectedLeft: null }))
    }
  }

  if (!gameState) return null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Concepts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {gameState.leftItems.map((item: any) => (
              <div
                key={item.id}
                onClick={() => !item.matched && handleLeftClick(item)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  item.matched
                    ? "border-green-400/50 bg-green-400/10 opacity-50"
                    : gameState.selectedLeft?.id === item.id
                      ? "border-cyan-400 bg-cyan-400/20"
                      : "border-slate-600 bg-slate-700/50 hover:bg-slate-600/50"
                }`}
              >
                <div className="text-white font-semibold">{item.content}</div>
                {item.matched && <CheckCircle className="text-green-400 mt-2" size={20} />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Descriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {gameState.rightItems.map((item: any) => (
              <div
                key={item.id}
                onClick={() => !item.matched && handleRightClick(item)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  item.matched
                    ? "border-green-400/50 bg-green-400/10 opacity-50"
                    : "border-slate-600 bg-slate-700/50 hover:bg-slate-600/50"
                }`}
              >
                <div className="text-white">{item.content}</div>
                {item.matched && <CheckCircle className="text-green-400 mt-2" size={20} />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Sequence Game Component
function SequenceGameComponent({ game, gameState, setGameState }: any) {
  const handleItemClick = (item: any) => {
    if (gameState.sequence.find((s: any) => s.id === item.id)) return

    setGameState((prev: any) => ({
      ...prev,
      sequence: [...prev.sequence, item],
      items: prev.items.filter((i: any) => i.id !== item.id),
    }))
  }

  const handleSequenceClick = (item: any) => {
    setGameState((prev: any) => ({
      ...prev,
      items: [...prev.items, item],
      sequence: prev.sequence.filter((s: any) => s.id !== item.id),
    }))
  }

  if (!gameState) return null

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Available Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gameState.items.map((item: any) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="p-4 rounded-lg border-2 border-slate-600 bg-slate-700/50 hover:bg-slate-600/50 cursor-pointer transition-all duration-300"
              >
                <div className="text-white text-center">{item.content}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Algorithm Sequence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-32 border-2 border-dashed border-slate-600 rounded-lg p-4">
            {gameState.sequence.length === 0 ? (
              <div className="text-gray-400 text-center py-8">Click steps above to build the algorithm sequence</div>
            ) : (
              <div className="space-y-3">
                {gameState.sequence.map((item: any, index: number) => (
                  <div
                    key={`${item.id}-${index}`}
                    onClick={() => handleSequenceClick(item)}
                    className="flex items-center gap-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600 cursor-pointer hover:bg-slate-600/50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="text-white">{item.content}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
