-- ===============================================
-- AI COMPANION - TEST RESULTS DATABASE SCHEMA
-- ===============================================
-- Run this SQL in your Supabase SQL Editor to create test tracking tables

-- ===============================================
-- 1. TEST SESSIONS TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS test_sessions (
    id TEXT PRIMARY KEY,
    test_type TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_personalities INTEGER,
    total_conversations INTEGER,
    successful_conversations INTEGER,
    failed_conversations INTEGER,
    success_rate DECIMAL,
    total_messages INTEGER,
    avg_messages_per_conversation DECIMAL,
    test_duration_seconds DECIMAL,
    full_results JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 2. CONVERSATION TEST RESULTS TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS conversation_test_results (
    id SERIAL PRIMARY KEY,
    test_session_id TEXT REFERENCES test_sessions(id) ON DELETE CASCADE,
    conversation_index INTEGER,
    personality_name TEXT,
    topic_category TEXT,
    conversation_starter TEXT,
    message_count INTEGER,
    success BOOLEAN,
    error_message TEXT,
    avg_response_length DECIMAL,
    sample_exchanges JSONB,
    performance_score DECIMAL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 3. PERFORMANCE METRICS TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS test_performance_metrics (
    id SERIAL PRIMARY KEY,
    test_session_id TEXT REFERENCES test_sessions(id) ON DELETE CASCADE,
    metric_name TEXT,
    metric_value DECIMAL,
    metric_category TEXT,
    metric_description TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 4. PERSONALITY PERFORMANCE TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS personality_performance (
    id SERIAL PRIMARY KEY,
    test_session_id TEXT REFERENCES test_sessions(id) ON DELETE CASCADE,
    personality_name TEXT,
    total_conversations INTEGER,
    successful_conversations INTEGER,
    avg_messages_per_conversation DECIMAL,
    avg_response_length DECIMAL,
    consistency_score DECIMAL,
    topic_diversity_score DECIMAL,
    engagement_score DECIMAL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 5. TOPIC PERFORMANCE TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS topic_performance (
    id SERIAL PRIMARY KEY,
    test_session_id TEXT REFERENCES test_sessions(id) ON DELETE CASCADE,
    topic_category TEXT,
    total_conversations INTEGER,
    avg_conversation_length DECIMAL,
    success_rate DECIMAL,
    avg_response_quality DECIMAL,
    engagement_level DECIMAL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 6. INDEXES FOR PERFORMANCE
-- ===============================================
CREATE INDEX IF NOT EXISTS idx_test_sessions_timestamp ON test_sessions(timestamp);
CREATE INDEX IF NOT EXISTS idx_test_sessions_type ON test_sessions(test_type);
CREATE INDEX IF NOT EXISTS idx_conversation_results_session ON conversation_test_results(test_session_id);
CREATE INDEX IF NOT EXISTS idx_conversation_results_personality ON conversation_test_results(personality_name);
CREATE INDEX IF NOT EXISTS idx_conversation_results_topic ON conversation_test_results(topic_category);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_session ON test_performance_metrics(test_session_id);
CREATE INDEX IF NOT EXISTS idx_personality_performance_session ON personality_performance(test_session_id);
CREATE INDEX IF NOT EXISTS idx_topic_performance_session ON topic_performance(test_session_id);

-- ===============================================
-- 7. VIEWS FOR ANALYSIS
-- ===============================================

-- Overall Test Performance View
CREATE OR REPLACE VIEW test_performance_summary AS
SELECT 
    ts.id,
    ts.test_type,
    ts.timestamp,
    ts.success_rate,
    ts.total_messages,
    ts.avg_messages_per_conversation,
    ts.test_duration_seconds,
    COUNT(ctr.id) as total_recorded_conversations,
    AVG(ctr.avg_response_length) as overall_avg_response_length,
    AVG(CASE WHEN ctr.success THEN 1.0 ELSE 0.0 END) * 100 as calculated_success_rate
FROM test_sessions ts
LEFT JOIN conversation_test_results ctr ON ts.id = ctr.test_session_id
GROUP BY ts.id, ts.test_type, ts.timestamp, ts.success_rate, 
         ts.total_messages, ts.avg_messages_per_conversation, ts.test_duration_seconds;

-- Personality Effectiveness View
CREATE OR REPLACE VIEW personality_effectiveness AS
SELECT 
    personality_name,
    COUNT(*) as total_tests,
    AVG(CASE WHEN success THEN 1.0 ELSE 0.0 END) * 100 as success_rate,
    AVG(message_count) as avg_conversation_length,
    AVG(avg_response_length) as avg_response_length,
    COUNT(DISTINCT topic_category) as topics_handled
FROM conversation_test_results
GROUP BY personality_name
ORDER BY success_rate DESC, avg_conversation_length DESC;

-- Topic Difficulty Analysis View
CREATE OR REPLACE VIEW topic_difficulty_analysis AS
SELECT 
    topic_category,
    COUNT(*) as total_conversations,
    AVG(CASE WHEN success THEN 1.0 ELSE 0.0 END) * 100 as success_rate,
    AVG(message_count) as avg_length,
    AVG(avg_response_length) as avg_response_length,
    COUNT(DISTINCT personality_name) as personalities_tested
FROM conversation_test_results
GROUP BY topic_category
ORDER BY success_rate ASC, avg_length DESC;

-- ===============================================
-- SETUP COMPLETE!
-- ===============================================
-- Your test tracking database is now ready.
-- This will store comprehensive data about:
-- - Test sessions and overall performance
-- - Individual conversation results
-- - Performance metrics by personality and topic
-- - Historical tracking for optimization analysis 