"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Clock, Play, CheckCircle, XCircle, Lightbulb, Code, Trophy, ArrowLeft, Settings, Terminal, FileText } from "lucide-react"
import { type CodingChallenge, codingChallenges } from "@/lib/coding-challenges"
import { runAllTestCases, type ExecutionResult } from "@/lib/code-execution"
import { submitQuizResult } from "@/lib/quiz-service"
import { cn } from "@/lib/utils"

interface CodingChallengeInterfaceProps {
  onBack: () => void
}

export function CodingChallengeInterface({ onBack }: CodingChallengeInterfaceProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<CodingChallenge | null>(null)
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState<"javascript" | "python">("javascript")
  const [testResults, setTestResults] = useState<ExecutionResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [challengeStartTime, setChallengeStartTime] = useState<Date | null>(null)
  const { user, userProfile } = useAuth()

  useEffect(() => {
    if (selectedChallenge && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft, selectedChallenge])

  useEffect(() => {
    if (selectedChallenge) {
      setCode(selectedChallenge.starterCode[language])
      setTestResults([])
    }
  }, [selectedChallenge, language])

  const startChallenge = (challenge: CodingChallenge) => {
    setSelectedChallenge(challenge)
    setCode(challenge.starterCode[language])
    setTestResults([])
    setTimeLeft(challenge.timeLimit || 1800)
    setChallengeStartTime(new Date())
  }

  const runCode = async () => {
    if (!selectedChallenge || !code.trim()) return

    setIsRunning(true)
    try {
      const results = await runAllTestCases(code, language, selectedChallenge.testCases)
      setTestResults(results)

      const allPassed = results.every((result) => result.success)
      if (allPassed && user && userProfile && challengeStartTime) {
        const timeSpent = Math.floor((Date.now() - challengeStartTime.getTime()) / 1000)
        const xpEarned = selectedChallenge.points
        await submitQuizResult(user.uid, {
            quizId: selectedChallenge.id,
            score: 100,
            totalQuestions: selectedChallenge.testCases.length,
            correctAnswers: selectedChallenge.testCases.length,
            timeSpent,
            xpEarned,
            completedAt: new Date(),
          }, userProfile)
      }
    } catch (error) {
      console.error("Error running code:", error)
    } finally {
      setIsRunning(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }
  
  // View 1: Challenge Selection List
  if (!selectedChallenge) {
    return (
      <div className="min-h-screen cyber-bg-gradient cyber-grid p-6 animate-in fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Terminal className="h-10 w-10 cyber-text-primary cyber-glow" />
              <div>
                <h1 className="text-4xl font-bold font-jura cyber-text-primary">Coding Arena</h1>
                <p className="cyber-text">Select Your Challenge</p>
              </div>
            </div>
            <Button onClick={onBack} variant="outline" className="cyber-button-outline">
              <ArrowLeft className="mr-2" size={16} />
              Back to Hub
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {codingChallenges.map((challenge) => (
              <Card key={challenge.id} className="cyber-card cyber-holo flex flex-col justify-between">
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-xl font-jura cyber-text-bright">{challenge.title}</CardTitle>
                    <Badge variant="outline" className={cn("capitalize text-xs",
                      challenge.difficulty === 'easy' && 'border-cyan-400 text-cyan-400',
                      challenge.difficulty === 'medium' && 'border-yellow-400 text-yellow-400',
                      challenge.difficulty === 'hard' && 'border-red-400 text-red-400'
                    )}>
                      {challenge.difficulty}
                    </Badge>
                  </div>
                  <CardDescription className="cyber-text text-sm pt-2">{challenge.topic}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="cyber-text text-sm mb-4 h-20 line-clamp-4">{challenge.description}</p>
                  <div className="flex items-center justify-between text-sm cyber-text mb-4 border-t border-cyber-border pt-4">
                    <span className="flex items-center gap-2"><Clock size={16} /> {Math.floor((challenge.timeLimit || 1800) / 60)} min</span>
                    <span className="flex items-center gap-2"><Trophy size={16} /> {challenge.points} XP</span>
                  </div>
                  <Button onClick={() => startChallenge(challenge)} className="w-full cyber-button font-jura">
                    <Code className="mr-2" size={16} />
                    Start Challenge
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const allTestsPassed = testResults.length > 0 && testResults.every((result) => result.success)

  // View 2: Challenge Workspace
  return (
    <div className="min-h-screen cyber-bg-gradient cyber-grid p-4 animate-in fade-in">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button onClick={() => setSelectedChallenge(null)} variant="ghost" size="sm" className="text-cyber-text hover:bg-cyber-border">
              <ArrowLeft size={16} />
            </Button>
            <h1 className="text-2xl font-bold font-jura cyber-text-bright">{selectedChallenge.title}</h1>
            <Badge variant="outline" className={cn("capitalize text-xs",
              selectedChallenge.difficulty === 'easy' && 'border-cyan-400 text-cyan-400',
              selectedChallenge.difficulty === 'medium' && 'border-yellow-400 text-yellow-400',
              selectedChallenge.difficulty === 'hard' && 'border-red-400 text-red-400'
            )}>
              {selectedChallenge.difficulty}
            </Badge>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-cyan-400 cyber-glow">
              <Clock size={20} />
              <span className="text-xl font-mono">{formatTime(timeLeft)}</span>
            </div>
            <Button onClick={runCode} disabled={isRunning || !code.trim()} className="cyber-button font-jura bg-green-500 hover:bg-green-600">
              {isRunning ? "Executing..." : <><Play className="mr-2" size={16} /> Run Code</>}
            </Button>
          </div>
        </div>

        {/* Main Grid: Problem on left, Editor/Results on right */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3 cyber-tabs-list">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="hints">Hints</TabsTrigger>
                <TabsTrigger value="solution">Solution</TabsTrigger>
              </TabsList>
              <TabsContent value="description">
                <Card className="cyber-card h-[calc(100vh-120px)] overflow-y-auto">
                  <CardHeader><CardTitle className="font-jura cyber-text-primary flex items-center gap-2"><FileText size={20}/> Problem Description</CardTitle></CardHeader>
                  <CardContent><div className="prose-cyber">{selectedChallenge.description}</div></CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="hints">
                 <Card className="cyber-card h-[calc(100vh-120px)] overflow-y-auto">
                  <CardHeader><CardTitle className="font-jura cyber-text-primary flex items-center gap-2"><Lightbulb size={20}/> Hints</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {selectedChallenge.hints.map((hint, i) => <div key={i} className="p-3 border border-yellow-400/30 bg-yellow-400/10 rounded-lg text-yellow-300 text-sm"><strong>Hint {i + 1}:</strong> {hint}</div>)}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="solution">
                <Card className="cyber-card h-[calc(100vh-120px)] overflow-y-auto">
                  <CardHeader><CardTitle className="font-jura cyber-text-primary flex items-center gap-2"><Settings size={20}/> Solution</CardTitle></CardHeader>
                  <CardContent><pre className="cyber-code-block"><code>{selectedChallenge.solution[language]}</code></pre></CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-3 space-y-4">
             <Tabs defaultValue="editor" className="w-full">
              <TabsList className="grid w-full grid-cols-2 cyber-tabs-list">
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="results">Test Results</TabsTrigger>
              </TabsList>
              <TabsContent value="editor">
                 <Card className="cyber-card h-[calc(100vh-120px)] flex flex-col">
                  <CardHeader className="flex-row items-center justify-between">
                    <CardTitle className="font-jura cyber-text-primary">Code Editor</CardTitle>
                    <Tabs value={language} onValueChange={(v) => setLanguage(v as any)}><TabsList className="cyber-tabs-list text-xs"><TabsTrigger value="javascript">JavaScript</TabsTrigger><TabsTrigger value="python">Python</TabsTrigger></TabsList></Tabs>
                  </CardHeader>
                  <CardContent className="flex-grow"><textarea value={code} onChange={(e) => setCode(e.target.value)} className="cyber-editor" placeholder="Write your solution here..." spellCheck={false} /></CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="results">
                <Card className="cyber-card h-[calc(100vh-120px)] overflow-y-auto">
                  <CardHeader>
                    <CardTitle className="font-jura flex items-center gap-2" style={{color: allTestsPassed ? 'var(--cyber-accent)' : testResults.length > 0 ? 'var(--cyber-secondary)' : 'var(--cyber-primary)'}}>
                      {allTestsPassed ? <CheckCircle/> : testResults.length > 0 ? <XCircle/> : <Terminal/>} Test Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {testResults.length === 0 && <p className="cyber-text text-center py-8">Run your code to see test results here.</p>}
                    {allTestsPassed && <div className="p-4 border border-green-400/30 bg-green-400/10 rounded-lg text-green-300 font-semibold text-center">🎉 Challenge Complete! You earned {selectedChallenge.points} XP. All tests passed.</div>}
                    {testResults.map((r, i) => <div key={i} className={cn("p-3 border rounded-lg", r.success ? 'border-green-400/30 bg-green-400/10' : 'border-red-400/30 bg-red-400/10')}>
                      <div className="flex justify-between items-center mb-2 font-semibold">
                        <span className={cn(r.success ? 'text-green-300' : 'text-red-300')}>Test Case {i+1}: {r.success ? "Passed" : "Failed"}</span>
                        <span className="text-xs font-mono cyber-text">{r.executionTime}ms</span>
                      </div>
                      <div className="font-mono text-xs cyber-text space-y-1">
                        <div><strong className="text-cyber-text-bright">Input:</strong> {JSON.stringify(selectedChallenge.testCases[i].input)}</div>
                        <div><strong className="text-cyber-text-bright">Expected:</strong> {JSON.stringify(selectedChallenge.testCases[i].expectedOutput)}</div>
                        <div className={cn(r.success ? "text-green-300" : "text-red-300")}><strong className="text-cyber-text-bright">Got:</strong> {JSON.stringify(r.output)}</div>
                        {r.error && <div className="text-red-300"><strong className="text-cyber-text-bright">Error:</strong> {r.error}</div>}
                      </div>
                    </div>)}
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
