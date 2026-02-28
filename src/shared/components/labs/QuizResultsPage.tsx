import { useLocation, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

export default function ResultsPage() {
    const { state } = useLocation()
    const navigate = useNavigate()
    const [showConfetti, setShowConfetti] = useState(false)

    const {
        score,
        answers,
        questions,
        pointsPerQuestion,
    } = state

    const maxScore = questions.length * pointsPerQuestion
    const percentage = ((score / maxScore) * 100).toFixed(1)
    const passed = score >= maxScore * 0.6 // 60% passing threshold

    // Trigger confetti for high scores
    useEffect(() => {
        if (percentage >= 80) {
            setShowConfetti(true)
            setTimeout(() => setShowConfetti(false), 3000)
        }
    }, [percentage])

    // Calculate statistics
    const correctAnswers = questions.filter((q: any) => answers[q.id] === q.answer).length
    const incorrectAnswers = questions.length - correctAnswers
    const unanswered = questions.filter((q: any) => !answers[q.id]).length

    return (
        <div className="min-h-screen bg-muted/40 p-4 md:p-6 flex items-start justify-center overflow-y-auto">
            {/* Confetti effect for high scores (simplified) */}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                </div>
            )}

            <Card className="w-full max-w-4xl rounded-2xl shadow-xl border-2 border-border mt-4 md:mt-8">
                <CardHeader className="border-b border-border pb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl md:text-3xl font-bold">
                                Quiz Complete!
                            </CardTitle>
                            <p className="text-muted-foreground mt-1">
                                Here's how you performed
                            </p>
                        </div>

                        {/* Score circle */}
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-20 h-20 rounded-full flex items-center justify-center border-4",
                                passed ? "border-primary" : "border-destructive"
                            )}>
                                <span className={cn(
                                    "text-2xl font-bold",
                                    passed ? "text-primary" : "text-destructive"
                                )}>
                                    {percentage}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                        <div className="bg-muted/50 rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-primary">{score}</div>
                            <div className="text-xs text-muted-foreground">Final Score</div>
                        </div>
                        <div className="bg-muted/50 rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-primary">{correctAnswers}</div>
                            <div className="text-xs text-muted-foreground">Correct</div>
                        </div>
                        <div className="bg-muted/50 rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-destructive">{incorrectAnswers}</div>
                            <div className="text-xs text-muted-foreground">Incorrect</div>
                        </div>
                        <div className="bg-muted/50 rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-muted-foreground">{unanswered}</div>
                            <div className="text-xs text-muted-foreground">Unanswered</div>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4 space-y-1">
                        <div className="flex justify-between text-sm">
                            <span>Accuracy</span>
                            <span className="font-medium">{percentage}%</span>
                        </div>
                        <Progress value={Number(percentage)} className="h-2" />
                    </div>
                </CardHeader>

                <CardContent className="pt-6">
                    <div className="space-y-3">
                        <h3 className="font-semibold text-lg">Question Review</h3>

                        {questions.map((q: any, index: number) => {
                            const isCorrect = answers[q.id] === q.answer
                            const userAnswer = answers[q.id]
                            const isUnanswered = !userAnswer

                            return (
                                <div
                                    key={q.id}
                                    className={cn(
                                        "border rounded-xl p-4 transition-all hover:shadow-md",
                                        isCorrect
                                            ? "border-primary/50 bg-primary/5"
                                            : isUnanswered
                                                ? "border-muted bg-muted/20"
                                                : "border-destructive/50 bg-destructive/5"
                                    )}
                                >
                                    {/* Question header */}
                                    <div className="flex items-start gap-3 mb-3">
                                        <span className={cn(
                                            "w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium shrink-0",
                                            isCorrect
                                                ? "bg-primary text-primary-foreground"
                                                : isUnanswered
                                                    ? "bg-muted text-muted-foreground"
                                                    : "bg-destructive text-destructive-foreground"
                                        )}>
                                            {index + 1}
                                        </span>
                                        <p className="font-medium flex-1">
                                            {q.question}
                                        </p>
                                    </div>

                                    {/* Answers grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                        {/* User's answer */}
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground font-medium">Your Answer</p>
                                            <div className={cn(
                                                "p-2 rounded-lg border text-sm",
                                                isUnanswered
                                                    ? "border-muted bg-muted/30 text-muted-foreground"
                                                    : isCorrect
                                                        ? "border-primary bg-primary/10 text-foreground"
                                                        : "border-destructive bg-destructive/10 text-foreground"
                                            )}>
                                                {userAnswer || (
                                                    <span className="italic">Not answered</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Correct answer (show only if wrong or unanswered) */}
                                        {(!isCorrect || isUnanswered) && (
                                            <div className="space-y-1">
                                                <p className="text-xs text-muted-foreground font-medium">Correct Answer</p>
                                                <div className="p-2 rounded-lg border border-primary/30 bg-primary/5 text-sm">
                                                    {q.answer}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Summary message */}
                    <div className="mt-4 text-center">
                        <p className={cn(
                            "text-sm",
                            passed ? "text-primary" : "text-muted-foreground"
                        )}>
                            {passed
                                ? " Great job! You passed the quiz!"
                                : "Keep practicing! You'll do better next time!"}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}