'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'

const questions = [
    {
        id: 1,
        dimension: 'openness',
        question: "I enjoy exploring new ideas and concepts, even if they seem unconventional.",
        category: "Openness to Experience"
    },
    {
        id: 2,
        dimension: 'conscientiousness',
        question: "I prefer to plan my activities well in advance rather than being spontaneous.",
        category: "Conscientiousness"
    },
    {
        id: 3,
        dimension: 'extraversion',
        question: "I feel energized when I'm around other people and in social situations.",
        category: "Extraversion"
    },
    {
        id: 4,
        dimension: 'agreeableness',
        question: "I tend to trust others and believe people generally have good intentions.",
        category: "Agreeableness"
    },
    {
        id: 5,
        dimension: 'neuroticism',
        question: "I often worry about things that might go wrong in the future.",
        category: "Emotional Stability"
    },
    {
        id: 6,
        dimension: 'humor_style',
        question: "I enjoy making others laugh, even if it means being a bit silly or absurd.",
        category: "Humor Style"
    },
    {
        id: 7,
        dimension: 'communication_style',
        question: "I prefer direct, straightforward communication over subtle hints.",
        category: "Communication Style"
    },
    {
        id: 8,
        dimension: 'relationship_style',
        question: "I prefer having a few close relationships rather than many casual friendships.",
        category: "Relationship Style"
    },
    // Second round of questions
    {
        id: 9,
        dimension: 'openness',
        question: "I often question established traditions and ways of doing things.",
        category: "Openness to Experience"
    },
    {
        id: 10,
        dimension: 'conscientiousness',
        question: "I am known for being reliable and following through on my commitments.",
        category: "Conscientiousness"
    },
    {
        id: 11,
        dimension: 'extraversion',
        question: "I often take the lead in group situations and enjoy being the center of attention.",
        category: "Extraversion"
    },
    {
        id: 12,
        dimension: 'agreeableness',
        question: "I find it easy to empathize with others and understand their perspectives.",
        category: "Agreeableness"
    },
    {
        id: 13,
        dimension: 'neuroticism',
        question: "I remain calm and composed even in stressful or challenging situations.",
        category: "Emotional Stability"
    },
    {
        id: 14,
        dimension: 'humor_style',
        question: "I appreciate witty, clever humor more than slapstick or physical comedy.",
        category: "Humor Style"
    },
    {
        id: 15,
        dimension: 'communication_style',
        question: "I enjoy long, detailed conversations about topics that interest me.",
        category: "Communication Style"
    },
    {
        id: 16,
        dimension: 'relationship_style',
        question: "I value loyalty and long-term commitment in my relationships.",
        category: "Relationship Style"
    }
]

const responseOptions = [
    { value: 1, label: "Strongly Disagree", color: "bg-red-100 text-red-800 border-red-200" },
    { value: 2, label: "Disagree", color: "bg-orange-100 text-orange-800 border-orange-200" },
    { value: 3, label: "Neutral", color: "bg-gray-100 text-gray-800 border-gray-200" },
    { value: 4, label: "Agree", color: "bg-blue-100 text-blue-800 border-blue-200" },
    { value: 5, label: "Strongly Agree", color: "bg-green-100 text-green-800 border-green-200" }
]

interface PersonalityTestProps {
    onComplete: (results: Record<string, number>) => void
    onBack?: () => void
}

export default function PersonalityTest({ onComplete, onBack }: PersonalityTestProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<Record<number, number>>({})
    const [isCompleting, setIsCompleting] = useState(false)

    const handleAnswer = (questionId: number, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }))
    }

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1)
        } else {
            handleComplete()
        }
    }

    const prevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1)
        }
    }

    const handleComplete = async () => {
        setIsCompleting(true)

        // Calculate personality scores
        const dimensionScores: Record<string, number[]> = {}

        questions.forEach(question => {
            const answer = answers[question.id]
            if (answer) {
                if (!dimensionScores[question.dimension]) {
                    dimensionScores[question.dimension] = []
                }
                // Convert 1-5 scale to 0-1 scale, with special handling for neuroticism (reversed)
                let normalizedScore = (answer - 1) / 4
                if (question.dimension === 'neuroticism' && question.id === 13) {
                    normalizedScore = 1 - normalizedScore // Reverse for emotional stability question
                }
                dimensionScores[question.dimension].push(normalizedScore)
            }
        })

        // Average scores for each dimension
        const results: Record<string, number> = {}
        Object.entries(dimensionScores).forEach(([dimension, scores]) => {
            results[dimension] = scores.reduce((sum, score) => sum + score, 0) / scores.length
        })

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500))

        onComplete(results)
    }

    const progress = ((currentQuestion + 1) / questions.length) * 100
    const isAnswered = answers[questions[currentQuestion].id] !== undefined

    if (isCompleting) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto"
                >
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-6"></div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Analyzing Your Personality
                    </h3>
                    <p className="text-gray-600">
                        Creating your unique personality profile...
                    </p>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-8 px-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Personality Assessment
                    </h1>
                    <p className="text-gray-600">
                        Answer 16 questions to discover your perfect AI companion
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Question {currentQuestion + 1} of {questions.length}</span>
                        <span>{Math.round(progress)}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                            className="bg-primary-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="glass-card rounded-2xl p-8 mb-8"
                    >
                        <div className="mb-6">
                            <div className="text-sm font-medium text-primary-600 mb-2">
                                {questions[currentQuestion].category}
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
                                {questions[currentQuestion].question}
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {responseOptions.map((option) => (
                                <motion.button
                                    key={option.value}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleAnswer(questions[currentQuestion].id, option.value)}
                                    className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${answers[questions[currentQuestion].id] === option.value
                                            ? `${option.color} border-current shadow-md`
                                            : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{option.label}</span>
                                        {answers[questions[currentQuestion].id] === option.value && (
                                            <CheckCircle className="w-5 h-5" />
                                        )}
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={currentQuestion === 0 ? onBack : prevQuestion}
                        className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        {currentQuestion === 0 ? 'Back to Home' : 'Previous'}
                    </button>

                    <button
                        onClick={nextQuestion}
                        disabled={!isAnswered}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${isAnswered
                                ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
} 