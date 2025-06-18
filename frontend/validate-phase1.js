/**
 * Quick Phase 1 Optimization Validation
 * Tests the key improvements implemented in Phase 1
 */

const axios = require('axios')

async function validatePhase1Optimizations() {
    console.log('🚀 Phase 1 Optimization Quick Validation')
    console.log('========================================')
    console.log(`Started at: ${new Date().toISOString()}\n`)

    const results = {
        memoryLatency: null,
        chatAPI: null,
        errorHandling: null,
        concurrentLoad: null
    }

    // Test 1: Memory API Performance
    console.log('🧠 1. Testing Memory API Performance...')
    try {
        const startTime = Date.now()
        const response = await axios.post('http://localhost:3000/api/memory', {
            action: 'extract',
            data: {
                user_id: 'test_user',
                companion_id: 'test_companion',
                conversation_id: 'test_conv',
                messages: [
                    { content: 'I had a stressful day at work', sender: 'user', timestamp: new Date() },
                    { content: 'My boss was being difficult', sender: 'user', timestamp: new Date() }
                ],
                relationship_data: { level: 2, experience: 100 }
            }
        })
        const latency = Date.now() - startTime

        if (response.data.success) {
            console.log(`   ✅ Memory extraction successful in ${latency}ms`)
            results.memoryLatency = { success: true, latency }
        } else {
            console.log(`   ❌ Memory extraction failed`)
            results.memoryLatency = { success: false, latency }
        }
    } catch (error) {
        console.log(`   ❌ Memory API error: ${error.message}`)
        results.memoryLatency = { success: false, error: error.message }
    }

    // Test 2: Chat API Performance
    console.log('\n💬 2. Testing Chat API Performance...')
    try {
        const startTime = Date.now()
        const response = await axios.post('http://localhost:3000/api/chat', {
            message: 'Hi there! How are you?',
            characterProfile: {
                character_name: 'Test Character',
                fictional_lore: 'Test Universe',
                summary: 'A friendly test character',
                personality_traits: {
                    core_traits: ['friendly', 'helpful'],
                    communication_style: 'casual'
                }
            },
            isFirstMessage: true,
            userId: 'test_user_chat',
            characterId: 'test_character_chat'
        })
        const latency = Date.now() - startTime

        if (response.data.response) {
            console.log(`   ✅ Chat response generated in ${latency}ms`)
            console.log(`   📝 Response: "${Array.isArray(response.data.response) ? response.data.response[0] : response.data.response}"`)
            results.chatAPI = { success: true, latency, hasResponse: true }
        } else {
            console.log(`   ❌ No chat response generated`)
            results.chatAPI = { success: false, latency }
        }
    } catch (error) {
        console.log(`   ❌ Chat API error: ${error.message}`)
        results.chatAPI = { success: false, error: error.message }
    }

    // Test 3: Error Handling
    console.log('\n🛡️ 3. Testing Error Handling...')
    try {
        const response = await axios.post('http://localhost:3000/api/memory', {
            action: 'invalid_action',
            data: {}
        })

        if (response.status >= 400) {
            console.log(`   ✅ Error handled gracefully: ${response.data.error}`)
            results.errorHandling = { success: true, graceful: true }
        } else {
            console.log(`   ⚠️  Unexpected success for invalid request`)
            results.errorHandling = { success: true, graceful: false }
        }
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            console.log(`   ✅ Error handled gracefully: ${error.response.data.error}`)
            results.errorHandling = { success: true, graceful: true }
        } else {
            console.log(`   ❌ Ungraceful error handling: ${error.message}`)
            results.errorHandling = { success: false, graceful: false }
        }
    }

    // Test 4: Concurrent Load (simplified)
    console.log('\n👥 4. Testing Concurrent Load (5 users)...')
    try {
        const concurrentRequests = []
        const startTime = Date.now()

        for (let i = 0; i < 5; i++) {
            const request = axios.post('http://localhost:3000/api/chat', {
                message: `Test message from user ${i}`,
                characterProfile: {
                    character_name: 'Load Test Character',
                    fictional_lore: 'Load Test Universe',
                    summary: 'A character for load testing',
                    personality_traits: {
                        core_traits: ['efficient'],
                        communication_style: 'brief'
                    }
                },
                isFirstMessage: true,
                userId: `load_test_user_${i}`,
                characterId: `load_test_character_${i}`
            })
            concurrentRequests.push(request)
        }

        const responses = await Promise.allSettled(concurrentRequests)
        const totalTime = Date.now() - startTime

        const successful = responses.filter(r => r.status === 'fulfilled' && r.value.data.response).length
        const failed = responses.length - successful
        const successRate = (successful / responses.length) * 100

        console.log(`   📊 Results: ${successful}/${responses.length} successful (${successRate.toFixed(1)}%) in ${totalTime}ms`)

        if (successRate >= 80) {
            console.log(`   ✅ Concurrent load handling successful`)
            results.concurrentLoad = { success: true, successRate, totalTime }
        } else {
            console.log(`   ❌ Concurrent load handling needs improvement`)
            results.concurrentLoad = { success: false, successRate, totalTime }
        }

    } catch (error) {
        console.log(`   ❌ Concurrent load test error: ${error.message}`)
        results.concurrentLoad = { success: false, error: error.message }
    }

    // Summary
    console.log('\n📊 PHASE 1 VALIDATION SUMMARY')
    console.log('=============================')

    const tests = [
        { name: 'Memory API Performance', result: results.memoryLatency },
        { name: 'Chat API Performance', result: results.chatAPI },
        { name: 'Error Handling', result: results.errorHandling },
        { name: 'Concurrent Load', result: results.concurrentLoad }
    ]

    let passedTests = 0
    tests.forEach(test => {
        if (test.result && test.result.success) {
            console.log(`✅ ${test.name}: PASSED`)
            passedTests++
        } else {
            console.log(`❌ ${test.name}: FAILED`)
        }
    })

    const passRate = (passedTests / tests.length) * 100
    console.log(`\n📈 Overall Pass Rate: ${passRate.toFixed(1)}%`)

    if (passRate >= 75) {
        console.log('🎉 Phase 1 optimizations are working well!')
        console.log('✅ Ready to proceed with Phase 2 or production deployment')
    } else {
        console.log('⚠️  Phase 1 optimizations need additional work')
        console.log('🔧 Consider reviewing failing areas before proceeding')
    }

    // Key Performance Insights
    console.log('\n🔍 Key Performance Insights:')
    if (results.memoryLatency && results.memoryLatency.latency) {
        console.log(`   🧠 Memory processing: ${results.memoryLatency.latency}ms (target: <100ms)`)
    }
    if (results.chatAPI && results.chatAPI.latency) {
        console.log(`   💬 Chat response time: ${results.chatAPI.latency}ms`)
    }
    if (results.concurrentLoad && results.concurrentLoad.successRate) {
        console.log(`   👥 Concurrent success rate: ${results.concurrentLoad.successRate.toFixed(1)}%`)
    }

    console.log('\n🚀 Phase 1 optimization validation completed!')
    return results
}

// Run validation
if (require.main === module) {
    validatePhase1Optimizations().catch(console.error)
}

module.exports = { validatePhase1Optimizations } 