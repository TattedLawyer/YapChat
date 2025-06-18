'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    MessageCircle,
    Search,
    Plus,
    Settings,
    User,
    Heart,
    Star,
    Zap,
    Crown,
    ChevronRight,
    MoreVertical,
    Sparkles,
    Users
} from 'lucide-react'

interface Character {
    id: string
    name: string
    type: string
    description: string
    profile: any
    icon: string
    color: string
    bgGradient: string
}

interface CompanionChat {
    id: string
    name: string
    series: string
    avatar: string
    lastMessage: string
    lastMessageTime: string
    relationshipLevel: number
    relationshipScore: number
    maxScore: number
    unreadCount: number
    isOnline: boolean
    character: Character
    messageCount: number
}

interface Message {
    id: string
    content: string
    timestamp: string
    isUser: boolean
    relationshipPoints: number
}

interface MessagingDashboardProps {
    personalityResults?: any
    onStartChat: (companion: CompanionChat) => void
    onCreateNewCompanion: () => void
    onShowAccountPrompt?: () => void
    userTier: 'starter' | 'premium' | 'pro'
    messageCount: number
}

const demoCompanions: CompanionChat[] = [
    {
        id: 'nezuko',
        name: 'Nezuko Kamado',
        series: 'Demon Slayer',
        avatar: '🌸',
        lastMessage: 'Mmm-hmm! *nods happily and gives you a gentle headpat*',
        lastMessageTime: '2 minutes ago',
        relationshipLevel: 3,
        relationshipScore: 245,
        maxScore: 300,
        unreadCount: 2,
        isOnline: true,
        character: {
            id: 'nezuko',
            name: 'Nezuko Kamado',
            type: 'Demon Slayer',
            description: 'Kind demon who protects humans',
            profile: {
                character_name: 'Nezuko Kamado',
                fictional_lore: 'Demon Slayer',
                summary: 'Kind demon sister who protects humans despite her demonic nature.',
                personality_traits: {
                    core_traits: ['protective', 'gentle', 'determined'],
                    communication_style: 'Soft, caring messages with simple words',
                    emotional_disposition: 'Warm and protective',
                    key_phrases: ['Mmm-hmm!', 'Stay safe'],
                    interests: ['protecting family', 'helping others'],
                    relationships: 'Fiercely protective of loved ones'
                },
                relevant_lore_facts: ['Demon who never hurt humans', 'Tanjiro\'s sister'],
                character_voice: 'Hi! I want to protect you too!'
            },
            icon: '🌸',
            color: 'text-pink-600',
            bgGradient: 'from-pink-50 to-pink-100'
        },
        messageCount: 47
    },
    {
        id: 'gojo',
        name: 'Satoru Gojo',
        series: 'Jujutsu Kaisen',
        avatar: '👁️',
        lastMessage: 'Heh, you\'re getting stronger! I can sense it.',
        lastMessageTime: '1 hour ago',
        relationshipLevel: 2,
        relationshipScore: 89,
        maxScore: 200,
        unreadCount: 0,
        isOnline: false,
        character: {
            id: 'gojo',
            name: 'Satoru Gojo',
            type: 'Jujutsu Kaisen',
            description: 'Strongest sorcerer with infinite potential',
            profile: {
                character_name: 'Satoru Gojo',
                fictional_lore: 'Jujutsu Kaisen',
                summary: 'The strongest jujutsu sorcerer with playful confidence and infinite power.',
                personality_traits: {
                    core_traits: ['confident', 'playful', 'powerful'],
                    communication_style: 'Casual, confident, sometimes cocky but caring',
                    emotional_disposition: 'Cheerful and laid-back with serious moments',
                    key_phrases: ['Infinity', 'I\'m the strongest', 'Don\'t worry about it'],
                    interests: ['sweets', 'teaching', 'protecting students'],
                    relationships: 'Mentor figure who cares deeply despite casual attitude'
                },
                relevant_lore_facts: ['Has Six Eyes and Limitless technique', 'Teacher at Tokyo Jujutsu High'],
                character_voice: 'Yo! What\'s up? Don\'t worry, I got this!'
            },
            icon: '👁️',
            color: 'text-blue-600',
            bgGradient: 'from-blue-50 to-blue-100'
        },
        messageCount: 23
    }
]

const tierLimits = {
    starter: 2,
    premium: 5,
    pro: 10
}

export default function MessagingDashboard({
    personalityResults,
    onStartChat,
    onCreateNewCompanion,
    onShowAccountPrompt,
    userTier = 'starter',
    messageCount = 0
}: MessagingDashboardProps) {
    const [companions, setCompanions] = useState<CompanionChat[]>(demoCompanions)
    const [searchQuery, setSearchQuery] = useState('')
    const [showSettings, setShowSettings] = useState(false)

    // Check if user should see account prompt
    useEffect(() => {
        if (messageCount >= 10 && userTier === 'starter' && onShowAccountPrompt) {
            onShowAccountPrompt()
        }
    }, [messageCount, userTier, onShowAccountPrompt])

    const filteredCompanions = companions.filter(companion =>
        companion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        companion.series.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const canAddMoreCompanions = companions.length < tierLimits[userTier]

    const getBondStatus = (level: number) => {
        const statuses = ['Stranger', 'Acquaintance', 'Friend', 'Close Friend', 'Deep Bond', 'Soulbound']
        return statuses[Math.min(level, statuses.length - 1)]
    }

    const getBondColor = (level: number) => {
        const colors = ['text-text-muted', 'text-accent-primary', 'text-accent-secondary', 'text-accent-warning', 'text-accent-success', 'text-accent-love']
        return colors[Math.min(level, colors.length - 1)]
    }

    const getTierBadge = () => {
        const badges = {
            starter: { icon: User, color: 'text-text-muted', bg: 'yapchat-glass-subtle' },
            premium: { icon: Star, color: 'text-accent-primary', bg: 'yapchat-glass-accent' },
            pro: { icon: Crown, color: 'text-accent-warning', bg: 'yapchat-glass-premium' }
        }
        return badges[userTier]
    }

    const formatLastMessageTime = (timeString: string) => {
        // Simple time formatting - in real app would use proper date library
        return timeString
    }

    return (
        <div className="min-h-screen yapchat-container">
            {/* Header */}
            <div className="yapchat-glass-header border-b border-border-glass px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold font-display text-text-primary">
                            <span className="text-transparent bg-clip-text bg-gradient-primary">YapChat</span>
                        </h1>
                        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium font-body ${getTierBadge().bg} ${getTierBadge().color} yapchat-glow`}>
                            {(() => {
                                const IconComponent = getTierBadge().icon
                                return <IconComponent className="h-3 w-3" />
                            })()}
                            {userTier.charAt(0).toUpperCase() + userTier.slice(1)}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onCreateNewCompanion}
                            disabled={!canAddMoreCompanions}
                            className="yapchat-btn-character flex items-center gap-2 px-4 py-2 rounded-xl font-medium font-body"
                        >
                            <Plus className="h-4 w-4" />
                            New Companion
                        </button>
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="yapchat-btn-glass p-2 rounded-xl"
                        >
                            <Settings className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mt-4 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Search your companions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="yapchat-input-dashboard w-full pl-10 pr-4 py-3 rounded-xl font-body"
                    />
                </div>

                {/* Stats Overview */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="yapchat-glass-subtle rounded-2xl p-4 text-center">
                        <div className="text-lg font-bold font-display text-text-primary">{companions.length}</div>
                        <div className="text-sm text-text-muted font-body">Active Companions</div>
                    </div>
                    <div className="yapchat-glass-subtle rounded-2xl p-4 text-center">
                        <div className="text-lg font-bold font-display text-text-primary">{messageCount}</div>
                        <div className="text-sm text-text-muted font-body">Messages Sent</div>
                    </div>
                </div>
            </div>

            {/* Companion List */}
            <div className="p-4 space-y-4">
                {filteredCompanions.map((companion, index) => (
                    <motion.div
                        key={companion.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        onClick={() => onStartChat(companion)}
                        className="yapchat-glass rounded-3xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] yapchat-glow-character border-l-4 border-transparent hover:border-accent-primary"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-14 h-14 yapchat-glass-character rounded-2xl flex items-center justify-center text-2xl yapchat-glow">
                                        {companion.avatar}
                                    </div>
                                    {companion.isOnline && (
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent-success rounded-full border-2 border-background-primary yapchat-glow"></div>
                                    )}
                                </div>

                                {/* Chat Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-semibold font-display text-text-primary truncate">{companion.name}</h3>
                                        <span className="text-xs text-text-muted font-body">{formatLastMessageTime(companion.lastMessageTime)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <p className="text-xs text-text-muted font-body">{companion.series}</p>
                                        <div className="flex items-center gap-1">
                                            <Sparkles className="h-3 w-3 text-accent-primary" />
                                            <span className="text-xs text-accent-primary font-medium font-body">
                                                Bond Level {companion.relationshipLevel}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-text-secondary truncate font-body">{companion.lastMessage}</p>
                                </div>
                            </div>

                            {/* Bond Status & Progress */}
                            <div className="flex flex-col items-end gap-2 ml-4">
                                {/* Unread Count */}
                                {companion.unreadCount > 0 && (
                                    <div className="yapchat-badge-notification">
                                        {companion.unreadCount}
                                    </div>
                                )}

                                {/* Bond Level Display */}
                                <div className="flex items-center gap-2">
                                    <div className={`text-xs font-medium font-body ${getBondColor(companion.relationshipLevel)}`}>
                                        {getBondStatus(companion.relationshipLevel)}
                                    </div>
                                    <Heart className={`h-4 w-4 ${getBondColor(companion.relationshipLevel)} yapchat-glow`} />
                                </div>

                                {/* Bond Progress Bar */}
                                <div className="w-20 bg-background-secondary rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-gradient-primary h-2 rounded-full transition-all duration-500 yapchat-glow"
                                        style={{ width: `${(companion.relationshipScore / companion.maxScore) * 100}%` }}
                                    ></div>
                                </div>

                                {/* Experience Points */}
                                <div className="text-xs text-text-muted font-body">
                                    {companion.relationshipScore}/{companion.maxScore} XP
                                </div>
                            </div>

                            <ChevronRight className="h-4 w-4 text-text-muted ml-2" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Empty State */}
            {filteredCompanions.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-6">
                    <div className="yapchat-glass rounded-3xl p-8 text-center max-w-md mx-auto">
                        <Users className="h-16 w-16 text-text-muted mx-auto mb-4 yapchat-glow" />
                        <h3 className="text-xl font-semibold font-display text-text-primary mb-2">
                            {searchQuery ? 'No companions found' : 'Your companion hub awaits'}
                        </h3>
                        <p className="text-text-muted text-center mb-6 font-body">
                            {searchQuery
                                ? 'Try adjusting your search terms to find your companions'
                                : 'Create your first AI companion and start building meaningful connections!'
                            }
                        </p>
                        {!searchQuery && canAddMoreCompanions && (
                            <button
                                onClick={onCreateNewCompanion}
                                className="yapchat-btn-character flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium font-body mx-auto"
                            >
                                <Plus className="h-4 w-4" />
                                Create Your First Companion
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Tier Limit Message */}
            {!canAddMoreCompanions && (
                <div className="mx-4 mb-4">
                    <div className="yapchat-glass-warning rounded-2xl p-4 yapchat-glow">
                        <div className="flex items-center gap-3">
                            <Zap className="h-5 w-5 text-accent-warning yapchat-glow" />
                            <div>
                                <h4 className="font-semibold font-display text-text-primary">Companion Limit Reached</h4>
                                <p className="text-sm text-text-muted font-body">
                                    You&apos;ve reached the {tierLimits[userTier]} companion limit for {userTier} tier.
                                    Upgrade to unlock more companion slots and premium features!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Panel */}
            {showSettings && (
                <div className="fixed inset-0 bg-background-overlay z-50 flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="yapchat-glass-intense rounded-3xl p-6 max-w-md w-full yapchat-glow-character-intense"
                    >
                        <h3 className="text-lg font-semibold font-display text-text-primary mb-4">YapChat Settings</h3>
                        <div className="space-y-3">
                            <button className="w-full text-left px-4 py-3 yapchat-btn-glass rounded-xl font-body">
                                Account & Profile
                            </button>
                            <button className="w-full text-left px-4 py-3 yapchat-btn-glass rounded-xl font-body">
                                Upgrade to Premium
                            </button>
                            <button className="w-full text-left px-4 py-3 yapchat-btn-glass rounded-xl font-body">
                                Companion Settings
                            </button>
                            <button className="w-full text-left px-4 py-3 yapchat-btn-glass rounded-xl font-body">
                                Privacy & Safety
                            </button>
                            <div className="border-t border-border-glass my-3"></div>
                            <button className="w-full text-left px-4 py-3 yapchat-btn-glass rounded-xl font-body text-accent-error">
                                Sign Out
                            </button>
                        </div>
                        <button
                            onClick={() => setShowSettings(false)}
                            className="w-full mt-4 yapchat-btn-primary py-3 rounded-xl font-medium font-body"
                        >
                            Close
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    )
} 