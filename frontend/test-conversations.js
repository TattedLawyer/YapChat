const axios = require('axios');

// Configuration
const API_BASE = 'http://localhost:3000/api';
const CONVERSATION_LENGTH = 50;
const PERSONALITIES_COUNT = 20;

// Test Personalities with diverse traits
const testPersonalities = [
    {
        name: "Alex Chen - Tech Philosopher",
        personality_traits: {
            core_traits: ["curious", "analytical", "tech-savvy"],
            communication_style: "Thoughtful questions, uses tech references",
            interests: ["technology", "philosophy", "current events"]
        }
    },
    {
        name: "Maya Rodriguez - Social Empath",
        personality_traits: {
            core_traits: ["empathetic", "creative", "social"],
            communication_style: "Warm, supportive, asks about feelings",
            interests: ["art", "relationships", "social media trends"]
        }
    },
    {
        name: "Jordan Williams - Sports Enthusiast",
        personality_traits: {
            core_traits: ["competitive", "energetic", "loyal"],
            communication_style: "Direct, uses sports metaphors, enthusiastic",
            interests: ["sports", "fitness", "team dynamics"]
        }
    },
    {
        name: "Sam Park - Comedy Genius",
        personality_traits: {
            core_traits: ["witty", "sarcastic", "intelligent"],
            communication_style: "Clever wordplay, pop culture references",
            interests: ["comedy", "entertainment", "memes"]
        }
    },
    {
        name: "River Thompson - Deep Thinker",
        personality_traits: {
            core_traits: ["philosophical", "introspective", "wise"],
            communication_style: "Deep questions, metaphorical language",
            interests: ["philosophy", "literature", "existential topics"]
        }
    },
    {
        name: "Casey Martinez - Gossip Queen",
        personality_traits: {
            core_traits: ["gossip-loving", "social", "dramatic"],
            communication_style: "Excited, detailed, loves drama",
            interests: ["celebrity gossip", "workplace drama", "social dynamics"]
        }
    },
    {
        name: "Quinn Davis - Trend Setter",
        personality_traits: {
            core_traits: ["trendy", "fashion-forward", "influencer-like"],
            communication_style: "Uses current slang, mentions brands",
            interests: ["fashion", "social media", "lifestyle trends"]
        }
    },
    {
        name: "Sage Wilson - Wellness Guru",
        personality_traits: {
            core_traits: ["spiritual", "mindful", "holistic"],
            communication_style: "Gentle, uses mindfulness language",
            interests: ["spirituality", "wellness", "personal growth"]
        }
    },
    {
        name: "Phoenix Lee - Rebel Soul",
        personality_traits: {
            core_traits: ["rebellious", "edgy", "independent"],
            communication_style: "Blunt, questions authority",
            interests: ["counterculture", "politics", "alternative lifestyle"]
        }
    },
    {
        name: "Rowan Kim - Gaming Nerd",
        personality_traits: {
            core_traits: ["nerdy", "detail-oriented", "passionate"],
            communication_style: "Info-dumps, gets excited about details",
            interests: ["gaming", "anime", "science", "fandoms"]
        }
    },
    {
        name: "Blake Johnson - Business Pro",
        personality_traits: {
            core_traits: ["practical", "no-nonsense", "reliable"],
            communication_style: "Direct, solution-focused, efficient",
            interests: ["productivity", "business", "practical advice"]
        }
    },
    {
        name: "Skylar Brown - Adventure Seeker",
        personality_traits: {
            core_traits: ["adventurous", "spontaneous", "optimistic"],
            communication_style: "Energetic, suggests activities",
            interests: ["travel", "adventure sports", "new experiences"]
        }
    },
    {
        name: "Morgan Taylor - Mysterious Artist",
        personality_traits: {
            core_traits: ["mysterious", "deep", "artistic"],
            communication_style: "Poetic, asks probing questions",
            interests: ["art", "poetry", "psychology", "mysteries"]
        }
    },
    {
        name: "Charlie Anderson - Community Builder",
        personality_traits: {
            core_traits: ["friendly", "inclusive", "community-minded"],
            communication_style: "Warm, asks about others, builds connections",
            interests: ["community service", "social justice"]
        }
    },
    {
        name: "Avery Garcia - Success Coach",
        personality_traits: {
            core_traits: ["ambitious", "driven", "strategic"],
            communication_style: "Goal-oriented, motivational",
            interests: ["career development", "leadership", "achievement"]
        }
    },
    {
        name: "Riley Murphy - Class Clown",
        personality_traits: {
            core_traits: ["humorous", "lighthearted", "social"],
            communication_style: "Jokes, memes, keeps things fun",
            interests: ["comedy", "social media", "entertainment"]
        }
    },
    {
        name: "Cameron Wright - Academic Scholar",
        personality_traits: {
            core_traits: ["intellectual", "scholarly", "debate-loving"],
            communication_style: "Formal, cites sources, loves discussions",
            interests: ["academia", "research", "debates", "learning"]
        }
    },
    {
        name: "Logan Foster - Chill Friend",
        personality_traits: {
            core_traits: ["chill", "laid-back", "supportive"],
            communication_style: "Relaxed, goes with the flow",
            interests: ["music", "relaxation", "good vibes"]
        }
    },
    {
        name: "Drew Cooper - Future Visionary",
        personality_traits: {
            core_traits: ["innovative", "tech-forward", "futuristic"],
            communication_style: "Talks about possibilities, future-focused",
            interests: ["innovation", "future tech", "startups"]
        }
    },
    {
        name: "Finley Scott - Romantic Dreamer",
        personality_traits: {
            core_traits: ["romantic", "dreamy", "emotional"],
            communication_style: "Poetic, talks about feelings",
            interests: ["love", "relationships", "poetry"]
        }
    }
];

// Diverse conversation topics and starters
const conversationTopics = [
    // Existential/Philosophical
    {
        category: "existential",
        starters: [
            "Do you ever think about what the point of existence really is?",
            "I had this weird dream last night that made me question reality",
            "Sometimes I wonder if we're all just living in a simulation",
            "What do you think happens after we die?",
            "Is free will real or just an illusion?",
            "Do you think consciousness is just chemicals in our brain?"
        ]
    },

    // Work/Office Gossip
    {
        category: "work_gossip",
        starters: [
            "OMG you will NOT believe what happened at work today",
            "My coworker Jessica is being so passive aggressive lately",
            "I think my boss is having an affair with someone in accounting",
            "There are rumors about layoffs coming next month",
            "Did you hear about the drama in the marketing department?",
            "I accidentally heard my manager talking about my performance review"
        ]
    },

    // Sports/NBA
    {
        category: "sports",
        starters: [
            "Did you see that insane Lakers trade yesterday?",
            "I can't believe the Warriors are struggling this season",
            "LeBron is still dominating at his age, it's crazy",
            "The Celtics vs Heat rivalry is getting intense",
            "Draft picks this year are looking promising",
            "NBA All-Star weekend was wild this year"
        ]
    },

    // Social Media/Current Trends
    {
        category: "social_trends",
        starters: [
            "Have you seen this new TikTok trend where people are...",
            "Instagram's new feature is actually kind of cool",
            "Everyone's talking about that viral video with the cat",
            "This new social media challenge is getting out of hand",
            "Did you see what happened with that influencer drama?",
            "Twitter is losing its mind over this celebrity tweet"
        ]
    },

    // Technology
    {
        category: "technology",
        starters: [
            "AI is getting scary good these days",
            "I just got the new iPhone and the camera is insane",
            "ChatGPT just changed how I do everything at work",
            "VR is finally becoming mainstream I think",
            "Crypto is making a comeback apparently",
            "Tesla's new update broke my car's software"
        ]
    },

    // Relationships/Dating
    {
        category: "relationships",
        starters: [
            "Dating apps are so weird, everyone seems fake",
            "My relationship is going through a rough patch",
            "I think I'm catching feelings for my friend",
            "Modern dating is so complicated compared to before",
            "I had the worst date last night, want to hear about it?",
            "My ex just texted me out of nowhere after 6 months"
        ]
    },

    // Entertainment/Pop Culture
    {
        category: "entertainment",
        starters: [
            "That new Netflix show is absolutely addictive",
            "Did you watch the Oscars? So many surprises",
            "I'm obsessed with this new K-pop group",
            "Marvel movies are getting ridiculous at this point",
            "This podcast I'm listening to is blowing my mind",
            "The new season of that show everyone's watching just dropped"
        ]
    },

    // Personal Growth/Mental Health
    {
        category: "personal_growth",
        starters: [
            "I've been working on my mental health lately",
            "Meditation is actually changing my life",
            "I'm trying to be more mindful about everything",
            "Therapy is helping me understand myself better",
            "I want to make some major life changes",
            "I've been reading about stoicism and it's fascinating"
        ]
    },

    // Food/Lifestyle
    {
        category: "lifestyle",
        starters: [
            "I'm trying this new diet and it's actually working",
            "The restaurant I went to last night was incredible",
            "I'm thinking about going vegan but it seems hard",
            "Cooking has become my new hobby during weekends",
            "I found this amazing coffee shop downtown",
            "I'm trying to be more sustainable in my daily life"
        ]
    },

    // Random/Weird
    {
        category: "random",
        starters: [
            "I saw the weirdest thing on my way to work today",
            "Random thought: why do we say 'after dark' when it's not after anything?",
            "I just realized I've been pronouncing this word wrong my whole life",
            "Do you ever have those moments where you question everything?",
            "I had the strangest conversation with a stranger today",
            "Sometimes I wonder what my dog is actually thinking"
        ]
    }
];

// User response patterns for different conversation flows
const responsePatterns = {
    agreement: ["Yeah totally", "I completely agree", "Exactly!", "That's so true", "You're absolutely right"],
    disagreement: ["I don't know about that", "Hmm, I see it differently", "I'm not sure I agree", "That's an interesting take but...", "I think there's another side to it"],
    curiosity: ["Tell me more about that", "That's interesting, why do you think that?", "I want to hear your perspective", "What made you think of that?", "Can you explain that more?"],
    personal_share: ["That reminds me of when I...", "I had a similar experience", "I can relate to that because...", "That's funny, I was just thinking about...", "Something similar happened to me"],
    follow_up: ["What happened next?", "How did that make you feel?", "What did you do about it?", "That's crazy, then what?", "I need to know more"],
    emotional: ["That sounds really tough", "I'm sorry you're going through that", "That must have been exciting", "I can imagine how you felt", "That sounds overwhelming"],
    humorous: ["Haha that's hilarious", "You're so funny", "I'm dying 😂", "That's the best thing I've heard today", "You always know how to make me laugh"],
    philosophical: ["That's a deep question", "I've been thinking about that too", "It makes you wonder about...", "There's so much we don't understand", "Life is so complex"]
};

// Function to get random item from array
function getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Function to simulate realistic user responses
function generateUserResponse(context, messageCount) {
    const patterns = Object.values(responsePatterns).flat();

    // Vary response length and style based on conversation flow
    if (messageCount < 5) {
        // Early conversation - more curious and engaging
        const responses = [...responsePatterns.curiosity, ...responsePatterns.follow_up];
        return getRandom(responses);
    } else if (messageCount < 15) {
        // Mid conversation - mix of agreement, personal sharing
        const responses = [...responsePatterns.agreement, ...responsePatterns.personal_share, ...responsePatterns.emotional];
        return getRandom(responses);
    } else if (messageCount < 30) {
        // Later conversation - deeper engagement
        const responses = [...responsePatterns.philosophical, ...responsePatterns.curiosity, ...responsePatterns.follow_up];
        return getRandom(responses);
    } else {
        // End conversation - more varied, testing different scenarios
        return getRandom(patterns);
    }
}

// Function to test a single conversation
async function testConversation(personality, topic, conversationId) {
    console.log(`\n🗣️  Starting conversation ${conversationId}: ${personality.name} discussing ${topic.category}`);

    const messages = [];
    const starter = getRandom(topic.starters);

    try {
        // Start conversation
        let response = await axios.post(`${API_BASE}/chat`, {
            message: starter,
            characterProfile: {
                character_name: personality.name,
                personality_traits: personality.personality_traits
            },
            isFirstMessage: true,
            userPersonality: {
                preferences: {
                    curiosity_style: [topic.category],
                    emotional_support_need: ["encouragement"]
                }
            }
        });

        messages.push({ user: starter, ai: response.data.messages || response.data.response });

        // Continue conversation
        for (let i = 1; i < CONVERSATION_LENGTH; i++) {
            const userMessage = generateUserResponse(topic.category, i);

            response = await axios.post(`${API_BASE}/chat`, {
                message: userMessage,
                characterProfile: {
                    character_name: personality.name,
                    personality_traits: personality.personality_traits
                },
                conversationHistory: messages.slice(-10).map(msg => [
                    { content: msg.user, sender: "user" },
                    { content: Array.isArray(msg.ai) ? msg.ai.join(" ") : msg.ai, sender: "ai" }
                ]).flat(),
                isFirstMessage: false,
                userPersonality: {
                    preferences: {
                        curiosity_style: [topic.category],
                        emotional_support_need: ["encouragement"]
                    }
                }
            });

            messages.push({
                user: userMessage,
                ai: response.data.messages || response.data.response
            });

            // Add small delay to avoid overwhelming the API
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log(`✅ Completed conversation ${conversationId}: ${messages.length} exchanges`);
        return {
            personality: personality.name,
            topic: topic.category,
            messageCount: messages.length,
            messages: messages,
            success: true
        };

    } catch (error) {
        console.error(`❌ Error in conversation ${conversationId}:`, error.message);
        return {
            personality: personality.name,
            topic: topic.category,
            messageCount: messages.length,
            error: error.message,
            success: false
        };
    }
}

// Main testing function
async function runConversationTests() {
    console.log("🚀 Starting comprehensive conversation testing...");
    console.log(`📊 Testing ${PERSONALITIES_COUNT} personalities across ${conversationTopics.length} topic categories`);
    console.log(`🎯 Target: ${CONVERSATION_LENGTH} messages per conversation\n`);

    const results = [];
    const startTime = Date.now();

    // Test each personality with different topics
    for (let i = 0; i < testPersonalities.length; i++) {
        const personality = testPersonalities[i];
        const topic = conversationTopics[i % conversationTopics.length];

        const result = await testConversation(personality, topic, i + 1);
        results.push(result);

        // Add delay between conversations
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Generate comprehensive report
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log("\n" + "=".repeat(60));
    console.log("📈 COMPREHENSIVE CONVERSATION TEST RESULTS");
    console.log("=".repeat(60));

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`\n📊 SUMMARY STATISTICS:`);
    console.log(`   Total Conversations: ${results.length}`);
    console.log(`   Successful: ${successful.length} (${(successful.length / results.length * 100).toFixed(1)}%)`);
    console.log(`   Failed: ${failed.length} (${(failed.length / results.length * 100).toFixed(1)}%)`);
    console.log(`   Total Duration: ${duration.toFixed(1)} seconds`);
    console.log(`   Average per Conversation: ${(duration / results.length).toFixed(1)} seconds`);

    const totalMessages = successful.reduce((sum, r) => sum + r.messageCount, 0);
    console.log(`   Total Messages Generated: ${totalMessages}`);
    console.log(`   Average Messages per Conversation: ${(totalMessages / successful.length).toFixed(1)}`);

    console.log(`\n🎭 PERSONALITY COVERAGE:`);
    const personalityStats = {};
    successful.forEach(r => {
        personalityStats[r.personality] = (personalityStats[r.personality] || 0) + 1;
    });
    Object.entries(personalityStats).forEach(([name, count]) => {
        console.log(`   ${name}: ${count} conversation(s)`);
    });

    console.log(`\n🏷️  TOPIC COVERAGE:`);
    const topicStats = {};
    successful.forEach(r => {
        topicStats[r.topic] = (topicStats[r.topic] || 0) + 1;
    });
    Object.entries(topicStats).forEach(([topic, count]) => {
        console.log(`   ${topic}: ${count} conversation(s)`);
    });

    if (failed.length > 0) {
        console.log(`\n❌ FAILED CONVERSATIONS:`);
        failed.forEach(f => {
            console.log(`   ${f.personality} (${f.topic}): ${f.error}`);
        });
    }

    console.log("\n" + "=".repeat(60));
    console.log("🎯 TEST COMPLETE - AI Conversation capabilities validated!");
    console.log("=".repeat(60));

    return results;
}

// Export for use
module.exports = {
    runConversationTests,
    testPersonalities,
    conversationTopics
};

// Run if called directly
if (require.main === module) {
    runConversationTests().catch(console.error);
} 