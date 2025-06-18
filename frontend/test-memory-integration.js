#!/usr/bin/env node

/**
 * YapChat Memory Integration Test
 * Tests the enhanced RAG memory system
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

// Test configuration
const TEST_USER_ID = 'test_user_memory_123';
const TEST_CHARACTER_ID = 'test_char_gojo_456';
const TEST_CONVERSATION_ID = 'test_conv_789';

const testCharacterProfile = {
    character_name: "Satoru Gojo",
    fictional_lore: "Jujutsu Kaisen",
    summary: "The strongest jujutsu sorcerer with playful confidence",
    personality_traits: {
        core_traits: ["confident", "playful", "powerful"],
        communication_style: "Casual, confident, sometimes cocky but caring"
    }
};

const testUserPersonality = {
    preferences: {
        companion_gender: "any",
        emotional_support_need: ["encouragement", "active listening"]
    },
    ageVerification: {
        age: 21,
        isAdult: true,
        contentRestrictions: {
            allowMildRomantic: true,
            allowFlirting: true,
            allowNSFW: true
        }
    }
};

async function testMemoryIntegration() {
    console.log('🧠 Testing YapChat Memory Integration...\n');

    try {
        // Test 1: First conversation with memory storage
        console.log('📝 Test 1: First conversation (memory storage)');
        const firstResponse = await axios.post(`${API_BASE}/chat`, {
            message: "Hi! My name is Alex and I work as a software engineer at Google. I love anime and I'm currently stressed about a big project deadline.",
            characterProfile: testCharacterProfile,
            isFirstMessage: true,
            userPersonality: testUserPersonality,
            userId: TEST_USER_ID,
            characterId: TEST_CHARACTER_ID,
            conversationId: TEST_CONVERSATION_ID
        });

        console.log('✅ First response received');
        console.log('Response:', firstResponse.data.response);
        console.log('');

        // Wait for memory processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Test 2: Follow-up conversation (memory retrieval)
        console.log('🔍 Test 2: Follow-up conversation (memory retrieval)');
        const secondResponse = await axios.post(`${API_BASE}/chat`, {
            message: "How's your day going? Any updates on that project?",
            characterProfile: testCharacterProfile,
            isFirstMessage: false,
            userPersonality: testUserPersonality,
            userId: TEST_USER_ID,
            characterId: TEST_CHARACTER_ID,
            conversationId: TEST_CONVERSATION_ID
        });

        console.log('✅ Second response received');
        console.log('Response:', secondResponse.data.response);
        console.log('');

        // Test 3: Memory recall test
        console.log('🎯 Test 3: Memory recall test');
        const recallResponse = await axios.post(`${API_BASE}/chat`, {
            message: "What do you remember about me?",
            characterProfile: testCharacterProfile,
            isFirstMessage: false,
            userPersonality: testUserPersonality,
            userId: TEST_USER_ID,
            characterId: TEST_CHARACTER_ID,
            conversationId: TEST_CONVERSATION_ID
        });

        console.log('✅ Recall response received');
        console.log('Response:', recallResponse.data.response);
        console.log('');

        console.log('🎉 Memory integration test completed successfully!');
        console.log('');
        console.log('Expected behaviors:');
        console.log('- First response should be a natural greeting');
        console.log('- Second response should reference the project/work stress');
        console.log('- Third response should recall name (Alex), job (Google engineer), and interests (anime)');

    } catch (error) {
        console.error('❌ Memory integration test failed:', error.response?.data || error.message);

        if (error.response?.status === 500) {
            console.log('\n💡 Possible issues:');
            console.log('- Supabase vector setup not completed');
            console.log('- OpenAI API key not configured');
            console.log('- Memory service dependencies missing');
        }
    }
}

// Run the test
if (require.main === module) {
    testMemoryIntegration();
}

module.exports = { testMemoryIntegration }; 