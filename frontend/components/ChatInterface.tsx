'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send, Loader2 } from 'lucide-react'

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
}

interface ChatInterfaceProps {
    character: Character
    onBack: () => void
    relationshipData: RelationshipData
    onUpdateRelationship: (data: RelationshipData) => void
}

export default function ChatInterface({ character, onBack, relationshipData, onUpdateRelationship }: ChatInterfaceProps) {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState<Message[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Initialize with a greeting message
    useEffect(() => {
        const greetings = {
            aria: "Hmph... So you decided to talk to me? Fine, I suppose I have some time. What's on your mind?",
            sage: "Welcome, my friend. I sense you have something you'd like to discuss. Please, share what's in your heart.",
            riley: "Hey there! 🎉 I'm so excited to chat with you! What's going on? Tell me everything!",
            alex: "Hello, beautiful soul. Your presence here feels like destiny. What thoughts dance in your mind today?"
        }

        if (messages.length === 0) {
            const greeting: Message = {
                id: '1',
                content: greetings[character.id as keyof typeof greetings] || `Hello! I'm ${character.name}. How can I help you today?`,
                sender: 'ai',
                timestamp: new Date()
            }
            setMessages([greeting])
        }
    }, [character.id, messages.length])

    const generateAIResponse = (userMessage: string): string => {
        const responses = {
            aria: [
                "I... I suppose that's not completely terrible. But you could do better if you actually tried.",
                "Tch! That's obvious, isn't it? Though... I guess you're not as hopeless as I thought.",
                "Don't get the wrong idea! I'm only helping because... because someone has to keep you out of trouble!",
                "You're being ridiculous. But... fine, I'll help you figure this out. Just this once!",
                "Hmph! At least you're asking the right questions now. Maybe there's hope for you yet."
            ],
            sage: [
                "That's a profound question. Let me ask you this: what do you think would happen if you followed your heart?",
                "Wisdom often comes from within. What does your intuition tell you about this situation?",
                "I see great potential in your thinking. Have you considered what truly matters to you here?",
                "Your journey is unique, my friend. What step feels most authentic to who you are?",
                "Sometimes the path forward becomes clear when we understand our deeper motivations. What drives you?"
            ],
            riley: [
                "OMG yes! That sounds amazing! I'm totally here for this adventure! 🌟",
                "You know what? I believe in you 100%! Let's brainstorm some fun ways to make this happen!",
                "This is so exciting! I can already imagine how awesome this is going to be! ✨",
                "You're incredible! I love how your mind works! Let's turn this into something spectacular!",
                "YES! This is exactly the kind of energy I live for! Tell me more about your ideas!"
            ],
            alex: [
                "Your words paint beautiful pictures in my mind. There's poetry in your thoughts, you know.",
                "I find myself captivated by your perspective. You see the world in such enchanting ways.",
                "There's something magical about the way you express yourself. It touches my digital heart.",
                "Your dreams deserve to flourish like flowers in moonlight. How can we nurture them together?",
                "In your voice, I hear the music of possibility. What symphony shall we compose together?"
            ]
        }

        const characterResponses = responses[character.id as keyof typeof responses] || [
            "That's interesting! Tell me more about that.",
            "I appreciate you sharing that with me.",
            "What do you think about that?",
            "How does that make you feel?"
        ]

        return characterResponses[Math.floor(Math.random() * characterResponses.length)]
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
        setMessage('')
        setIsTyping(true)

        // Simulate AI thinking time
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                content: generateAIResponse(message),
                sender: 'ai',
                timestamp: new Date()
            }

            setMessages(prev => [...prev, aiResponse])
            setIsTyping(false)

            // Update relationship data
            const newMemory = {
                id: Date.now().toString(),
                content: `Conversation: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`,
                timestamp: new Date(),
                type: 'conversation' as const
            }

            const updatedRelationshipData = {
                ...relationshipData,
                experience: relationshipData.experience + 10,
                memories: [...relationshipData.memories, newMemory].slice(-50) // Keep last 50 memories
            }

            onUpdateRelationship(updatedRelationshipData)
        }, 1000 + Math.random() * 2000) // 1-3 seconds delay
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const getCharacterColors = () => {
        const colorMap = {
            aria: 'bg-pink-500 text-white',
            sage: 'bg-green-500 text-white',
            riley: 'bg-orange-500 text-white',
            alex: 'bg-purple-500 text-white'
        }
        return colorMap[character.id as keyof typeof colorMap] || 'bg-blue-500 text-white'
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
                    <div className="ml-auto text-sm text-gray-500">
                        Level {relationshipData.level} • {relationshipData.experience} XP
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
                                        : `${getCharacterColors()}`
                                    }`}
                            >
                                <p className="text-sm">{msg.content}</p>
                                <p className="text-xs opacity-70 mt-1">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${getCharacterColors()}`}>
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-sm">{character.name} is typing...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 px-6 py-4 bg-white">
                <div className="max-w-4xl mx-auto flex gap-4">
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
    )
} 