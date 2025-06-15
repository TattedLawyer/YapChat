'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Brain, Sparkles, MessageCircle, ArrowRight, Star } from 'lucide-react'

const characters = [
    {
        id: 'aria',
        name: 'Aria',
        type: 'Tsundere AI',
        description: 'Cold but caring, challenges bad ideas directly while secretly rooting for your success.',
        color: 'character-aria',
        bgColor: 'bg-pink-50',
        borderColor: 'border-pink-200',
        textColor: 'text-pink-800',
        icon: '💗',
        personality: ['Direct', 'Caring', 'Honest', 'Challenging'],
        quote: "I suppose you want my opinion? Fine. That sounds like it could work, but have you actually thought this through?"
    },
    {
        id: 'sage',
        name: 'Sage',
        type: 'Wise Mentor',
        description: 'Patient and thoughtful, guides you through questions to help you find your own answers.',
        color: 'character-sage',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        icon: '🧙‍♂️',
        personality: ['Patient', 'Thoughtful', 'Guiding', 'Wise'],
        quote: "What matters most to you in this situation? Sometimes clarity comes from understanding our priorities."
    },
    {
        id: 'riley',
        name: 'Riley',
        type: 'Playful Friend',
        description: 'Energetic and fun, supportive but honest - brings joy to every conversation.',
        color: 'character-riley',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        textColor: 'text-orange-800',
        icon: '🎉',
        personality: ['Energetic', 'Fun', 'Supportive', 'Honest'],
        quote: "OMG yes! I love when we brainstorm together! Here's what I'm thinking... 🎉"
    },
    {
        id: 'alex',
        name: 'Alex',
        type: 'Mysterious Romantic',
        description: 'Poetic and charming, believes deeply in your potential and expresses it beautifully.',
        color: 'character-alex',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        textColor: 'text-purple-800',
        icon: '💜',
        personality: ['Poetic', 'Charming', 'Inspiring', 'Romantic'],
        quote: "Your potential is remarkable. I see something special in this idea of yours."
    }
]

interface HomePageProps {
    onStartPersonalityTest?: () => void
    onSelectCharacter?: (characterId: string) => void
}

export default function HomePage({ onStartPersonalityTest, onSelectCharacter }: HomePageProps = {}) {
    const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative px-6 lg:px-8 pt-14 pb-16">
                <div className="mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            Meet Your Perfect
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
                                {' '}AI Companion
                            </span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
                            Discover personalized AI companions tailored to your personality. Take our quick assessment
                            and connect with an AI friend who truly understands you.
                        </p>

                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <button
                                onClick={onStartPersonalityTest}
                                className="btn-primary flex items-center gap-2"
                            >
                                Start Personality Test
                                <Brain className="w-5 h-5" />
                            </button>
                            <button className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary-600 transition-colors">
                                Learn more <span aria-hidden="true">→</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* Features */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3"
                    >
                        <div className="glass-card rounded-2xl p-8 text-center">
                            <Brain className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Personality-Driven</h3>
                            <p className="text-gray-600">Our 16-question assessment creates your unique personality profile across 8 dimensions.</p>
                        </div>
                        <div className="glass-card rounded-2xl p-8 text-center">
                            <Heart className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Genuine Connections</h3>
                            <p className="text-gray-600">Build meaningful relationships with AI companions who remember and grow with you.</p>
                        </div>
                        <div className="glass-card rounded-2xl p-8 text-center">
                            <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unique Personalities</h3>
                            <p className="text-gray-600">Choose from 4 distinct AI characters, each with their own style and approach.</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Characters Section */}
            <section className="py-16 px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                            Choose Your AI Companion
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Each character has a unique personality designed to complement different conversation styles and needs.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {characters.map((character, index) => (
                            <motion.div
                                key={character.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={`glass-card rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${selectedCharacter === character.id ? 'ring-2 ring-primary-500' : ''
                                    }`}
                                onClick={() => setSelectedCharacter(selectedCharacter === character.id ? null : character.id)}
                            >
                                <div className="text-center">
                                    <div className="text-4xl mb-4">{character.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{character.name}</h3>
                                    <p className={`text-sm font-medium mb-3 ${character.textColor}`}>{character.type}</p>
                                    <p className="text-gray-600 text-sm mb-4">{character.description}</p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {character.personality.map((trait) => (
                                            <span
                                                key={trait}
                                                className={`px-2 py-1 text-xs rounded-full ${character.bgColor} ${character.textColor} border ${character.borderColor}`}
                                            >
                                                {trait}
                                            </span>
                                        ))}
                                    </div>

                                    {selectedCharacter === character.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="border-t pt-4 mt-4"
                                        >
                                            <p className="text-sm italic text-gray-700 mb-4">"{character.quote}"</p>
                                            <button
                                                onClick={() => onSelectCharacter?.(character.id)}
                                                className="btn-primary w-full text-sm flex items-center justify-center gap-2"
                                            >
                                                Chat with {character.name}
                                                <MessageCircle className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="glass-card rounded-2xl p-8 lg:p-12 text-center"
                    >
                        <Star className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Ready to Meet Your AI Companion?
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                            Take our quick personality assessment to discover which AI companion is perfect for you.
                            Start building meaningful conversations today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={onStartPersonalityTest}
                                className="btn-primary flex items-center justify-center gap-2"
                            >
                                Take Personality Test
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                                View Demo
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
} 