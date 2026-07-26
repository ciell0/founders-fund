-- Init Migration for FoundersFund
-- Path: supabase/migrations/20260725000000_init.sql

-- 1. Create startups table
CREATE TABLE IF NOT EXISTS startups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id UUID REFERENCES startups(id) ON DELETE CASCADE,
    type VARCHAR(10) CHECK (type IN ('INCOME', 'EXPENSE')),
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create financial_projections table
CREATE TABLE IF NOT EXISTS financial_projections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id UUID REFERENCES startups(id) ON DELETE CASCADE,
    projection_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create checklist_items table
CREATE TABLE IF NOT EXISTS checklist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id UUID REFERENCES startups(id) ON DELETE CASCADE,
    item_key VARCHAR(100) NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (startup_id, item_key)
);

-- 5. Create ai_analysis table
CREATE TABLE IF NOT EXISTS ai_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id UUID REFERENCES startups(id) ON DELETE CASCADE,
    analysis_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_projections ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis ENABLE ROW LEVEL SECURITY;

-- Create RLS policies mapped to auth.uid()

-- Startups policies
CREATE POLICY "Users can manage their own startups" 
    ON startups 
    FOR ALL 
    USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can manage transactions of their own startups" 
    ON transactions 
    FOR ALL 
    USING (
        startup_id IN (
            SELECT id FROM startups WHERE user_id = auth.uid()
        )
    );

-- Financial projections policies
CREATE POLICY "Users can manage projections of their own startups" 
    ON financial_projections 
    FOR ALL 
    USING (
        startup_id IN (
            SELECT id FROM startups WHERE user_id = auth.uid()
        )
    );

-- Checklist items policies
CREATE POLICY "Users can manage checklist items of their own startups" 
    ON checklist_items 
    FOR ALL 
    USING (
        startup_id IN (
            SELECT id FROM startups WHERE user_id = auth.uid()
        )
    );

-- AI analysis policies
CREATE POLICY "Users can manage ai analysis of their own startups"
    ON ai_analysis
    FOR ALL
    USING (
        startup_id IN (
            SELECT id FROM startups WHERE user_id = auth.uid()
        )
    );
