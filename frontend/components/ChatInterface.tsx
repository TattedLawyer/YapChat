'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send, Loader2, AlertCircle, Shield, Heart, Sparkles, Zap } from 'lucide-react'

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

interface Message {
    id: string
    content: string
    sender: 'user' | 'ai'
    timestamp: Date
    fallback?: boolean
}

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

interface ChatInterfaceProps {
    character: Character
    onBack: () => void
    relationshipData: RelationshipData
    onUpdateRelationship: (data: RelationshipData) => void
    personalityResults?: PersonalityResults | null
}

export default function ChatInterface({ character, onBack, relationshipData, onUpdateRelationship, personalityResults }: ChatInterfaceProps) {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState<Message[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // RPG-style level calculation
    const getCurrentLevelFromXP = (experience: number): number => {
        const baseXP = 100
        const levelRequirements = []

        for (let level = 1; level <= 20; level++) {
            if (level === 1) {
                levelRequirements.push(0)
            } else {
                const multiplier = level <= 5 ? 1.0 :
                    level <= 10 ? 1.5 :
                        level <= 15 ? 2.0 : 2.5
                const xpRequired = Math.floor(baseXP * Math.pow(level - 1, 2.2) * multiplier)
                levelRequirements.push(xpRequired)
            }
        }

        for (let i = levelRequirements.length - 1; i >= 0; i--) {
            if (experience >= levelRequirements[i]) {
                return i + 1
            }
        }
        return 1
    }

    const getBondStatus = (level: number) => {
        const statuses = ['Stranger', 'Acquaintance', 'Friend', 'Close Friend', 'Deep Bond', 'Soulbound']
        return statuses[Math.min(level, statuses.length - 1)]
    }

    const getBondColor = (level: number) => {
        const colors = ['text-text-muted', 'text-accent-primary', 'text-accent-secondary', 'text-accent-warning', 'text-accent-success', 'text-accent-love']
        return colors[Math.min(level, colors.length - 1)]
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Initialize with a natural first message from the character
    useEffect(() => {
        if (messages.length === 0) {
            // Send an empty first message to get the character's natural greeting
            const initializeChat = async () => {
                setIsTyping(true)
                try {
                    const response = await fetch('/api/chat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            message: "Hi",
                            characterProfile: (character as any).profile,
                            isFirstMessage: true,
                            userPersonality: personalityResults
                        }),
                    })

                    if (response.ok) {
                        const data = await response.json()

                        if (data.isMultiMessage && Array.isArray(data.response)) {
                            // Handle multiple messages
                            const greetingMessages: Message[] = data.response.map((msg: string, index: number) => ({
                                id: `greeting_${index + 1}`,
                                content: msg,
                                sender: 'ai' as const,
                                timestamp: new Date(Date.now() + index * 1000) // Slight delay between messages
                            }))
                            setMessages(greetingMessages)
                        } else {
                            // Single message
                            const greeting: Message = {
                                id: '1',
                                content: typeof data.response === 'string' ? data.response : data.response[0],
                                sender: 'ai',
                                timestamp: new Date()
                            }
                            setMessages([greeting])
                        }
                    }
                } catch (error) {
                    console.error('Error getting initial greeting:', error)
                    // Fallback to simple greeting
                    const greeting: Message = {
                        id: '1',
                        content: `Hey! What's up?`,
                        sender: 'ai',
                        timestamp: new Date()
                    }
                    setMessages([greeting])
                } finally {
                    setIsTyping(false)
                }
            }

            initializeChat()
        }
    }, [character.id, messages.length])

    const callChatAPI = async (userMessage: string): Promise<{ response: string | string[]; nsfwBlocked?: boolean; requiredLevel?: number; currentLevel?: number }> => {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    characterProfile: (character as any).profile,
                    conversationHistory: messages.slice(-10), // Send last 10 messages for context
                    isFirstMessage: false,
                    userPersonality: personalityResults,
                    relationshipData: relationshipData
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
            }

            const data = await response.json()

            if (data.fallback) {
                setError('Using fallback response - API connection issue')
            } else {
                setError(null)
            }

            return {
                response: data.response,
                nsfwBlocked: data.nsfwBlocked,
                requiredLevel: data.requiredLevel,
                currentLevel: data.currentLevel
            }
        } catch (error) {
            console.error('Error calling chat API:', error)
            throw error
        }
    }

    const handleSendMessage = async () => {
        const currentMessage = message.trim()
        if (!currentMessage || isTyping) return

        const userMessage: Message = {
            id: Date.now().toString(),
            content: currentMessage,
            sender: 'user',
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setMessage('')
        setIsTyping(true)

        try {
            const result = await callChatAPI(currentMessage)
            const { response: aiResponseText, nsfwBlocked, requiredLevel, currentLevel } = result

            // Handle NSFW content blocking with special message
            if (nsfwBlocked && requiredLevel && currentLevel) {
                const blockMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    content: aiResponseText as string,
                    sender: 'ai',
                    timestamp: new Date()
                }

                const infoMessage: Message = {
                    id: (Date.now() + 2).toString(),
                    content: `💕 *Your bond needs to reach Level ${requiredLevel} to discuss that topic. Keep chatting to strengthen your connection! (Current: Level ${currentLevel})*`,
                    sender: 'ai',
                    timestamp: new Date(Date.now() + 1000)
                }

                setMessages(prev => [...prev, blockMessage, infoMessage])
            } else if (Array.isArray(aiResponseText)) {
                // Handle multiple messages
                const aiResponses: Message[] = aiResponseText.map((msg, index) => ({
                    id: `${Date.now() + index + 1}`,
                    content: msg,
                    sender: 'ai' as const,
                    timestamp: new Date(Date.now() + index * 1000)
                }))
                setMessages(prev => [...prev, ...aiResponses])
            } else {
                // Handle single message
                const aiResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    content: aiResponseText,
                    sender: 'ai',
                    timestamp: new Date()
                }
                setMessages(prev => [...prev, aiResponse])
            }

            // Update bond data with XP gain
            const newMemory = {
                id: Date.now().toString(),
                content: `Conversation: "${currentMessage.substring(0, 50)}${currentMessage.length > 50 ? '...' : ''}"`,
                timestamp: new Date(),
                type: 'conversation' as const
            }

            const updatedRelationshipData = {
                ...relationshipData,
                experience: relationshipData.experience + 10,
                memories: [...relationshipData.memories, newMemory].slice(-50) // Keep last 50 memories
            }

            onUpdateRelationship(updatedRelationshipData)
        } catch (error) {
            console.error('Error in handleSendMessage:', error)
            setError('Failed to send message. Please try again.')
        } finally {
            setIsTyping(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const retryLastMessage = () => {
        if (messages.length >= 2) {
            const lastUserMessage = messages[messages.length - 2]
            if (lastUserMessage.sender === 'user') {
                // Remove the last AI response and retry
                setMessages(prev => prev.slice(0, -1))
                setMessage(lastUserMessage.content)
                setTimeout(() => handleSendMessage(), 100)
            }
        }
    }

    const currentLevel = getCurrentLevelFromXP(relationshipData.experience)
    const bondStatus = getBondStatus(currentLevel)
    const bondColor = getBondColor(currentLevel)

    return (
        <div className="min-h-screen yapchat-container flex flex-col">
            {/* Header */}
            <div className="yapchat-glass-header border-b border-border-glass px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="yapchat-btn-glass p-2 rounded-xl"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="yapchat-glass-character w-12 h-12 rounded-2xl flex items-center justify-center text-2xl yapchat-glow">
                            {character.icon}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold font-display text-text-primary">{character.name}</h1>
                            <p className="text-sm text-text-muted font-body">{character.type}</p>
                        </div>
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                        {error && (
                            <div className="yapchat-glass-warning rounded-xl px-3 py-2 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-accent-warning" />
                                <span className="text-sm text-text-primary font-body">Connection issue</span>
                                <button
                                    onClick={retryLastMessage}
                                    className="text-accent-primary hover:text-accent-secondary underline text-sm font-body"
                                >
                                    Retry
                                </button>
                            </div>
                        )}
                        <div className="yapchat-glass-subtle rounded-xl px-4 py-2">
                            <div className="flex items-center gap-2">
                                <Sparkles className={`w-4 h-4 ${bondColor} yapchat-glow`} />
                                <div className="text-sm font-body">
                                    <div className={`font-medium ${bondColor}`}>{bondStatus}</div>
                                    <div className="text-text-muted">Level {currentLevel} • {relationshipData.experience} XP</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="max-w-4xl mx-auto space-y-6">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-3 ${msg.sender === 'user'
                                        ? 'yapchat-glass-user yapchat-glow'
                                        : `yapchat-glass-character yapchat-glow-character ${msg.fallback ? 'opacity-75' : ''}`
                                    }`}
                            >
                                <p className="text-sm whitespace-pre-wrap font-body text-text-primary">{msg.content}</p>
                                <p className="text-xs text-text-muted mt-2 flex items-center gap-1 font-body">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    {msg.fallback && <span title="Fallback response">⚠️</span>}
                                </p>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="max-w-xs lg:max-w-md yapchat-glass-character rounded-2xl px-4 py-3 yapchat-glow-character">
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-accent-primary yapchat-glow" />
                                    <span className="text-sm font-body text-text-primary">{character.name} is thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <div className="yapchat-glass-header border-t border-border-glass px-6 py-4">
                <div className="max-w-4xl mx-auto">
                    {error && (
                        <div className="mb-4 yapchat-glass-warning rounded-2xl p-4">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-accent-warning" />
                                <span className="text-sm font-body text-text-primary">{error}</span>
                            </div>
                            <p className="mt-1 text-xs text-text-muted font-body">
                                Make sure your API connection is stable and try again.
                            </p>
                        </div>
                    )}
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={`Message ${character.name}...`}
                            className="yapchat-input-chat flex-1 rounded-2xl px-4 py-3 font-body"
                            disabled={isTyping}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!message.trim() || isTyping}
                            className="yapchat-btn-character p-3 rounded-2xl"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
} 