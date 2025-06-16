'use client'

import { useState } from 'react'
import HomePage from './HomePage'
import PersonalityTest from './PersonalityTest'
import ChatInterface from './ChatInterface'
import CompanionHub from './CompanionHub'

type View = 'personality-test' | 'home' | 'hub' | 'chat'

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

interface Character {
    id: string
    name: string
    type: string
    description: string
    profile: CharacterProfile
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
}

export default function App() {
    const [currentView, setCurrentView] = useState<View>('personality-test')
    const [personalityResults, setPersonalityResults] = useState<PersonalityResults | null>(null)
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
    const [isCreatingCharacter, setIsCreatingCharacter] = useState(false)
    const [relationshipData, setRelationshipData] = useState<RelationshipData>({
        level: 1,
        experience: 0,
        memories: [],
        daysTogether: 1,
        unlockedContent: ['basic_chat']
    })

    const handlePersonalityComplete = (results: PersonalityResults) => {
        setPersonalityResults(results)
        setCurrentView('home')
    }

    const handleCreateCustomCharacter = async (characterDescription: string) => {
        if (!personalityResults) return

        setIsCreatingCharacter(true)

        try {
            // Create enhanced character prompt using personality data
            const enhancedPrompt = createEnhancedCharacterPrompt(characterDescription, personalityResults)

            const response = await fetch('/api/create-character', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    characterDescription: enhancedPrompt,
                    personalityData: personalityResults
                })
            })

            if (!response.ok) {
                throw new Error('Failed to create character')
            }

            const { characterProfile } = await response.json()

            // Create character object
            const character: Character = {
                id: `custom_${Date.now()}`,
                name: characterProfile.character_name,
                type: characterProfile.fictional_lore,
                description: characterDescription,
                profile: characterProfile,
                icon: getCharacterIcon(characterProfile),
                color: 'text-primary-600',
                bgGradient: 'from-primary-50 to-primary-100'
            }

            setSelectedCharacter(character)
            setCurrentView('hub')
        } catch (error) {
            alert('Failed to create character. Please try again.')
        } finally {
            setIsCreatingCharacter(false)
        }
    }

    const createEnhancedCharacterPrompt = (originalDescription: string, personality: PersonalityResults) => {
        const { preferences, personality: traits, insights, conversationalStyle } = personality

        let enhancedPrompt = `${originalDescription}\n\nUser Personality & Preferences Context:\n`

        // Add companion preferences
        if (preferences.companion_gender) {
            enhancedPrompt += `- Preferred companion gender: ${preferences.companion_gender}\n`
        }

        // Add inspiration from favorite character
        if (preferences.favorite_character && preferences.character_source) {
            enhancedPrompt += `- Inspired by: ${preferences.favorite_character} from ${preferences.character_source}\n`
        }
        if (preferences.what_attracts_character) {
            enhancedPrompt += `- Attracted to traits: ${preferences.what_attracts_character}\n`
        }

        // Add user personality traits
        enhancedPrompt += `\nUser Personality Profile:\n`
        if (preferences.emotional_support_need) {
            enhancedPrompt += `- Emotional support style: ${preferences.emotional_support_need}\n`
        }
        if (preferences.social_energy) {
            enhancedPrompt += `- Energy source: ${preferences.social_energy}\n`
        }
        if (preferences.stress_response) {
            enhancedPrompt += `- Stress response: ${preferences.stress_response}\n`
        }
        if (preferences.relationship_values) {
            enhancedPrompt += `- Values in relationships: ${preferences.relationship_values}\n`
        }
        if (preferences.life_approach) {
            enhancedPrompt += `- Life approach: ${preferences.life_approach}\n`
        }
        if (preferences.curiosity_style) {
            enhancedPrompt += `- Intellectual interests: ${preferences.curiosity_style}\n`
        }

        // Add companion role preferences
        if (preferences.ideal_companion_role) {
            enhancedPrompt += `- Desired companion role: ${preferences.ideal_companion_role}\n`
        }
        if (preferences.connection_pace) {
            enhancedPrompt += `- Connection style: ${preferences.connection_pace}\n`
        }

        // Add personality insights
        if (insights.length > 0) {
            enhancedPrompt += `\nPersonality Insights:\n- ${insights.join('\n- ')}\n`
        }

        // Add high-scoring personality dimensions
        const strongTraits = Object.entries(traits)
            .filter(([, score]) => score > 0.6)
            .map(([trait, score]) => `${trait} (${Math.round(score * 100)}%)`)

        if (strongTraits.length > 0) {
            enhancedPrompt += `\nStrong Personality Traits: ${strongTraits.join(', ')}\n`
        }

        enhancedPrompt += `\nIMPORTANT: Create a character that embodies their authentic fictional personality while being naturally compatible with this user's emotional needs and relationship values. Let the CHARACTER determine their communication style, humor, and energy - witty characters should be witty, serious characters should be serious, etc. The user's personality profile shows what they need from a relationship, not how the character should act. Focus on creating natural compatibility between the character's authentic traits and the user's personality.`

        return enhancedPrompt
    }

    const getCharacterIcon = (profile: CharacterProfile): string => {
        // Simple logic to assign icons based on character traits or source
        const lore = profile.fictional_lore.toLowerCase()
        const traits = profile.personality_traits.core_traits.join(' ').toLowerCase()

        if (lore.includes('anime') || lore.includes('manga')) return '🌸'
        if (lore.includes('harry potter') || lore.includes('wizard')) return '⚡'
        if (lore.includes('vampire') || lore.includes('twilight')) return '🌙'
        if (traits.includes('strong') || traits.includes('warrior')) return '⚔️'
        if (traits.includes('wise') || traits.includes('mentor')) return '🧙‍♂️'
        if (traits.includes('playful') || traits.includes('energetic')) return '🎉'
        if (traits.includes('romantic') || traits.includes('charming')) return '💜'
        if (traits.includes('mysterious') || traits.includes('dark')) return '🌟'

        return '✨' // Default icon
    }

    const handleChatFromHub = () => {
        setCurrentView('chat')
    }

    const handleBackToHub = () => {
        setCurrentView('hub')
    }

    const handleUpdateRelationship = (newData: RelationshipData) => {
        setRelationshipData(newData)
    }

    const renderCurrentView = () => {
        switch (currentView) {
            case 'personality-test':
                return (
                    <PersonalityTest
                        onComplete={handlePersonalityComplete}
                    />
                )
            case 'home':
                return personalityResults ? (
                    <HomePage
                        onStartPersonalityTest={() => setCurrentView('personality-test')}
                        onCreateCustomCharacter={handleCreateCustomCharacter}
                        personalityResults={personalityResults}
                    />
                ) : null
            case 'hub':
                return selectedCharacter ? (
                    <CompanionHub
                        character={selectedCharacter}
                        relationshipData={relationshipData}
                        onStartChat={handleChatFromHub}
                        onBack={() => setCurrentView('home')}
                        onUpdateRelationship={handleUpdateRelationship}
                    />
                ) : null
            case 'chat':
                return selectedCharacter ? (
                    <ChatInterface
                        character={selectedCharacter}
                        onBack={handleBackToHub}
                        relationshipData={relationshipData}
                        onUpdateRelationship={handleUpdateRelationship}
                        personalityResults={personalityResults}
                    />
                ) : null
            default:
                return (
                    <PersonalityTest
                        onComplete={handlePersonalityComplete}
                    />
                )
        }
    }

    return (
        <div className="min-h-screen">
            {renderCurrentView()}

            {/* Loading overlay for character creation */}
            {isCreatingCharacter && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Creating Your Perfect Companion</h3>
                        <p className="text-gray-600">
                            Using your personality profile to create the ideal match...
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
} 