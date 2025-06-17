'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, CheckCircle, User, Heart, Star, Brain, MessageCircle } from 'lucide-react'

interface ConversationalQuestion {
    id: string
    type: 'select' | 'multiselect' | 'text' | 'textarea' | 'scale'
    question: string
    subtitle?: string
    category: string
    options?: { value: string; label: string; emoji?: string }[]
    placeholder?: string
    scaleLabels?: { min: string; max: string }
}

// Hybrid conversational questions with age verification first
const conversationalQuestions: ConversationalQuestion[] = [
    // Age Verification (Question 1)
    {
        id: 'age_verification',
        type: 'text',
        question: "How old are you?",
        subtitle: "We need to verify your age to provide age-appropriate content. You must be at least 13 years old to use this application.",
        category: "Age Verification",
        placeholder: "Enter your age in years (e.g., 18, 25, etc.)"
    },

    // Character Inspiration & Basic Preferences (Questions 2-4)
    {
        id: 'favorite_character',
        type: 'text',
        question: "Who's your favorite fictional character?",
        subtitle: "This could be from any anime, movie, book, game, or TV show",
        category: "Character Inspiration",
        placeholder: "e.g., Hermione Granger, Gojo Satoru, Tyrion Lannister..."
    },
    {
        id: 'character_source',
        type: 'text',
        question: "What are they from?",
        subtitle: "The series, movie, book, or game where this character appears",
        category: "Character Inspiration",
        placeholder: "e.g., Harry Potter, Jujutsu Kaisen, Game of Thrones..."
    },
    {
        id: 'companion_gender',
        type: 'text',
        question: "What gender would you like your companion to be?",
        subtitle: "Just type whatever feels right to you - male, female, non-binary, etc.",
        category: "Companion Preferences",
        placeholder: "e.g., female, male, non-binary, doesn't matter..."
    },

    // User's Personality & Emotional Needs (Questions 4-7)
    {
        id: 'emotional_support_need',
        type: 'multiselect',
        question: "When you're going through something difficult, what do you need most?",
        subtitle: "Select all that help you feel better - you can choose multiple options",
        category: "Emotional Needs",
        options: [
            { value: 'someone_listen', label: 'Someone to listen and understand', emoji: '👂' },
            { value: 'practical_help', label: 'Practical advice and solutions', emoji: '💡' },
            { value: 'distraction_fun', label: 'Distraction and something fun', emoji: '🎉' },
            { value: 'gentle_encouragement', label: 'Gentle encouragement and motivation', emoji: '🌟' }
        ]
    },
    {
        id: 'social_energy',
        type: 'select',
        question: "How do you typically recharge and feel your best?",
        subtitle: "What gives you energy vs. what drains you?",
        category: "Personal Energy",
        options: [
            { value: 'alone_time', label: 'Quiet time alone with my thoughts', emoji: '🌙' },
            { value: 'deep_conversations', label: 'Deep, meaningful conversations', emoji: '💭' },
            { value: 'social_interaction', label: 'Being around people and socializing', emoji: '👥' },
            { value: 'creative_activities', label: 'Creative or hands-on activities', emoji: '🎨' }
        ]
    },
    {
        id: 'stress_response',
        type: 'select',
        question: "When you're stressed or overwhelmed, you tend to:",
        subtitle: "Your natural response when things get tough",
        category: "Coping Style",
        options: [
            { value: 'withdraw_process', label: 'Withdraw and process things internally', emoji: '🤔' },
            { value: 'talk_it_out', label: 'Talk it out with someone I trust', emoji: '💬' },
            { value: 'stay_busy', label: 'Stay busy and keep moving forward', emoji: '⚡' },
            { value: 'seek_comfort', label: 'Seek comfort and reassurance', emoji: '🤗' }
        ]
    },
    {
        id: 'relationship_values',
        type: 'multiselect',
        question: "What do you value in close relationships?",
        subtitle: "Select all that are important to you - you can choose multiple",
        category: "Relationship Values",
        options: [
            { value: 'loyalty_trust', label: 'Loyalty and unwavering trust', emoji: '🛡️' },
            { value: 'intellectual_connection', label: 'Intellectual connection and growth', emoji: '🧠' },
            { value: 'emotional_intimacy', label: 'Deep emotional intimacy and understanding', emoji: '💙' },
            { value: 'shared_adventures', label: 'Shared experiences and adventures', emoji: '🌍' }
        ]
    },

    // Life Approach & Interests (Questions 8-10)
    {
        id: 'life_approach',
        type: 'select',
        question: "Which describes your general approach to life?",
        subtitle: "How you tend to navigate the world",
        category: "Life Philosophy",
        options: [
            { value: 'careful_thoughtful', label: 'Careful and thoughtful - I like to plan ahead', emoji: '📋' },
            { value: 'spontaneous_adaptable', label: 'Spontaneous and adaptable - I go with the flow', emoji: '🌊' },
            { value: 'ambitious_driven', label: 'Ambitious and driven - I pursue my goals actively', emoji: '🎯' },
            { value: 'peaceful_content', label: 'Peaceful and content - I appreciate simple pleasures', emoji: '🌸' }
        ]
    },
    {
        id: 'curiosity_style',
        type: 'multiselect',
        question: "What kind of topics genuinely fascinate you?",
        subtitle: "Select all that make you light up when discussing them",
        category: "Intellectual Interests",
        options: [
            { value: 'people_psychology', label: 'People, psychology, and human nature', emoji: '🧭' },
            { value: 'ideas_philosophy', label: 'Big ideas, philosophy, and meaning', emoji: '🌌' },
            { value: 'creative_arts', label: 'Creative arts, stories, and imagination', emoji: '🎭' },
            { value: 'practical_world', label: 'How things work and practical knowledge', emoji: '⚙️' }
        ]
    },
    {
        id: 'what_attracts_character',
        type: 'textarea',
        question: "What specifically draws you to your favorite character?",
        subtitle: "The traits, qualities, or aspects of their personality that resonate with you",
        category: "Character Connection",
        placeholder: "Their strength in adversity, their loyalty to friends, their intelligence and wit, their complexity..."
    },

    // Companion Relationship Dynamics (Questions 11-12)
    {
        id: 'ideal_companion_role',
        type: 'multiselect',
        question: "What roles would you want your ideal companion to play in your life?",
        subtitle: "Select all that would be meaningful to you",
        category: "Companion Role",
        options: [
            { value: 'trusted_confidant', label: 'A trusted confidant who truly knows me', emoji: '🤝' },
            { value: 'intellectual_partner', label: 'An intellectual partner who challenges my thinking', emoji: '🎓' },
            { value: 'emotional_support', label: 'A source of emotional support and comfort', emoji: '💝' },
            { value: 'adventure_companion', label: 'A companion for life\'s adventures and experiences', emoji: '🗺️' }
        ]
    },
    {
        id: 'connection_pace',
        type: 'multiselect',
        question: "How do you naturally form deep connections?",
        subtitle: "Select all the ways you build meaningful relationships",
        category: "Connection Style",
        options: [
            { value: 'gradual_trust', label: 'Gradually, as trust builds over time', emoji: '🌱' },
            { value: 'instant_chemistry', label: 'Quickly when there\'s natural chemistry', emoji: '✨' },
            { value: 'shared_experiences', label: 'Through shared experiences and memories', emoji: '📸' },
            { value: 'deep_conversations', label: 'Through meaningful conversations and vulnerability', emoji: '💭' }
        ]
    }
]

interface PersonalityResults {
    preferences: Record<string, any>
    personality: Record<string, number>
    insights: string[]
    conversationalStyle: {
        communicationPreference: string
        energyLevel: string
        humorStyle: string
        supportStyle: string
        responseLength: string
    }
    ageVerification: {
        age: number
        isAdult: boolean
        contentRestrictions: {
            allowMildRomantic: boolean
            allowFlirting: boolean
            allowNSFW: boolean
        }
    }
}

interface PersonalityTestProps {
    onComplete: (results: PersonalityResults) => void
    onBack?: () => void
}

export default function PersonalityTest({ onComplete, onBack }: PersonalityTestProps) {
    const [phase, setPhase] = useState<'intro' | 'questions' | 'completing'>('intro')
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, any>>({})

    const currentQuestion = conversationalQuestions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / conversationalQuestions.length) * 100

    const handleAnswer = (questionId: string, value: any) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }))
    }

    const nextQuestion = () => {
        if (currentQuestionIndex < conversationalQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1)
        } else {
            handleComplete()
        }
    }

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1)
        }
    }

    const handleComplete = async () => {
        // Check age verification first
        const age = parseInt(answers.age_verification) || 0

        if (age < 13) {
            alert("Sorry, you must be at least 13 years old to use this application. Please come back when you're older.")
            return
        }

        setPhase('completing')

        // Process answers into personality insights
        const insights = generatePersonalityInsights(answers)
        const conversationalStyle = extractConversationalStyle(answers)
        const personalityScores = calculatePersonalityScores(answers)

        // Process age verification and content restrictions
        const isAdult = age >= 18
        const ageVerification = {
            age,
            isAdult,
            contentRestrictions: {
                allowMildRomantic: age >= 16,  // Mild romantic content at 16+
                allowFlirting: age >= 16,      // Light flirting at 16+
                allowNSFW: age >= 18           // NSFW content only at 18+
            }
        }

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000))

        const results: PersonalityResults = {
            preferences: answers,
            personality: personalityScores,
            insights,
            conversationalStyle,
            ageVerification
        }

        onComplete(results)
    }

    const generatePersonalityInsights = (answers: Record<string, any>) => {
        const insights: string[] = []

        // Emotional needs insights
        if (answers.emotional_support_need === 'someone_listen') {
            insights.push("You value being truly heard and understood above all else")
        } else if (answers.emotional_support_need === 'practical_help') {
            insights.push("You appreciate practical solutions and actionable advice")
        } else if (answers.emotional_support_need === 'distraction_fun') {
            insights.push("You cope best when you can shift focus to positive experiences")
        }

        // Social energy insights
        if (answers.social_energy === 'alone_time') {
            insights.push("You're introspective and recharge through solitude and reflection")
        } else if (answers.social_energy === 'deep_conversations') {
            insights.push("You're energized by meaningful, authentic connections")
        } else if (answers.social_energy === 'social_interaction') {
            insights.push("You thrive on social energy and interpersonal connections")
        }

        // Stress response insights
        if (answers.stress_response === 'withdraw_process') {
            insights.push("You're a thoughtful processor who needs space to work through challenges")
        } else if (answers.stress_response === 'talk_it_out') {
            insights.push("You find clarity and relief through open communication")
        }

        // Life approach insights
        if (answers.life_approach === 'careful_thoughtful') {
            insights.push("You're naturally cautious and prefer to think things through")
        } else if (answers.life_approach === 'spontaneous_adaptable') {
            insights.push("You're flexible and comfortable with uncertainty")
        } else if (answers.life_approach === 'ambitious_driven') {
            insights.push("You're goal-oriented and motivated by achievement")
        }

        // Character connection insights
        if (answers.favorite_character && answers.what_attracts_character) {
            insights.push(`Your admiration for ${answers.favorite_character} reveals you value ${answers.what_attracts_character.toLowerCase()}`)
        }

        // Intellectual interests insights (can be multiple)
        if (answers.curiosity_style && Array.isArray(answers.curiosity_style)) {
            const interests = answers.curiosity_style
            if (interests.includes('people_psychology')) {
                insights.push("You're fascinated by human nature and what makes people tick")
            }
            if (interests.includes('ideas_philosophy')) {
                insights.push("You love exploring big ideas and the deeper meaning of things")
            }
            if (interests.includes('creative_arts')) {
                insights.push("You're drawn to creativity, stories, and imaginative expression")
            }
            if (interests.includes('practical_world')) {
                insights.push("You enjoy understanding how things work and practical knowledge")
            }
        }

        // Relationship values insights (can be multiple)
        if (answers.relationship_values && Array.isArray(answers.relationship_values)) {
            const values = answers.relationship_values
            if (values.includes('loyalty_trust')) {
                insights.push("Loyalty and trust form the foundation of your meaningful relationships")
            }
            if (values.includes('intellectual_connection')) {
                insights.push("You seek partners who can engage with you intellectually and help you grow")
            }
            if (values.includes('emotional_intimacy')) {
                insights.push("Deep emotional connection and vulnerability are essential to you")
            }
            if (values.includes('shared_adventures')) {
                insights.push("You value shared experiences and creating memories together")
            }
        }

        // Companion role insights (can be multiple)
        if (answers.ideal_companion_role && Array.isArray(answers.ideal_companion_role)) {
            const roles = answers.ideal_companion_role
            if (roles.includes('trusted_confidant')) {
                insights.push("You want a companion who truly knows and understands you")
            }
            if (roles.includes('intellectual_partner')) {
                insights.push("You value intellectual stimulation and growth in relationships")
            }
            if (roles.includes('emotional_support')) {
                insights.push("You appreciate having a reliable source of emotional comfort")
            }
            if (roles.includes('adventure_companion')) {
                insights.push("You want to share life's experiences and adventures with your companion")
            }
        }

        // Connection style insights (can be multiple)
        if (answers.connection_pace && Array.isArray(answers.connection_pace)) {
            const styles = answers.connection_pace
            if (styles.includes('gradual_trust')) {
                insights.push("You prefer building connections slowly as trust develops over time")
            }
            if (styles.includes('instant_chemistry')) {
                insights.push("You can form quick connections when there's natural chemistry")
            }
            if (styles.includes('shared_experiences')) {
                insights.push("You bond through shared activities and creating memories together")
            }
            if (styles.includes('deep_conversations')) {
                insights.push("You connect through meaningful dialogue and emotional vulnerability")
            }
        }

        return insights
    }

    const extractConversationalStyle = (answers: Record<string, any>) => {
        // Handle multiple curiosity styles
        let communicationPreference = 'balanced'
        if (answers.curiosity_style && Array.isArray(answers.curiosity_style)) {
            communicationPreference = answers.curiosity_style.join(', ')
        } else if (answers.curiosity_style) {
            communicationPreference = answers.curiosity_style
        }

        return {
            communicationPreference,
            energyLevel: answers.social_energy || 'moderate',
            humorStyle: 'character_determined', // Let character personality determine this
            supportStyle: answers.emotional_support_need || 'empathetic',
            responseLength: 'character_determined' // Let character personality determine this
        }
    }

    const calculatePersonalityScores = (answers: Record<string, any>) => {
        const scores: Record<string, number> = {}

        // Map answers to Big Five personality dimensions

        // Openness to Experience
        if (answers.curiosity_style && Array.isArray(answers.curiosity_style)) {
            if (answers.curiosity_style.includes('ideas_philosophy')) {
                scores.openness = (scores.openness || 0) + 0.9
            }
            if (answers.curiosity_style.includes('creative_arts')) {
                scores.openness = (scores.openness || 0) + 0.8
            }
            if (answers.curiosity_style.includes('people_psychology')) {
                scores.openness = (scores.openness || 0) + 0.6
            }
        } else if (answers.curiosity_style === 'ideas_philosophy') {
            scores.openness = 0.9
        } else if (answers.curiosity_style === 'creative_arts') {
            scores.openness = 0.8
        }
        if (answers.life_approach === 'spontaneous_adaptable') scores.openness = (scores.openness || 0) + 0.3

        // Extraversion
        if (answers.social_energy === 'social_interaction') scores.extraversion = 0.8
        if (answers.social_energy === 'deep_conversations') scores.extraversion = 0.6
        if (answers.social_energy === 'alone_time') scores.extraversion = 0.2

        // Conscientiousness
        if (answers.life_approach === 'careful_thoughtful') scores.conscientiousness = 0.8
        if (answers.life_approach === 'ambitious_driven') scores.conscientiousness = 0.7
        if (answers.connection_pace && Array.isArray(answers.connection_pace)) {
            if (answers.connection_pace.includes('gradual_trust')) {
                scores.conscientiousness = (scores.conscientiousness || 0) + 0.2
            }
        } else if (answers.connection_pace === 'gradual_trust') {
            scores.conscientiousness = (scores.conscientiousness || 0) + 0.2
        }

        // Agreeableness
        if (answers.emotional_support_need === 'someone_listen') scores.agreeableness = 0.8
        if (answers.relationship_values && Array.isArray(answers.relationship_values)) {
            if (answers.relationship_values.includes('emotional_intimacy')) {
                scores.agreeableness = (scores.agreeableness || 0) + 0.7
            }
            if (answers.relationship_values.includes('loyalty_trust')) {
                scores.agreeableness = (scores.agreeableness || 0) + 0.3
            }
        }
        if (answers.stress_response === 'seek_comfort') scores.agreeableness = (scores.agreeableness || 0) + 0.2

        // Neuroticism (emotional stability - lower scores = more stable)
        if (answers.stress_response === 'withdraw_process') scores.neuroticism = 0.6
        if (answers.stress_response === 'stay_busy') scores.neuroticism = 0.4
        if (answers.life_approach === 'peaceful_content') scores.neuroticism = 0.3

        return scores
    }

    const isCurrentAnswered = () => {
        const answer = answers[currentQuestion.id]

        // Special validation for age verification
        if (currentQuestion.id === 'age_verification') {
            const age = parseInt(answer) || 0
            return age >= 13 && age <= 120 // Reasonable age range
        }

        if (currentQuestion.type === 'multiselect') {
            return Array.isArray(answer) && answer.length > 0
        }
        return answer !== undefined && answer !== ''
    }

    // Intro Phase
    if (phase === 'intro') {
        return (
            <div className="min-h-screen yapchat-container flex items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="yapchat-glass rounded-4xl p-8 max-w-2xl mx-auto text-center yapchat-glow-character"
                >
                    <div className="flex justify-center mb-6">
                        <div className="yapchat-glass-character p-4 rounded-3xl yapchat-glow-character-intense">
                            <MessageCircle className="h-12 w-12 text-accent-primary" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold font-display text-text-primary mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-primary">
                            ✨ Let&apos;s Find Your Perfect Companion
                        </span>
                    </h1>

                    <p className="text-lg text-text-secondary mb-8 leading-relaxed font-body">
                        🌟 I&apos;m excited to help you find your perfect anime/fantasy companion! I just have a few questions
                        about your personality and what draws you to characters. This feels more like a friendly chat than a test.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="yapchat-glass-subtle rounded-2xl p-4 yapchat-glow">
                            <User className="h-8 w-8 text-accent-primary mx-auto mb-2 yapchat-glow" />
                            <h3 className="font-semibold font-display text-text-primary mb-1">✨ Your Personality</h3>
                            <p className="text-sm text-text-muted font-body">Your unique traits & energy</p>
                        </div>

                        <div className="yapchat-glass-subtle rounded-2xl p-4 yapchat-glow">
                            <Heart className="h-8 w-8 text-accent-love mx-auto mb-2 yapchat-glow" />
                            <h3 className="font-semibold font-display text-text-primary mb-1">🌟 Your Inspiration</h3>
                            <p className="text-sm text-text-muted font-body">Anime/fantasy characters you love</p>
                        </div>

                        <div className="yapchat-glass-subtle rounded-2xl p-4 yapchat-glow">
                            <Star className="h-8 w-8 text-accent-warning mx-auto mb-2 yapchat-glow" />
                            <h3 className="font-semibold font-display text-text-primary mb-1">💕 Perfect Match</h3>
                            <p className="text-sm text-text-muted font-body">Your ideal companion connection</p>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="yapchat-btn-glass px-6 py-3 rounded-xl font-body"
                            >
                                ← Back
                            </button>
                        )}

                        <button
                            onClick={() => setPhase('questions')}
                            className="yapchat-btn-character px-8 py-3 rounded-xl font-semibold font-body"
                        >
                            Ready to Start! 🚀
                        </button>
                    </div>
                </motion.div>
            </div>
        )
    }

    // Completing Phase
    if (phase === 'completing') {
        return (
            <div className="min-h-screen yapchat-container flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="yapchat-glass rounded-3xl p-12 text-center max-w-md mx-auto yapchat-glow-character"
                >
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent-primary mx-auto mb-6 yapchat-glow"></div>
                    <h3 className="text-xl font-semibold font-display text-text-primary mb-2">
                        ✨ Finding Your Perfect Companion Match
                    </h3>
                    <p className="text-text-muted font-body">
                        🔮 Analyzing your personality and preferences to find your ideal companion...
                    </p>
                </motion.div>
            </div>
        )
    }

    // Questions Phase
    return (
        <div className="min-h-screen yapchat-container py-8 px-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="text-sm font-medium text-accent-primary font-body">
                            Question {currentQuestionIndex + 1} of {conversationalQuestions.length}
                        </span>
                        <span className="text-sm text-text-muted font-body">
                            • {currentQuestion.category}
                        </span>
                    </div>

                    <div className="w-full bg-background-secondary rounded-full h-3 mb-4 overflow-hidden">
                        <motion.div
                            className="bg-gradient-primary h-3 rounded-full yapchat-glow"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestionIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="yapchat-glass rounded-3xl p-8 mb-8 yapchat-glow"
                    >
                        <div className="text-center mb-8">
                            {currentQuestion.type === 'multiselect' && (
                                <div className="yapchat-badge-notification inline-flex items-center gap-2 px-3 py-1 text-sm font-medium mb-4 font-body">
                                    <CheckCircle className="h-4 w-4" />
                                    Multiple selections allowed
                                </div>
                            )}
                            <h2 className="text-2xl font-semibold font-display text-text-primary leading-relaxed mb-3">
                                {currentQuestion.question}
                            </h2>
                            {currentQuestion.subtitle && (
                                <p className="text-text-secondary text-lg font-body">
                                    {currentQuestion.subtitle}
                                </p>
                            )}
                        </div>

                        {/* Answer Options */}
                        <div className="space-y-4">
                            {currentQuestion.type === 'select' ? (
                                <div className="space-y-3">
                                    {currentQuestion.options?.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleAnswer(currentQuestion.id, option.value)}
                                            className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left yapchat-glow ${answers[currentQuestion.id] === option.value
                                                    ? 'border-accent-primary yapchat-glass-accent text-text-primary'
                                                    : 'border-border-glass yapchat-glass-subtle hover:border-accent-primary'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    {option.emoji && (
                                                        <span className="text-2xl">{option.emoji}</span>
                                                    )}
                                                    <span className="font-medium font-body">{option.label}</span>
                                                </div>
                                                {answers[currentQuestion.id] === option.value && (
                                                    <CheckCircle className="h-5 w-5 text-accent-primary yapchat-glow" />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : currentQuestion.type === 'multiselect' ? (
                                <div className="space-y-3">
                                    {currentQuestion.options?.map((option) => {
                                        const selectedValues = answers[currentQuestion.id] || []
                                        const isSelected = selectedValues.includes(option.value)

                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    const currentValues = answers[currentQuestion.id] || []
                                                    let newValues
                                                    if (isSelected) {
                                                        newValues = currentValues.filter((v: string) => v !== option.value)
                                                    } else {
                                                        newValues = [...currentValues, option.value]
                                                    }
                                                    handleAnswer(currentQuestion.id, newValues)
                                                }}
                                                className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left yapchat-glow ${isSelected
                                                        ? 'border-accent-primary yapchat-glass-accent text-text-primary'
                                                        : 'border-border-glass yapchat-glass-subtle hover:border-accent-primary'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        {option.emoji && (
                                                            <span className="text-2xl">{option.emoji}</span>
                                                        )}
                                                        <span className="font-medium font-body">{option.label}</span>
                                                    </div>
                                                    {isSelected && (
                                                        <CheckCircle className="h-5 w-5 text-accent-primary yapchat-glow" />
                                                    )}
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            ) : currentQuestion.type === 'text' ? (
                                <input
                                    type="text"
                                    placeholder={currentQuestion.placeholder}
                                    value={answers[currentQuestion.id] || ''}
                                    onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                                    className="yapchat-input-dashboard w-full p-4 rounded-2xl text-lg font-body"
                                />
                            ) : (
                                <textarea
                                    placeholder={currentQuestion.placeholder}
                                    value={answers[currentQuestion.id] || ''}
                                    onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                                    rows={4}
                                    className="yapchat-input-dashboard w-full p-4 rounded-2xl text-lg resize-none font-body"
                                />
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={prevQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="yapchat-btn-glass flex items-center gap-2 px-6 py-3 rounded-xl font-body disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </button>

                    <button
                        onClick={nextQuestion}
                        disabled={!isCurrentAnswered()}
                        className="yapchat-btn-character flex items-center gap-2 px-6 py-3 rounded-xl font-semibold font-body disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {currentQuestionIndex === conversationalQuestions.length - 1 ? (
                            <>Create My Companion! ✨</>
                        ) : (
                            <>
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
} 