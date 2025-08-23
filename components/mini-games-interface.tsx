"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Trophy, Target, Gamepad2, ArrowLeft, CheckCircle, RotateCcw, Award, Shuffle, Link2 } from "lucide-react"
import { miniGames, type DragDropGame, type MatchingGame, type SequenceGame } from "@/lib/mini-games"
import { submitQuizResult } from "@/lib/quiz-service"
import { cn } from "@/lib/utils"

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

  // --- All original game logic is preserved below ---

  useEffect(() => {
    if (selectedGame && timeLeft > 0 && !showResults) {
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
    if (game.type === "drag-drop") {
      setGameState({ availableBlocks: [...game.codeBlocks].sort(() => Math.random() - 0.5), droppedBlocks: [] })
    } else if (game.type === "matching") {
      const shuffledLeft = [...game.pairs].sort(() => Math.random() - 0.5)
      const shuffledRight = [...game.pairs].map((p) => ({ id: p.id, content: p.right })).sort(() => Math.random() - 0.5)
      setGameState({ leftItems: shuffledLeft.map((p) => ({ id: p.id, content: p.left, matched: false })), rightItems: shuffledRight.map((r) => ({ ...r, matched: false })), matches: [], selectedLeft: null, selectedRight: null })
    } else if (game.type === "sequence") {
      setGameState({ items: [...game.items].sort(() => Math.random() - 0.5), sequence: [] })
    }
  }

  const handleGameComplete = async () => {
    if (!selectedGame || !user || !userProfile || !gameStartTime) return
    let finalScore = 0, isCorrect = false
    if (selectedGame.type === "drag-drop" && gameState) {
      isCorrect = JSON.stringify(gameState.droppedBlocks.map((b: any) => b.id)) === JSON.stringify((selectedGame as DragDropGame).correctSequence)
      finalScore = isCorrect ? 100 : 0
    } else if (selectedGame.type === "matching" && gameState) {
      const totalPairs = (selectedGame as MatchingGame).pairs.length
      const correctMatches = gameState.matches.length
      finalScore = Math.round((correctMatches / totalPairs) * 100)
      isCorrect = correctMatches === totalPairs
    } else if (selectedGame.type === "sequence" && gameState) {
      const correctOrder = (selectedGame as SequenceGame).items.sort((a, b) => a.correctPosition - b.correctPosition)
      isCorrect = JSON.stringify(gameState.sequence.map((s: any) => s.id)) === JSON.stringify(correctOrder.map((c) => c.id))
      finalScore = isCorrect ? 100 : 0
    }
    setScore(finalScore)
    const timeSpent = Math.floor((Date.now() - gameStartTime.getTime()) / 1000)
    const xpEarned = Math.floor((finalScore / 100) * selectedGame.points)
    try {
      await submitQuizResult(user.uid, { quizId: selectedGame.id, score: finalScore, totalQuestions: 1, correctAnswers: isCorrect ? 1 : 0, timeSpent, xpEarned, completedAt: new Date() }, userProfile)
    } catch (error) { console.error("Error submitting game result:", error) }
    setShowResults(true)
  }

  const resetGame = () => { if (selectedGame) { startGame(selectedGame) } }
  const formatTime = (seconds: number) => { const mins = Math.floor(seconds / 60); const secs = seconds % 60; return `${mins}:${secs.toString().padStart(2, "0")}` }

  // --- UI Rendering ---

  // View 1: Game Selection List
  if (!selectedGame) {
    return (
      <div className="min-h-screen cyber-bg-gradient cyber-grid p-6 animate-in fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3"><Gamepad2 className="h-10 w-10 cyber-text-primary cyber-glow" /><div><h1 className="text-4xl font-bold font-jura cyber-text-primary">Game Simulation Hub</h1><p className="cyber-text">Select a Training Module</p></div></div>
            <Button onClick={onBack} variant="outline" className="cyber-button-outline"><ArrowLeft className="mr-2" size={16} /> Back to Hub</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {miniGames.map((game) => (
              <Card key={game.id} className="cyber-card cyber-holo flex flex-col justify-between">
                <CardHeader>
                  <div className="flex justify-between items-start gap-4"><CardTitle className="text-xl font-jura cyber-text-bright">{game.title}</CardTitle><Badge variant="outline" className={cn("capitalize text-xs", game.difficulty === 'easy' && 'border-cyan-400 text-cyan-400', game.difficulty === 'medium' && 'border-yellow-400 text-yellow-400', game.difficulty === 'hard' && 'border-red-400 text-red-400')}>{game.difficulty}</Badge></div>
                  <CardDescription className="cyber-text text-sm pt-2">{game.topic}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="cyber-text text-sm mb-4 h-20 line-clamp-4">{game.description}</p>
                  <div className="flex items-center justify-between text-xs cyber-text mb-4 border-t border-cyber-border pt-4">
                    <span className="flex items-center gap-1.5"><Clock size={14} />{Math.floor((game.timeLimit || 300) / 60)} min</span>
                    <span className="flex items-center gap-1.5"><Trophy size={14} />{game.points} XP</span>
                    <span className="flex items-center gap-1.5 capitalize"><Target size={14} />{game.type.replace('-', ' ')}</span>
                  </div>
                  <Button onClick={() => startGame(game)} className="w-full cyber-button font-jura"><Play className="mr-2" size={16} /> Play Game</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // View 2: Game Results Screen
  if (showResults) {
    return (
      <div className="min-h-screen cyber-bg-gradient cyber-grid flex items-center justify-center p-4 animate-in fade-in">
        <Card className="cyber-card w-full max-w-2xl text-center">
          <CardHeader>
            <Award className="mx-auto h-16 w-16 cyber-text-accent cyber-glow mb-4" />
            <CardTitle className="text-3xl font-jura cyber-text-primary cyber-glow">Simulation Complete</CardTitle>
            <CardDescription className="cyber-text-bright text-lg">Performance Analysis:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="cyber-card p-4 border-cyber-primary"><div className="text-4xl font-mono font-bold cyber-text-primary">{score}%</div><div className="cyber-text text-sm">Score</div></div>
              <div className="cyber-card p-4 border-cyber-accent"><div className="text-4xl font-mono font-bold cyber-text-accent">+{Math.floor((score / 100) * selectedGame.points)}</div><div className="cyber-text text-sm">XP Earned</div></div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button onClick={resetGame} className="cyber-button font-jura"><RotateCcw className="mr-2 h-4 w-4" /> Play Again</Button>
              <Button onClick={() => setSelectedGame(null)} variant="outline" className="cyber-button-outline">More Games</Button>
              <Button onClick={onBack} variant="outline" className="cyber-button-outline">Return to Hub</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // View 3: Main Game Playing Interface
  return (
    <div className="min-h-screen cyber-bg-gradient cyber-grid p-4 animate-in fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4"><Button onClick={() => setSelectedGame(null)} variant="ghost" size="sm" className="text-cyber-text hover:bg-cyber-border"><ArrowLeft size={16} /></Button><h1 className="text-2xl font-bold font-jura cyber-text-bright">{selectedGame.title}</h1><Badge variant="outline" className={cn("capitalize text-xs", selectedGame.difficulty === 'easy' && 'border-cyan-400 text-cyan-400', selectedGame.difficulty === 'medium' && 'border-yellow-400 text-yellow-400', selectedGame.difficulty === 'hard' && 'border-red-400 text-red-400')}>{selectedGame.difficulty}</Badge></div>
          <div className="flex items-center gap-6"><div className="flex items-center gap-2 text-cyan-400 cyber-glow"><Clock size={20} /><span className="text-xl font-mono">{formatTime(timeLeft)}</span></div><Button onClick={handleGameComplete} className="cyber-button font-jura bg-green-500 hover:bg-green-600"><CheckCircle className="mr-2" size={16} /> Finish Game</Button></div>
        </div>
        {/* Render the correct game component based on type */}
        {selectedGame.type === "drag-drop" && <DragDropGameComponent game={selectedGame} gameState={gameState} setGameState={setGameState} />}
        {selectedGame.type === "matching" && <MatchingGameComponent game={selectedGame} gameState={gameState} setGameState={setGameState} />}
        {selectedGame.type === "sequence" && <SequenceGameComponent game={selectedGame} gameState={gameState} setGameState={setGameState} />}
      </div>
    </div>
  )
}

// --- Sub-Components for each Game Type ---

function DragDropGameComponent({ gameState, setGameState }: any) {
  const handleDrop = (block: any) => { setGameState((prev: any) => ({ ...prev, droppedBlocks: [...prev.droppedBlocks, block], availableBlocks: prev.availableBlocks.filter((b: any) => b.id !== block.id) })) }
  const handleRemove = (block: any) => { setGameState((prev: any) => ({ ...prev, availableBlocks: [...prev.availableBlocks, block], droppedBlocks: prev.droppedBlocks.filter((b: any) => b.id !== block.id) })) }
  if (!gameState) return null
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="cyber-card"><CardHeader><CardTitle className="font-jura cyber-text-primary">Available Blocks</CardTitle></CardHeader><CardContent className="space-y-3">{gameState.availableBlocks.map((b: any) => (<button key={b.id} onClick={() => handleDrop(b)} className="game-block w-full text-left"><code className="font-mono text-sm">{b.code}</code></button>))}</CardContent></Card>
      <Card className="cyber-card"><CardHeader><CardTitle className="font-jura cyber-text-primary">Your Function</CardTitle></CardHeader><CardContent><div className="min-h-[20rem] p-4 rounded-lg border-2 border-dashed border-cyber-border space-y-2">{gameState.droppedBlocks.length === 0 ? (<div className="flex items-center justify-center h-full cyber-text">Drop blocks here</div>) : (gameState.droppedBlocks.map((b: any, i: number) => (<button key={`${b.id}-${i}`} onClick={() => handleRemove(b)} className="game-block w-full text-left"><code className="font-mono text-sm">{b.code}</code></button>)))}</div></CardContent></Card>
    </div>
  )
}

function MatchingGameComponent({ game, gameState, setGameState }: any) {
  const handleLeftClick = (item: any) => { setGameState((prev: any) => ({ ...prev, selectedLeft: prev.selectedLeft?.id === item.id ? null : item })) }
  const handleRightClick = (item: any) => {
    if (!gameState.selectedLeft) return
    if (game.pairs.find((p: any) => p.id === gameState.selectedLeft.id && p.right === item.content)) {
      setGameState((prev: any) => ({ ...prev, matches: [...prev.matches, { left: prev.selectedLeft, right: item }], leftItems: prev.leftItems.map((l: any) => (l.id === prev.selectedLeft.id ? { ...l, matched: true } : l)), rightItems: prev.rightItems.map((r: any) => (r.id === item.id ? { ...r, matched: true } : r)), selectedLeft: null }))
    } else { setGameState((prev: any) => ({ ...prev, selectedLeft: null })) }
  }
  if (!gameState) return null
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="cyber-card"><CardHeader><CardTitle className="font-jura cyber-text-primary flex items-center gap-2"><Shuffle size={20}/>Concepts</CardTitle></CardHeader><CardContent className="space-y-3">{gameState.leftItems.map((item: any) => (<button key={item.id} disabled={item.matched} onClick={() => handleLeftClick(item)} className={cn("game-block w-full text-left", item.matched && "matched", gameState.selectedLeft?.id === item.id && "selected")}>{item.content}</button>))}</CardContent></Card>
      <Card className="cyber-card"><CardHeader><CardTitle className="font-jura cyber-text-primary flex items-center gap-2"><Link2 size={20}/>Descriptions</CardTitle></CardHeader><CardContent className="space-y-3">{gameState.rightItems.map((item: any) => (<button key={item.id} disabled={item.matched} onClick={() => handleRightClick(item)} className={cn("game-block w-full text-left", item.matched && "matched")}>{item.content}</button>))}</CardContent></Card>
    </div>
  )
}

function SequenceGameComponent({ gameState, setGameState }: any) {
  const handleItemClick = (item: any) => { if (gameState.sequence.find((s: any) => s.id === item.id)) return; setGameState((prev: any) => ({ ...prev, sequence: [...prev.sequence, item], items: prev.items.filter((i: any) => i.id !== item.id) })) }
  const handleSequenceClick = (item: any) => { setGameState((prev: any) => ({ ...prev, items: [...prev.items, item], sequence: prev.sequence.filter((s: any) => s.id !== item.id) })) }
  if (!gameState) return null
  return (
    <div className="space-y-8">
      <Card className="cyber-card"><CardHeader><CardTitle className="font-jura cyber-text-primary">Available Steps</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-3">{gameState.items.map((item: any) => (<button key={item.id} onClick={() => handleItemClick(item)} className="game-block">{item.content}</button>))}</CardContent></Card>
      <Card className="cyber-card"><CardHeader><CardTitle className="font-jura cyber-text-primary">Your Sequence</CardTitle></CardHeader><CardContent><div className="min-h-[10rem] p-4 rounded-lg border-2 border-dashed border-cyber-border space-y-2">{gameState.sequence.length === 0 ? (<div className="flex items-center justify-center h-full cyber-text">Click steps above to build your sequence</div>) : (gameState.sequence.map((item: any, i: number) => (<button key={`${item.id}-${i}`} onClick={() => handleSequenceClick(item)} className="game-block w-full flex items-center gap-4"><span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyber-primary text-cyber-bg-dark font-bold">{i + 1}</span>{item.content}</button>)))}</div></CardContent></Card>
    </div>
  )
}
