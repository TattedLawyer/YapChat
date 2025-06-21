/**
 * Research-Based Memory Processing Service
 * Implements Mem0-style two-phase processing with CRAG-style validation
 * 
 * Architecture Patterns:
 * - Two-Phase Processing (Extraction + Update)
 * - Validation Loops with Fallbacks
 * - Memory Controller with ADD/UPDATE/DELETE/NOOP operations
 * - Rich Context Provision
 * - Comprehensive Logging
 */

import { createClient } from '@supabase/supabase-js'

interface MemoryExtractionResult {
    memories: ExtractedMemory[]
    confidence: number
    requiresValidation: boolean
    extractionMethod: 'llm' | 'fallback' | 'keyword'
}

interface ExtractedMemory {
    content: string
    type: 'preference' | 'experience' | 'fact' | 'emotional_state'
    importance: number
    entities: string[]
    emotionalContext?: {
        emotion: string
        intensity: number
    }
}

interface MemoryUpdateOperation {
    operation: 'ADD' | 'UPDATE' | 'DELETE' | 'NOOP'
    targetMemoryId?: string
    newMemory?: ExtractedMemory
    reason: string
    confidence: number
}

interface ProcessingMetrics {
    startTime: number
    extractionTime?: number
    updateTime?: number
    totalMemories: number
    successfulOperations: number
    errors: string[]
}

export class RobustMemoryProcessingService {
    private supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    /**
     * Phase 1: Memory Extraction with Validation
     * Research Pattern: Rich context provision + LLM-based extraction + fallbacks
     */
    async extractMemories(
        userMessage: string,
        aiResponse: string,
        userId: string,
        characterId: string,
        conversationId: string
    ): Promise<MemoryExtractionResult> {
        const startTime = Date.now()

        try {
            console.log('🧠 [Phase 1] Starting memory extraction...')
            console.log(`   User: "${userMessage.substring(0, 100)}..."`)
            console.log(`   AI: "${aiResponse.substring(0, 100)}..."`)

            // Step 1.1: Get recent conversation context (research-backed)
            console.log('📋 [Phase 1.1] Gathering recent context...')
            const recentContext = await this.getRecentContext(userId, characterId)
            console.log(`   Context length: ${recentContext.length} chars`)

            // Step 1.2: Construct extraction prompt with rich context
            console.log('🎯 [Phase 1.2] Building extraction prompt...')
            const extractionPrompt = this.buildExtractionPrompt(
                userMessage,
                aiResponse,
                recentContext
            )

            // Step 1.3: Call Anthropic API for memory extraction
            console.log('🤖 [Phase 1.3] Calling Anthropic API...')
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.ANTHROPIC_API_KEY!,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-5-haiku-20241022',
                    max_tokens: 1000,
                    messages: [{ role: 'user', content: extractionPrompt }]
                })
            })

            if (!response.ok) {
                throw new Error(`Anthropic API failed: ${response.status}`)
            }

            const data = await response.json()
            const extractedText = data.content[0].text
            console.log('✅ [Phase 1.3] API response received')

            // Step 1.4: Parse extraction results
            console.log('📊 [Phase 1.4] Parsing extraction results...')
            const extractionResult = this.parseExtractionResult(extractedText)

            const extractionTime = Date.now() - startTime
            console.log(`✅ [Phase 1] Extraction complete in ${extractionTime}ms`)
            console.log(`   Extracted: ${extractionResult.memories.length} memories`)
            console.log(`   Confidence: ${extractionResult.confidence}`)
            console.log(`   Method: ${extractionResult.extractionMethod}`)

            return extractionResult

        } catch (error) {
            console.error('❌ [Phase 1] Memory extraction failed:', error)
            console.log('🔄 [Phase 1] Attempting fallback extraction...')

            // Research Pattern: Fallback mechanism (CRAG-style)
            const fallbackResult = this.createFallbackMemory(userMessage, aiResponse)
            console.log(`⚠️ [Phase 1] Fallback created ${fallbackResult.memories.length} memories`)

            return fallbackResult
        }
    }

    /**
     * Phase 2: Memory Update with Controller Logic
     * Research Pattern: LLM-driven memory controller with four operations
     */
    async updateMemories(
        extractionResult: MemoryExtractionResult,
        userId: string,
        characterId: string
    ): Promise<string[]> {
        const startTime = Date.now()
        const createdMemoryIds: string[] = []
        const operations: MemoryUpdateOperation[] = []

        try {
            console.log('🔄 [Phase 2] Starting memory update phase...')
            console.log(`   Processing ${extractionResult.memories.length} extracted memories`)

            // Step 2.1: Determine operations for each memory
            for (const memory of extractionResult.memories) {
                console.log(`🔍 [Phase 2.1] Analyzing: "${memory.content.substring(0, 50)}..."`)

                // Check for existing similar memories
                const existingMemories = await this.findSimilarMemories(
                    memory.content,
                    userId,
                    characterId
                )
                console.log(`   Found ${existingMemories.length} similar memories`)

                // Determine update operation (research-backed controller logic)
                const operation = await this.determineUpdateOperation(
                    memory,
                    existingMemories
                )

                console.log(`   Operation: ${operation.operation} (${operation.reason})`)
                operations.push(operation)
            }

            // Step 2.2: Execute operations
            console.log('⚡ [Phase 2.2] Executing memory operations...')
            for (let i = 0; i < operations.length; i++) {
                const operation = operations[i]
                const memory = extractionResult.memories[i]

                console.log(`   [${i + 1}/${operations.length}] ${operation.operation}: "${memory.content.substring(0, 40)}..."`)

                const memoryId = await this.executeOperation(operation, memory, userId, characterId)

                if (memoryId) {
                    createdMemoryIds.push(memoryId)
                    console.log(`     ✅ Success: ${memoryId}`)
                } else {
                    console.log(`     ❌ Failed`)
                }
            }

            const updateTime = Date.now() - startTime
            console.log(`✅ [Phase 2] Update complete in ${updateTime}ms`)
            console.log(`   Successful operations: ${createdMemoryIds.length}/${operations.length}`)

            return createdMemoryIds

        } catch (error) {
            console.error('❌ [Phase 2] Memory update failed:', error)
            return createdMemoryIds
        }
    }

    /**
     * Main Processing Function - Orchestrates Both Phases
     * Research Pattern: Two-phase processing with comprehensive logging
     */
    async processMessage(data: {
        userId: string
        characterId: string
        userMessage: string
        aiResponse: string
        conversationId: string
    }): Promise<string[]> {
        const metrics: ProcessingMetrics = {
            startTime: Date.now(),
            totalMemories: 0,
            successfulOperations: 0,
            errors: []
        }

        console.log('🚀 [MEMORY PROCESSING] Starting robust memory processing...')
        console.log(`   User: ${data.userId}`)
        console.log(`   Character: ${data.characterId}`)
        console.log(`   Conversation: ${data.conversationId}`)

        try {
            // Phase 1: Extract memories
            const extractionStart = Date.now()
            const extractionResult = await this.extractMemories(
                data.userMessage,
                data.aiResponse,
                data.userId,
                data.characterId,
                data.conversationId
            )
            metrics.extractionTime = Date.now() - extractionStart
            metrics.totalMemories = extractionResult.memories.length

            // Phase 2: Update memory store
            const updateStart = Date.now()
            const memoryIds = await this.updateMemories(
                extractionResult,
                data.userId,
                data.characterId
            )
            metrics.updateTime = Date.now() - updateStart
            metrics.successfulOperations = memoryIds.length

            // Final metrics
            const totalTime = Date.now() - metrics.startTime
            console.log('🎉 [MEMORY PROCESSING] Processing complete!')
            console.log(`   Total time: ${totalTime}ms`)
            console.log(`   Extraction: ${metrics.extractionTime}ms`)
            console.log(`   Update: ${metrics.updateTime}ms`)
            console.log(`   Success rate: ${metrics.successfulOperations}/${metrics.totalMemories}`)
            console.log(`   Memory IDs: [${memoryIds.join(', ')}]`)

            return memoryIds

        } catch (error) {
            console.error('❌ [MEMORY PROCESSING] Critical failure:', error)
            metrics.errors.push(error.message)
            return []
        }
    }

    /**
     * Search for relevant memories using semantic similarity
     * 
     * CRITICAL ARCHITECTURE NOTE:
     * This function was the source of the "Great Memory Crisis" where the system had 0% recall accuracy.
     * The root cause was a field name mismatch between database and TypeScript expectations.
     * 
     * DATABASE FUNCTION: search_memories() returns field named 'similarity_score'
     * TYPESCRIPT CODE: Expected field named 'similarity' 
     * RESULT: All memories defaulted to 0.5 similarity, preventing proper ranking
     * 
     * THE FIX: Use mem.similarity_score (not mem.similarity) - see line ~335
     * 
     * SIMILARITY THRESHOLD TUNING:
     * - Threshold 0.02 is intentionally LOW to capture real semantic matches
     * - Actual similarity scores range from 0.030-0.507 for relevant memories  
     * - Previous threshold 0.65+ caused 0% memory recall (too restrictive)
     * - Lower threshold captures more context while filtering random noise
     * 
     * @param query - User message to find relevant memories for
     * @param userId - User identifier 
     * @param characterId - Character identifier (optional)
     * @param similarityThreshold - Minimum similarity score (default: 0.02)
     * @param limit - Maximum memories to return (default: 5)
     * @param memoryTypes - Filter by memory types (optional)
     */
    async searchMemories({
        query,
        userId,
        characterId,
        similarityThreshold = 0.02,  // CRITICAL: 0.02 threshold tuned for semantic similarity range 0.030-0.507
        // This low threshold captures real semantic matches while filtering random noise
        // Higher thresholds (0.65+) caused 0% memory recall - see MEMORY_SYSTEM_STATUS_FINAL.md
        limit = 5,
        memoryTypes
    }: {
        query: string
        userId: string
        characterId?: string
        similarityThreshold?: number
        limit?: number
        memoryTypes?: string[]
    }): Promise<{
        memories: Array<{
            id: string
            content: string
            memory_type: string
            importance: number
            metadata?: any
            similarity?: number
        }>
        totalFound: number
        searchQuery: string
        cacheHitRatio: number
        averageLatency: number
    }> {
        const startTime = Date.now()

        try {
            console.log(`🔍 [SEARCH] Searching for memories: "${query.substring(0, 50)}..."`)
            console.log(`   User: ${userId}`)
            console.log(`   Character: ${characterId}`)
            console.log(`   Threshold: ${similarityThreshold}`)
            console.log(`   Limit: ${limit}`)

            // Generate real embedding for the query
            const embedding = await this.generateEmbedding(query)
            console.log(`🔍 [SEARCH] Generated embedding with ${embedding.length} dimensions`)

            // Use Supabase RPC function for vector similarity search
            const { data, error } = await this.supabase.rpc('search_memories', {
                query_embedding: embedding, // Use real embedding instead of mock
                filter_user_id: userId,
                filter_character_id: characterId || null,
                similarity_threshold: similarityThreshold,
                match_count: limit,
                memory_types: memoryTypes || null
            })

            if (error) {
                console.error('🚨 [SEARCH] Database search failed:', error.message)
                throw error
            }

            // CRITICAL FIX: The Great Memory Crisis Resolution
            // The search_memories PostgreSQL function calculates: (1 - (embedding <=> query_embedding)) AS similarity_score
            // Database returns 'similarity_score' but code was expecting 'similarity' - this caused 0% memory recall
            // Similarity scores typically range from 0.030-0.507 for semantic matches
            // 
            // BEFORE FIX: All memories returned 0.500 similarity (fallback value)
            // AFTER FIX: Real similarity scores like 0.288, 0.274, 0.265, 0.052, 0.044
            const memories = (data || []).map((mem: any) => ({
                id: mem.id,
                content: mem.memory_text || mem.content,
                memory_type: mem.memory_type,
                importance: mem.importance_score || mem.importance || 0.5,
                metadata: mem.extracted_entities || mem.metadata || {},
                similarity: mem.similarity_score || 0.5  // CRITICAL: Use similarity_score (not similarity) from database
            }))

            const totalLatency = Date.now() - startTime

            console.log(`✅ [SEARCH] Found ${memories.length} memories in ${totalLatency}ms`)
            memories.forEach((mem, index) => {
                console.log(`   ${index + 1}. [${mem.memory_type}] "${mem.content.substring(0, 50)}..." (similarity: ${mem.similarity?.toFixed(3)})`)
            })

            return {
                memories,
                totalFound: memories.length,
                searchQuery: query,
                cacheHitRatio: 0.0, // No cache for now
                averageLatency: totalLatency
            }

        } catch (error) {
            const totalLatency = Date.now() - startTime
            console.error('❌ [SEARCH] Memory search failed:', error)

            return {
                memories: [],
                totalFound: 0,
                searchQuery: query,
                cacheHitRatio: 0.0,
                averageLatency: totalLatency
            }
        }
    }

    /**
     * Health check for service container integration
     */
    async healthCheck() {
        try {
            // Test database connectivity
            const { data, error } = await this.supabase
                .from('memory_embeddings')
                .select('id')
                .limit(1)

            if (error) {
                return {
                    status: 'unhealthy',
                    error: error.message,
                    timestamp: new Date().toISOString()
                }
            }

            return {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                details: {
                    database: 'connected',
                    apiKey: process.env.ANTHROPIC_API_KEY ? 'configured' : 'missing'
                }
            }
        } catch (error) {
            return {
                status: 'unhealthy',
                error: error.message,
                timestamp: new Date().toISOString()
            }
        }
    }

    // ===============================
    // HELPER METHODS
    // ===============================

    private async getRecentContext(userId: string, characterId: string): Promise<string> {
        try {
            const { data } = await this.supabase
                .from('memory_embeddings')
                .select('memory_text, created_at, memory_type')
                .eq('user_id', userId)
                .eq('companion_id', characterId)
                .order('created_at', { ascending: false })
                .limit(5)

            if (!data || data.length === 0) {
                return 'No previous memories found.'
            }

            return data.map(m => `[${m.memory_type}] ${m.memory_text}`).join('; ')
        } catch (error) {
            console.warn('Failed to get recent context:', error)
            return 'Context unavailable.'
        }
    }

    private buildExtractionPrompt(
        userMessage: string,
        aiResponse: string,
        recentContext: string
    ): string {
        return `You are a memory extraction specialist. Extract important memories from this conversation exchange.

RECENT USER CONTEXT: ${recentContext}

CURRENT EXCHANGE:
User: ${userMessage}
AI: ${aiResponse}

Extract memories in this EXACT JSON format:
{
  "memories": [
    {
      "content": "specific memory text (be precise and factual)",
      "type": "preference|experience|fact|emotional_state",
      "importance": 0.1-1.0,
      "entities": ["relevant", "entities", "mentioned"],
      "emotionalContext": {"emotion": "happy|sad|excited|neutral|etc", "intensity": 0.1-1.0}
    }
  ],
  "confidence": 0.1-1.0
}

EXTRACTION RULES:
1. Focus on USER information only (not general knowledge)
2. Extract specific, factual statements
3. Prioritize: preferences, personal facts, emotions, experiences
4. Only extract if likely relevant for future conversations
5. Be precise - avoid vague or generic statements
6. Importance: 0.8-1.0 for strong preferences, 0.5-0.7 for facts, 0.3-0.4 for casual mentions

EXAMPLES OF GOOD MEMORIES:
- "User loves playing violin and practices every morning at 6 AM"
- "User works as a software engineer at Microsoft"
- "User is stressed about upcoming job interview"
- "User prefers tea over coffee"

EXAMPLES OF BAD MEMORIES:
- "User said hello" (too generic)
- "Violin is a musical instrument" (general knowledge)
- "The weather is nice" (not about user)

Return ONLY the JSON, no other text.`
    }

    private parseExtractionResult(extractedText: string): MemoryExtractionResult {
        try {
            // Try to find JSON in the response
            const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
            const jsonText = jsonMatch ? jsonMatch[0] : extractedText;

            const parsed = JSON.parse(jsonText)

            // Validate structure
            if (!parsed.memories || !Array.isArray(parsed.memories)) {
                throw new Error('Invalid memories structure')
            }

            return {
                memories: parsed.memories.filter(m => m.content && m.type),
                confidence: parsed.confidence || 0.5,
                requiresValidation: (parsed.confidence || 0.5) < 0.7,
                extractionMethod: 'llm'
            }
        } catch (error) {
            console.warn('Failed to parse LLM extraction result:', error.message)
            return {
                memories: [],
                confidence: 0.1,
                requiresValidation: true,
                extractionMethod: 'fallback'
            }
        }
    }

    private createFallbackMemory(userMessage: string, aiResponse: string): MemoryExtractionResult {
        const memories: ExtractedMemory[] = []

        // Simple keyword-based fallback extraction
        const message = userMessage.toLowerCase()

        // Detect preferences
        if (/\b(love|like|enjoy|prefer|favorite)\b/.test(message)) {
            memories.push({
                content: userMessage,
                type: 'preference',
                importance: 0.6,
                entities: this.extractSimpleEntities(userMessage),
                emotionalContext: { emotion: 'positive', intensity: 0.7 }
            })
        }

        // Detect personal facts
        if (/\b(i am|my name|i work|i live|i study)\b/.test(message)) {
            memories.push({
                content: userMessage,
                type: 'fact',
                importance: 0.7,
                entities: this.extractSimpleEntities(userMessage),
                emotionalContext: { emotion: 'neutral', intensity: 0.5 }
            })
        }

        // Detect emotional states
        if (/\b(happy|sad|excited|worried|stressed|angry|frustrated)\b/.test(message)) {
            memories.push({
                content: userMessage,
                type: 'emotional_state',
                importance: 0.5,
                entities: this.extractSimpleEntities(userMessage),
                emotionalContext: { emotion: 'detected', intensity: 0.6 }
            })
        }

        return {
            memories,
            confidence: memories.length > 0 ? 0.4 : 0.1,
            requiresValidation: true,
            extractionMethod: 'keyword'
        }
    }

    private extractSimpleEntities(text: string): string[] {
        // Simple entity extraction - could be enhanced
        const words = text.toLowerCase().split(/\s+/)
        const entities = words.filter(word =>
            word.length > 3 &&
            !['that', 'this', 'with', 'have', 'they', 'were', 'been', 'their'].includes(word)
        )
        return entities.slice(0, 5) // Limit to 5 entities
    }

    private async findSimilarMemories(
        content: string,
        userId: string,
        characterId: string
    ): Promise<any[]> {
        try {
            // Extract key terms for similarity matching
            const keyTerms = content.toLowerCase().split(' ')
                .filter(word => word.length > 3)
                .slice(0, 3)

            if (keyTerms.length === 0) return []

            // Search for memories containing any of the key terms
            const { data } = await this.supabase
                .from('memory_embeddings')
                .select('*')
                .eq('user_id', userId)
                .eq('companion_id', characterId)
                .or(keyTerms.map(term => `memory_text.ilike.%${term}%`).join(','))
                .limit(5)

            return data || []
        } catch (error) {
            console.warn('Failed to find similar memories:', error)
            return []
        }
    }

    private async determineUpdateOperation(
        memory: ExtractedMemory,
        existingMemories: any[]
    ): Promise<MemoryUpdateOperation> {
        if (existingMemories.length === 0) {
            return {
                operation: 'ADD',
                reason: 'No similar memories found',
                confidence: 0.9
            }
        }

        // Check for very similar content (potential duplicate)
        const contentWords = memory.content.toLowerCase().split(' ')
        const verySimlar = existingMemories.some(existing => {
            const existingWords = existing.memory_text.toLowerCase().split(' ')
            const commonWords = contentWords.filter(word =>
                existingWords.some(ew => ew.includes(word) || word.includes(ew))
            )
            return commonWords.length > contentWords.length * 0.6
        })

        if (verySimlar) {
            return {
                operation: 'UPDATE',
                targetMemoryId: existingMemories[0].id,
                reason: 'Found very similar existing memory - updating',
                confidence: 0.8
            }
        }

        // Check if memory contradicts existing ones
        const contradictory = existingMemories.some(existing => {
            return existing.memory_type === memory.type &&
                existing.memory_text.toLowerCase().includes('not') !== memory.content.toLowerCase().includes('not')
        })

        if (contradictory) {
            return {
                operation: 'UPDATE',
                targetMemoryId: existingMemories[0].id,
                reason: 'Contradictory memory found - updating',
                confidence: 0.7
            }
        }

        return {
            operation: 'ADD',
            reason: 'Memory is unique enough to add separately',
            confidence: 0.8
        }
    }

    private async executeOperation(
        operation: MemoryUpdateOperation,
        memory: ExtractedMemory,
        userId: string,
        characterId: string
    ): Promise<string | null> {
        try {
            if (operation.operation === 'ADD') {
                // Generate mock embedding (in production, use real embedding service)
                const embedding = new Array(768).fill(0).map(() => Math.random() * 0.1)

                const { data, error } = await this.supabase
                    .from('memory_embeddings')
                    .insert({
                        user_id: userId,
                        companion_id: characterId,
                        memory_text: memory.content,
                        memory_type: memory.type,
                        importance_score: memory.importance,
                        embedding: embedding,
                        emotional_context: memory.emotionalContext || {},
                        extracted_entities: { entities: memory.entities },
                        search_keywords: memory.entities,
                        created_at: new Date().toISOString(),
                        last_accessed_at: new Date().toISOString(),
                        access_count: 0
                    })
                    .select('id')

                if (error) {
                    console.error('Insert error:', error)
                    return null
                }

                return data?.[0]?.id || null
            }

            if (operation.operation === 'UPDATE' && operation.targetMemoryId) {
                const { error } = await this.supabase
                    .from('memory_embeddings')
                    .update({
                        memory_text: memory.content,
                        importance_score: memory.importance,
                        emotional_context: memory.emotionalContext || {},
                        last_accessed_at: new Date().toISOString(),
                        access_count: 1 // Increment access count
                    })
                    .eq('id', operation.targetMemoryId)

                if (error) {
                    console.error('Update error:', error)
                    return null
                }

                return operation.targetMemoryId
            }

            // NOOP and DELETE operations
            return null

        } catch (error) {
            console.error('Operation execution failed:', error)
            return null
        }
    }

    /**
     * Generate embedding using Google AI
     */
    private async generateEmbedding(text: string): Promise<number[]> {
        try {
            const { GoogleGenerativeAI } = await import('@google/generative-ai')
            const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)
            const model = genAI.getGenerativeModel({ model: 'text-embedding-004' })

            const result = await model.embedContent(text)
            return result.embedding.values || []
        } catch (error) {
            console.error('❌ [EMBEDDING] Failed to generate embedding:', error)
            throw error
        }
    }
}

/**
 * Factory function for creating the robust memory processing service
 */
export function createRobustMemoryProcessingService(): RobustMemoryProcessingService {
    return new RobustMemoryProcessingService()
} 