#!/usr/bin/env node

/**
 * YapChat Production Monitoring Dashboard
 * 
 * Continuous monitoring system for:
 * - Real-time performance metrics
 * - Memory system health
 * - Cost tracking
 * - Quality assessment
 * - Alert generation
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Monitoring configuration
const MONITOR_CONFIG = {
    API_BASE: process.env.API_BASE || 'http://localhost:3000/api',
    MONITORING_INTERVAL: 300000, // 5 minutes
    HEALTH_CHECK_INTERVAL: 60000, // 1 minute
    ALERT_THRESHOLDS: {
        responseTime: 2000, // 2 seconds
        errorRate: 0.05, // 5%
        memoryFailureRate: 0.1, // 10%
        costPerEngagement: 0.008, // $0.008
        qualityScore: 7.0 // Minimum quality score
    },
    RETENTION_DAYS: 30,
    ALERT_WEBHOOK: process.env.ALERT_WEBHOOK_URL
};

// Metrics storage
let metrics = {
    performance: [],
    memory: [],
    cost: [],
    quality: [],
    errors: [],
    alerts: []
};

// Utility functions
function timestamp() {
    return new Date().toISOString();
}

function generateMetricId() {
    return 'metric-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// =====================================================
// PERFORMANCE MONITORING
// =====================================================

async function monitorPerformance() {
    console.log(`🔍 [${timestamp()}] Performance Monitoring Check`);

    const testCharacter = {
        character_name: "Nezuko Kamado",
        fictional_lore: "Demon Slayer",
        summary: "Kind demon sister who protects humans.",
        personality_traits: {
            core_traits: ["protective", "gentle"],
            communication_style: "Simple, caring"
        }
    };

    const testUserId = 'monitor-' + Date.now();
    const startTime = Date.now();
    let success = false;
    let errorDetails = null;

    try {
        const response = await axios.post(`${MONITOR_CONFIG.API_BASE}/chat`, {
            message: "Hello, this is a monitoring test message.",
            characterProfile: testCharacter,
            isFirstMessage: true,
            userId: testUserId,
            characterId: testUserId + '-char',
            conversationId: testUserId + '-conv',
            userPersonality: { ageVerification: { age: 25, isAdult: true } }
        });

        success = response.status === 200;
    } catch (error) {
        errorDetails = {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText
        };
    }

    const responseTime = Date.now() - startTime;

    const performanceMetric = {
        id: generateMetricId(),
        timestamp: timestamp(),
        responseTime,
        success,
        error: errorDetails
    };

    metrics.performance.push(performanceMetric);

    // Check alerts
    if (responseTime > MONITOR_CONFIG.ALERT_THRESHOLDS.responseTime) {
        await generateAlert('performance', 'High Response Time', {
            responseTime: `${responseTime}ms`,
            threshold: `${MONITOR_CONFIG.ALERT_THRESHOLDS.responseTime}ms`
        });
    }

    if (!success) {
        await generateAlert('performance', 'API Failure', errorDetails);
    }

    console.log(`📊 Response Time: ${responseTime}ms | Success: ${success ? '✅' : '❌'}`);
    return performanceMetric;
}

// =====================================================
// MEMORY SYSTEM MONITORING
// =====================================================

async function monitorMemorySystem() {
    console.log(`🧠 [${timestamp()}] Memory System Monitoring`);

    const testUserId = 'memory-monitor-' + Date.now();
    const testCharacter = {
        character_name: "Satoru Gojo",
        fictional_lore: "Jujutsu Kaisen",
        summary: "Strongest jujutsu sorcerer.",
        personality_traits: {
            core_traits: ["confident", "powerful"],
            communication_style: "Casual, confident"
        }
    };

    let memoryExtractionSuccess = false;
    let memoryRetrievalSuccess = false;
    let memoryLatency = 0;

    try {
        // Test memory extraction
        const startTime = Date.now();
        await axios.post(`${MONITOR_CONFIG.API_BASE}/chat`, {
            message: "I work as a data scientist and I love machine learning. My favorite programming language is Python.",
            characterProfile: testCharacter,
            isFirstMessage: true,
            userId: testUserId,
            characterId: testUserId + '-char',
            conversationId: testUserId + '-conv',
            userPersonality: { ageVerification: { age: 25, isAdult: true } }
        });

        memoryExtractionSuccess = true;
        await delay(2000); // Allow memory processing

        // Test memory retrieval
        const recallResponse = await axios.post(`${MONITOR_CONFIG.API_BASE}/chat`, {
            message: "What do you remember about my job?",
            characterProfile: testCharacter,
            conversationHistory: [
                { content: "I work as a data scientist and I love machine learning.", sender: 'user' }
            ],
            isFirstMessage: false,
            userId: testUserId,
            characterId: testUserId + '-char',
            conversationId: testUserId + '-conv',
            userPersonality: { ageVerification: { age: 25, isAdult: true } }
        });

        memoryLatency = Date.now() - startTime;

        const responseText = Array.isArray(recallResponse.data.response)
            ? recallResponse.data.response.join(' ')
            : recallResponse.data.response;

        // Check if memory was recalled
        memoryRetrievalSuccess = responseText.toLowerCase().includes('data scientist') ||
            responseText.toLowerCase().includes('machine learning') ||
            responseText.toLowerCase().includes('python');

    } catch (error) {
        console.error(`❌ Memory monitoring error:`, error.message);
    }

    const memoryMetric = {
        id: generateMetricId(),
        timestamp: timestamp(),
        extractionSuccess: memoryExtractionSuccess,
        retrievalSuccess: memoryRetrievalSuccess,
        latency: memoryLatency
    };

    metrics.memory.push(memoryMetric);

    // Check alerts
    if (!memoryExtractionSuccess || !memoryRetrievalSuccess) {
        await generateAlert('memory', 'Memory System Failure', {
            extraction: memoryExtractionSuccess ? 'OK' : 'FAILED',
            retrieval: memoryRetrievalSuccess ? 'OK' : 'FAILED'
        });
    }

    console.log(`🧠 Extraction: ${memoryExtractionSuccess ? '✅' : '❌'} | Retrieval: ${memoryRetrievalSuccess ? '✅' : '❌'} | Latency: ${memoryLatency}ms`);
    return memoryMetric;
}

// =====================================================
// COST MONITORING
// =====================================================

async function monitorCosts() {
    console.log(`💰 [${timestamp()}] Cost Monitoring`);

    // Simulate cost calculation based on recent activity
    const recentPerformanceMetrics = metrics.performance.slice(-10);
    const successfulRequests = recentPerformanceMetrics.filter(m => m.success).length;

    // Estimated costs per successful request
    const estimatedCostPerRequest = 0.003 + 0.0001 + 0.00005; // LLM + Embedding + Vector search
    const totalEstimatedCost = successfulRequests * estimatedCostPerRequest;
    const avgCostPerEngagement = successfulRequests > 0 ? totalEstimatedCost / successfulRequests : 0;

    const costMetric = {
        id: generateMetricId(),
        timestamp: timestamp(),
        totalCost: totalEstimatedCost,
        avgCostPerEngagement,
        requestCount: successfulRequests,
        period: '10-requests'
    };

    metrics.cost.push(costMetric);

    // Check alerts
    if (avgCostPerEngagement > MONITOR_CONFIG.ALERT_THRESHOLDS.costPerEngagement) {
        await generateAlert('cost', 'High Cost Per Engagement', {
            current: `$${avgCostPerEngagement.toFixed(4)}`,
            threshold: `$${MONITOR_CONFIG.ALERT_THRESHOLDS.costPerEngagement}`
        });
    }

    console.log(`💰 Avg Cost/Engagement: $${avgCostPerEngagement.toFixed(4)} | Total: $${totalEstimatedCost.toFixed(4)}`);
    return costMetric;
}

// =====================================================
// QUALITY MONITORING
// =====================================================

async function monitorQuality() {
    console.log(`⭐ [${timestamp()}] Quality Monitoring`);

    const testUserId = 'quality-monitor-' + Date.now();
    const testCharacter = {
        character_name: "Hermione Granger",
        fictional_lore: "Harry Potter",
        summary: "Brilliant witch who values knowledge.",
        personality_traits: {
            core_traits: ["intelligent", "loyal"],
            communication_style: "Articulate and thoughtful"
        }
    };

    let qualityScore = 0;
    let responseLength = 0;
    let hasEmpathy = false;
    let isNatural = false;

    try {
        const response = await axios.post(`${MONITOR_CONFIG.API_BASE}/chat`, {
            message: "I've been feeling really stressed about my upcoming exams. I'm worried I won't do well.",
            characterProfile: testCharacter,
            isFirstMessage: true,
            userId: testUserId,
            characterId: testUserId + '-char',
            conversationId: testUserId + '-conv',
            userPersonality: { ageVerification: { age: 25, isAdult: true } }
        });

        const responseText = Array.isArray(response.data.response)
            ? response.data.response.join(' ')
            : response.data.response;

        responseLength = responseText.length;

        // Quality assessment
        qualityScore = 5.0; // Base score

        // Check for empathy
        if (responseText.toLowerCase().includes('understand') ||
            responseText.toLowerCase().includes('feel') ||
            responseText.toLowerCase().includes('help') ||
            responseText.toLowerCase().includes('support')) {
            hasEmpathy = true;
            qualityScore += 2.0;
        }

        // Check for appropriate length
        if (responseLength >= 50 && responseLength <= 300) {
            qualityScore += 1.5;
        }

        // Check for natural conversation
        if (!responseText.includes('As an AI') && !responseText.includes('I am a')) {
            isNatural = true;
            qualityScore += 1.5;
        }

        qualityScore = Math.min(qualityScore, 10.0);

    } catch (error) {
        console.error(`❌ Quality monitoring error:`, error.message);
    }

    const qualityMetric = {
        id: generateMetricId(),
        timestamp: timestamp(),
        qualityScore,
        responseLength,
        hasEmpathy,
        isNatural
    };

    metrics.quality.push(qualityMetric);

    // Check alerts
    if (qualityScore < MONITOR_CONFIG.ALERT_THRESHOLDS.qualityScore) {
        await generateAlert('quality', 'Low Quality Score', {
            score: qualityScore.toFixed(1),
            threshold: MONITOR_CONFIG.ALERT_THRESHOLDS.qualityScore
        });
    }

    console.log(`⭐ Quality Score: ${qualityScore.toFixed(1)}/10 | Empathy: ${hasEmpathy ? '✅' : '❌'} | Natural: ${isNatural ? '✅' : '❌'}`);
    return qualityMetric;
}

// =====================================================
// ALERT SYSTEM
// =====================================================

async function generateAlert(category, type, details) {
    const alert = {
        id: generateMetricId(),
        timestamp: timestamp(),
        category,
        type,
        details,
        severity: determineSeverity(category, type, details)
    };

    metrics.alerts.push(alert);

    console.log(`🚨 ALERT [${alert.severity.toUpperCase()}]: ${category} - ${type}`);
    console.log(`📋 Details:`, details);

    // Send to webhook if configured
    if (MONITOR_CONFIG.ALERT_WEBHOOK) {
        try {
            await axios.post(MONITOR_CONFIG.ALERT_WEBHOOK, {
                text: `🚨 YapChat Alert: ${category} - ${type}`,
                attachments: [{
                    color: alert.severity === 'critical' ? 'danger' : 'warning',
                    fields: [
                        { title: 'Category', value: category, short: true },
                        { title: 'Type', value: type, short: true },
                        { title: 'Severity', value: alert.severity, short: true },
                        { title: 'Time', value: timestamp(), short: true },
                        { title: 'Details', value: JSON.stringify(details, null, 2), short: false }
                    ]
                }]
            });
        } catch (error) {
            console.error(`❌ Failed to send alert webhook:`, error.message);
        }
    }

    return alert;
}

function determineSeverity(category, type, details) {
    if (category === 'performance' && type === 'API Failure') return 'critical';
    if (category === 'memory' && type === 'Memory System Failure') return 'critical';
    if (category === 'cost' && type === 'High Cost Per Engagement') return 'warning';
    if (category === 'quality' && type === 'Low Quality Score') return 'warning';
    return 'info';
}

// =====================================================
// HEALTH CHECK
// =====================================================

async function performHealthCheck() {
    console.log(`💚 [${timestamp()}] Health Check`);

    const health = {
        timestamp: timestamp(),
        status: 'healthy',
        checks: {
            api: false,
            memory: false,
            database: false
        },
        metrics: {
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            activeConnections: 0
        }
    };

    try {
        // Basic API health check
        const response = await axios.get(`${MONITOR_CONFIG.API_BASE.replace('/api', '')}/api/health`, {
            timeout: 5000
        });
        health.checks.api = response.status === 200;
    } catch (error) {
        console.log(`❌ API health check failed: ${error.message}`);
    }

    // Determine overall health status
    const failedChecks = Object.values(health.checks).filter(check => !check).length;
    if (failedChecks > 0) {
        health.status = failedChecks === Object.keys(health.checks).length ? 'critical' : 'degraded';
    }

    console.log(`💚 Health: ${health.status.toUpperCase()} | API: ${health.checks.api ? '✅' : '❌'}`);
    return health;
}

// =====================================================
// REPORTING
// =====================================================

function generateReport() {
    console.log('\n📊 MONITORING DASHBOARD REPORT');
    console.log('==============================');
    console.log(`Generated at: ${timestamp()}`);
    console.log('');

    // Performance summary
    const recentPerformance = metrics.performance.slice(-10);
    const avgResponseTime = recentPerformance.reduce((sum, m) => sum + m.responseTime, 0) / recentPerformance.length || 0;
    const successRate = recentPerformance.filter(m => m.success).length / recentPerformance.length || 0;

    console.log('🔍 PERFORMANCE METRICS (Last 10 requests)');
    console.log(`   Average Response Time: ${avgResponseTime.toFixed(0)}ms`);
    console.log(`   Success Rate: ${(successRate * 100).toFixed(1)}%`);
    console.log('');

    // Memory summary
    const recentMemory = metrics.memory.slice(-5);
    const memorySuccessRate = recentMemory.filter(m => m.extractionSuccess && m.retrievalSuccess).length / recentMemory.length || 0;

    console.log('🧠 MEMORY SYSTEM METRICS (Last 5 checks)');
    console.log(`   Memory Success Rate: ${(memorySuccessRate * 100).toFixed(1)}%`);
    console.log('');

    // Cost summary
    const recentCost = metrics.cost.slice(-5);
    const avgCost = recentCost.reduce((sum, m) => sum + m.avgCostPerEngagement, 0) / recentCost.length || 0;

    console.log('💰 COST METRICS (Last 5 checks)');
    console.log(`   Average Cost per Engagement: $${avgCost.toFixed(4)}`);
    console.log('');

    // Quality summary
    const recentQuality = metrics.quality.slice(-5);
    const avgQuality = recentQuality.reduce((sum, m) => sum + m.qualityScore, 0) / recentQuality.length || 0;

    console.log('⭐ QUALITY METRICS (Last 5 checks)');
    console.log(`   Average Quality Score: ${avgQuality.toFixed(1)}/10`);
    console.log('');

    // Alert summary
    const recentAlerts = metrics.alerts.filter(a =>
        new Date(a.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );

    console.log('🚨 ALERTS (Last 24 hours)');
    console.log(`   Total Alerts: ${recentAlerts.length}`);
    console.log(`   Critical: ${recentAlerts.filter(a => a.severity === 'critical').length}`);
    console.log(`   Warning: ${recentAlerts.filter(a => a.severity === 'warning').length}`);
    console.log('');

    // Overall system status
    const systemStatus = determineSystemStatus();
    console.log(`🎯 OVERALL SYSTEM STATUS: ${systemStatus.toUpperCase()}`);
    console.log('==============================\n');

    return {
        timestamp: timestamp(),
        performance: { avgResponseTime, successRate },
        memory: { successRate: memorySuccessRate },
        cost: { avgCostPerEngagement: avgCost },
        quality: { avgScore: avgQuality },
        alerts: { total: recentAlerts.length, critical: recentAlerts.filter(a => a.severity === 'critical').length },
        systemStatus
    };
}

function determineSystemStatus() {
    const recentAlerts = metrics.alerts.filter(a =>
        new Date(a.timestamp) > new Date(Date.now() - 60 * 60 * 1000) // Last hour
    );

    const criticalAlerts = recentAlerts.filter(a => a.severity === 'critical').length;
    const warningAlerts = recentAlerts.filter(a => a.severity === 'warning').length;

    if (criticalAlerts > 0) return 'critical';
    if (warningAlerts > 2) return 'degraded';
    return 'healthy';
}

// =====================================================
// DATA PERSISTENCE
// =====================================================

function saveMetrics() {
    const metricsFile = `monitoring-metrics-${new Date().toISOString().split('T')[0]}.json`;
    try {
        fs.writeFileSync(metricsFile, JSON.stringify(metrics, null, 2));
        console.log(`📄 Metrics saved to: ${metricsFile}`);
    } catch (error) {
        console.error(`❌ Failed to save metrics:`, error.message);
    }
}

function cleanupOldMetrics() {
    const cutoffTime = Date.now() - (MONITOR_CONFIG.RETENTION_DAYS * 24 * 60 * 60 * 1000);

    Object.keys(metrics).forEach(category => {
        if (Array.isArray(metrics[category])) {
            metrics[category] = metrics[category].filter(metric =>
                new Date(metric.timestamp).getTime() > cutoffTime
            );
        }
    });
}

// =====================================================
// MAIN MONITORING LOOP
// =====================================================

async function startMonitoring() {
    console.log('🚀 YapChat Production Monitoring Dashboard');
    console.log('==========================================');
    console.log(`Started at: ${timestamp()}`);
    console.log(`Monitoring interval: ${MONITOR_CONFIG.MONITORING_INTERVAL / 1000}s`);
    console.log(`Health check interval: ${MONITOR_CONFIG.HEALTH_CHECK_INTERVAL / 1000}s`);
    console.log('');

    // Initial health check
    await performHealthCheck();

    // Set up monitoring intervals
    const monitoringInterval = setInterval(async () => {
        try {
            await monitorPerformance();
            await monitorMemorySystem();
            await monitorCosts();
            await monitorQuality();

            // Generate report every 10 cycles
            if (metrics.performance.length % 10 === 0) {
                generateReport();
                saveMetrics();
            }

            // Cleanup old metrics daily
            if (metrics.performance.length % 100 === 0) {
                cleanupOldMetrics();
            }
        } catch (error) {
            console.error(`❌ Monitoring error:`, error.message);
        }
    }, MONITOR_CONFIG.MONITORING_INTERVAL);

    const healthCheckInterval = setInterval(async () => {
        try {
            await performHealthCheck();
        } catch (error) {
            console.error(`❌ Health check error:`, error.message);
        }
    }, MONITOR_CONFIG.HEALTH_CHECK_INTERVAL);

    // Graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down monitoring dashboard...');
        clearInterval(monitoringInterval);
        clearInterval(healthCheckInterval);
        saveMetrics();
        console.log('✅ Monitoring dashboard stopped.');
        process.exit(0);
    });

    console.log('✅ Monitoring dashboard started. Press Ctrl+C to stop.');
}

// Run monitoring if this script is executed directly
if (require.main === module) {
    startMonitoring().catch(console.error);
}

module.exports = {
    startMonitoring,
    generateReport,
    metrics,
    MONITOR_CONFIG
}; 