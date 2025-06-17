import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Heart, ArrowRight, Edit3 } from 'lucide-react'

interface CharacterProfile {
    character_name: string
    fictional_lore: string
    summary: string
    personality_traits: {
        core_traits: string[]
        communication_style: string
        emotional_disposition: string
        key_phrases: string[]
        interests: string[]
        relationships: string
    }
    relevant_lore_facts: string[]
    character_voice: string
}

interface CharacterNamingProps {
    characterProfile: CharacterProfile
    originalDescription: string
    onNameConfirmed: (customName: string) => void
    onBack: () => void
}

export default function CharacterNaming({
    characterProfile,
    originalDescription,
    onNameConfirmed,
    onBack
}: CharacterNamingProps) {
    const [customName, setCustomName] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(true)

    // Generate name suggestions based on character traits
    const generateSuggestions = () => {
        const traits = characterProfile.personality_traits.core_traits
        const suggestions = []

        // Add some name variations
        const originalName = characterProfile.character_name
        if (originalName) {
            // First name only
            const firstName = originalName.split(' ')[0]
            if (firstName) suggestions.push(firstName)

            // Add trait-based variations
            if (traits.includes('confident') || traits.includes('powerful')) {
                suggestions.push('Kai', 'Rex', 'Nova', 'Ace')
            }
            if (traits.includes('gentle') || traits.includes('kind')) {
                suggestions.push('Luna', 'Sage', 'River', 'Dawn')
            }
            if (traits.includes('mysterious') || traits.includes('dark')) {
                suggestions.push('Shadow', 'Raven', 'Onyx', 'Storm')
            }
            if (traits.includes('playful') || traits.includes('energetic')) {
                suggestions.push('Sunny', 'Spark', 'Blaze', 'Sky')
            }
        }

        return Array.from(new Set(suggestions)).slice(0, 6)
    }

    const suggestions = generateSuggestions()

    const handleConfirm = () => {
        const finalName = customName.trim() || characterProfile.character_name
        onNameConfirmed(finalName)
    }

    const handleSuggestionClick = (suggestion: string) => {
        setCustomName(suggestion)
        setShowSuggestions(false)
    }

    return (
        <div className="min-h-screen yapchat-container flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl"
            >
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="text-6xl mb-4 yapchat-glow">✨</div>
                    <h1 className="text-4xl font-bold font-display text-text-primary mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-primary">
                            Your Companion Has Arrived!
                        </span>
                    </h1>
                    <p className="text-lg text-text-muted max-w-lg mx-auto font-body">
                        Your AI companion has been created with the personality of <strong className="text-text-primary">{characterProfile.character_name}</strong> from <em className="text-accent-primary">{characterProfile.fictional_lore}</em>.
                        What would you like to call them?
                    </p>
                </motion.div>

                {/* Character Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="yapchat-glass rounded-3xl p-6 mb-8 yapchat-glow-character"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 yapchat-character-glass rounded-full flex items-center justify-center text-2xl yapchat-glow">
                            ✨
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold font-display text-text-primary">
                                {characterProfile.character_name}
                            </h3>
                            <p className="text-text-muted font-body">{characterProfile.fictional_lore}</p>
                        </div>
                    </div>

                    <p className="text-text-primary font-body mb-4">{characterProfile.summary}</p>

                    <div className="flex flex-wrap gap-2">
                        {characterProfile.personality_traits.core_traits.map((trait, index) => (
                            <span
                                key={index}
                                className="yapchat-level-badge text-sm font-medium"
                            >
                                {trait}
                            </span>
                        ))}
                    </div>
                </motion.div>

                {/* Naming Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="yapchat-glass rounded-3xl p-8"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Edit3 className="w-6 h-6 text-accent-primary yapchat-glow" />
                        <h2 className="text-xl font-semibold font-display text-text-primary">Choose Your Companion's Name</h2>
                    </div>

                    {/* Custom Name Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-text-primary font-body mb-2">
                            Custom Name (or leave blank to use &quot;{characterProfile.character_name}&quot;)
                        </label>
                        <input
                            type="text"
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            placeholder={`e.g., ${suggestions[0] || 'My Companion'}`}
                            className="w-full yapchat-input-character font-body text-lg"
                            maxLength={30}
                        />
                        <p className="text-xs text-text-muted mt-1 font-body">
                            This avoids any copyright issues while keeping the personality you love
                        </p>
                    </div>

                    {/* Name Suggestions */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="mb-6">
                            <p className="text-sm font-medium text-text-primary font-body mb-3">Quick suggestions:</p>
                            <div className="flex flex-wrap gap-2">
                                {suggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="yapchat-btn-glass px-4 py-2 rounded-xl text-sm font-medium font-body"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Preview */}
                    <div className="yapchat-glass-intense rounded-2xl p-4 mb-6 border-l-4 border-accent-primary">
                        <p className="text-sm text-text-muted font-body mb-2">Preview:</p>
                        <p className="text-lg font-semibold font-display text-text-primary">
                            {customName.trim() || characterProfile.character_name}
                        </p>
                        <p className="text-sm text-text-muted font-body">
                            Personality: {characterProfile.personality_traits.core_traits.join(', ')}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={onBack}
                            className="yapchat-btn-glass px-6 py-3 rounded-xl font-medium font-body"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 yapchat-btn-character flex items-center justify-center gap-2 py-3 rounded-xl font-medium font-body"
                        >
                            <Heart className="w-5 h-5" />
                            Start Chatting with {customName.trim() || characterProfile.character_name}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>

                {/* Copyright Notice */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-6"
                >
                    <p className="text-xs text-text-muted max-w-md mx-auto font-body">
                        By naming your companion, you create a unique character inspired by fictional personalities
                        while respecting intellectual property rights. Your companion will have the personality
                        traits you love without trademark conflicts.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    )
} 