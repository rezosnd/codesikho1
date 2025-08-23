"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Play, CheckCircle, XCircle, Lightbulb, Code, Trophy, ArrowLeft, Settings } from "lucide-react"
import { type CodingChallenge, codingChallenges } from "@/lib/coding-challenges"
import { runAllTestCases, type ExecutionResult } from "@/lib/code-execution"
import { submitQuizResult } from "@/lib/quiz-service"

interface CodingChallengeInterfaceProps {
  onBack: () => void
}

export function CodingChallengeInterface({ onBack }: CodingChallengeInterfaceProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<CodingChallenge | null>(null)
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState<"javascript" | "python">("javascript")
  const [testResults, setTestResults] = useState<ExecutionResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [challengeStartTime, setChallengeStartTime] = useState<Date | null>(null)
  const [showSolution, setShowSolution] = useState(false)
  const { user, userProfile } = useAuth()

  const editorRef = useRef<HTMLTextAreaElement>(null)

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
      setShowSolution(false)
    }
  }, [selectedChallenge, language])

  const startChallenge = (challenge: CodingChallenge) => {
    setSelectedChallenge(challenge)
    setCode(challenge.starterCode[language])
    setTestResults([])
    setShowHints(false)
    setShowSolution(false)
    setTimeLeft(challenge.timeLimit || 1800)
    setChallengeStartTime(new Date())
  }

  const runCode = async () => {
    if (!selectedChallenge || !code.trim()) return

    setIsRunning(true)
    try {
      const results = await runAllTestCases(code, language, selectedChallenge.testCases)
      setTestResults(results)

      // Check if all tests passed
      const allPassed = results.every((result) => result.success)
      if (allPassed && user && userProfile && challengeStartTime) {
        const timeSpent = Math.floor((Date.now() - challengeStartTime.getTime()) / 1000)
        const xpEarned = selectedChallenge.points

        await submitQuizResult(
          user.uid,
          {
            quizId: selectedChallenge.id,
            score: 100,
            totalQuestions: selectedChallenge.testCases.length,
            correctAnswers: selectedChallenge.testCases.length,
            timeSpent,
            xpEarned,
            completedAt: new Date(),
          },
          userProfile,
        )
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

  if (!selectedChallenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Coding Challenges
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
            {codingChallenges.map((challenge) => (
              <Card
                key={challenge.id}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 transform hover:scale-105"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">{challenge.title}</CardTitle>
                    <Badge
                      variant={
                        challenge.difficulty === "easy"
                          ? "secondary"
                          : challenge.difficulty === "medium"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {challenge.difficulty}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="border-purple-400 text-purple-400 w-fit">
                    {challenge.topic}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">{challenge.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {Math.floor((challenge.timeLimit || 1800) / 60)} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy size={16} />
                      {challenge.points} XP
                    </span>
                  </div>
                  <Button
                    onClick={() => startChallenge(challenge)}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  >
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setSelectedChallenge(null)}
              variant="outline"
              size="sm"
              className="border-slate-600 text-gray-400"
            >
              <ArrowLeft size={16} />
            </Button>
            <h1 className="text-2xl font-bold text-white">{selectedChallenge.title}</h1>
            <Badge
              variant={
                selectedChallenge.difficulty === "easy"
                  ? "secondary"
                  : selectedChallenge.difficulty === "medium"
                    ? "default"
                    : "destructive"
              }
            >
              {selectedChallenge.difficulty}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <Clock size={20} />
              <span className="text-xl font-mono">{formatTime(timeLeft)}</span>
            </div>
            <Button
              onClick={runCode}
              disabled={isRunning || !code.trim()}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Play className="mr-2" size={16} />
              {isRunning ? "Running..." : "Run Code"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problem Description */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Code size={20} />
                  Problem Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed">
                    {selectedChallenge.description}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Test Results */}
            {testResults.length > 0 && (
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    {allTestsPassed ? (
                      <CheckCircle className="text-green-400" size={20} />
                    ) : (
                      <XCircle className="text-red-400" size={20} />
                    )}
                    Test Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {testResults.map((result, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          result.success ? "border-green-400/30 bg-green-400/10" : "border-red-400/30 bg-red-400/10"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-semibold">Test Case {index + 1}</span>
                          {result.success ? (
                            <CheckCircle className="text-green-400" size={16} />
                          ) : (
                            <XCircle className="text-red-400" size={16} />
                          )}
                        </div>
                        <div className="text-sm text-gray-400">
                          <div>Input: {JSON.stringify(selectedChallenge.testCases[index].input)}</div>
                          <div>Expected: {JSON.stringify(selectedChallenge.testCases[index].expectedOutput)}</div>
                          <div>Got: {JSON.stringify(result.output)}</div>
                          {result.error && <div className="text-red-400">Error: {result.error}</div>}
                          <div>Time: {result.executionTime}ms</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {allTestsPassed && (
                    <div className="mt-4 p-4 bg-green-400/10 border border-green-400/30 rounded-lg">
                      <div className="text-green-400 font-semibold mb-2">🎉 Challenge Completed!</div>
                      <div className="text-gray-300 text-sm">
                        You earned {selectedChallenge.points} XP! All test cases passed successfully.
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Hints */}
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Lightbulb size={20} />
                    Hints
                  </CardTitle>
                  <Button
                    onClick={() => setShowHints(!showHints)}
                    variant="outline"
                    size="sm"
                    className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 bg-transparent"
                  >
                    {showHints ? "Hide" : "Show"} Hints
                  </Button>
                </div>
              </CardHeader>
              {showHints && (
                <CardContent>
                  <div className="space-y-2">
                    {selectedChallenge.hints.map((hint, index) => (
                      <div key={index} className="p-3 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
                        <div className="text-yellow-400 text-sm">
                          <strong>Hint {index + 1}:</strong> {hint}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Code Editor */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Code Editor</CardTitle>
                  <Tabs value={language} onValueChange={(value) => setLanguage(value as "javascript" | "python")}>
                    <TabsList className="bg-slate-800">
                      <TabsTrigger value="javascript" className="text-yellow-400">
                        JavaScript
                      </TabsTrigger>
                      <TabsTrigger value="python" className="text-blue-400">
                        Python
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <textarea
                    ref={editorRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-96 bg-slate-900 text-gray-300 font-mono text-sm p-4 rounded-lg border border-slate-700 focus:border-cyan-400 focus:outline-none resize-none"
                    placeholder="Write your code here..."
                    spellCheck={false}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Solution */}
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings size={20} />
                    Solution
                  </CardTitle>
                  <Button
                    onClick={() => setShowSolution(!showSolution)}
                    variant="outline"
                    size="sm"
                    className="border-purple-400 text-purple-400 hover:bg-purple-400/10 bg-transparent"
                  >
                    {showSolution ? "Hide" : "Show"} Solution
                  </Button>
                </div>
              </CardHeader>
              {showSolution && (
                <CardContent>
                  <pre className="bg-slate-900 p-4 rounded-lg text-gray-300 font-mono text-sm overflow-x-auto">
                    <code>{selectedChallenge.solution[language]}</code>
                  </pre>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
