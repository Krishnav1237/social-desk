-- SocialDesk Seed Data
-- Test users, posts, and templates for development

-- Insert test users (password for all: 'password123')
-- Password hash for 'password123' using bcrypt rounds=10
INSERT INTO users (id, email, username, password_hash, plan, credits, onboarded, bio) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'emma@socialdesk.com',
    'emma_creates',
    '$2b$10$rKx8qvHzVvN6x0.PxGZCWO8WJZqI2Xwm9bOZkCpN9KyV5h8xNLGqS',
    'pro',
    500,
    true,
    '🎨 Digital creator | Fashion & lifestyle | DM for collabs'
),
(
    '22222222-2222-2222-2222-222222222222',
    'alex@socialdesk.com',
    'alex_tech',
    '$2b$10$rKx8qvHzVvN6x0.PxGZCWO8WJZqI2Xwm9bOZkCpN9KyV5h8xNLGqS',
    'free',
    100,
    true,
    '💻 Tech reviews | Coding tips | Building in public'
),
(
    '33333333-3333-3333-3333-333333333333',
    'sarah@socialdesk.com',
    'sarah_fitness',
    '$2b$10$rKx8qvHzVvN6x0.PxGZCWO8WJZqI2Xwm9bOZkCpN9KyV5h8xNLGqS',
    'business',
    1000,
    true,
    '💪 Fitness coach | Nutrition tips | Your transformation journey'
),
(
    '44444444-4444-4444-4444-444444444444',
    'brand@example.com',
    'cool_brand',
    '$2b$10$rKx8qvHzVvN6x0.PxGZCWO8WJZqI2Xwm9bOZkCpN9KyV5h8xNLGqS',
    'business',
    2000,
    true,
    '🏢 Brand account | Looking for creator partnerships'
)
ON CONFLICT (email) DO NOTHING;

-- Insert social media accounts
INSERT INTO accounts (user_id, provider, provider_user_id, provider_username, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'instagram', 'emma_ig_123', 'emma_creates', true),
('22222222-2222-2222-2222-222222222222', 'instagram', 'alex_ig_456', 'alex_tech', true),
('33333333-3333-3333-3333-333333333333', 'instagram', 'sarah_ig_789', 'sarah_fitness', true)
ON CONFLICT DO NOTHING;

-- Insert persona profiles
INSERT INTO persona_profiles (user_id, name, tone, emoji_usage, avg_caption_length) VALUES
('11111111-1111-1111-1111-111111111111', 'Default', 'casual', 'moderate', 150),
('22222222-2222-2222-2222-222222222222', 'Default', 'educational', 'minimal', 200),
('33333333-3333-3333-3333-333333333333', 'Default', 'inspirational', 'heavy', 120)
ON CONFLICT DO NOTHING;

-- Insert sample posts
INSERT INTO posts (user_id, account_id, title, content, post_type, status, viral_score, ai_generated) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    (SELECT id FROM accounts WHERE provider_username = 'emma_creates' LIMIT 1),
    'Weekend OOTD',
    '{"caption": "Weekend vibes ✨ Which look is your favorite? 1, 2, or 3? #fashion #ootd #style", "hashtags": ["fashion", "ootd", "style", "weekendvibes"], "media_urls": ["https://picsum.photos/1080/1080?random=1"]}',
    'carousel',
    'published',
    78,
    false
),
(
    '22222222-2222-2222-2222-222222222222',
    (SELECT id FROM accounts WHERE provider_username = 'alex_tech' LIMIT 1),
    'VS Code Tips',
    '{"caption": "5 VS Code shortcuts that changed my life 🚀\n\n1. Ctrl+P - Quick file open\n2. Ctrl+Shift+P - Command palette\n3. Alt+Click - Multiple cursors\n4. Ctrl+/ - Toggle comment\n5. F2 - Rename symbol\n\nWhich one do you use most? #coding #vscode #webdev", "hashtags": ["coding", "vscode", "webdev", "programming"], "media_urls": ["https://picsum.photos/1080/1920?random=2"]}',
    'reel',
    'published',
    85,
    true
),
(
    '33333333-3333-3333-3333-333333333333',
    (SELECT id FROM accounts WHERE provider_username = 'sarah_fitness' LIMIT 1),
    'Morning Workout',
    '{"caption": "Started my day with this 20-min HIIT workout 💪 No equipment needed!\n\nSave this for later and try it tomorrow morning. Your future self will thank you! ❤️\n\n#fitness #workout #hiit #morningroutine", "hashtags": ["fitness", "workout", "hiit", "morningroutine", "fitfam"], "media_urls": ["https://picsum.photos/1080/1350?random=3"]}',
    'image',
    'published',
    92,
    false
),
(
    '11111111-1111-1111-1111-111111111111',
    (SELECT id FROM accounts WHERE provider_username = 'emma_creates' LIMIT 1),
    'New Product Review',
    '{"caption": "Testing out the new summer collection 🌸 Full review coming soon!", "hashtags": ["fashion", "review", "summer"], "media_urls": ["https://picsum.photos/1080/1080?random=4"]}',
    'image',
    'scheduled',
    0,
    true
),
(
    '22222222-2222-2222-2222-222222222222',
    (SELECT id FROM accounts WHERE provider_username = 'alex_tech' LIMIT 1),
    'Build Log #5',
    '{"caption": "Building my SaaS - Day 5 update! Just shipped the authentication system. What feature should I build next? 🤔", "hashtags": ["buildinpublic", "saas", "coding"], "media_urls": []}',
    'image',
    'draft',
    0,
    false
);

-- Insert templates
INSERT INTO templates (creator_id, title, description, category, tags, template_type, content, price_cents, is_published, rating, review_count) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    '30 Fashion Captions Bundle',
    'Ready-to-use captions for fashion and lifestyle creators. Perfect for OOTD, fashion hauls, and style posts.',
    'Fashion',
    ARRAY['fashion', 'captions', 'lifestyle', 'ootd'],
    'bundle',
    '{"captions": ["Outfit of the day ✨", "Serving looks today 💅", "Fashion is my therapy 🛍️"], "count": 30}',
    999,
    true,
    4.8,
    127
),
(
    '22222222-2222-2222-2222-222222222222',
    'Tech Review Script Template',
    'Complete script template for tech product reviews. Includes intro, features breakdown, pros/cons, and call-to-action.',
    'Tech',
    ARRAY['tech', 'reviews', 'youtube', 'script'],
    'script',
    '{"sections": ["intro", "unboxing", "features", "testing", "verdict", "cta"], "duration": "5-7min"}',
    1499,
    true,
    4.9,
    83
),
(
    '33333333-3333-3333-3333-333333333333',
    'Workout Carousel Templates',
    '10 pre-designed carousel templates for workout posts. Fully customizable in Canva.',
    'Fitness',
    ARRAY['fitness', 'workout', 'carousel', 'design'],
    'carousel',
    '{"templates": 10, "format": "canva", "dimensions": "1080x1080"}',
    1999,
    true,
    5.0,
    156
),
(
    '11111111-1111-1111-1111-111111111111',
    'Viral Hooks Mega Pack',
    '100+ proven viral hooks for short-form content. Tested on Instagram Reels and TikTok.',
    'General',
    ARRAY['hooks', 'viral', 'reels', 'tiktok'],
    'hook',
    '{"hooks_count": 100, "categories": ["educational", "funny", "story", "controversial"]}',
    2999,
    true,
    4.7,
    294
),
(
    '22222222-2222-2222-2222-222222222222',
    'Email Newsletter Templates',
    '5 email newsletter templates optimized for creator businesses.',
    'Email',
    ARRAY['email', 'newsletter', 'templates'],
    'email',
    '{"templates": 5, "formats": ["welcome", "weekly", "product_launch", "update", "survey"]}',
    799,
    true,
    4.6,
    52
);

-- Insert referral codes
INSERT INTO referrals (user_id, code, used_count, total_rewards_earned) VALUES
('11111111-1111-1111-1111-111111111111', 'EMMA2024', 12, 600),
('22222222-2222-2222-2222-222222222222', 'ALEX2024', 5, 250),
('33333333-3333-3333-3333-333333333333', 'SARAH2024', 23, 1150);

-- Insert streaks
INSERT INTO streaks (user_id, current_streak, longest_streak, total_posts, level, xp) VALUES
('11111111-1111-1111-1111-111111111111', 7, 14, 89, 5, 890),
('22222222-2222-2222-2222-222222222222', 3, 8, 34, 3, 340),
('33333333-3333-3333-3333-333333333333', 21, 21, 156, 8, 1560);

-- Insert sample transactions
INSERT INTO transactions (user_id, transaction_type, amount_cents, status, description) VALUES
('11111111-1111-1111-1111-111111111111', 'payout', 50000, 'completed', 'Template sales payout - January'),
('22222222-2222-2222-2222-222222222222', 'subscription', 999, 'completed', 'Pro plan - Monthly'),
('33333333-3333-3333-3333-333333333333', 'payout', 120000, 'completed', 'Template sales payout - January');

-- Insert template purchases
INSERT INTO template_purchases (template_id, buyer_id, price_paid_cents) VALUES
(
    (SELECT id FROM templates WHERE title = 'Viral Hooks Mega Pack' LIMIT 1),
    '22222222-2222-2222-2222-222222222222',
    2999
),
(
    (SELECT id FROM templates WHERE title = 'Workout Carousel Templates' LIMIT 1),
    '11111111-1111-1111-1111-111111111111',
    1999
);

-- Insert sample collaborations
INSERT INTO collaborations (creator_id, brand_name, brand_email, status, collaboration_type, compensation_cents, deliverables) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'StyleCo Fashion',
    'partnerships@styleco.com',
    'accepted',
    'sponsored_post',
    50000,
    ARRAY['1 Instagram post', '3 stories', 'Brand mention in bio for 7 days']
),
(
    '33333333-3333-3333-3333-333333333333',
    'FitGear Pro',
    'collabs@fitgearpro.com',
    'pending',
    'brand_deal',
    75000,
    ARRAY['2 Instagram reels', '1 YouTube video', 'Affiliate code promotion']
);

-- Insert AI generations
INSERT INTO ai_generations (user_id, generation_type, input_data, output_data, model_used, tokens_used, cost_credits) VALUES
(
    '22222222-2222-2222-2222-222222222222',
    'caption',
    '{"topic": "VS Code tips", "tone": "educational", "goal": "engagement"}',
    '{"captions": ["5 VS Code shortcuts that changed my life 🚀..."], "generated_count": 5}',
    'gpt-4-turbo',
    256,
    1
),
(
    '11111111-1111-1111-1111-111111111111',
    'hook',
    '{"topic": "fashion haul", "platform": "reels"}',
    '{"hooks": ["Wait for the last outfit 😍", "Which one should I keep? 🤔", "POV: You just got paid 💸"]}',
    'gpt-4-turbo',
    128,
    1
);

-- Insert notifications
INSERT INTO notifications (user_id, notification_type, title, message, is_read) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'collaboration',
    'New collaboration request',
    'StyleCo Fashion wants to collaborate with you!',
    false
),
(
    '22222222-2222-2222-2222-222222222222',
    'achievement',
    'Streak milestone! 🔥',
    'You''ve maintained a 3-day posting streak!',
    true
),
(
    '33333333-3333-3333-3333-333333333333',
    'sale',
    'Template sold! 💰',
    'Your "Workout Carousel Templates" was just purchased!',
    false
);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Seed data inserted successfully!';
    RAISE NOTICE '📊 Test users created:';
    RAISE NOTICE '   - emma@socialdesk.com (Pro plan)';
    RAISE NOTICE '   - alex@socialdesk.com (Free plan)';
    RAISE NOTICE '   - sarah@socialdesk.com (Business plan)';
    RAISE NOTICE '   - brand@example.com (Brand account)';
    RAISE NOTICE '🔑 Password for all test users: password123';
END $$;
