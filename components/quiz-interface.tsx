"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, Trophy, CheckCircle, XCircle } from "lucide-react"
import { type Quiz, quizzes } from "@/lib/quiz-data"
import { submitQuizResult, type QuizResult } from "@/lib/quiz-service"

interface QuizInterfaceProps {
  onBack: () => void
}

export function QuizInterface({ onBack }: QuizInterfaceProps) {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null)
  const [loading, setLoading] = useState(false)
  const { user, userProfile } = useAuth()

  useEffect(() => {
    if (selectedQuiz && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && selectedQuiz && !showResults) {
      handleQuizComplete()
    }
  }, [timeLeft, selectedQuiz, showResults])

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    setCurrentQuestion(0)
    setSelectedAnswers(new Array(quiz.questions.length).fill(-1))
    setShowResults(false)
    setTimeLeft(quiz.timeLimit || 600)
    setQuizStartTime(new Date())
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < selectedQuiz!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleQuizComplete()
    }
  }

  const handleQuizComplete = async () => {
    if (!selectedQuiz || !user || !userProfile || !quizStartTime) return

    setLoading(true)

    const correctAnswers = selectedAnswers.reduce((count, answer, index) => {
      return answer === selectedQuiz.questions[index].correctAnswer ? count + 1 : count
    }, 0)

    const score = Math.round((correctAnswers / selectedQuiz.questions.length) * 100)
    const xpEarned = Math.floor((correctAnswers / selectedQuiz.questions.length) * selectedQuiz.totalPoints)
    const timeSpent = Math.floor((Date.now() - quizStartTime.getTime()) / 1000)

    const result: QuizResult = {
      quizId: selectedQuiz.id,
      score,
      totalQuestions: selectedQuiz.questions.length,
      correctAnswers,
      timeSpent,
      xpEarned,
      completedAt: new Date(),
    }

    try {
      await submitQuizResult(user.uid, result, userProfile)
      setShowResults(true)
    } catch (error) {
      console.error("Error submitting quiz:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!selectedQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Code Quizzes
            </h1>
            <Button
              onClick={onBack}
              variant="outline"
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 bg-transparent"
            >
              Back to Dashboard
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map((quiz) => (
              <Card
                key={quiz.id}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{quiz.title}</CardTitle>
                    <Badge
                      variant={
                        quiz.difficulty === "beginner"
                          ? "secondary"
                          : quiz.difficulty === "intermediate"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {quiz.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">{quiz.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{quiz.questions.length} questions</span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {Math.floor((quiz.timeLimit || 600) / 60)} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy size={16} />
                      {quiz.totalPoints} XP
                    </span>
                  </div>
                  <Button
                    onClick={() => startQuiz(quiz)}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  >
                    Start Quiz
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
    const correctAnswers = selectedAnswers.reduce((count, answer, index) => {
      return answer === selectedQuiz.questions[index].correctAnswer ? count + 1 : count
    }, 0)
    const score = Math.round((correctAnswers / selectedQuiz.questions.length) * 100)

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl font-bold text-white mb-4">Quiz Complete!</CardTitle>
              <div className="text-6xl mb-4">{score >= 80 ? "🎉" : score >= 60 ? "👍" : "📚"}</div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-cyan-400">{score}%</div>
                  <div className="text-gray-400">Score</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-purple-400">
                    {correctAnswers}/{selectedQuiz.questions.length}
                  </div>
                  <div className="text-gray-400">Correct</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-400">
                    +{Math.floor((correctAnswers / selectedQuiz.questions.length) * selectedQuiz.totalPoints)}
                  </div>
                  <div className="text-gray-400">XP Earned</div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {selectedQuiz.questions.map((question, index) => (
                  <div key={question.id} className="bg-slate-800/30 p-4 rounded-lg text-left">
                    <div className="flex items-center gap-2 mb-2">
                      {selectedAnswers[index] === question.correctAnswer ? (
                        <CheckCircle className="text-green-400" size={20} />
                      ) : (
                        <XCircle className="text-red-400" size={20} />
                      )}
                      <span className="text-white font-semibold">Question {index + 1}</span>
                    </div>
                    <p className="text-gray-300 mb-2">{question.question}</p>
                    {question.code && (
                      <pre className="bg-slate-900 p-2 rounded text-cyan-400 text-sm mb-2">
                        <code>{question.code}</code>
                      </pre>
                    )}
                    <div className="text-sm">
                      <span className="text-gray-400">Correct answer: </span>
                      <span className="text-green-400">{question.options[question.correctAnswer]}</span>
                    </div>
                    {selectedAnswers[index] !== question.correctAnswer && (
                      <div className="text-sm">
                        <span className="text-gray-400">Your answer: </span>
                        <span className="text-red-400">
                          {selectedAnswers[index] >= 0 ? question.options[selectedAnswers[index]] : "Not answered"}
                        </span>
                      </div>
                    )}
                    <p className="text-gray-400 text-sm mt-2">{question.explanation}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={() => setSelectedQuiz(null)} className="bg-gradient-to-r from-cyan-500 to-blue-500">
                  Take Another Quiz
                </Button>
                <Button onClick={onBack} variant="outline" className="border-purple-400 text-purple-400 bg-transparent">
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const question = selectedQuiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / selectedQuiz.questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">{selectedQuiz.title}</h1>
            <Badge variant="outline" className="border-cyan-400 text-cyan-400">
              {currentQuestion + 1} / {selectedQuiz.questions.length}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-cyan-400">
            <Clock size={20} />
            <span className="text-xl font-mono">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <Progress value={progress} className="mb-8" />

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white text-xl">Question {currentQuestion + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-lg mb-4">{question.question}</p>

            {question.code && (
              <pre className="bg-slate-900 p-4 rounded-lg mb-6 overflow-x-auto">
                <code className="text-cyan-400">{question.code}</code>
              </pre>
            )}

            <div className="space-y-3 mb-6">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 ${
                    selectedAnswers[currentQuestion] === index
                      ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                      : "border-slate-600 bg-slate-800/30 text-gray-300 hover:border-slate-500"
                  }`}
                >
                  <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <Button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                variant="outline"
                className="border-slate-600 text-gray-400"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={selectedAnswers[currentQuestion] === -1 || loading}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                {loading
                  ? "Submitting..."
                  : currentQuestion === selectedQuiz.questions.length - 1
                    ? "Finish Quiz"
                    : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
