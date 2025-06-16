'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles, ArrowRight, Star, Search, Wand2 } from 'lucide-react'

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
}

interface HomePageProps {
    onStartPersonalityTest?: () => void
    onSelectCharacter?: (characterId: string) => void
    onCreateCustomCharacter?: (characterDescription: string) => void
    personalityResults?: PersonalityResults
}

export default function HomePage({ onStartPersonalityTest, onCreateCustomCharacter, personalityResults }: HomePageProps = {}) {
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
                            ✨ Welcome to
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
                                {' '}YapChat
                            </span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
                            🌟 Summon any anime, manga, or fantasy character! Our magical AI will research their essence
                            and bring them to life for epic conversations that feel like stepping into their world.
                        </p>

                        {/* Character Input Section */}
                        <div className="mt-10 max-w-2xl mx-auto">
                            <div className="glass-card rounded-2xl p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <Wand2 className="w-6 h-6 text-primary-600" />
                                    <h3 className="text-xl font-semibold text-gray-900">✨ Summon Your Character</h3>
                                </div>

                                <textarea
                                    value={characterInput}
                                    onChange={(e) => setCharacterInput(e.target.value)}
                                    placeholder="Example: Nezuko Kamado from Demon Slayer - the protective demon sister who shows affection through headpats and bamboo muzzle..."
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
                                            🌟 Summon & Chat
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <button
                                onClick={onStartPersonalityTest}
                                className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary-600 transition-colors"
                            >
                                ✨ Take Soul Assessment <span aria-hidden="true">→</span>
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
                            <Search className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">🔮 Magical Research</h3>
                            <p className="text-gray-600">Our AI channels deep knowledge of anime, manga, and fantasy universes to capture each character&apos;s true essence.</p>
                        </div>
                        <div className="glass-card rounded-2xl p-8 text-center">
                            <Heart className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">⚡ Authentic Souls</h3>
                            <p className="text-gray-600">Experience genuine conversations with characters who embody their true personality, powers, and quirks.</p>
                        </div>
                        <div className="glass-card rounded-2xl p-8 text-center">
                            <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">🌟 Infinite Realms</h3>
                            <p className="text-gray-600">Any character from anime, manga, light novels, games, or fantasy worlds - your imagination is the only limit!</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Demo Characters Section */}
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
                            ✨ Try These Demo Characters
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            🌟 Click any character below to auto-fill their description, or summon your own favorite from any anime or fantasy world!
                        </p>
                    </motion.div>

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
                                        ✨ Summon This Character →
                                    </button>
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
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Meet Your Character?</h2>
                        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                            From classic literature heroes to modern anime protagonists - describe any character and start
                            an authentic conversation within seconds.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => document.querySelector('textarea')?.focus()}
                                className="btn-primary flex items-center justify-center gap-2"
                            >
                                Start Creating
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                                View Examples
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
} 