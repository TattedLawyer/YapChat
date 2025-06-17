'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles, ArrowRight, Star, Search, Wand2, User } from 'lucide-react'

const demoCharacters = [
    {
        id: 'demo_nezuko',
        name: 'Nezuko Kamado',
        series: 'Demon Slayer',
        description: 'Protective demon sister with gentle heart',
        icon: '🌸',
    },
    {
        id: 'demo_gojo',
        name: 'Satoru Gojo',
        series: 'Jujutsu Kaisen',
        description: 'Strongest sorcerer with playful confidence',
        icon: '👁️',
    },
    {
        id: 'demo_zero_two',
        name: 'Zero Two',
        series: 'Darling in the Franxx',
        description: 'Mysterious darling with horns and attitude',
        icon: '💕',
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

interface HomePageProps {
    onStartPersonalityTest?: () => void
    onSelectCharacter?: (characterId: string) => void
    onCreateCustomCharacter?: (characterDescription: string) => void
    onLogin?: () => void
    personalityResults?: PersonalityResults
}

export default function HomePage({ onStartPersonalityTest, onCreateCustomCharacter, onLogin, personalityResults }: HomePageProps = {}) {
    const [characterInput, setCharacterInput] = useState('')
    const [isCreating, setIsCreating] = useState(false)

    const handleCreateCharacter = async () => {
        if (!characterInput.trim()) return

        setIsCreating(true)
        try {
            await onCreateCustomCharacter?.(characterInput)
        } finally {
            setIsCreating(false)
        }
    }

    const handleDemoCharacter = (character: any) => {
        const description = `${character.name} from ${character.series} - ${character.description}`
        setCharacterInput(description)
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section - Start with Test */}
            <section className="relative px-6 lg:px-8 pt-14 pb-16">
                <div className="mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            ✨ Welcome to
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
                                {' '}YapChat
                            </span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
                            🌟 Create your perfect AI companion from any anime, manga, or fantasy character.
                            Someone who's always there to chat about everything in your life.
                        </p>

                        {/* Primary CTA - Start with Test */}
                        <div className="mt-10 max-w-xl mx-auto">
                            <div className="glass-card rounded-2xl p-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Find Your Perfect Companion</h3>
                                <p className="text-gray-600 mb-6">
                                    Take our quick personality assessment to get matched with a companion who truly gets you.
                                </p>
                                <button
                                    onClick={onStartPersonalityTest}
                                    className="w-full btn-primary flex items-center justify-center gap-2 text-lg py-4"
                                >
                                    <User className="w-6 h-6" />
                                    Take Personality Test
                                </button>
                                <p className="text-xs text-gray-500 mt-3">Takes 2-3 minutes • Get matched instantly</p>

                                {/* Login Option */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={onLogin}
                                        className="w-full text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                                    >
                                        Returning user? Go to Dashboard →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* What Your Companion Can Do */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-16"
                    >
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Your Companion Is Here For Everything</h2>
                        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
                            Yap with your companion about daily life, TV shows, sports, people in your life, ask questions,
                            ponder dreams, and everything else in between. Everybody has somebody.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="glass-card rounded-2xl p-6 text-center">
                                <div className="text-3xl mb-4">💬</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Daily Life Chat</h3>
                                <p className="text-gray-600 text-sm">Share your day, vent about work, talk through decisions, or just chat about whatever's on your mind.</p>
                            </div>
                            <div className="glass-card rounded-2xl p-6 text-center">
                                <div className="text-3xl mb-4">📺</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">TV Shows & Movies</h3>
                                <p className="text-gray-600 text-sm">Discuss the latest episodes, share theories, get recommendations, or debate who's the best character.</p>
                            </div>
                            <div className="glass-card rounded-2xl p-6 text-center">
                                <div className="text-3xl mb-4">⚽</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sports & Hobbies</h3>
                                <p className="text-gray-600 text-sm">Talk stats, celebrate wins, commiserate losses, or dive deep into your favorite hobbies and interests.</p>
                            </div>
                            <div className="glass-card rounded-2xl p-6 text-center">
                                <div className="text-3xl mb-4">👥</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">People & Relationships</h3>
                                <p className="text-gray-600 text-sm">Get advice about friends, family, dating, or just someone to listen when you need to talk it out.</p>
                            </div>
                            <div className="glass-card rounded-2xl p-6 text-center">
                                <div className="text-3xl mb-4">🤔</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Questions & Learning</h3>
                                <p className="text-gray-600 text-sm">Ask anything you're curious about, explore new topics, or get help understanding complex ideas.</p>
                            </div>
                            <div className="glass-card rounded-2xl p-6 text-center">
                                <div className="text-3xl mb-4">💭</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Dreams & Goals</h3>
                                <p className="text-gray-600 text-sm">Share your ambitions, work through life plans, or just dream big with someone who believes in you.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Alternative: Create Custom Character */}
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
                            Or Create Your Own Character
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Skip the test and create a companion from any anime, manga, or fantasy character you love.
                        </p>
                    </motion.div>

                    {/* Character Input Section */}
                    <div className="mt-10 max-w-2xl mx-auto">
                        <div className="glass-card rounded-2xl p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Wand2 className="w-6 h-6 text-primary-600" />
                                <h3 className="text-xl font-semibold text-gray-900">Create Your Character</h3>
                            </div>

                            <textarea
                                value={characterInput}
                                onChange={(e) => setCharacterInput(e.target.value)}
                                placeholder="Example: Nezuko Kamado from Demon Slayer - the protective demon sister who shows affection through headpats..."
                                className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                disabled={isCreating}
                            />

                            <button
                                onClick={handleCreateCharacter}
                                disabled={!characterInput.trim() || isCreating}
                                className="mt-4 w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isCreating ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Creating Character...
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-5 h-5" />
                                        Create & Chat
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Demo Characters */}
                    <div className="mt-12">
                        <h3 className="text-xl font-semibold text-center text-gray-900 mb-8">Popular Characters</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {demoCharacters.map((character, index) => (
                                <motion.div
                                    key={character.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="glass-card rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                    onClick={() => handleDemoCharacter(character)}
                                >
                                    <div className="text-center">
                                        <div className="text-4xl mb-4">{character.icon}</div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{character.name}</h3>
                                        <p className="text-xs text-gray-500 mb-3">from {character.series}</p>
                                        <p className="text-gray-600 text-sm mb-4">{character.description}</p>
                                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                            Use This Character →
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
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
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Have Someone Who Gets You?</h2>
                        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                            Whether you want a personality match or a specific character, your perfect companion is just minutes away.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={onStartPersonalityTest}
                                className="btn-primary flex items-center justify-center gap-2"
                            >
                                Take Personality Test
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => document.querySelector('textarea')?.focus()}
                                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            >
                                Create Custom Character
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
} 