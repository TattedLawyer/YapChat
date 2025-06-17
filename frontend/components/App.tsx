'use client'

import { useState, useEffect } from 'react'
import HomePage from './HomePage'
import PersonalityTest from './PersonalityTest'
import ChatInterface from './ChatInterface'
import MessagingDashboard from './MessagingDashboard'
import AccountPrompt from './AccountPrompt'

type View = 'home' | 'personality-test' | 'dashboard' | 'chat'
type UserTier = 'free' | 'premium' | 'ultimate'

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

interface CompanionChat {
    id: string
    name: string
    series: string
    avatar: string
    lastMessage: string
    lastMessageTime: string
    relationshipLevel: number
    relationshipScore: number
    maxScore: number
    unreadCount: number
    isOnline: boolean
    character: Character
    messageCount: number
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

interface User {
    id: string
    email: string
    username: string
    tier: UserTier
    totalMessageCount: number
    companionChats: CompanionChat[]
}

export default function App() {
    const [currentView, setCurrentView] = useState<View>('home')
    const [personalityResults, setPersonalityResults] = useState<PersonalityResults | undefined>(undefined)
    const [selectedCompanion, setSelectedCompanion] = useState<CompanionChat | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [isCreatingCharacter, setIsCreatingCharacter] = useState(false)
    const [showAccountPrompt, setShowAccountPrompt] = useState(false)
    const [relationshipData, setRelationshipData] = useState<RelationshipData>({
        level: 1,
        experience: 0,
        memories: [],
        daysTogether: 1,
        unlockedContent: ['basic_chat']
    })

    // Initialize demo user for testing
    useEffect(() => {
        if (!user) {
            setUser({
                id: 'demo_user',
                email: 'demo@yapchat.com',
                username: 'Demo User',
                tier: 'free',
                totalMessageCount: 0,
                companionChats: []
            })
        }
    }, [user])

    const handlePersonalityComplete = (results: PersonalityResults) => {
        setPersonalityResults(results)
        // Direct to dashboard instead of home page (no intermediate screens)
        setCurrentView('dashboard')
    }

    const handleStartChat = (companion: CompanionChat) => {
        setSelectedCompanion(companion)
        setCurrentView('chat')
    }

    const handleCreateNewCompanion = () => {
        setCurrentView('home') // Go back to character creation
    }

    const handleShowAccountPrompt = () => {
        setShowAccountPrompt(true)
    }

    const handleCloseAccountPrompt = () => {
        setShowAccountPrompt(false)
    }

    const handleSignUp = async (method: 'google' | 'email', data?: any) => {
        // Mock sign-up process
        console.log('Sign up with:', method, data)

        // Update user tier based on selection
        if (user && data?.tier) {
            setUser(prev => prev ? { ...prev, tier: data.tier } : null)
        }

        setShowAccountPrompt(false)
        // In real app, this would create account and authenticate
    }

    const handleSignIn = () => {
        // Mock sign-in process
        console.log('Sign in clicked')
        setShowAccountPrompt(false)
        // In real app, this would show sign-in modal
    }

    const handleQuickLogin = () => {
        // Create a mock user for testing purposes
        const mockUser: User = {
            id: 'test_user_' + Date.now(),
            email: 'test@yapchat.com',
            username: 'TestUser',
            tier: 'free',
            totalMessageCount: 0,
            companionChats: []
        }

        // Set mock personality results for testing
        const mockPersonalityResults: PersonalityResults = {
            preferences: {
                companion_gender: 'any',
                emotional_support_need: ['encouragement', 'active listening'],
                social_energy: 'balanced',
                stress_response: 'talk it out',
                relationship_values: ['trust', 'communication'],
                life_approach: 'spontaneous',
                curiosity_style: ['pop culture', 'anime/manga'],
                ideal_companion_role: ['friend', 'confidant'],
                connection_pace: ['gradual build', 'natural flow']
            },
            personality: {
                openness: 0.7,
                conscientiousness: 0.6,
                extraversion: 0.5,
                agreeableness: 0.8,
                neuroticism: 0.4
            },
            insights: [
                'You value authentic connections and genuine communication',
                'You appreciate companions who can balance fun conversation with emotional support',
                'You prefer relationships that develop naturally over time'
            ],
            conversationalStyle: {
                communicationPreference: 'balanced',
                energyLevel: 'moderate',
                humorStyle: 'witty',
                supportStyle: 'encouraging',
                responseLength: 'medium'
            }
        }

        setUser(mockUser)
        setPersonalityResults(mockPersonalityResults)
        setCurrentView('dashboard')
    }

    const handleCreateCustomCharacter = async (characterDescription: string) => {
        if (!personalityResults || !user) return

        setIsCreatingCharacter(true)

        try {
            console.log('🔧 Creating character with description:', characterDescription)

            // Create enhanced character prompt using personality data
            const enhancedPrompt = createEnhancedCharacterPrompt(characterDescription, personalityResults)
            console.log('🔧 Enhanced prompt created, length:', enhancedPrompt.length)

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

            console.log('🔧 API Response status:', response.status)

            if (!response.ok) {
                const errorText = await response.text()
                console.error('🔧 API Error response:', errorText)
                throw new Error(`Failed to create character: ${response.status} - ${errorText}`)
            }

            const result = await response.json()
            console.log('🔧 API Response received:', result)

            const { characterProfile } = result

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

            // Create companion chat
            const newCompanion: CompanionChat = {
                id: character.id,
                name: character.name,
                series: character.type,
                avatar: character.icon,
                lastMessage: "Hi there! I'm excited to chat with you!",
                lastMessageTime: 'Just now',
                relationshipLevel: 1,
                relationshipScore: 0,
                maxScore: 100,
                unreadCount: 1,
                isOnline: true,
                character: character,
                messageCount: 0
            }

            // Add to user's companion chats
            setUser(prev => prev ? {
                ...prev,
                companionChats: [...prev.companionChats, newCompanion]
            } : null)

            console.log('🔧 Character created successfully, going to dashboard')
            // Go directly to dashboard
            setCurrentView('dashboard')
        } catch (error) {
            console.error('🔧 Character creation error:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            alert(`Failed to create character: ${errorMessage}. Please check the console for details.`)
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
            if (Array.isArray(preferences.emotional_support_need)) {
                enhancedPrompt += `- Emotional support styles: ${preferences.emotional_support_need.join(', ')}\n`
            } else {
                enhancedPrompt += `- Emotional support style: ${preferences.emotional_support_need}\n`
            }
        }
        if (preferences.social_energy) {
            enhancedPrompt += `- Energy source: ${preferences.social_energy}\n`
        }
        if (preferences.stress_response) {
            enhancedPrompt += `- Stress response: ${preferences.stress_response}\n`
        }
        if (preferences.relationship_values) {
            if (Array.isArray(preferences.relationship_values)) {
                enhancedPrompt += `- Values in relationships: ${preferences.relationship_values.join(', ')}\n`
            } else {
                enhancedPrompt += `- Values in relationships: ${preferences.relationship_values}\n`
            }
        }
        if (preferences.life_approach) {
            enhancedPrompt += `- Life approach: ${preferences.life_approach}\n`
        }
        if (preferences.curiosity_style) {
            if (Array.isArray(preferences.curiosity_style)) {
                enhancedPrompt += `- Intellectual interests: ${preferences.curiosity_style.join(', ')}\n`
            } else {
                enhancedPrompt += `- Intellectual interests: ${preferences.curiosity_style}\n`
            }
        }

        // Add companion role preferences
        if (preferences.ideal_companion_role) {
            if (Array.isArray(preferences.ideal_companion_role)) {
                enhancedPrompt += `- Desired companion roles: ${preferences.ideal_companion_role.join(', ')}\n`
            } else {
                enhancedPrompt += `- Desired companion role: ${preferences.ideal_companion_role}\n`
            }
        }
        if (preferences.connection_pace) {
            if (Array.isArray(preferences.connection_pace)) {
                enhancedPrompt += `- Connection styles: ${preferences.connection_pace.join(', ')}\n`
            } else {
                enhancedPrompt += `- Connection style: ${preferences.connection_pace}\n`
            }
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
            enhancedPrompt += `\nStrong personality traits: ${strongTraits.join(', ')}\n`
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

    const handleBackToDashboard = () => {
        setCurrentView('dashboard')
        setSelectedCompanion(null)
    }

    const handleUpdateRelationship = (newData: RelationshipData) => {
        setRelationshipData(newData)

        // Update companion chat data
        if (selectedCompanion && user) {
            const updatedCompanions = user.companionChats.map(companion =>
                companion.id === selectedCompanion.id
                    ? {
                        ...companion,
                        relationshipLevel: newData.level,
                        relationshipScore: newData.experience,
                        messageCount: companion.messageCount + 1
                    }
                    : companion
            )

            setUser(prev => prev ? {
                ...prev,
                companionChats: updatedCompanions,
                totalMessageCount: prev.totalMessageCount + 1
            } : null)
        }
    }

    const renderCurrentView = () => {
        switch (currentView) {
            case 'home':
                return (
                    <HomePage
                        onStartPersonalityTest={() => setCurrentView('personality-test')}
                        onCreateCustomCharacter={handleCreateCustomCharacter}
                        onLogin={handleQuickLogin}
                        personalityResults={personalityResults}
                    />
                )
            case 'personality-test':
                return (
                    <PersonalityTest
                        onComplete={handlePersonalityComplete}
                        onBack={() => setCurrentView('home')}
                    />
                )
            case 'dashboard':
                return user ? (
                    <MessagingDashboard
                        personalityResults={personalityResults || undefined}
                        onStartChat={handleStartChat}
                        onCreateNewCompanion={handleCreateNewCompanion}
                        onShowAccountPrompt={handleShowAccountPrompt}
                        userTier={user.tier}
                        messageCount={user.totalMessageCount}
                    />
                ) : null
            case 'chat':
                return selectedCompanion ? (
                    <ChatInterface
                        character={selectedCompanion.character}
                        onBack={handleBackToDashboard}
                        relationshipData={relationshipData}
                        onUpdateRelationship={handleUpdateRelationship}
                        personalityResults={personalityResults || undefined}
                    />
                ) : null
            default:
                return (
                    <HomePage
                        onStartPersonalityTest={() => setCurrentView('personality-test')}
                        onCreateCustomCharacter={handleCreateCustomCharacter}
                        onLogin={handleQuickLogin}
                        personalityResults={personalityResults}
                    />
                )
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {renderCurrentView()}

            {/* Account Prompt Modal */}
            {showAccountPrompt && (
                <AccountPrompt
                    onClose={handleCloseAccountPrompt}
                    onSignUp={handleSignUp}
                    onSignIn={handleSignIn}
                />
            )}
        </div>
    )
} 