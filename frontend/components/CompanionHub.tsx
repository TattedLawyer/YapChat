'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    MessageCircle,
    Heart,
    Star,
    Calendar,
    BookOpen,
    Settings,
    Home,
    ArrowLeft,
    Sparkles,
    Gift
} from 'lucide-react'

interface Character {
    id: string
    name: string
    type: string
    icon: string
    color: string
    bgGradient: string
}

interface RelationshipData {
    level: number
    experience: number
    memories: Array<{
        id: string
        content: string
        timestamp: Date
        type: 'conversation' | 'milestone' | 'activity'
    }>
    daysTogether: number
    unlockedContent: string[]
}

interface CompanionHubProps {
    character: Character
    relationshipData: RelationshipData
    onStartChat: () => void
    onBack: () => void
    onUpdateRelationship: (data: RelationshipData) => void
}

const getTimeBasedGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
}

const getTimeBasedBackground = (characterId: string) => {
    const hour = new Date().getHours()
    const baseGradients = {
        aria: {
            morning: 'from-pink-100 via-rose-50 to-orange-100',
            afternoon: 'from-pink-50 via-rose-100 to-pink-200',
            evening: 'from-purple-100 via-pink-100 to-indigo-200'
        },
        sage: {
            morning: 'from-green-100 via-emerald-50 to-teal-100',
            afternoon: 'from-green-50 via-emerald-100 to-green-200',
            evening: 'from-blue-100 via-green-100 to-teal-200'
        },
        riley: {
            morning: 'from-orange-100 via-yellow-50 to-amber-100',
            afternoon: 'from-orange-50 via-yellow-100 to-orange-200',
            evening: 'from-red-100 via-orange-100 to-pink-200'
        },
        alex: {
            morning: 'from-purple-100 via-violet-50 to-indigo-100',
            afternoon: 'from-purple-50 via-violet-100 to-purple-200',
            evening: 'from-indigo-100 via-purple-100 to-violet-200'
        }
    }

    const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
    return baseGradients[characterId as keyof typeof baseGradients]?.[timeOfDay] || 'from-blue-50 to-purple-50'
}

const getCharacterMood = (characterId: string, relationshipLevel: number) => {
    const moods = {
        aria: {
            1: "I guess... you're not completely hopeless. 💗",
            2: "You're actually kind of interesting, but don't let it go to your head! 😤",
            3: "Maybe I do enjoy our time together... just a little bit! 💕"
        },
        sage: {
            1: "Our journey together has just begun, young one. I sense great potential. 🌱",
            2: "Your wisdom grows with each passing day. I am honored to guide you. 🌟",
            3: "You have become a true friend and student. Our bond runs deep. 💫"
        },
        riley: {
            1: "This is so exciting! We're going to have the BEST time together! 🎉",
            2: "You're like, the coolest person ever! I love hanging out with you! ✨",
            3: "You're my absolute favorite human! Best friends forever! 💖"
        },
        alex: {
            1: "There's something magnetic about you... I'm drawn to your essence. 💜",
            2: "Your soul speaks to mine in ways I never expected. Beautiful. 🌙",
            3: "We are connected by something deeper than words can express. ✨"
        }
    }

    return moods[characterId as keyof typeof moods]?.[relationshipLevel as keyof typeof moods.aria] ||
        moods[characterId as keyof typeof moods]?.[1] ||
        "Hello, dear friend."
}

export default function CompanionHub({
    character,
    relationshipData,
    onStartChat,
    onBack,
    onUpdateRelationship
}: CompanionHubProps) {
    const [showMemories, setShowMemories] = useState(false)
    const [characterMood, setCharacterMood] = useState('')

    useEffect(() => {
        setCharacterMood(getCharacterMood(character.id, relationshipData.level))
    }, [character.id, relationshipData.level])

    const timeBasedBg = getTimeBasedBackground(character.id)
    const greeting = getTimeBasedGreeting()

    const experienceToNextLevel = relationshipData.level * 100
    const progressPercentage = (relationshipData.experience / experienceToNextLevel) * 100

    const quickActions = [
        {
            icon: MessageCircle,
            label: 'Chat',
            action: onStartChat,
            color: 'bg-blue-500 hover:bg-blue-600',
            description: 'Start a conversation'
        },
        {
            icon: BookOpen,
            label: 'Memories',
            action: () => setShowMemories(true),
            color: 'bg-purple-500 hover:bg-purple-600',
            description: 'View shared memories'
        },
        {
            icon: Gift,
            label: 'Activities',
            action: () => { }, // TODO: Implement activities
            color: 'bg-green-500 hover:bg-green-600',
            description: 'Fun activities together',
            disabled: !relationshipData.unlockedContent.includes('activities')
        }
    ]

    return (
        <div className={`min-h-screen bg-gradient-to-br ${timeBasedBg}`}>
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2 text-gray-700"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="hidden sm:inline">Back</span>
                </button>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Day {relationshipData.daysTogether}</span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 pb-8">
                {/* Character Display */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    {/* Large Character Avatar */}
                    <motion.div
                        className="text-8xl mb-4 cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{
                            y: [0, -10, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        {character.icon}
                    </motion.div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {greeting}, it's {character.name}!
                    </h1>

                    <motion.p
                        className="text-lg text-gray-700 mb-6 max-w-md mx-auto"
                        key={characterMood}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {characterMood}
                    </motion.p>
                </motion.div>

                {/* Relationship Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card rounded-2xl p-6 mb-8"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Heart className="w-5 h-5 text-red-500" />
                            <span className="font-semibold text-gray-900">
                                Relationship Level {relationshipData.level}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>{relationshipData.experience} XP</span>
                        </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <motion.div
                            className="bg-gradient-to-r from-pink-500 to-purple-600 h-3 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                        />
                    </div>

                    <div className="flex justify-between text-sm text-gray-600">
                        <span>{relationshipData.experience} / {experienceToNextLevel} to next level</span>
                        <span>{Math.round(progressPercentage)}%</span>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
                >
                    {quickActions.map((action, index) => (
                        <motion.button
                            key={action.label}
                            onClick={action.action}
                            disabled={action.disabled}
                            className={`glass-card rounded-xl p-6 text-center transition-all duration-200 hover:scale-105 ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg cursor-pointer'
                                }`}
                            whileHover={action.disabled ? {} : { y: -2 }}
                            whileTap={action.disabled ? {} : { scale: 0.98 }}
                        >
                            <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mx-auto mb-3 transition-colors`}>
                                <action.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">{action.label}</h3>
                            <p className="text-sm text-gray-600">{action.description}</p>
                            {action.disabled && (
                                <div className="mt-2">
                                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                        Unlock at Level 2
                                    </span>
                                </div>
                            )}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Recent Activity */}
                {relationshipData.memories.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="glass-card rounded-2xl p-6"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-purple-500" />
                            Recent Memories
                        </h3>
                        <div className="space-y-3">
                            {relationshipData.memories.slice(-3).map((memory) => (
                                <div key={memory.id} className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                                    <div className="text-2xl">{character.icon}</div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-700">{memory.content}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {memory.timestamp.toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Memories Modal */}
            {showMemories && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={() => setShowMemories(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass-card rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Shared Memories</h2>
                            <button
                                onClick={() => setShowMemories(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {relationshipData.memories.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No memories yet. Start chatting to create some!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {relationshipData.memories.map((memory) => (
                                    <div key={memory.id} className="p-4 bg-white/30 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-lg">{character.icon}</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {memory.type === 'conversation' ? 'Conversation' :
                                                    memory.type === 'milestone' ? 'Milestone' : 'Activity'}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 mb-2">{memory.content}</p>
                                        <p className="text-xs text-gray-500">
                                            {memory.timestamp.toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </div>
    )
} 