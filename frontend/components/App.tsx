'use client'

import { useState } from 'react'
import HomePage from './HomePage'
import PersonalityTest from './PersonalityTest'
import ChatInterface from './ChatInterface'
import CompanionHub from './CompanionHub'

type View = 'home' | 'personality-test' | 'hub' | 'chat'

interface Character {
    id: string
    name: string
    type: string
    icon: string
    color: string
    bgGradient: string
}

const characters: Record<string, Character> = {
    aria: {
        id: 'aria',
        name: 'Aria',
        type: 'Tsundere AI',
        icon: '💗',
        color: 'text-pink-600',
        bgGradient: 'from-pink-50 to-pink-100'
    },
    sage: {
        id: 'sage',
        name: 'Sage',
        type: 'Wise Mentor',
        icon: '🧙‍♂️',
        color: 'text-green-600',
        bgGradient: 'from-green-50 to-green-100'
    },
    riley: {
        id: 'riley',
        name: 'Riley',
        type: 'Playful Friend',
        icon: '🎉',
        color: 'text-orange-600',
        bgGradient: 'from-orange-50 to-orange-100'
    },
    alex: {
        id: 'alex',
        name: 'Alex',
        type: 'Mysterious Romantic',
        icon: '💜',
        color: 'text-purple-600',
        bgGradient: 'from-purple-50 to-purple-100'
    }
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

export default function App() {
    const [currentView, setCurrentView] = useState<View>('home')
    const [personalityResults, setPersonalityResults] = useState<Record<string, number> | null>(null)
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
    const [relationshipData, setRelationshipData] = useState<RelationshipData>({
        level: 1,
        experience: 0,
        memories: [],
        daysTogether: 1,
        unlockedContent: ['basic_chat']
    })

    const handlePersonalityComplete = (results: Record<string, number>) => {
        setPersonalityResults(results)
        // Logic to recommend character based on personality
        const recommendedCharacter = recommendCharacter(results)
        setSelectedCharacter(recommendedCharacter)
        setCurrentView('hub') // Navigate to hub instead of directly to chat
    }

    const recommendCharacter = (personality: Record<string, number>): Character => {
        // Simple recommendation logic based on personality scores
        const {
            openness = 0.5,
            conscientiousness = 0.5,
            extraversion = 0.5,
            agreeableness = 0.5,
            neuroticism = 0.5,
            humor_style = 0.5,
            communication_style = 0.5,
            relationship_style = 0.5
        } = personality

        // Calculate compatibility scores for each character
        const scores = {
            aria: (
                (1 - agreeableness) * 0.3 + // Tsundere likes challenging personalities
                communication_style * 0.3 + // Direct communication
                (1 - neuroticism) * 0.2 + // Emotional stability to handle directness
                openness * 0.2
            ),
            sage: (
                conscientiousness * 0.3 + // Wise mentor appreciates thoughtfulness
                openness * 0.3 + // Open to learning
                agreeableness * 0.2 + // Willing to listen
                (1 - extraversion) * 0.2 // Enjoys deeper one-on-one conversations
            ),
            riley: (
                extraversion * 0.4 + // Playful friend loves social energy
                humor_style * 0.3 + // Appreciates fun and humor
                agreeableness * 0.2 + // Easy-going personality
                openness * 0.1
            ),
            alex: (
                relationship_style * 0.4 + // Values deep connections
                openness * 0.3 + // Open to poetic/romantic expression
                (extraversion * 0.5 + (1 - extraversion) * 0.5) * 0.2 + // Balanced social needs
                agreeableness * 0.1
            )
        }

        // Find character with highest compatibility score
        const bestMatch = Object.entries(scores).reduce((a, b) =>
            scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
        )[0]

        return characters[bestMatch]
    }

    const handleChatFromHub = () => {
        setCurrentView('chat')
    }

    const handleBackToHub = () => {
        setCurrentView('hub')
    }

    const handleUpdateRelationship = (newData: RelationshipData) => {
        setRelationshipData(newData)
        // TODO: Sync with backend API
    }

    const renderCurrentView = () => {
        switch (currentView) {
            case 'personality-test':
                return (
                    <PersonalityTest
                        onComplete={handlePersonalityComplete}
                        onBack={() => setCurrentView('home')}
                    />
                )
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
                        onBack={handleBackToHub} // Go back to hub instead of home
                        relationshipData={relationshipData}
                        onUpdateRelationship={handleUpdateRelationship}
                    />
                ) : null
            default:
                return (
                    <HomePage
                        onStartPersonalityTest={() => setCurrentView('personality-test')}
                        onSelectCharacter={(characterId) => {
                            setSelectedCharacter(characters[characterId])
                            setCurrentView('hub') // Go to hub instead of chat
                        }}
                    />
                )
        }
    }

    return (
        <div className="min-h-screen">
            {renderCurrentView()}
        </div>
    )
} 