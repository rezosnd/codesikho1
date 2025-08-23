"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, Trophy, CheckCircle, XCircle, ArrowLeft, BrainCircuit, Award, Repeat } from "lucide-react"
import { type Quiz, quizzes } from "@/lib/quiz-data"
import { submitQuizResult, type QuizResult } from "@/lib/quiz-service"
import { cn } from "@/lib/utils"

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
  const { user, userProfile, refreshUserProfile } = useAuth()
  
  // FIX 1: Add state to store the final results to be displayed
  const [finalResult, setFinalResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    if (selectedQuiz && timeLeft > 0 && !showResults) {
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
    setFinalResult(null); // Clear previous results
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
    
    // Calculate results locally first
    const correctAnswers = selectedAnswers.reduce((count, answer, index) => (answer === selectedQuiz.questions[index].correctAnswer ? count + 1 : count), 0)
    const score = Math.round((correctAnswers / selectedQuiz.questions.length) * 100)
    const xpEarned = Math.floor((score / 100) * selectedQuiz.totalPoints)
    const timeSpent = Math.floor((Date.now() - quizStartTime.getTime()) / 1000)
    const result: QuizResult = { quizId: selectedQuiz.id, score, totalQuestions: selectedQuiz.questions.length, correctAnswers, timeSpent, xpEarned, completedAt: new Date() }
    
    try {
      // Send the result to the backend
      const response = await submitQuizResult(user.uid, result, userProfile)
      
      // If the submission was successful...
      if(response.success) {
        setFinalResult(result); // FIX 2: Save the calculated result for display
        setShowResults(true);   // FIX 3: Trigger the results screen
        await refreshUserProfile(); // Refresh the user's global data
      }
    } catch (error) {
      console.error("Error submitting quiz:", error)
      // Optionally, you can add a state to show an error message to the user
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // --- View 1: Quiz Selection List (No Changes Here) ---
  if (!selectedQuiz) {
    return (
      <div className="min-h-screen cyber-bg-gradient cyber-grid p-6 animate-in fade-in">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3"><BrainCircuit className="h-10 w-10 cyber-text-primary cyber-glow" /><div><h1 className="text-4xl font-bold font-jura cyber-text-primary">Quiz Databank</h1><p className="cyber-text">Select Knowledge Packet</p></div></div>
            <Button onClick={onBack} variant="outline" className="cyber-button-outline"><ArrowLeft className="mr-2" size={16} /> Back to Hub</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map((quiz) => {
              const isCompleted = userProfile?.completedChallenges?.includes(quiz.id);
              return (
                <Card key={quiz.id} className={cn("cyber-card cyber-holo flex flex-col justify-between", isCompleted && "opacity-70")}>
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-xl font-jura cyber-text-bright">{quiz.title}</CardTitle>
                      {isCompleted ? (
                        <Badge variant="outline" className="border-green-400 text-green-400"><CheckCircle className="mr-1 h-3 w-3" />Completed</Badge>
                      ) : (
                        <Badge variant="outline" className={cn("capitalize text-xs", quiz.difficulty === 'beginner' && 'border-cyan-400 text-cyan-400', quiz.difficulty === 'intermediate' && 'border-yellow-400 text-yellow-400', quiz.difficulty === 'advanced' && 'border-red-400 text-red-400')}>{quiz.difficulty}</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="cyber-text text-sm mb-4 h-16 line-clamp-3">{quiz.description}</p>
                    <div className="flex items-center justify-between text-sm cyber-text mb-4 border-t border-cyber-border pt-4">
                      <span>{quiz.questions.length} Questions</span>
                      <span className="flex items-center gap-2"><Clock size={16} /> {Math.floor((quiz.timeLimit || 600) / 60)} min</span>
                      <span className="flex items-center gap-2"><Trophy size={16} /> {quiz.totalPoints} XP</span>
                    </div>
                    <Button onClick={() => startQuiz(quiz)} className={cn("w-full font-jura", isCompleted ? "cyber-button-outline" : "cyber-button")}>
                      {isCompleted ? "Play Again (No XP)" : "Start Quiz"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    )
  }
  
  // --- View 2: Quiz Results Screen (Updated to use finalResult state) ---
  if (showResults && finalResult) {
    return (
      <div className="min-h-screen cyber-bg-gradient cyber-grid flex items-center justify-center p-4 animate-in fade-in">
        <Card className="cyber-card w-full max-w-4xl">
          <CardHeader className="text-center">
            <Award className="mx-auto h-16 w-16 cyber-text-accent cyber-glow mb-4" />
            <CardTitle className="text-3xl font-jura cyber-text-primary cyber-glow">Results Analysis</CardTitle>
            <CardDescription className="cyber-text-bright text-lg">Knowledge Assimilation Complete.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center">
              <div className="cyber-card p-4 border-cyber-primary"><div className="text-4xl font-mono font-bold cyber-text-primary">{finalResult.score}%</div><div className="cyber-text text-sm">Score</div></div>
              <div className="cyber-card p-4 border-cyber-secondary"><div className="text-4xl font-mono font-bold cyber-text-secondary">{finalResult.correctAnswers}/{finalResult.totalQuestions}</div><div className="cyber-text text-sm">Correct</div></div>
              <div className="cyber-card p-4 border-cyber-accent"><div className="text-4xl font-mono font-bold cyber-text-accent">+{finalResult.xpEarned}</div><div className="cyber-text text-sm">XP Earned</div></div>
            </div>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 mb-8">
              {selectedQuiz.questions.map((q, i) => {
                const isCorrect = selectedAnswers[i] === q.correctAnswer;
                return (
                  <div key={q.id} className={cn("p-4 rounded-lg border", isCorrect ? "border-green-400/30 bg-green-400/10" : "border-red-400/30 bg-red-400/10")}>
                    <div className="flex items-center gap-3 mb-2">
                      {isCorrect ? <CheckCircle className="text-green-400 h-5 w-5" /> : <XCircle className="text-red-400 h-5 w-5" />}
                      <h4 className="font-semibold cyber-text-bright">{q.question}</h4>
                    </div>
                    {q.code && <pre className="cyber-code-block my-2"><code>{q.code}</code></pre>}
                    <div className="text-sm border-t border-cyber-border pt-2 mt-2">
                      <p className="text-green-400"><strong>Correct Answer:</strong> {q.options[q.correctAnswer]}</p>
                      {!isCorrect && <p className="text-red-400"><strong>Your Answer:</strong> {selectedAnswers[i] >= 0 ? q.options[selectedAnswers[i]] : "Not answered"}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-center gap-4 pt-4">
              <Button onClick={() => setSelectedQuiz(null)} className="cyber-button font-jura"><Repeat className="mr-2 h-4 w-4" /> Take Another Quiz</Button>
              <Button onClick={onBack} variant="outline" className="cyber-button-outline">Return to Hub</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const question = selectedQuiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / selectedQuiz.questions.length) * 100

  // --- View 3: Quiz Taking Interface (No Changes Here) ---
  return (
    <div className="min-h-screen cyber-bg-gradient cyber-grid p-4 md:p-8 animate-in fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4"><h1 className="text-2xl font-bold font-jura cyber-text-bright">{selectedQuiz.title}</h1><Badge variant="outline" className="border-cyan-400 text-cyan-400 font-mono text-sm">{currentQuestion + 1} / {selectedQuiz.questions.length}</Badge></div>
          <div className="flex items-center gap-2 text-cyan-400 cyber-glow"><Clock size={20} /><span className="text-xl font-mono">{formatTime(timeLeft)}</span></div>
        </div>
        <Progress value={progress} className="cyber-progress mb-8" />
        <Card className="cyber-card mb-8">
          <CardHeader><CardTitle className="text-xl md:text-2xl font-jura cyber-text-bright leading-tight">Question {currentQuestion + 1}: {question.question}</CardTitle></CardHeader>
          {question.code && <CardContent><pre className="cyber-code-block"><code>{question.code}</code></pre></CardContent>}
        </Card>
        <div className="grid grid-cols-1 md-grid-cols-2 gap-4 mb-8">
          {question.options.map((option, index) => (
            <button key={index} onClick={() => handleAnswerSelect(index)} className={cn("quiz-answer-button", selectedAnswers[currentQuestion] === index && "selected")}>
              <span className="font-mono cyber-text-primary mr-4">{String.fromCharCode(65 + index)}</span>
              <span className="text-lg">{option}</span>
            </button>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <Button onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))} disabled={currentQuestion === 0} variant="outline" className="cyber-button-outline">Previous</Button>
          <Button onClick={handleNext} disabled={selectedAnswers[currentQuestion] === -1 || loading} className="cyber-button font-jura">
            {loading ? "Submitting..." : currentQuestion === selectedQuiz.questions.length - 1 ? "Finish Quiz" : "Next Question"}
          </Button>
        </div>
      </div>
    </div>
  )
}
