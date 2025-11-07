-- SocialDesk Initial Schema Migration
-- Creates all core tables for the MVP

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    plan VARCHAR(50) DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business')),
    credits INTEGER DEFAULT 100,
    email_verified BOOLEAN DEFAULT FALSE,
    onboarded BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    bio TEXT,
    website TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Social media accounts table
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL CHECK (provider IN ('instagram', 'tiktok', 'twitter', 'youtube', 'linkedin')),
    provider_user_id VARCHAR(255) NOT NULL,
    provider_username VARCHAR(255),
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMPTZ,
    account_data JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    connected_at TIMESTAMPTZ DEFAULT NOW(),
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_provider ON accounts(provider);
CREATE UNIQUE INDEX idx_accounts_provider_user ON accounts(provider, provider_user_id);

-- Persona profiles (AI learning)
CREATE TABLE IF NOT EXISTS persona_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) DEFAULT 'Default',
    style_embedding JSONB DEFAULT '{}'::jsonb,
    tone VARCHAR(50) DEFAULT 'casual' CHECK (tone IN ('casual', 'professional', 'funny', 'inspirational', 'educational')),
    sample_posts JSONB DEFAULT '[]'::jsonb,
    hashtag_preferences TEXT[],
    emoji_usage VARCHAR(20) DEFAULT 'moderate' CHECK (emoji_usage IN ('none', 'minimal', 'moderate', 'heavy')),
    avg_caption_length INTEGER,
    preferred_hooks TEXT[],
    is_default BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_persona_user_id ON persona_profiles(user_id);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
    title VARCHAR(255),
    content JSONB NOT NULL DEFAULT '{}'::jsonb, -- {caption, hooks, hashtags, media_urls, etc}
    post_type VARCHAR(50) DEFAULT 'image' CHECK (post_type IN ('image', 'video', 'carousel', 'reel', 'story')),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed', 'archived')),
    scheduled_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    platform_post_id VARCHAR(255),
    viral_score INTEGER DEFAULT 0 CHECK (viral_score >= 0 AND viral_score <= 100),
    analytics JSONB DEFAULT '{}'::jsonb, -- {likes, comments, shares, saves, reach, impressions}
    ai_generated BOOLEAN DEFAULT FALSE,
    template_id UUID,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_account_id ON posts(account_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_scheduled_at ON posts(scheduled_at);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- Templates marketplace
CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    tags TEXT[],
    template_type VARCHAR(50) CHECK (template_type IN ('caption', 'hook', 'carousel', 'script', 'email', 'bundle')),
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    preview_url TEXT,
    asset_urls TEXT[],
    price_cents INTEGER DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    download_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_templates_creator_id ON templates(creator_id);
CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_is_published ON templates(is_published);
CREATE INDEX idx_templates_rating ON templates(rating DESC);

-- Template purchases
CREATE TABLE IF NOT EXISTS template_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transaction_id UUID,
    price_paid_cents INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    purchased_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_template_purchases_buyer_id ON template_purchases(buyer_id);
CREATE INDEX idx_template_purchases_template_id ON template_purchases(template_id);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) CHECK (transaction_type IN ('purchase', 'subscription', 'payout', 'refund', 'credit')),
    amount_cents INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    stripe_payment_id VARCHAR(255),
    stripe_payment_intent_id VARCHAR(255),
    metadata JSONB DEFAULT '{}'::jsonb,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_stripe_payment_id ON transactions(stripe_payment_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- Referrals
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code VARCHAR(50) UNIQUE NOT NULL,
    referred_by UUID REFERENCES users(id) ON DELETE SET NULL,
    used_count INTEGER DEFAULT 0,
    total_rewards_earned INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_referrals_user_id ON referrals(user_id);
CREATE INDEX idx_referrals_code ON referrals(code);
CREATE INDEX idx_referrals_referred_by ON referrals(referred_by);

-- Streaks (gamification)
CREATE TABLE IF NOT EXISTS streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_posted_at TIMESTAMPTZ,
    total_posts INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    badges JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_streaks_user_id ON streaks(user_id);
CREATE INDEX idx_streaks_current_streak ON streaks(current_streak DESC);

-- Collaborations
CREATE TABLE IF NOT EXISTS collaborations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    brand_name VARCHAR(255),
    brand_email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
    collaboration_type VARCHAR(50) CHECK (collaboration_type IN ('sponsored_post', 'brand_deal', 'affiliate', 'gift')),
    details JSONB DEFAULT '{}'::jsonb,
    compensation_cents INTEGER,
    deliverables TEXT[],
    deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_collaborations_creator_id ON collaborations(creator_id);
CREATE INDEX idx_collaborations_status ON collaborations(status);

-- AI generation history
CREATE TABLE IF NOT EXISTS ai_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    generation_type VARCHAR(50) CHECK (generation_type IN ('caption', 'hook', 'repurpose', 'hashtag', 'viral_score')),
    input_data JSONB NOT NULL,
    output_data JSONB NOT NULL,
    model_used VARCHAR(100),
    tokens_used INTEGER,
    cost_credits INTEGER DEFAULT 1,
    quality_rating INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_generations_user_id ON ai_generations(user_id);
CREATE INDEX idx_ai_generations_created_at ON ai_generations(created_at DESC);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50),
    title VARCHAR(255),
    message TEXT,
    data JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_persona_profiles_updated_at BEFORE UPDATE ON persona_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON referrals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_streaks_updated_at BEFORE UPDATE ON streaks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_collaborations_updated_at BEFORE UPDATE ON collaborations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create views for common queries
CREATE OR REPLACE VIEW user_stats AS
SELECT
    u.id,
    u.username,
    u.plan,
    u.credits,
    COUNT(DISTINCT p.id) as total_posts,
    COUNT(DISTINCT a.id) as connected_accounts,
    COALESCE(s.current_streak, 0) as current_streak,
    COALESCE(SUM(t.amount_cents), 0) as total_earnings_cents
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
LEFT JOIN accounts a ON u.id = a.user_id AND a.is_active = true
LEFT JOIN streaks s ON u.id = s.user_id
LEFT JOIN transactions t ON u.id = t.user_id AND t.transaction_type = 'payout' AND t.status = 'completed'
GROUP BY u.id, u.username, u.plan, u.credits, s.current_streak;

COMMENT ON TABLE users IS 'Core user accounts';
COMMENT ON TABLE accounts IS 'Connected social media accounts';
COMMENT ON TABLE persona_profiles IS 'AI-learned user writing styles';
COMMENT ON TABLE posts IS 'Created and scheduled posts';
COMMENT ON TABLE templates IS 'Marketplace templates';
COMMENT ON TABLE transactions IS 'Financial transactions';
COMMENT ON TABLE referrals IS 'User referral codes and tracking';
COMMENT ON TABLE streaks IS 'Gamification: posting streaks and achievements';
COMMENT ON TABLE collaborations IS 'Brand collaboration opportunities';
COMMENT ON TABLE ai_generations IS 'AI generation audit log';
