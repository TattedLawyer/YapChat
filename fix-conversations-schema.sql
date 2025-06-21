-- Fix conversations table schema
-- Add missing ai_response column if it doesn't exist

ALTER TABLE conversations 
ADD COLUMN IF NOT EXISTS ai_response TEXT;

-- Verify the column was added
\d conversations; 