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
    MoreVertical
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
    userTier: 'free' | 'premium' | 'ultimate'
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
    free: 2,
    premium: 5,
    ultimate: 10
}

export default function MessagingDashboard({
    personalityResults,
    onStartChat,
    onCreateNewCompanion,
    onShowAccountPrompt,
    userTier = 'free',
    messageCount = 0
}: MessagingDashboardProps) {
    const [companions, setCompanions] = useState<CompanionChat[]>(demoCompanions)
    const [searchQuery, setSearchQuery] = useState('')
    const [showSettings, setShowSettings] = useState(false)

    // Check if user should see account prompt
    useEffect(() => {
        if (messageCount >= 10 && userTier === 'free' && onShowAccountPrompt) {
            onShowAccountPrompt()
        }
    }, [messageCount, userTier, onShowAccountPrompt])

    const filteredCompanions = companions.filter(companion =>
        companion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        companion.series.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const canAddMoreCompanions = companions.length < tierLimits[userTier]

    const getRelationshipStatus = (level: number) => {
        const statuses = ['Stranger', 'Acquaintance', 'Friend', 'Close Friend', 'Best Friend', 'Soulmate']
        return statuses[Math.min(level, statuses.length - 1)]
    }

    const getRelationshipColor = (level: number) => {
        const colors = ['text-gray-500', 'text-blue-500', 'text-green-500', 'text-purple-500', 'text-pink-500', 'text-red-500']
        return colors[Math.min(level, colors.length - 1)]
    }

    const getTierBadge = () => {
        const badges = {
            free: { icon: User, color: 'text-gray-500', bg: 'bg-gray-100' },
            premium: { icon: Star, color: 'text-blue-500', bg: 'bg-blue-100' },
            ultimate: { icon: Crown, color: 'text-purple-500', bg: 'bg-purple-100' }
        }
        return badges[userTier]
    }

    const formatLastMessageTime = (timeString: string) => {
        // Simple time formatting - in real app would use proper date library
        return timeString
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900">YapChat</h1>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTierBadge().bg} ${getTierBadge().color}`}>
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
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            New Chat
                        </button>
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Settings className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mt-4 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search companions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Companion List */}
            <div className="divide-y divide-gray-200">
                {filteredCompanions.map((companion, index) => (
                    <motion.div
                        key={companion.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        onClick={() => onStartChat(companion)}
                        className="bg-white hover:bg-gray-50 px-6 py-4 cursor-pointer transition-colors border-l-4 border-transparent hover:border-purple-500"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                                        {companion.avatar}
                                    </div>
                                    {companion.isOnline && (
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                    )}
                                </div>

                                {/* Chat Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-semibold text-gray-900 truncate">{companion.name}</h3>
                                        <span className="text-xs text-gray-500">{formatLastMessageTime(companion.lastMessageTime)}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">{companion.series}</p>
                                    <p className="text-sm text-gray-600 truncate">{companion.lastMessage}</p>
                                </div>
                            </div>

                            {/* Relationship Status & Badges */}
                            <div className="flex flex-col items-end gap-2 ml-4">
                                {/* Unread Count */}
                                {companion.unreadCount > 0 && (
                                    <div className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {companion.unreadCount}
                                    </div>
                                )}

                                {/* Relationship Level */}
                                <div className="flex items-center gap-1">
                                    <div className={`text-xs font-medium ${getRelationshipColor(companion.relationshipLevel)}`}>
                                        Level {companion.relationshipLevel}
                                    </div>
                                    <Heart className={`h-3 w-3 ${getRelationshipColor(companion.relationshipLevel)}`} />
                                </div>

                                {/* Progress Bar */}
                                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                    <div
                                        className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                                        style={{ width: `${(companion.relationshipScore / companion.maxScore) * 100}%` }}
                                    ></div>
                                </div>

                                {/* Relationship Status */}
                                <div className={`text-xs ${getRelationshipColor(companion.relationshipLevel)}`}>
                                    {getRelationshipStatus(companion.relationshipLevel)}
                                </div>
                            </div>

                            <ChevronRight className="h-4 w-4 text-gray-400 ml-2" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Empty State */}
            {filteredCompanions.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-6">
                    <MessageCircle className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        {searchQuery ? 'No companions found' : 'No companions yet'}
                    </h3>
                    <p className="text-gray-500 text-center mb-6">
                        {searchQuery
                            ? 'Try adjusting your search terms'
                            : 'Start by creating your first AI companion!'
                        }
                    </p>
                    {!searchQuery && canAddMoreCompanions && (
                        <button
                            onClick={onCreateNewCompanion}
                            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Create Your First Companion
                        </button>
                    )}
                </div>
            )}

            {/* Tier Limit Message */}
            {!canAddMoreCompanions && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg m-6 p-4">
                    <div className="flex items-center gap-3">
                        <Zap className="h-5 w-5 text-yellow-600" />
                        <div>
                            <h4 className="font-semibold text-yellow-800">Companion Limit Reached</h4>
                            <p className="text-sm text-yellow-700">
                                You've reached the {tierLimits[userTier]} companion limit for {userTier} accounts.
                                Upgrade to add more companions!
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Panel */}
            {showSettings && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl p-6 max-w-md w-full"
                    >
                        <h3 className="text-lg font-semibold mb-4">Settings</h3>
                        <div className="space-y-3">
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg">
                                Account Settings
                            </button>
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg">
                                Upgrade Plan
                            </button>
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg">
                                Privacy & Safety
                            </button>
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg text-red-600">
                                Sign Out
                            </button>
                        </div>
                        <button
                            onClick={() => setShowSettings(false)}
                            className="w-full mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Close
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    )
} 