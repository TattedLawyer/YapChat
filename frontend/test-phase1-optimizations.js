/**
 * YapChat Phase 1 Optimization Validation Tests
 * 
 * Focus Areas:
 * 1. Memory Retrieval Performance (Target: <100ms)
 * 2. Memory Recall Accuracy (Target: >80%)
 * 3. Concurrent Load Performance (Target: 90%+ success rate)
 * 4. Cost Optimization Maintenance (Target: <$0.0058)
 * 5. Error Recovery & Resilience (Target: >80% recovery rate)
 */

const axios = require('axios')

class Phase1OptimizationTester {
    constructor() {
        this.config = {
            API_BASE: 'http://localhost:3000/api',
            MEMORY_LATENCY_TARGET: 100, // ms
            RECALL_ACCURACY_TARGET: 80, // %
            CONCURRENT_SUCCESS_TARGET: 90, // %
            COST_TARGET: 0.0058, // $ per engagement
            RECOVERY_RATE_TARGET: 80, // %
            TEST_ITERATIONS: 20,
            CONCURRENT_USERS: 10
        }

        this.results = {
            memoryLatency: [],
            recallAccuracy: [],
            concurrentLoad: [],
            costPerformance: [],
            errorRecovery: []
        }

        this.metrics = {
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            warnings: 0
        }
    }

    async runPhase1Tests() {
        console.log('🚀 YapChat Phase 1 Optimization Validation')
        console.log('==========================================')
        console.log(`Started at: ${new Date().toISOString()}`)
        console.log(`Configuration:`, JSON.stringify(this.config, null, 2))
        console.log('')

        // Test 1: Memory Performance Optimization
        await this.testMemoryPerformance()

        // Test 2: Memory Recall Accuracy
        await this.testMemoryRecallAccuracy()

        // Test 3: Concurrent Load Performance
        await this.testConcurrentLoadPerformance()

        // Test 4: Cost Performance Maintenance
        await this.testCostPerformanceMaintenance()

        // Test 5: Error Recovery & Resilience
        await this.testErrorRecoveryResilience()

        // Generate summary report
        this.generatePhase1Report()
    }

    async testMemoryPerformance() {
        console.log('🧠 1. MEMORY PERFORMANCE OPTIMIZATION')
        console.log('====================================')

        const testCases = [
            {
                name: 'Memory Extraction Speed',
                action: 'extract',
                data: {
                    user_id: 'test_user_perf',
                    companion_id: 'test_companion_perf',
                    conversation_id: 'test_conv_perf',
                    messages: [
                        { content: 'I had a really stressful day at work today', sender: 'user', timestamp: new Date() },
                        { content: 'My boss was being really difficult', sender: 'user', timestamp: new Date() },
                        { content: 'I need to finish this project by Friday', sender: 'user', timestamp: new Date() }
                    ],
                    relationship_data: { level: 3, experience: 250 }
                }
            },
            {
                name: 'Memory Retrieval Speed',
                action: 'retrieve',
                data: {
                    userId: 'test_user_perf',
                    characterId: 'test_companion_perf',
                    currentMessage: 'How was work today?',
                    limit: 5
                }
            }
        ]

        for (const testCase of testCases) {
            console.log(`\n📝 Testing: ${testCase.name}`)

            const latencies = []
            let successCount = 0

            for (let i = 0; i < this.config.TEST_ITERATIONS; i++) {
                try {
                    const startTime = Date.now()

                    const response = await axios.post(`${this.config.API_BASE}/memory`, {
                        action: testCase.action,
                        data: testCase.data
                    })

                    const latency = Date.now() - startTime
                    latencies.push(latency)

                    if (response.data.success) {
                        successCount++
                    }

                } catch (error) {
                    console.log(`   ⚠️  Iteration ${i + 1} failed: ${error.message}`)
                }
            }

            const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length
            const maxLatency = Math.max(...latencies)
            const minLatency = Math.min(...latencies)
            const successRate = (successCount / this.config.TEST_ITERATIONS) * 100

            console.log(`   📊 Results:`)
            console.log(`      Average Latency: ${avgLatency.toFixed(2)}ms`)
            console.log(`      Min/Max Latency: ${minLatency}ms / ${maxLatency}ms`)
            console.log(`      Success Rate: ${successRate.toFixed(1)}%`)

            this.results.memoryLatency.push({
                test: testCase.name,
                avgLatency,
                maxLatency,
                minLatency,
                successRate,
                passed: avgLatency <= this.config.MEMORY_LATENCY_TARGET && successRate >= 90
            })

            this.updateMetrics(avgLatency <= this.config.MEMORY_LATENCY_TARGET && successRate >= 90)

            if (avgLatency <= this.config.MEMORY_LATENCY_TARGET) {
                console.log(`   ✅ ${testCase.name} - PASSED (${avgLatency.toFixed(2)}ms <= ${this.config.MEMORY_LATENCY_TARGET}ms)`)
            } else {
                console.log(`   ❌ ${testCase.name} - FAILED (${avgLatency.toFixed(2)}ms > ${this.config.MEMORY_LATENCY_TARGET}ms)`)
            }
        }
    }

    async testMemoryRecallAccuracy() {
        console.log('\n🎯 2. MEMORY RECALL ACCURACY')
        console.log('============================')

        // Test memory recall with known conversation context
        const testConversations = [
            {
                setup: [
                    { content: 'I work as a software engineer at Google', sender: 'user', timestamp: new Date(Date.now() - 86400000) },
                    { content: 'My manager Sarah is really supportive', sender: 'user', timestamp: new Date(Date.now() - 82800000) },
                    { content: 'We are working on a machine learning project', sender: 'user', timestamp: new Date(Date.now() - 79200000) }
                ],
                queries: [
                    { message: 'How is work going?', expectedContext: ['work', 'Google', 'software engineer'] },
                    { message: 'Tell me about your manager', expectedContext: ['manager', 'Sarah', 'supportive'] },
                    { message: 'What projects are you working on?', expectedContext: ['machine learning', 'project'] }
                ]
            },
            {
                setup: [
                    { content: 'I am studying computer science at Stanford', sender: 'user', timestamp: new Date(Date.now() - 172800000) },
                    { content: 'My favorite class is algorithms with Professor Chen', sender: 'user', timestamp: new Date(Date.now() - 169200000) },
                    { content: 'I have a big exam next week', sender: 'user', timestamp: new Date(Date.now() - 165600000) }
                ],
                queries: [
                    { message: 'How are your studies?', expectedContext: ['computer science', 'Stanford', 'studying'] },
                    { message: 'Which professor do you like?', expectedContext: ['Professor Chen', 'algorithms'] },
                    { message: 'Any upcoming exams?', expectedContext: ['exam', 'next week'] }
                ]
            }
        ]

        let totalQueries = 0
        let accurateRecalls = 0

        for (const [index, conversation] of testConversations.entries()) {
            console.log(`\n📚 Testing Conversation Context ${index + 1}`)

            // Setup conversation context
            try {
                await axios.post(`${this.config.API_BASE}/memory`, {
                    action: 'extract',
                    data: {
                        user_id: `test_user_recall_${index}`,
                        companion_id: `test_companion_recall_${index}`,
                        conversation_id: `test_conv_recall_${index}`,
                        messages: conversation.setup,
                        relationship_data: { level: 2, experience: 150 }
                    }
                })

                // Wait for processing
                await new Promise(resolve => setTimeout(resolve, 100))

                // Test recall accuracy
                for (const query of conversation.queries) {
                    totalQueries++

                    const response = await axios.post(`${this.config.API_BASE}/memory`, {
                        action: 'retrieve',
                        data: {
                            userId: `test_user_recall_${index}`,
                            characterId: `test_companion_recall_${index}`,
                            currentMessage: query.message,
                            limit: 3
                        }
                    })

                    if (response.data.success && response.data.data.memories) {
                        const retrievedContent = response.data.data.memories
                            .map(m => m.content?.toLowerCase() || '')
                            .join(' ')

                        const contextMatches = query.expectedContext.filter(context =>
                            retrievedContent.includes(context.toLowerCase())
                        ).length

                        const accuracy = contextMatches / query.expectedContext.length

                        if (accuracy >= 0.6) { // 60% context match threshold
                            accurateRecalls++
                            console.log(`   ✅ Query: "${query.message}" - ${(accuracy * 100).toFixed(1)}% context match`)
                        } else {
                            console.log(`   ❌ Query: "${query.message}" - ${(accuracy * 100).toFixed(1)}% context match`)
                        }
                    } else {
                        console.log(`   ❌ Query: "${query.message}" - No memories retrieved`)
                    }
                }

            } catch (error) {
                console.log(`   ⚠️  Conversation ${index + 1} setup failed: ${error.message}`)
            }
        }

        const overallAccuracy = totalQueries > 0 ? (accurateRecalls / totalQueries) * 100 : 0

        console.log(`\n📊 Memory Recall Accuracy Results:`)
        console.log(`   Total Queries: ${totalQueries}`)
        console.log(`   Accurate Recalls: ${accurateRecalls}`)
        console.log(`   Overall Accuracy: ${overallAccuracy.toFixed(1)}%`)

        this.results.recallAccuracy.push({
            totalQueries,
            accurateRecalls,
            accuracy: overallAccuracy,
            passed: overallAccuracy >= this.config.RECALL_ACCURACY_TARGET
        })

        this.updateMetrics(overallAccuracy >= this.config.RECALL_ACCURACY_TARGET)

        if (overallAccuracy >= this.config.RECALL_ACCURACY_TARGET) {
            console.log(`   ✅ Memory Recall Accuracy - PASSED (${overallAccuracy.toFixed(1)}% >= ${this.config.RECALL_ACCURACY_TARGET}%)`)
        } else {
            console.log(`   ❌ Memory Recall Accuracy - FAILED (${overallAccuracy.toFixed(1)}% < ${this.config.RECALL_ACCURACY_TARGET}%)`)
        }
    }

    async testConcurrentLoadPerformance() {
        console.log('\n👥 3. CONCURRENT LOAD PERFORMANCE')
        console.log('=================================')

        const concurrentRequests = []
        const startTime = Date.now()

        for (let i = 0; i < this.config.CONCURRENT_USERS; i++) {
            const request = this.simulateUserRequest(i)
            concurrentRequests.push(request)
        }

        try {
            const results = await Promise.allSettled(concurrentRequests)
            const totalTime = Date.now() - startTime

            const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length
            const failed = results.filter(r => r.status === 'rejected' || !r.value?.success).length
            const successRate = (successful / this.config.CONCURRENT_USERS) * 100

            const latencies = results
                .filter(r => r.status === 'fulfilled' && r.value.latency)
                .map(r => r.value.latency)

            const avgLatency = latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0

            console.log(`📊 Concurrent Load Results:`)
            console.log(`   Concurrent Users: ${this.config.CONCURRENT_USERS}`)
            console.log(`   Successful Requests: ${successful}`)
            console.log(`   Failed Requests: ${failed}`)
            console.log(`   Success Rate: ${successRate.toFixed(1)}%`)
            console.log(`   Total Time: ${totalTime}ms`)
            console.log(`   Average Latency: ${avgLatency.toFixed(2)}ms`)

            this.results.concurrentLoad.push({
                concurrentUsers: this.config.CONCURRENT_USERS,
                successful,
                failed,
                successRate,
                totalTime,
                avgLatency,
                passed: successRate >= this.config.CONCURRENT_SUCCESS_TARGET
            })

            this.updateMetrics(successRate >= this.config.CONCURRENT_SUCCESS_TARGET)

            if (successRate >= this.config.CONCURRENT_SUCCESS_TARGET) {
                console.log(`✅ Concurrent Load Performance - PASSED (${successRate.toFixed(1)}% >= ${this.config.CONCURRENT_SUCCESS_TARGET}%)`)
            } else {
                console.log(`❌ Concurrent Load Performance - FAILED (${successRate.toFixed(1)}% < ${this.config.CONCURRENT_SUCCESS_TARGET}%)`)
            }

        } catch (error) {
            console.log(`❌ Concurrent Load Test - ERROR: ${error.message}`)
            this.updateMetrics(false)
        }
    }

    async simulateUserRequest(userId) {
        const startTime = Date.now()

        try {
            // Simulate a typical user interaction
            const response = await axios.post(`${this.config.API_BASE}/chat`, {
                message: `Hi there! This is user ${userId} testing the system.`,
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
                userId: `test_user_${userId}`,
                characterId: `test_character_${userId}`
            })

            const latency = Date.now() - startTime

            return {
                success: response.status === 200 && response.data.response,
                latency,
                userId
            }

        } catch (error) {
            return {
                success: false,
                error: error.message,
                latency: Date.now() - startTime,
                userId
            }
        }
    }

    async testCostPerformanceMaintenance() {
        console.log('\n💰 4. COST PERFORMANCE MAINTENANCE')
        console.log('==================================')

        // Simulate cost tracking for multiple interactions
        const testInteractions = 5
        let totalCost = 0

        for (let i = 0; i < testInteractions; i++) {
            try {
                const response = await axios.post(`${this.config.API_BASE}/chat`, {
                    message: `This is test interaction ${i + 1} for cost analysis.`,
                    characterProfile: {
                        character_name: 'Cost Test Character',
                        fictional_lore: 'Cost Test Universe',
                        summary: 'A character for cost testing',
                        personality_traits: {
                            core_traits: ['efficient'],
                            communication_style: 'concise'
                        }
                    },
                    userId: 'cost_test_user',
                    characterId: 'cost_test_character'
                })

                // Estimate cost based on response length (simplified)
                const responseLength = JSON.stringify(response.data).length
                const estimatedCost = (responseLength / 1000) * 0.001 // Rough estimation
                totalCost += estimatedCost

            } catch (error) {
                console.log(`   ⚠️  Cost test interaction ${i + 1} failed: ${error.message}`)
            }
        }

        const avgCostPerInteraction = totalCost / testInteractions

        console.log(`📊 Cost Performance Results:`)
        console.log(`   Total Interactions: ${testInteractions}`)
        console.log(`   Total Estimated Cost: $${totalCost.toFixed(6)}`)
        console.log(`   Average Cost per Interaction: $${avgCostPerInteraction.toFixed(6)}`)
        console.log(`   Target Cost: $${this.config.COST_TARGET}`)

        this.results.costPerformance.push({
            totalInteractions: testInteractions,
            totalCost,
            avgCostPerInteraction,
            target: this.config.COST_TARGET,
            passed: avgCostPerInteraction <= this.config.COST_TARGET
        })

        this.updateMetrics(avgCostPerInteraction <= this.config.COST_TARGET)

        if (avgCostPerInteraction <= this.config.COST_TARGET) {
            console.log(`✅ Cost Performance - PASSED ($${avgCostPerInteraction.toFixed(6)} <= $${this.config.COST_TARGET})`)
        } else {
            console.log(`❌ Cost Performance - FAILED ($${avgCostPerInteraction.toFixed(6)} > $${this.config.COST_TARGET})`)
        }
    }

    async testErrorRecoveryResilience() {
        console.log('\n🛠️ 5. ERROR RECOVERY & RESILIENCE')
        console.log('=================================')

        const errorTests = [
            {
                name: 'Invalid Memory Request',
                request: () => axios.post(`${this.config.API_BASE}/memory`, {
                    action: 'invalid_action',
                    data: {}
                })
            },
            {
                name: 'Malformed Chat Request',
                request: () => axios.post(`${this.config.API_BASE}/chat`, {
                    invalidField: 'test'
                })
            },
            {
                name: 'Empty Request Body',
                request: () => axios.post(`${this.config.API_BASE}/memory`, {})
            }
        ]

        let totalTests = 0
        let gracefulFailures = 0

        for (const test of errorTests) {
            totalTests++
            console.log(`\n🧪 Testing: ${test.name}`)

            try {
                const response = await test.request()

                // Check if error was handled gracefully
                if (response.status >= 400 && response.data.error) {
                    gracefulFailures++
                    console.log(`   ✅ Graceful error handling: ${response.data.error}`)
                } else {
                    console.log(`   ⚠️  Unexpected success response`)
                }

            } catch (error) {
                if (error.response && error.response.data && error.response.data.error) {
                    gracefulFailures++
                    console.log(`   ✅ Graceful error handling: ${error.response.data.error}`)
                } else {
                    console.log(`   ❌ Ungraceful error: ${error.message}`)
                }
            }
        }

        const recoveryRate = (gracefulFailures / totalTests) * 100

        console.log(`\n📊 Error Recovery Results:`)
        console.log(`   Total Error Tests: ${totalTests}`)
        console.log(`   Graceful Failures: ${gracefulFailures}`)
        console.log(`   Recovery Rate: ${recoveryRate.toFixed(1)}%`)

        this.results.errorRecovery.push({
            totalTests,
            gracefulFailures,
            recoveryRate,
            passed: recoveryRate >= this.config.RECOVERY_RATE_TARGET
        })

        this.updateMetrics(recoveryRate >= this.config.RECOVERY_RATE_TARGET)

        if (recoveryRate >= this.config.RECOVERY_RATE_TARGET) {
            console.log(`✅ Error Recovery & Resilience - PASSED (${recoveryRate.toFixed(1)}% >= ${this.config.RECOVERY_RATE_TARGET}%)`)
        } else {
            console.log(`❌ Error Recovery & Resilience - FAILED (${recoveryRate.toFixed(1)}% < ${this.config.RECOVERY_RATE_TARGET}%)`)
        }
    }

    updateMetrics(passed) {
        this.metrics.totalTests++
        if (passed) {
            this.metrics.passedTests++
        } else {
            this.metrics.failedTests++
        }
    }

    generatePhase1Report() {
        console.log('\n📊 PHASE 1 OPTIMIZATION RESULTS')
        console.log('================================')

        const passRate = (this.metrics.passedTests / this.metrics.totalTests) * 100
        const isPhase1Ready = passRate >= 80 // 80% pass rate for Phase 1

        console.log(`Total Tests: ${this.metrics.totalTests}`)
        console.log(`✅ Passed: ${this.metrics.passedTests}`)
        console.log(`❌ Failed: ${this.metrics.failedTests}`)
        console.log(`📈 Pass Rate: ${passRate.toFixed(1)}%`)
        console.log('')

        console.log('🎯 Phase 1 Optimization Status:')
        if (isPhase1Ready) {
            console.log('✅ PHASE 1 OPTIMIZATIONS SUCCESSFUL')
            console.log('   Ready to proceed to Phase 2')
        } else {
            console.log('❌ PHASE 1 OPTIMIZATIONS NEED IMPROVEMENT')
            console.log('   Additional optimization required')
        }

        console.log('\n📋 Detailed Results Summary:')
        console.log('============================')

        // Memory Performance Summary
        if (this.results.memoryLatency.length > 0) {
            const avgLatency = this.results.memoryLatency.reduce((sum, r) => sum + r.avgLatency, 0) / this.results.memoryLatency.length
            console.log(`🧠 Memory Performance: ${avgLatency.toFixed(2)}ms avg (target: ${this.config.MEMORY_LATENCY_TARGET}ms)`)
        }

        // Recall Accuracy Summary
        if (this.results.recallAccuracy.length > 0) {
            const accuracy = this.results.recallAccuracy[0].accuracy
            console.log(`🎯 Recall Accuracy: ${accuracy.toFixed(1)}% (target: ${this.config.RECALL_ACCURACY_TARGET}%)`)
        }

        // Concurrent Load Summary
        if (this.results.concurrentLoad.length > 0) {
            const successRate = this.results.concurrentLoad[0].successRate
            console.log(`👥 Concurrent Load: ${successRate.toFixed(1)}% success (target: ${this.config.CONCURRENT_SUCCESS_TARGET}%)`)
        }

        // Cost Performance Summary
        if (this.results.costPerformance.length > 0) {
            const avgCost = this.results.costPerformance[0].avgCostPerInteraction
            console.log(`💰 Cost Performance: $${avgCost.toFixed(6)} per interaction (target: $${this.config.COST_TARGET})`)
        }

        // Error Recovery Summary
        if (this.results.errorRecovery.length > 0) {
            const recoveryRate = this.results.errorRecovery[0].recoveryRate
            console.log(`🛠️ Error Recovery: ${recoveryRate.toFixed(1)}% (target: ${this.config.RECOVERY_RATE_TARGET}%)`)
        }

        console.log('\n🚀 Next Steps:')
        if (isPhase1Ready) {
            console.log('1. Deploy Phase 1 optimizations to staging')
            console.log('2. Begin Phase 2 advanced optimizations')
            console.log('3. Implement continuous monitoring')
        } else {
            console.log('1. Address failing optimization areas')
            console.log('2. Re-run Phase 1 validation tests')
            console.log('3. Consider additional performance tuning')
        }

        // Save results
        const timestamp = Date.now()
        const filename = `phase1-optimization-results-${timestamp}.json`

        const fullResults = {
            timestamp: new Date().toISOString(),
            config: this.config,
            metrics: this.metrics,
            results: this.results,
            summary: {
                passRate,
                isPhase1Ready,
                recommendations: isPhase1Ready ? 'Proceed to Phase 2' : 'Improve failing areas'
            }
        }

        require('fs').writeFileSync(filename, JSON.stringify(fullResults, null, 2))
        console.log(`\n📄 Detailed results saved to: ${filename}`)
    }
}

// Run Phase 1 optimization tests
async function runPhase1OptimizationTests() {
    const tester = new Phase1OptimizationTester()
    await tester.runPhase1Tests()
}

// Execute if called directly
if (require.main === module) {
    runPhase1OptimizationTests().catch(console.error)
}

module.exports = { Phase1OptimizationTester } 