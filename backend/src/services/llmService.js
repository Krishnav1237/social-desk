const OpenAI = require('openai');
const { query } = require('../db');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const LLM_MODEL = process.env.LLM_MODEL || 'gpt-4-turbo-preview';
const LLM_TEMPERATURE = parseFloat(process.env.LLM_TEMPERATURE) || 0.7;
const LLM_MAX_TOKENS = parseInt(process.env.LLM_MAX_TOKENS) || 2000;

/**
 * Get user's persona/style for personalization
 */
async function getUserPersona(userId) {
  try {
    const result = await query(
      `SELECT tone, sample_posts, hashtag_preferences, emoji_usage, avg_caption_length
       FROM persona_profiles
       WHERE user_id = $1 AND is_default = true
       LIMIT 1`,
      [userId]
    );

    if (result.rows.length > 0) {
      return result.rows[0];
    }

    return {
      tone: 'casual',
      sample_posts: [],
      hashtag_preferences: [],
      emoji_usage: 'moderate',
      avg_caption_length: 150,
    };
  } catch (error) {
    console.error('Error fetching user persona:', error);
    return null;
  }
}

/**
 * Generate caption with AI
 */
async function generateCaption({ userId, mediaUrl, tone, goal, postType }) {
  try {
    const persona = await getUserPersona(userId);

    const systemPrompt = `You are an expert social media content creator specializing in ${postType || 'Instagram'} posts. Generate engaging captions that drive ${goal || 'engagement'}.`;

    const userPrompt = `Generate 5 caption variations for a ${postType || 'image'} post.

Tone: ${tone || persona?.tone || 'casual'}
Goal: ${goal || 'engagement'}
${persona ? `User's typical style: ${persona.tone} with ${persona.emoji_usage} emoji usage` : ''}
${mediaUrl ? `Media: ${mediaUrl}` : ''}

For each caption variation:
1. Include an attention-grabbing hook (first line)
2. Keep it ${persona?.avg_caption_length || 150} characters or less
3. Add relevant hashtags (3-5)
4. Include a call-to-action
5. Match the specified tone

Return as JSON with this structure:
{
  "captions": [
    {
      "text": "caption text here",
      "hook": "attention-grabbing first line",
      "hashtags": ["tag1", "tag2", "tag3"],
      "cta": "call to action"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: LLM_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: LLM_TEMPERATURE,
      max_tokens: LLM_MAX_TOKENS,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0].message.content);

    return {
      captions: result.captions || [],
      tokens_used: completion.usage.total_tokens,
      model: LLM_MODEL,
    };
  } catch (error) {
    console.error('Error generating caption:', error);

    // Fallback to template-based captions
    return generateFallbackCaptions({ tone, goal });
  }
}

/**
 * Generate viral hooks
 */
async function generateHooks({ topic, platform, count = 5 }) {
  try {
    const systemPrompt = `You are a viral content strategist for ${platform || 'social media'}. Generate attention-grabbing hooks that stop the scroll.`;

    const userPrompt = `Generate ${count} viral hooks for a post about: ${topic}

Each hook should be:
- Maximum 10-12 words
- Start with a pattern interrupt (question, controversial statement, or intriguing claim)
- Optimized for ${platform || 'Instagram/TikTok'}
- Make the viewer want to keep watching/reading

Return as JSON:
{
  "hooks": [
    "hook text 1",
    "hook text 2",
    ...
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: LLM_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.9, // Higher temperature for creativity
      max_tokens: 500,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0].message.content);

    return {
      hooks: result.hooks || [],
      tokens_used: completion.usage.total_tokens,
    };
  } catch (error) {
    console.error('Error generating hooks:', error);

    // Fallback hooks
    return {
      hooks: [
        `The truth about ${topic} that nobody talks about`,
        `Here's why ${topic} is about to change everything`,
        `I tried ${topic} for 30 days and here's what happened`,
        `Stop doing ${topic} wrong (do this instead)`,
        `The ${topic} secret that went viral`,
      ],
    };
  }
}

/**
 * Calculate viral score prediction
 */
async function getViralScore(postFeatures) {
  try {
    const { caption, hasHook, mediaType, hashtags, postingTime, engagement_history } =
      postFeatures;

    const systemPrompt = `You are a social media analytics expert. Predict the viral potential of posts based on features.`;

    const userPrompt = `Analyze this post and predict its viral score (0-100):

Caption: "${caption || 'No caption'}"
Has Hook: ${hasHook ? 'Yes' : 'No'}
Media Type: ${mediaType || 'image'}
Hashtags: ${hashtags?.length || 0}
Posting Time: ${postingTime || 'optimal'}
Past Avg Engagement: ${engagement_history?.avg_likes || 0} likes, ${engagement_history?.avg_comments || 0} comments

Consider:
- Caption quality and hook strength
- Media type performance
- Hashtag relevance
- Timing optimization
- Historical performance

Return as JSON:
{
  "viral_score": 0-100,
  "confidence": "high/medium/low",
  "factors": {
    "caption_quality": 0-10,
    "hook_strength": 0-10,
    "hashtag_optimization": 0-10,
    "timing": 0-10,
    "media_type": 0-10
  },
  "suggestions": ["improvement 1", "improvement 2"]
}`;

    const completion = await openai.chat.completions.create({
      model: LLM_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3, // Lower temperature for consistency
      max_tokens: 800,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0].message.content);

    return result.viral_score || 50;
  } catch (error) {
    console.error('Error calculating viral score:', error);
    return 50; // Default score
  }
}

/**
 * Repurpose content for different platforms
 */
async function repurposeContent({ longText, targetPlatforms = ['twitter', 'instagram', 'tiktok'] }) {
  try {
    const systemPrompt = `You are a content repurposing expert. Transform long-form content into platform-specific formats.`;

    const userPrompt = `Repurpose this content for ${targetPlatforms.join(', ')}:

Original Content:
${longText}

For each platform, create:
- Twitter: Thread (280 chars per tweet)
- Instagram: Carousel post (5 slides, each with short copy)
- TikTok: Video script (30-60 seconds)

Return as JSON:
{
  "twitter": {
    "thread": ["tweet 1", "tweet 2", ...]
  },
  "instagram": {
    "slides": [
      {"title": "Slide 1", "text": "content"},
      ...
    ],
    "caption": "Instagram caption"
  },
  "tiktok": {
    "script": "full script",
    "hook": "opening hook",
    "cta": "call to action"
  }
}`;

    const completion = await openai.chat.completions.create({
      model: LLM_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: LLM_TEMPERATURE,
      max_tokens: 3000,
      response_format: { type: 'json_object' },
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('Error repurposing content:', error);
    throw new Error('Failed to repurpose content');
  }
}

/**
 * Fallback caption generator (template-based)
 */
function generateFallbackCaptions({ tone, goal }) {
  const templates = {
    casual: [
      { text: 'Just vibing ✨ What are you up to today?', hook: 'Just vibing ✨', hashtags: ['mood', 'vibes', 'lifestyle'], cta: 'What are you up to today?' },
      { text: 'This moment 📸 Double tap if you relate!', hook: 'This moment 📸', hashtags: ['relatable', 'mood', 'real'], cta: 'Double tap if you relate!' },
    ],
    professional: [
      { text: 'Sharing insights from today\'s work. What\'s your take?', hook: 'Sharing insights', hashtags: ['business', 'growth', 'professional'], cta: 'What\'s your take?' },
      { text: 'Key learnings from this experience. Save for later!', hook: 'Key learnings', hashtags: ['learning', 'growth', 'tips'], cta: 'Save for later!' },
    ],
  };

  const selectedTemplates = templates[tone] || templates.casual;

  return {
    captions: selectedTemplates,
    tokens_used: 0,
    model: 'fallback',
    note: 'Using template-based generation due to LLM unavailability',
  };
}

module.exports = {
  generateCaption,
  generateHooks,
  getViralScore,
  repurposeContent,
};
