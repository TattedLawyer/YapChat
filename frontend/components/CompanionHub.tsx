'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    MessageCircle,
    Heart,
    Star,
    Calendar,
    BookOpen,
    ArrowLeft,
    Sparkles,
    Gift,
    Zap
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

const getCharacterMood = (character: any, relationshipLevel: number) => {
    // Use character's voice or generate based on personality
    const profile = character.profile
    if (profile?.character_voice) {
        return profile.character_voice
    }

    // Generate mood based on bond level
    const levelMoods = [
        "Nice to meet you! I'm looking forward to getting to know you better.",
        "I'm really enjoying our conversations together!",
        "You've become such an important part of my day. Thank you for being here."
    ]

    return levelMoods[Math.min(relationshipLevel - 1, levelMoods.length - 1)] || levelMoods[0]
}

const getBondStatus = (level: number) => {
    const statuses = ['Stranger', 'Acquaintance', 'Friend', 'Close Friend', 'Deep Bond', 'Soulbound']
    return statuses[Math.min(level, statuses.length - 1)]
}

const getBondColor = (level: number) => {
    const colors = ['text-text-muted', 'text-accent-primary', 'text-accent-secondary', 'text-accent-warning', 'text-accent-success', 'text-accent-love']
    return colors[Math.min(level, colors.length - 1)]
}

export default function CompanionHub({
    character,
    relationshipData,
    onStartChat,
    onBack
}: CompanionHubProps) {
    const [showMemories, setShowMemories] = useState(false)
    const [characterMood, setCharacterMood] = useState('')

    useEffect(() => {
        setCharacterMood(getCharacterMood(character, relationshipData.level))
    }, [character, relationshipData.level])

    const greeting = getTimeBasedGreeting()

    // RPG-style level progression
    const getLevelRequirements = (): number[] => {
        const baseXP = 100
        const levels = []

        for (let level = 1; level <= 20; level++) {
            if (level === 1) {
                levels.push(0)
            } else {
                const multiplier = level <= 5 ? 1.0 :
                    level <= 10 ? 1.5 :
                        level <= 15 ? 2.0 : 2.5
                const xpRequired = Math.floor(baseXP * Math.pow(level - 1, 2.2) * multiplier)
                levels.push(xpRequired)
            }
        }
        return levels
    }

    const levelRequirements = getLevelRequirements()

    const getCurrentLevelFromXP = (experience: number): number => {
        for (let i = levelRequirements.length - 1; i >= 0; i--) {
            if (experience >= levelRequirements[i]) {
                return i + 1
            }
        }
        return 1
    }

    const actualLevel = getCurrentLevelFromXP(relationshipData.experience)
    const currentLevelXP = levelRequirements[actualLevel - 1] || 0
    const nextLevelXP = levelRequirements[actualLevel] || levelRequirements[levelRequirements.length - 1]
    const experienceToNextLevel = actualLevel >= 20 ? 0 : nextLevelXP - relationshipData.experience
    const progressInLevel = relationshipData.experience - currentLevelXP
    const xpNeededForLevel = nextLevelXP - currentLevelXP
    const progressPercentage = actualLevel >= 20 ? 100 : (progressInLevel / xpNeededForLevel) * 100

    const bondStatus = getBondStatus(actualLevel)
    const bondColor = getBondColor(actualLevel)

    const quickActions = [
        {
            icon: MessageCircle,
            label: 'Start Chat',
            action: onStartChat,
            color: 'yapchat-btn-character',
            description: 'Continue your conversation'
        },
        {
            icon: BookOpen,
            label: 'Memories',
            action: () => setShowMemories(true),
            color: 'yapchat-btn-glass',
            description: 'View shared moments'
        },
        {
            icon: Gift,
            label: 'Activities',
            action: () => {
                alert('Activities feature coming soon! More interactive experiences will be added in future updates.')
            },
            color: 'yapchat-btn-glass',
            description: 'Fun activities together',
            disabled: !relationshipData.unlockedContent.includes('activities')
        }
    ]

    return (
        <div className="min-h-screen yapchat-container">
            {/* Header */}
            <div className="yapchat-glass-header border-b border-border-glass px-6 py-4">
                <div className="flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="yapchat-btn-glass p-2 rounded-xl flex items-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline font-body">Back to Hub</span>
                    </button>

                    <div className="flex items-center gap-2 text-sm text-text-muted font-body">
                        <Calendar className="w-4 h-4" />
                        <span>Day {relationshipData.daysTogether}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Character Display */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    {/* Large Character Avatar */}
                    <motion.div
                        className="yapchat-glass-character w-32 h-32 rounded-3xl flex items-center justify-center text-6xl mb-6 mx-auto cursor-pointer yapchat-glow-character-intense"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{
                            y: [0, -5, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        {character.icon}
                    </motion.div>

                    <h1 className="text-4xl font-bold font-display text-text-primary mb-3">
                        <span className="text-transparent bg-clip-text bg-gradient-primary">
                            {greeting}, it&apos;s {character.name}!
                        </span>
                    </h1>

                    <motion.p
                        className="text-lg text-text-secondary mb-6 max-w-md mx-auto font-body"
                        key={characterMood}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {characterMood}
                    </motion.p>
                </motion.div>

                {/* Bond Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="yapchat-glass rounded-3xl p-6 mb-8 yapchat-glow"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Heart className={`w-6 h-6 ${bondColor} yapchat-glow`} />
                            <div>
                                <span className="font-semibold font-display text-text-primary text-lg">
                                    Bond Level {actualLevel}
                                </span>
                                <div className={`text-sm font-body ${bondColor}`}>
                                    {bondStatus}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-text-muted font-body">
                            <Sparkles className="w-4 h-4 text-accent-primary" />
                            <span>{relationshipData.experience} XP</span>
                        </div>
                    </div>

                    <div className="w-full bg-background-secondary rounded-full h-4 mb-3 overflow-hidden">
                        <motion.div
                            className="bg-gradient-primary h-4 rounded-full yapchat-glow"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                        />
                    </div>

                    <div className="flex justify-between text-sm text-text-muted font-body">
                        <span>{relationshipData.experience} / {nextLevelXP} to next level</span>
                        <span>{Math.round(progressPercentage)}%</span>
                    </div>

                    {actualLevel >= 20 && (
                        <div className="mt-3 text-center">
                            <span className="yapchat-badge-premium font-body">
                                Maximum Bond Level Reached!
                            </span>
                        </div>
                    )}
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8"
                >
                    {quickActions.map((action) => (
                        <motion.button
                            key={action.label}
                            onClick={action.action}
                            disabled={action.disabled}
                            className={`yapchat-glass rounded-3xl p-6 text-center transition-all duration-300 yapchat-glow ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer yapchat-glow-character'
                                }`}
                            whileHover={action.disabled ? {} : { y: -4 }}
                            whileTap={action.disabled ? {} : { scale: 0.98 }}
                        >
                            <div className={`w-12 h-12 rounded-2xl ${action.color} flex items-center justify-center mx-auto mb-4 yapchat-glow`}>
                                <action.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-semibold font-display text-text-primary mb-2">{action.label}</h3>
                            <p className="text-sm text-text-muted font-body">{action.description}</p>
                            {action.disabled && (
                                <div className="mt-3">
                                    <span className="yapchat-badge-notification text-xs font-body">
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
                        className="yapchat-glass rounded-3xl p-6 yapchat-glow"
                    >
                        <h3 className="text-xl font-semibold font-display text-text-primary mb-6 flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-accent-primary yapchat-glow" />
                            Recent Memories
                        </h3>
                        <div className="space-y-4">
                            {relationshipData.memories.slice(-3).map((memory) => (
                                <div key={memory.id} className="yapchat-glass-subtle rounded-2xl p-4 yapchat-glow">
                                    <div className="flex items-start gap-4">
                                        <div className="yapchat-glass-character w-10 h-10 rounded-xl flex items-center justify-center text-lg yapchat-glow">
                                            {character.icon}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-text-primary font-body">{memory.content}</p>
                                            <p className="text-xs text-text-muted mt-2 font-body">
                                                {memory.timestamp.toLocaleDateString()}
                                            </p>
                                        </div>
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
                    className="fixed inset-0 bg-background-overlay flex items-center justify-center p-4 z-50"
                    onClick={() => setShowMemories(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="yapchat-glass-intense rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto yapchat-glow-character-intense"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold font-display text-text-primary">Shared Memories</h2>
                            <button
                                onClick={() => setShowMemories(false)}
                                className="yapchat-btn-glass p-2 rounded-xl"
                            >
                                ✕
                            </button>
                        </div>

                        {relationshipData.memories.length === 0 ? (
                            <div className="text-center py-12 text-text-muted">
                                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p className="font-body text-lg">No memories yet. Start chatting to create some!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {relationshipData.memories.map((memory) => (
                                    <div key={memory.id} className="yapchat-glass-subtle rounded-2xl p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="yapchat-glass-character w-8 h-8 rounded-xl flex items-center justify-center text-sm yapchat-glow">
                                                {character.icon}
                                            </div>
                                            <span className="text-sm font-medium font-body text-text-primary">
                                                {memory.type === 'conversation' ? 'Conversation' :
                                                    memory.type === 'milestone' ? 'Milestone' : 'Activity'}
                                            </span>
                                        </div>
                                        <p className="text-text-secondary mb-3 font-body">{memory.content}</p>
                                        <p className="text-xs text-text-muted font-body">
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