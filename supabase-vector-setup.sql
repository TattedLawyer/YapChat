-- =====================================================
-- YapChat Elite Memory System - Database Schema
-- =====================================================
-- Comprehensive RAG memory architecture with multi-tiered
-- memory types, emotional context, and temporal decay
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- =====================================================
-- MEMORY EMBEDDINGS TABLE
-- =====================================================
-- Core table for storing vectorized memories with rich metadata
CREATE TABLE IF NOT EXISTS memory_embeddings (
    -- Primary identifiers
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    companion_id UUID NOT NULL,
    conversation_id UUID,
    
    -- Memory content and context
    memory_text TEXT NOT NULL,
    memory_type VARCHAR(20) NOT NULL CHECK (memory_type IN (
        'conversational',    -- Direct conversation excerpts
        'episodic',         -- Significant events/moments
        'semantic',         -- Facts, preferences, knowledge
        'emotional',        -- Emotional states and reactions
        'preference',       -- User likes/dislikes
        'milestone',        -- Relationship milestones
        'contextual'        -- Environmental/situational context
    )),
    
    -- Vector embedding (768 dimensions for Google text-embedding-004)
    embedding VECTOR(768) NOT NULL,
    
    -- Rich metadata for advanced retrieval
    metadata JSONB DEFAULT '{}',
    emotional_context JSONB DEFAULT '{}', -- Emotional state, sentiment, intensity
    extracted_entities JSONB DEFAULT '{}', -- People, places, topics, activities
    relationship_context JSONB DEFAULT '{}', -- Relationship level, intimacy, dynamics
    
    -- Temporal and importance scoring
    importance_score FLOAT DEFAULT 0.5 CHECK (importance_score >= 0 AND importance_score <= 1),
    emotional_intensity FLOAT DEFAULT 0.5 CHECK (emotional_intensity >= 0 AND emotional_intensity <= 1),
    decay_factor FLOAT DEFAULT 1.0 CHECK (decay_factor >= 0 AND decay_factor <= 1),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexing and search optimization
    search_keywords TEXT[], -- For hybrid keyword + vector search
    conversation_turn INTEGER, -- Position within conversation
    
    -- Memory lifecycle management
    is_consolidated BOOLEAN DEFAULT FALSE, -- Has been processed by consolidation agent
    consolidation_parent_id UUID REFERENCES memory_embeddings(id), -- If this is a consolidated memory
    access_count INTEGER DEFAULT 0,
    
    -- Constraints
    CONSTRAINT valid_importance CHECK (importance_score BETWEEN 0 AND 1),
    CONSTRAINT valid_emotional_intensity CHECK (emotional_intensity BETWEEN 0 AND 1),
    CONSTRAINT valid_decay CHECK (decay_factor BETWEEN 0 AND 1)
);

-- =====================================================
-- MEMORY RETRIEVAL CACHE TABLE
-- =====================================================
-- Optimizes repeated memory queries with intelligent caching
CREATE TABLE IF NOT EXISTS memory_retrieval_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    companion_id UUID NOT NULL,
    
    -- Query characteristics
    query_embedding VECTOR(768) NOT NULL,
    query_text TEXT NOT NULL,
    query_context JSONB DEFAULT '{}',
    
    -- Cached results
    retrieved_memory_ids UUID[] NOT NULL,
    retrieval_scores FLOAT[] NOT NULL,
    
    -- Cache metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    use_count INTEGER DEFAULT 1,
    
    -- Cache invalidation
    is_valid BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 hour')
);

-- =====================================================
-- MEMORY CONSOLIDATION LOG TABLE
-- =====================================================
-- Tracks memory processing and consolidation operations
CREATE TABLE IF NOT EXISTS memory_consolidation_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    companion_id UUID NOT NULL,
    
    -- Consolidation details
    operation_type VARCHAR(20) NOT NULL CHECK (operation_type IN (
        'extraction',       -- Initial memory extraction from conversation
        'consolidation',    -- Merging similar memories
        'decay_update',     -- Temporal decay adjustment
        'importance_update', -- Importance score recalculation
        'cleanup'          -- Removal of low-value memories
    )),
    
    -- Processing metadata
    processed_memory_ids UUID[] NOT NULL,
    processing_stats JSONB DEFAULT '{}',
    llm_cost FLOAT DEFAULT 0,
    processing_time_ms INTEGER DEFAULT 0,
    
    -- Results
    created_memory_ids UUID[] DEFAULT '{}',
    updated_memory_ids UUID[] DEFAULT '{}',
    deleted_memory_ids UUID[] DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Status tracking
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT
);

-- =====================================================
-- MEMORY ANALYTICS TABLE
-- =====================================================
-- Tracks memory system performance and user engagement
CREATE TABLE IF NOT EXISTS memory_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    companion_id UUID NOT NULL,
    
    -- Analytics period
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Memory statistics
    total_memories INTEGER DEFAULT 0,
    memories_by_type JSONB DEFAULT '{}',
    avg_importance_score FLOAT DEFAULT 0,
    avg_emotional_intensity FLOAT DEFAULT 0,
    
    -- Retrieval statistics
    total_retrievals INTEGER DEFAULT 0,
    avg_retrieval_score FLOAT DEFAULT 0,
    cache_hit_rate FLOAT DEFAULT 0,
    
    -- Cost tracking
    embedding_cost FLOAT DEFAULT 0,
    llm_processing_cost FLOAT DEFAULT 0,
    total_cost FLOAT DEFAULT 0,
    
    -- Performance metrics
    avg_retrieval_time_ms INTEGER DEFAULT 0,
    avg_processing_time_ms INTEGER DEFAULT 0,
    
    -- Updated timestamp
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint for daily analytics
    UNIQUE(user_id, companion_id, date)
);

-- =====================================================
-- INDEXES FOR OPTIMAL PERFORMANCE
-- =====================================================

-- Primary vector similarity search index (HNSW for production)
CREATE INDEX IF NOT EXISTS idx_memory_embeddings_vector 
ON memory_embeddings USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Composite indexes for filtered vector search
CREATE INDEX IF NOT EXISTS idx_memory_user_companion_type 
ON memory_embeddings (user_id, companion_id, memory_type);

CREATE INDEX IF NOT EXISTS idx_memory_user_companion_created 
ON memory_embeddings (user_id, companion_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_memory_importance_emotional 
ON memory_embeddings (importance_score DESC, emotional_intensity DESC);

-- Temporal access patterns
CREATE INDEX IF NOT EXISTS idx_memory_last_accessed 
ON memory_embeddings (last_accessed_at DESC);

CREATE INDEX IF NOT EXISTS idx_memory_decay_factor 
ON memory_embeddings (decay_factor DESC);

-- Metadata search indexes (GIN for JSONB)
CREATE INDEX IF NOT EXISTS idx_memory_metadata 
ON memory_embeddings USING GIN (metadata);

CREATE INDEX IF NOT EXISTS idx_memory_emotional_context 
ON memory_embeddings USING GIN (emotional_context);

CREATE INDEX IF NOT EXISTS idx_memory_entities 
ON memory_embeddings USING GIN (extracted_entities);

-- Keyword search index
CREATE INDEX IF NOT EXISTS idx_memory_keywords 
ON memory_embeddings USING GIN (search_keywords);

-- Cache table indexes
CREATE INDEX IF NOT EXISTS idx_cache_user_companion 
ON memory_retrieval_cache (user_id, companion_id);

CREATE INDEX IF NOT EXISTS idx_cache_expires 
ON memory_retrieval_cache (expires_at);

CREATE INDEX IF NOT EXISTS idx_cache_query_vector 
ON memory_retrieval_cache USING hnsw (query_embedding vector_cosine_ops);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_user_companion_date 
ON memory_analytics (user_id, companion_id, date DESC);

-- Consolidation log indexes
CREATE INDEX IF NOT EXISTS idx_consolidation_user_companion 
ON memory_consolidation_log (user_id, companion_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_consolidation_status 
ON memory_consolidation_log (status, created_at);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE memory_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_retrieval_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_consolidation_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_analytics ENABLE ROW LEVEL SECURITY;

-- Memory embeddings policies
CREATE POLICY "Users can access their own memories" 
ON memory_embeddings FOR ALL 
USING (auth.uid() = user_id);

-- Cache policies
CREATE POLICY "Users can access their own cache" 
ON memory_retrieval_cache FOR ALL 
USING (auth.uid() = user_id);

-- Consolidation log policies
CREATE POLICY "Users can view their own consolidation logs" 
ON memory_consolidation_log FOR SELECT 
USING (auth.uid() = user_id);

-- Analytics policies
CREATE POLICY "Users can view their own analytics" 
ON memory_analytics FOR SELECT 
USING (auth.uid() = user_id);

-- =====================================================
-- UTILITY FUNCTIONS
-- =====================================================

-- Function to calculate memory relevance score
CREATE OR REPLACE FUNCTION calculate_memory_relevance(
    memory_row memory_embeddings,
    current_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
) RETURNS FLOAT AS $$
DECLARE
    time_decay FLOAT;
    access_boost FLOAT;
    final_score FLOAT;
BEGIN
    -- Calculate time-based decay
    time_decay := EXP(-EXTRACT(EPOCH FROM (current_time - memory_row.created_at)) / (86400 * 30)); -- 30-day half-life
    
    -- Calculate access frequency boost
    access_boost := LEAST(1.0, memory_row.access_count / 10.0);
    
    -- Combine factors
    final_score := memory_row.importance_score * memory_row.decay_factor * 
                   (0.7 * time_decay + 0.3 * access_boost);
    
    RETURN GREATEST(0.0, LEAST(1.0, final_score));
END;
$$ LANGUAGE plpgsql;

-- Function to update memory access statistics
CREATE OR REPLACE FUNCTION update_memory_access(memory_id UUID) 
RETURNS VOID AS $$
BEGIN
    UPDATE memory_embeddings 
    SET 
        last_accessed_at = NOW(),
        access_count = access_count + 1
    WHERE id = memory_id;
END;
$$ LANGUAGE plpgsql;

-- Function to clean expired cache entries
CREATE OR REPLACE FUNCTION clean_expired_cache() 
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM memory_retrieval_cache 
    WHERE expires_at < NOW() OR NOT is_valid;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- AUTOMATED MAINTENANCE
-- =====================================================

-- Function to perform daily memory maintenance
CREATE OR REPLACE FUNCTION daily_memory_maintenance() 
RETURNS VOID AS $$
BEGIN
    -- Clean expired cache
    PERFORM clean_expired_cache();
    
    -- Update decay factors for old memories
    UPDATE memory_embeddings 
    SET decay_factor = decay_factor * 0.99
    WHERE last_accessed_at < NOW() - INTERVAL '7 days'
    AND decay_factor > 0.1;
    
    -- Archive very old, low-importance memories
    UPDATE memory_embeddings 
    SET metadata = metadata || '{"archived": true}'::jsonb
    WHERE created_at < NOW() - INTERVAL '6 months'
    AND importance_score < 0.2
    AND access_count < 2;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PERFORMANCE MONITORING
-- =====================================================

-- View for memory system health monitoring
CREATE OR REPLACE VIEW memory_system_health AS
SELECT 
    COUNT(*) as total_memories,
    COUNT(DISTINCT user_id) as active_users,
    COUNT(DISTINCT companion_id) as active_companions,
    AVG(importance_score) as avg_importance,
    AVG(emotional_intensity) as avg_emotional_intensity,
    AVG(access_count) as avg_access_count,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as memories_last_24h,
    COUNT(*) FILTER (WHERE last_accessed_at > NOW() - INTERVAL '24 hours') as accessed_last_24h
FROM memory_embeddings
WHERE metadata->>'archived' IS DISTINCT FROM 'true';

-- =====================================================
-- SAMPLE DATA INSERTION (for testing)
-- =====================================================

-- Note: This would be populated by the application
-- Sample structure for reference:
/*
INSERT INTO memory_embeddings (
    user_id, companion_id, conversation_id,
    memory_text, memory_type, embedding,
    metadata, emotional_context, extracted_entities,
    importance_score, emotional_intensity,
    search_keywords
) VALUES (
    'user-uuid-here',
    'companion-uuid-here', 
    'conversation-uuid-here',
    'User mentioned they love hiking in the mountains during autumn',
    'preference',
    '[0.1, 0.2, ...]'::vector, -- 768-dimensional embedding
    '{"topic": "outdoor_activities", "season": "autumn"}',
    '{"sentiment": "positive", "emotion": "joy", "intensity": 0.8}',
    '{"activities": ["hiking"], "locations": ["mountains"], "seasons": ["autumn"]}',
    0.7,
    0.8,
    ARRAY['hiking', 'mountains', 'autumn', 'outdoor', 'nature']
);
*/

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'YapChat Elite Memory System database schema installed successfully!';
    RAISE NOTICE 'Tables created: memory_embeddings, memory_retrieval_cache, memory_consolidation_log, memory_analytics';
    RAISE NOTICE 'Indexes optimized for vector similarity search and filtering';
    RAISE NOTICE 'Row Level Security enabled for data protection';
    RAISE NOTICE 'Utility functions and maintenance procedures ready';
END $$; 