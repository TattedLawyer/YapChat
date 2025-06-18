import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.24.3'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MemoryExtractionRequest {
    conversationText: string
    context: {
        user_id: string
        companion_id: string
        conversation_id: string
        relationship_data?: any
        user_personality?: any
    }
    model?: string
}

interface ExtractedMemory {
    text: string
    type: 'conversational' | 'episodic' | 'semantic' | 'emotional' | 'preference' | 'milestone' | 'contextual'
    importance: number
    emotional_intensity: number
    keywords: string[]
    metadata: Record<string, any>
    entities: {
        people?: string[]
        places?: string[]
        topics?: string[]
        activities?: string[]
    }
    emotional_context: {
        sentiment: 'positive' | 'negative' | 'neutral'
        emotion?: string
        intensity: number
    }
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Initialize Anthropic client
        const anthropic = new Anthropic({
            apiKey: Deno.env.get('ANTHROPIC_API_KEY') ?? '',
        })

        // Parse request
        const { conversationText, context, model = 'claude-3-5-haiku-20241022' }: MemoryExtractionRequest = await req.json()

        if (!conversationText || !context) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields: conversationText, context' }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        console.log(`🧠 Extracting memories from conversation for user ${context.user_id}`)

        // Build the extraction prompt
        const prompt = buildMemoryExtractionPrompt(conversationText, context)

        // Call Claude 3.5 Haiku for memory extraction
        const message = await anthropic.messages.create({
            model,
            max_tokens: 4000,
            temperature: 0.1, // Low temperature for consistent extraction
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        })

        // Parse the response
        const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

        let extractionResult
        try {
            extractionResult = JSON.parse(responseText)
        } catch (parseError) {
            console.error('Failed to parse LLM response:', parseError)
            return new Response(
                JSON.stringify({ error: 'Failed to parse memory extraction response' }),
                {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        // Calculate estimated cost
        const inputTokens = Math.ceil(prompt.length / 4) // Rough estimation
        const outputTokens = Math.ceil(responseText.length / 4)
        const estimatedCost = (inputTokens * 0.00025 + outputTokens * 0.00125) / 1000 // Claude 3.5 Haiku pricing

        // Validate and clean extracted memories
        const validatedMemories = validateExtractedMemories(extractionResult.memories || [])

        const result = {
            memories: validatedMemories,
            metadata: {
                extraction_method: 'claude_haiku',
                model_used: model,
                conversation_length: conversationText.length,
                memories_extracted: validatedMemories.length,
                processing_timestamp: new Date().toISOString(),
                ...extractionResult.metadata
            },
            estimatedCost,
            usage: {
                input_tokens: inputTokens,
                output_tokens: outputTokens,
                total_tokens: inputTokens + outputTokens
            }
        }

        console.log(`🧠 Successfully extracted ${validatedMemories.length} memories`)

        return new Response(
            JSON.stringify(result),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )

    } catch (error) {
        console.error('Memory extraction error:', error)
        return new Response(
            JSON.stringify({
                error: 'Memory extraction failed',
                details: error.message
            }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    }
})

function buildMemoryExtractionPrompt(conversationText: string, context: any): string {
    return `You are an expert memory extraction system for an AI companion application. Your task is to analyze conversations and extract meaningful, persistent memories that will help the AI companion maintain context and build deeper relationships.

CONVERSATION TO ANALYZE:
${conversationText}

CONTEXT INFORMATION:
- User ID: ${context.user_id}
- Companion ID: ${context.companion_id}
- Conversation ID: ${context.conversation_id}
- Relationship Level: ${context.relationship_data?.level || 'New'}
- User Personality: ${JSON.stringify(context.user_personality || {}, null, 2)}

MEMORY EXTRACTION GUIDELINES:
Extract memories that are:
1. **Personally significant** - Information about the user's life, experiences, preferences
2. **Emotionally meaningful** - Moments that carry emotional weight or significance
3. **Contextually important** - Information needed to maintain conversation flow
4. **Relationship building** - Moments that develop the user-companion relationship
5. **Preference indicators** - User likes, dislikes, interests, values
6. **Factual information** - Important facts about the user's life, work, family, etc.

MEMORY TYPES:
- **conversational**: Direct quotes or exchanges that should be remembered
- **episodic**: Specific events, experiences, or stories shared by the user
- **semantic**: Facts, knowledge, preferences, or general information about the user
- **emotional**: Emotional states, feelings, or emotionally charged moments
- **preference**: User likes, dislikes, interests, or values
- **milestone**: Important relationship or life milestones
- **contextual**: Environmental or situational context that affects the relationship

EXTRACTION RULES:
- Focus on the USER'S information, not the AI's responses
- Prioritize unique, personal information over generic responses
- Extract specific details rather than vague generalizations
- Consider emotional context and relationship dynamics
- Assign importance scores based on personal significance (0.1-1.0)
- Assign emotional intensity based on emotional weight (0.0-1.0)
- Generate relevant keywords for each memory
- Extract entities (people, places, topics, activities)
- Analyze emotional context (sentiment, emotion, intensity)

OUTPUT FORMAT:
Return a JSON object with this exact structure:

{
  "memories": [
    {
      "text": "Specific memory content here",
      "type": "semantic|episodic|emotional|preference|conversational|milestone|contextual",
      "importance": 0.8,
      "emotional_intensity": 0.6,
      "keywords": ["keyword1", "keyword2", "keyword3"],
      "metadata": {
        "topic": "category",
        "context": "additional context"
      },
      "entities": {
        "people": ["person1", "person2"],
        "places": ["place1"],
        "topics": ["topic1", "topic2"],
        "activities": ["activity1"]
      },
      "emotional_context": {
        "sentiment": "positive|negative|neutral",
        "emotion": "joy|sadness|excitement|etc",
        "intensity": 0.7
      }
    }
  ],
  "metadata": {
    "conversation_summary": "Brief summary of what happened in this conversation",
    "key_themes": ["theme1", "theme2"],
    "relationship_development": "How the relationship progressed in this conversation"
  }
}

IMPORTANT: Only extract memories that are genuinely worth remembering. Quality over quantity. If the conversation contains no meaningful information to remember, return an empty memories array.

Now analyze the conversation and extract the memories:`
}

function validateExtractedMemories(memories: any[]): ExtractedMemory[] {
    const validMemoryTypes = ['conversational', 'episodic', 'semantic', 'emotional', 'preference', 'milestone', 'contextual']
    const validSentiments = ['positive', 'negative', 'neutral']

    return memories
        .filter(memory => {
            // Basic validation
            if (!memory.text || typeof memory.text !== 'string') return false
            if (!memory.type || !validMemoryTypes.includes(memory.type)) return false
            if (typeof memory.importance !== 'number' || memory.importance < 0 || memory.importance > 1) return false
            if (typeof memory.emotional_intensity !== 'number' || memory.emotional_intensity < 0 || memory.emotional_intensity > 1) return false

            return true
        })
        .map(memory => ({
            text: memory.text.trim(),
            type: memory.type,
            importance: Math.max(0, Math.min(1, memory.importance)),
            emotional_intensity: Math.max(0, Math.min(1, memory.emotional_intensity)),
            keywords: Array.isArray(memory.keywords) ? memory.keywords.filter(k => typeof k === 'string').slice(0, 10) : [],
            metadata: typeof memory.metadata === 'object' ? memory.metadata : {},
            entities: {
                people: Array.isArray(memory.entities?.people) ? memory.entities.people.slice(0, 5) : [],
                places: Array.isArray(memory.entities?.places) ? memory.entities.places.slice(0, 5) : [],
                topics: Array.isArray(memory.entities?.topics) ? memory.entities.topics.slice(0, 10) : [],
                activities: Array.isArray(memory.entities?.activities) ? memory.entities.activities.slice(0, 5) : []
            },
            emotional_context: {
                sentiment: validSentiments.includes(memory.emotional_context?.sentiment)
                    ? memory.emotional_context.sentiment
                    : 'neutral',
                emotion: typeof memory.emotional_context?.emotion === 'string'
                    ? memory.emotional_context.emotion
                    : undefined,
                intensity: typeof memory.emotional_context?.intensity === 'number'
                    ? Math.max(0, Math.min(1, memory.emotional_context.intensity))
                    : memory.emotional_intensity
            }
        }))
        .slice(0, 20) // Limit to 20 memories per extraction
} 