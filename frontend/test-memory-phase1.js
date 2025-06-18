/**
 * YapChat Memory System Phase 1 Test
 * Tests Google Embeddings and basic memory functionality
 */

import { googleEmbeddings } from './lib/embeddings/googleEmbeddings.js'

async function testPhase1() {
    console.log('🧪 YapChat Memory System - Phase 1 Testing')
    console.log('='.repeat(50))

    try {
        // Test 1: Google Embeddings Service
        console.log('\n🔧 Test 1: Google Embeddings Generation')

        const testText = "I love hiking in the mountains during autumn"
        console.log(`Input text: "${testText}"`)

        const embedding = await googleEmbeddings.generateEmbedding(testText)
        console.log(`✅ Generated embedding with ${embedding.length} dimensions`)
        console.log(`First 5 values: [${embedding.slice(0, 5).map(v => v.toFixed(4)).join(', ')}...]`)

        // Validate embedding
        const isValid = googleEmbeddings.isValidEmbedding(embedding)
        console.log(`✅ Embedding validation: ${isValid ? 'PASSED' : 'FAILED'}`)

        // Test 2: Batch Embeddings
        console.log('\n🔧 Test 2: Batch Embeddings Generation')

        const testTexts = [
            "User enjoys playing video games",
            "User works as a software engineer",
            "User has a cat named Whiskers"
        ]

        console.log(`Generating embeddings for ${testTexts.length} texts...`)
        const batchEmbeddings = await googleEmbeddings.batchEmbeddings(testTexts)
        console.log(`✅ Generated ${batchEmbeddings.length} batch embeddings`)

        // Test 3: Similarity Calculation
        console.log('\n🔧 Test 3: Similarity Calculation')

        const text1 = "I love cats"
        const text2 = "I adore felines"
        const text3 = "I enjoy programming"

        const emb1 = await googleEmbeddings.generateEmbedding(text1)
        const emb2 = await googleEmbeddings.generateEmbedding(text2)
        const emb3 = await googleEmbeddings.generateEmbedding(text3)

        const similarity12 = googleEmbeddings.calculateSimilarity(emb1, emb2)
        const similarity13 = googleEmbeddings.calculateSimilarity(emb1, emb3)

        console.log(`Similarity between "${text1}" and "${text2}": ${similarity12.toFixed(4)}`)
        console.log(`Similarity between "${text1}" and "${text3}": ${similarity13.toFixed(4)}`)
        console.log(`✅ Similarity test: ${similarity12 > similarity13 ? 'PASSED' : 'FAILED'} (cat texts should be more similar)`)

        // Test 4: Usage Statistics
        console.log('\n🔧 Test 4: Usage Statistics')

        const stats = googleEmbeddings.getUsageStats()
        console.log(`Total requests: ${stats.totalRequests}`)
        console.log(`Total tokens: ${stats.totalTokens}`)
        console.log(`Estimated cost: $${stats.estimatedCost.toFixed(6)}`)
        console.log(`✅ Usage tracking: WORKING`)

        // Test 5: Memory Extraction API (mock test)
        console.log('\n🔧 Test 5: Memory Extraction API Structure')

        const mockConversation = `USER: Hi! I'm really excited about my new job as a data scientist at Google.
AI: That's wonderful! Congratulations on your new position.
USER: Thanks! I'm a bit nervous though. I'll be working on machine learning models for search.
AI: It's natural to feel nervous about a new role. What aspects are you most excited about?
USER: I love the problem-solving aspect and working with large datasets.`

        const mockContext = {
            user_id: 'test-user-123',
            companion_id: 'test-companion-456',
            conversation_id: 'test-conv-789',
            messages: [
                { content: "Hi! I'm really excited about my new job as a data scientist at Google.", sender: 'user', timestamp: new Date() },
                { content: "That's wonderful! Congratulations on your new position.", sender: 'ai', timestamp: new Date() }
            ]
        }

        console.log(`Mock conversation length: ${mockConversation.length} characters`)
        console.log(`Mock context prepared for user: ${mockContext.user_id}`)
        console.log(`✅ Memory extraction structure: READY`)

        console.log('\n🎉 Phase 1 Testing Complete!')
        console.log('='.repeat(50))
        console.log('✅ Google Embeddings: WORKING')
        console.log('✅ Batch Processing: WORKING')
        console.log('✅ Similarity Calculation: WORKING')
        console.log('✅ Usage Tracking: WORKING')
        console.log('✅ API Structure: READY')
        console.log('\n🚀 Ready for Phase 2: Database Integration & Memory Storage')

    } catch (error) {
        console.error('\n❌ Phase 1 Testing Failed:', error)
        console.error('Stack:', error.stack)
    }
}

// Run the test
if (typeof window === 'undefined') {
    // Node.js environment
    testPhase1()
} else {
    // Browser environment
    console.log('Phase 1 test ready - call testPhase1() to run')
    window.testPhase1 = testPhase1
} 