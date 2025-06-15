'use client'

import { useState } from 'react'
import { ArrowLeft, Send } from 'lucide-react'

interface Character {
    id: string
    name: string
    type: string
    icon: string
    color: string
    bgGradient: string
}

interface ChatInterfaceProps {
    character: Character
    onBack: () => void
}

export default function ChatInterface({ character, onBack }: ChatInterfaceProps) {
    const [message, setMessage] = useState('')

    return (
        <div className="min-h-screen flex flex-col">
            <div className="bg-gray-100 border-b border-gray-200 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
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
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">{character.icon}</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Chat with {character.name}</h2>
                    <p className="text-gray-600">Start a conversation below!</p>
                </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 bg-white">
                <div className="max-w-4xl mx-auto flex gap-4">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={`Message ${character.name}...`}
                        className="flex-1 rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
} 