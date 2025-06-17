'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send, Loader2, AlertCircle } from 'lucide-react'

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

    const callChatAPI = async (userMessage: string): Promise<string | string[]> => {
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
                    userPersonality: personalityResults
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

            return data.response
        } catch (error) {
            console.error('Chat API Error:', error)
            setError(error instanceof Error ? error.message : 'Failed to get AI response')

            // Fallback response based on character personality
            const characterProfile = (character as any).profile
            if (characterProfile?.personality_traits?.communication_style) {
                return `I'm having some trouble connecting right now. Please try again.`
            }

            return "I'm having trouble connecting right now. Please try again."
        }
    }

    const handleSendMessage = async () => {
        if (!message.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            content: message.trim(),
            sender: 'user',
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        const currentMessage = message.trim()
        setMessage('')
        setIsTyping(true)
        setError(null)

        try {
            const aiResponseText = await callChatAPI(currentMessage)

            if (Array.isArray(aiResponseText)) {
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

            // Update relationship data
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

    const getCharacterColors = () => {
        // Use primary color for all custom characters
        return 'bg-primary-500 text-white'
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

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="text-3xl">{character.icon}</div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">{character.name}</h1>
                            <p className="text-sm text-gray-600">{character.type}</p>
                        </div>
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                        {error && (
                            <div className="flex items-center gap-2 text-amber-600 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                <span>Connection issue</span>
                                <button
                                    onClick={retryLastMessage}
                                    className="text-blue-600 hover:text-blue-800 underline"
                                >
                                    Retry
                                </button>
                            </div>
                        )}
                        <div className="text-sm text-gray-500">
                            Level {relationshipData.level} • {relationshipData.experience} XP
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
                <div className="max-w-4xl mx-auto space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : `${getCharacterColors()} ${msg.fallback ? 'opacity-75' : ''}`
                                    }`}
                            >
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                <p className="text-xs opacity-70 mt-1 flex items-center gap-1">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    {msg.fallback && <span title="Fallback response">⚠️</span>}
                                </p>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${getCharacterColors()}`}>
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-sm">{character.name} is thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 px-6 py-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    {error && (
                        <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                <span>{error}</span>
                            </div>
                            <p className="mt-1 text-xs">
                                Make sure your Anthropic API key is configured in environment variables.
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
                            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            disabled={isTyping}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!message.trim() || isTyping}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
} 