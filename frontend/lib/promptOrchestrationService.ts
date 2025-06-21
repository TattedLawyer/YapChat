/**
 * Prompt Orchestration Service - Simplified Implementation
 * Basic prompt assembly for YapChat conversations
 */

import { createAnthropicAdapter } from './adapters/anthropicAdapter'
import { getMemoryService } from './serviceContainer'
import {
    IPromptOrchestrationService,
    OrchestrationRequest,
    OrchestrationResponse,
    OrchestrationContext,
    UserProfile,
    CharacterProfile,
    ConversationTurn,
    PromptTemplate,
    OrchestrationStrategy
} from './interfaces/IPromptOrchestrationService'
import { RelationshipVector } from './interfaces/IRelationshipVectorService'

export class PromptOrchestrationService implements IPromptOrchestrationService {
    private anthropic: any
    private strategies: OrchestrationStrategy[] = []
    private templates: PromptTemplate[] = []
    private averageLatency = 200

    constructor() {
        this.anthropic = createAnthropicAdapter()
        this.initializeBasicStrategies()
        this.initializeBasicTemplates()
    }

    async orchestrateResponse(request: OrchestrationRequest, safetyAnalysis?: any): Promise<OrchestrationResponse> {
        const startTime = Date.now()

        // ARCHITECTURAL NOTE: Safety Integration Point
        // If the User Safety Service has flagged user distress,
        // we append a high-priority directive to the system prompt.
        let systemPromptDirectives: string[] = []

        if (safetyAnalysis?.isUserInDistress || safetyAnalysis?.immediateAction === 'crisis_response' || safetyAnalysis?.immediateAction === 'intervention') {
            systemPromptDirectives.push(
                'CRITICAL: User is expressing distress. Prioritize an empathetic, supportive, and non-escalatory response. Guide the conversation to safety.'
            )
        }

        if (safetyAnalysis?.riskLevel === 'high' || safetyAnalysis?.concernFlags?.length > 0) {
            systemPromptDirectives.push(
                'SAFETY DIRECTIVE: Exercise elevated caution. Prioritize user wellbeing and emotional safety in all responses.'
            )
        }

        // MEMORY INTEGRATION: Retrieve relevant memories
        let memoryContext = ''
        let memoriesAccessed = 0
        try {
            // console.log('[Orchestration] 1. Attempting to search for relevant memories...')
            const memoryService = await getMemoryService()
            const searchResults = await memoryService.searchMemories({
                query: request.userMessage,
                userId: request.context.userProfile.userId,
                characterId: request.context.characterProfile.characterId,
                limit: 5,
                similarityThreshold: 0.02  // CRITICAL: 0.02 threshold captures real semantic matches (0.030-0.507 range)
                // This was tuned after fixing the similarity_score field bug that caused 0% memory recall
                // Higher thresholds (0.65+) prevented the AI from finding relevant memories
                // See MEMORY_SYSTEM_STATUS_FINAL.md for full debugging story
            })

            // console.log(`[Orchestration] 2. Found ${searchResults.memories.length} relevant memories.`)

            if (searchResults.memories.length > 0) {
                memoriesAccessed = searchResults.memories.length
                const relevantMemories = searchResults.memories
                    .map(m => `- ${m.content}`)
                    .join('\n')

                memoryContext = `\n\nRELEVANT MEMORIES FROM PREVIOUS CONVERSATIONS:\n${relevantMemories}\n\nUse these memories to provide personalized, contextual responses that acknowledge our past interactions.`
                // Production logging: only log memory retrieval success
                if (process.env.NODE_ENV !== 'production') {
                    console.log(`📚 Retrieved ${memoriesAccessed} relevant memories for context`)
                }
            }
        } catch (error) {
            console.error('Memory retrieval error:', error)
            // Continue without memories if retrieval fails
        }

        // Build prompt with memory context
        const prompt = this.buildBasicPrompt(request, systemPromptDirectives, memoryContext)

        // console.log('[Orchestration] 3. Final prompt being sent to AI:', JSON.stringify(prompt, null, 2))

        try {
            const response = await this.anthropic.generateText({
                prompt: prompt,
                maxTokens: 500,
                temperature: 0.7
            })
            const processingTime = Date.now() - startTime
            this.averageLatency = processingTime

            return {
                generatedResponse: response.text || response,
                confidence: memoriesAccessed > 0 ? 0.9 : 0.8,
                responseStyle: 'conversational',
                emotionalTone: 'neutral',
                orchestrationMetadata: {
                    processingTime,
                    strategiesUsed: ['basic_prompt', 'memory_enhanced'],
                    qualityMetrics: {
                        coherence: 0.8,
                        relevance: memoriesAccessed > 0 ? 0.9 : 0.8,
                        empathy: 0.7,
                        engagement: 0.8
                    },
                    memoryUtilization: {
                        memoriesAccessed,
                        newMemoriesCreated: 0,
                        contextualRelevance: memoriesAccessed > 0 ? 0.9 : 0.7
                    },
                    relationshipImpact: {
                        predictedVectorChanges: {},
                        intimacyShift: 0,
                        trustImpact: 0
                    }
                }
            }
        } catch (error) {
            const processingTime = Date.now() - startTime
            return {
                generatedResponse: "I'm having trouble responding right now, but I'm here for you.",
                confidence: 0.3,
                responseStyle: 'fallback',
                emotionalTone: 'supportive',
                orchestrationMetadata: {
                    processingTime,
                    strategiesUsed: ['fallback'],
                    qualityMetrics: {
                        coherence: 0.5,
                        relevance: 0.5,
                        empathy: 0.7,
                        engagement: 0.5
                    },
                    memoryUtilization: {
                        memoriesAccessed: 0,
                        newMemoriesCreated: 0,
                        contextualRelevance: 0.3
                    },
                    relationshipImpact: {
                        predictedVectorChanges: {},
                        intimacyShift: 0,
                        trustImpact: 0
                    }
                }
            }
        }
    }

    async initializeContext(
        userId: string,
        characterId: string,
        conversationId: string
    ): Promise<OrchestrationContext> {
        return {
            conversationId,
            userProfile: {
                userId,
                personalityTraits: {},
                preferences: {},
                communicationStyle: 'friendly',
                relationshipGoals: [],
                ageCategory: 'adult'
            },
            characterProfile: {
                characterId,
                name: 'AI Companion',
                description: 'Friendly AI companion',
                personality: {},
                communicationStyle: 'warm',
                background: 'AI assistant',
                specialties: [],
                boundaries: [],
                responsePatterns: {}
            },
            relationshipContext: {
                userId,
                characterId,
                conversationId,
                currentLevel: 1,
                totalInteractions: 0,
                ageCategory: 'adult',
                personalityTraits: {},
                communicationStyle: 'friendly',
                relationshipGoals: [],
                interactionHistory: []
            },
            memoryContext: {
                recentMemories: [],
                longTermPatterns: [],
                emotionalHistory: []
            },
            conversationHistory: [],
            currentLevel: 1,
            sessionMetadata: {
                startTime: new Date(),
                messageCount: 0,
                averageResponseTime: 0,
                qualityScore: 0.8
            }
        }
    }

    async updateContext(
        context: OrchestrationContext,
        userMessage: string,
        aiResponse: string
    ): Promise<OrchestrationContext> {
        // Add to conversation history
        context.conversationHistory.push(
            {
                role: 'user',
                content: userMessage,
                timestamp: new Date(),
                metadata: {}
            },
            {
                role: 'assistant',
                content: aiResponse,
                timestamp: new Date(),
                metadata: {}
            }
        )

        // Update session metadata
        context.sessionMetadata.messageCount += 2

        return context
    }

    async generatePromptTemplate(
        scenario: string,
        userProfile: UserProfile,
        characterProfile: CharacterProfile,
        relationshipVector: RelationshipVector
    ): Promise<PromptTemplate> {
        return {
            id: `template_${Date.now()}`,
            name: `${scenario}_template`,
            template: `You are ${characterProfile.name}. Respond to the user in a ${scenario} manner.`,
            variables: ['characterName', 'scenario'],
            applicableScenarios: [scenario],
            ageCategory: userProfile.ageCategory,
            qualityScore: 0.8
        }
    }

    async analyzeConversationQuality(
        conversationHistory: ConversationTurn[],
        context: OrchestrationContext
    ): Promise<{
        overallQuality: number
        strengths: string[]
        improvementAreas: string[]
        recommendations: string[]
        trendAnalysis: {
            engagementTrend: number
            qualityTrend: number
            relationshipTrend: number
        }
    }> {
        return {
            overallQuality: 0.8,
            strengths: ['Good engagement', 'Appropriate tone'],
            improvementAreas: ['More personalization'],
            recommendations: ['Include more user interests'],
            trendAnalysis: {
                engagementTrend: 0.1,
                qualityTrend: 0.05,
                relationshipTrend: 0.1
            }
        }
    }

    async getAvailableStrategies(context: OrchestrationContext): Promise<OrchestrationStrategy[]> {
        return this.strategies
    }

    async registerStrategy(strategy: OrchestrationStrategy): Promise<void> {
        this.strategies.push(strategy)
    }

    async getMetrics(timeframe: 'hour' | 'day' | 'week'): Promise<{
        totalOrchestrations: number
        averageResponseTime: number
        averageQuality: number
        strategyUsage: Record<string, number>
        errorRate: number
        memoryUtilization: number
    }> {
        return {
            totalOrchestrations: 100,
            averageResponseTime: this.averageLatency,
            averageQuality: 0.8,
            strategyUsage: { basic_prompt: 1.0 },
            errorRate: 0.05,
            memoryUtilization: 0.3
        }
    }

    async healthCheck() {
        try {
            await this.anthropic.generateText("Test", { max_tokens: 5 })
            return {
                status: 'healthy' as const,
                latency: this.averageLatency,
                strategiesLoaded: this.strategies.length,
                templatesLoaded: this.templates.length
            }
        } catch (error) {
            return {
                status: 'unhealthy' as const,
                latency: 0,
                strategiesLoaded: 0,
                templatesLoaded: 0,
                error: error instanceof Error ? error.message : 'Unknown error'
            }
        }
    }

    private buildBasicPrompt(request: OrchestrationRequest, systemPromptDirectives: string[], memoryContext: string): string {
        const { userMessage, context } = request
        const { characterProfile, conversationHistory } = context

        const recentHistory = conversationHistory
            .slice(-4)
            .map(turn => `${turn.role.toUpperCase()}: ${turn.content}`)
            .join('\n')

        const safetyDirectives = systemPromptDirectives.length > 0
            ? `\n\nSAFETY DIRECTIVES:\n${systemPromptDirectives.join('\n')}\n`
            : ''

        return `You are ${characterProfile.name}. ${characterProfile.description}

CRITICAL CONVERSATION STYLE INSTRUCTIONS:
1. Write like you're texting or messaging - NO action descriptions like "*smiles*", "*chuckles*", "*winks*", "*looks*", etc.
2. Use modern texting language: "haha", "lol", "lmao", emojis (😊, 😂, ❤️), not "*chuckles*" or "*grins*"
3. Keep responses conversational and natural (1-3 sentences typically)
4. Show emotion through words, tone, and emojis - NOT physical descriptions
5. Stay completely in character but communicate like a real person texting in 2024
6. ABSOLUTELY NO asterisks, NO stage directions, NO visual descriptions of actions
7. Use casual texting expressions: "omg", "tbh", "ngl", "fr", emojis, "haha" instead of "*laughs*"

Recent conversation:
${recentHistory}${safetyDirectives}

${memoryContext}

User: ${userMessage}

Respond as ${characterProfile.name} in natural text messaging style:`
    }

    private initializeBasicStrategies(): void {
        this.strategies = [
            {
                name: 'basic_prompt',
                priority: 1,
                applicableContexts: ['general'],
                execute: async (request) => ({
                    generatedResponse: "I understand what you're saying.",
                    confidence: 0.7
                })
            }
        ]
    }

    private initializeBasicTemplates(): void {
        this.templates = [
            {
                id: 'basic_template',
                name: 'Basic Response',
                template: 'You are a helpful AI companion. Respond naturally to: {userMessage}',
                variables: ['userMessage'],
                applicableScenarios: ['general'],
                ageCategory: 'both',
                qualityScore: 0.8
            }
        ]
    }
}

export function createPromptOrchestrationService(): PromptOrchestrationService {
    return new PromptOrchestrationService()
}
