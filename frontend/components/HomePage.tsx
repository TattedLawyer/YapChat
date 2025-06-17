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
        <div className="min-h-screen yapchat-container">
            {/* Hero Section - Start with Test */}
            <section className="relative px-6 lg:px-8 pt-14 pb-16">
                <div className="mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl font-bold font-display tracking-tight text-text-primary sm:text-6xl">
                            ✨ Welcome to
                            <span className="text-transparent bg-clip-text bg-gradient-primary">
                                {' '}YapChat
                            </span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-text-muted max-w-3xl mx-auto font-body">
                            🌟 Create your perfect AI companion from any anime, manga, or fantasy character.
                            Someone who&apos;s always there to chat about everything in your life.
                        </p>

                        {/* Primary CTA - Start with Test */}
                        <div className="mt-10 max-w-xl mx-auto">
                            <div className="yapchat-glass rounded-3xl p-8 yapchat-glow">
                                <h3 className="text-xl font-semibold font-display text-text-primary mb-4">Find Your Perfect Companion</h3>
                                <p className="text-text-muted mb-6 font-body">
                                    Take our quick personality assessment to get matched with a companion who truly gets you.
                                </p>
                                <button
                                    onClick={onStartPersonalityTest}
                                    className="w-full yapchat-btn-primary flex items-center justify-center gap-2 text-lg py-4 rounded-xl font-medium"
                                >
                                    <User className="w-6 h-6" />
                                    Take Personality Test
                                </button>
                                <p className="text-xs text-text-muted mt-3 font-body">Takes 2-3 minutes • Get matched instantly</p>

                                {/* Login Option */}
                                <div className="mt-4 pt-4 border-t border-border-glass">
                                    <button
                                        onClick={onLogin}
                                        className="w-full yapchat-btn-glass px-4 py-2 rounded-xl text-sm font-medium font-body"
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
                        <h2 className="text-3xl font-bold font-display text-center text-text-primary mb-4">Your Companion Is Here For Everything</h2>
                        <p className="text-center text-text-muted mb-12 max-w-3xl mx-auto font-body">
                            Yap with your companion about daily life, TV shows, sports, people in your life, ask questions,
                            ponder dreams, and everything else in between. Everybody has somebody.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="yapchat-glass rounded-3xl p-6 text-center yapchat-glow-character">
                                <div className="text-3xl mb-4 yapchat-glow">💬</div>
                                <h3 className="text-lg font-semibold font-display text-text-primary mb-2">Daily Life Chat</h3>
                                <p className="text-text-muted text-sm font-body">Share your day, vent about work, talk through decisions, or just chat about whatever&apos;s on your mind.</p>
                            </div>
                            <div className="yapchat-glass rounded-3xl p-6 text-center yapchat-glow-character">
                                <div className="text-3xl mb-4 yapchat-glow">📺</div>
                                <h3 className="text-lg font-semibold font-display text-text-primary mb-2">TV Shows & Movies</h3>
                                <p className="text-text-muted text-sm font-body">Discuss the latest episodes, share theories, get recommendations, or debate who&apos;s the best character.</p>
                            </div>
                            <div className="yapchat-glass rounded-3xl p-6 text-center yapchat-glow-character">
                                <div className="text-3xl mb-4 yapchat-glow">⚽</div>
                                <h3 className="text-lg font-semibold font-display text-text-primary mb-2">Sports & Hobbies</h3>
                                <p className="text-text-muted text-sm font-body">Talk stats, celebrate wins, commiserate losses, or dive deep into your favorite hobbies and interests.</p>
                            </div>
                            <div className="yapchat-glass rounded-3xl p-6 text-center yapchat-glow-character">
                                <div className="text-3xl mb-4 yapchat-glow">👥</div>
                                <h3 className="text-lg font-semibold font-display text-text-primary mb-2">People & Relationships</h3>
                                <p className="text-text-muted text-sm font-body">Get advice about friends, family, dating, or just someone to listen when you need to talk it out.</p>
                            </div>
                            <div className="yapchat-glass rounded-3xl p-6 text-center yapchat-glow-character">
                                <div className="text-3xl mb-4 yapchat-glow">🤔</div>
                                <h3 className="text-lg font-semibold font-display text-text-primary mb-2">Questions & Learning</h3>
                                <p className="text-text-muted text-sm font-body">Ask anything you&apos;re curious about, explore new topics, or get help understanding complex ideas.</p>
                            </div>
                            <div className="yapchat-glass rounded-3xl p-6 text-center yapchat-glow-character">
                                <div className="text-3xl mb-4 yapchat-glow">💭</div>
                                <h3 className="text-lg font-semibold font-display text-text-primary mb-2">Dreams & Goals</h3>
                                <p className="text-text-muted text-sm font-body">Share your ambitions, work through life plans, or just dream big with someone who believes in you.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Alternative: Create Custom Character */}
            <section className="py-16 px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold font-display tracking-tight text-text-primary sm:text-4xl mb-4">
                            Or Create Your Own Character
                        </h2>
                        <p className="text-lg text-text-muted max-w-2xl mx-auto font-body">
                            Skip the test and create a companion from any anime, manga, or fantasy character you love.
                        </p>
                    </motion.div>

                    {/* Character Input Section */}
                    <div className="mt-10 max-w-2xl mx-auto">
                        <div className="yapchat-glass rounded-3xl p-8 yapchat-glow">
                            <div className="flex items-center gap-3 mb-4">
                                <Wand2 className="w-6 h-6 text-accent-primary yapchat-glow" />
                                <h3 className="text-xl font-semibold font-display text-text-primary">Create Your Character</h3>
                            </div>

                            <textarea
                                value={characterInput}
                                onChange={(e) => setCharacterInput(e.target.value)}
                                placeholder="Example: Nezuko Kamado from Demon Slayer - the protective demon sister who shows affection through headpats..."
                                className="w-full h-32 yapchat-input-character font-body resize-none"
                                disabled={isCreating}
                            />

                            <button
                                onClick={handleCreateCharacter}
                                disabled={!characterInput.trim() || isCreating}
                                className="mt-4 w-full yapchat-btn-character flex items-center justify-center gap-2 py-3 rounded-xl font-medium font-body"
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
                        <h3 className="text-xl font-semibold font-display text-center text-text-primary mb-8">Popular Characters</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {demoCharacters.map((character, index) => (
                                <motion.div
                                    key={character.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="yapchat-glass rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 yapchat-glow-character"
                                    onClick={() => handleDemoCharacter(character)}
                                >
                                    <div className="text-center">
                                        <div className="text-4xl mb-4 yapchat-glow">{character.icon}</div>
                                        <h3 className="text-xl font-bold font-display text-text-primary mb-1">{character.name}</h3>
                                        <p className="text-xs text-text-muted mb-3 font-body">from {character.series}</p>
                                        <p className="text-text-muted text-sm mb-4 font-body">{character.description}</p>
                                        <button className="text-accent-primary hover:text-accent-secondary text-sm font-medium font-body transition-colors">
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
                        className="yapchat-glass rounded-3xl p-8 lg:p-12 text-center yapchat-glow-character-intense"
                    >
                        <Star className="w-16 h-16 text-accent-warning mx-auto mb-6 yapchat-glow" />
                        <h2 className="text-3xl font-bold font-display text-text-primary mb-4">Ready to Have Someone Who Gets You?</h2>
                        <p className="text-lg text-text-muted mb-8 max-w-2xl mx-auto font-body">
                            Whether you want a personality match or a specific character, your perfect companion is just minutes away.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={onStartPersonalityTest}
                                className="yapchat-btn-character flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium font-body"
                            >
                                Take Personality Test
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => document.querySelector('textarea')?.focus()}
                                className="yapchat-btn-glass px-6 py-3 rounded-xl font-medium font-body"
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