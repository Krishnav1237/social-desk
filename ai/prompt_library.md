# SocialDesk AI Prompt Library

This document contains all prompt templates used by SocialDesk's AI generation features. Each prompt is optimized for specific content types and platforms.

## Table of Contents

1. [Hook Generators](#hook-generators)
2. [Caption Templates](#caption-templates)
3. [Carousel Outlines](#carousel-outlines)
4. [Video Scripts](#video-scripts)
5. [Repurpose Pipelines](#repurpose-pipelines)
6. [Brand Pitch Templates](#brand-pitch-templates)
7. [Viral Score Evaluation](#viral-score-evaluation)
8. [Hashtag Generation](#hashtag-generation)

---

## Hook Generators

### 1. General Viral Hook Generator

```
You are a viral content strategist. Generate {count} attention-grabbing hooks for {platform}.

Topic: {topic}
Audience: {target_audience}
Goal: Stop the scroll and drive engagement

Requirements:
- Maximum 10-12 words per hook
- Start with a pattern interrupt
- Create curiosity gap
- Use power words
- Platform-optimized for {platform}

Return JSON:
{
  "hooks": ["hook1", "hook2", ...]
}
```

### 2. Educational Hook Generator

```
Generate {count} educational hooks that promise value.

Topic: {topic}
Format: {format} (tutorial/list/tip/guide)

Hook patterns to use:
- "How to {achieve_result} in {timeframe}"
- "The {number} {topic} mistakes you're making"
- "{Number} {topic} secrets that changed my {outcome}"
- "Stop {wrong_way}. Do this instead:"

Return the hooks as a JSON array.
```

### 3. Story-Based Hook Generator

```
Create {count} story-driven hooks that build intrigue.

Topic: {topic}
Story angle: {angle}

Use these formats:
- "I {action} and this happened..."
- "The moment I realized {insight}"
- "Nobody tells you about {hidden_truth}"
- "Here's what they don't show you..."

Make them personal and relatable.
```

### 4. Controversial Hook Generator

```
Generate {count} slightly controversial hooks (respectful, not offensive).

Topic: {topic}

Patterns:
- "Unpopular opinion: {statement}"
- "Hot take: {provocative_claim}"
- "Everyone's doing {topic} wrong. Here's why:"
- "The {industry} doesn't want you to know this..."

Balance controversy with value.
```

### 5. Question-Based Hook Generator

```
Create {count} question hooks that spark engagement.

Topic: {topic}

Question types:
- Yes/No questions that divide opinion
- "What if" scenarios
- "Would you rather" choices
- Rhetorical questions with surprising answers

Make viewers want to answer in comments.
```

---

## Caption Templates

### 6. Lifestyle Caption Generator

```
Generate {count} lifestyle captions for {post_type}.

Tone: {tone} (casual/aspirational/relatable)
Length: {length} characters
Emoji usage: {emoji_level}

Structure each caption with:
1. Hook/opening line
2. Personal story or value prop (2-3 sentences)
3. Engagement question or CTA
4. Relevant hashtags (3-5)

Return as JSON array with fields: text, hook, cta, hashtags
```

### 7. Educational Caption Generator

```
Create {count} educational captions that teach {topic}.

Format:
- Start with the problem/question
- Provide 3-5 actionable tips
- End with a save/share CTA

Tone: Helpful expert, not preachy
Include: Step-by-step breakdown
Hashtags: Educational + niche tags
```

### 8. Behind-the-Scenes Caption

```
Write {count} BTS captions showing {process}.

Make it:
- Authentic and vulnerable
- Show the journey, not just results
- Include a lesson learned
- End with community-building question

Target: Build trust and relatability
```

### 9. Product/Review Caption

```
Generate {count} product feature captions for {product}.

Include:
- Personal experience angle
- 3 key benefits/features
- Who it's perfect for
- Honest assessment (pros/cons if relevant)
- Clear CTA (link in bio, swipe up, etc.)

Avoid: Overly salesy language
Tone: Friend recommendation
```

### 10. Motivational Caption

```
Create {count} motivational captions on {theme}.

Structure:
- Powerful opening statement
- Short personal anecdote or universal truth
- Actionable encouragement
- Inspiring CTA

Tone: Uplifting without toxic positivity
Length: 100-150 characters
Emojis: Strategic, not excessive
```

---

## Carousel Outlines

### 11. Listicle Carousel (5-10 Slides)

```
Create a {slide_count}-slide carousel outline on "{topic}".

Slide 1 (Cover):
- Eye-catching title
- Subheading with benefit
- Strong visual suggestion

Slides 2-{slide_count-1}:
- One tip/item per slide
- Short headline (5-7 words)
- 2-3 bullet points max
- Visual element suggestion

Final Slide:
- Recap/CTA
- Follow for more
- Engagement prompt

Return as JSON with slide number, title, content, visual_note
```

### 12. Tutorial Carousel

```
Design a step-by-step tutorial carousel for "{process}".

Number of steps: {step_count}

Slide 1: Problem/Before state
Slide 2: What you'll learn
Slides 3-N: Each step with:
  - Clear instruction
  - Pro tip
  - Common mistake to avoid
Final Slide: Result/After state + CTA

Format for easy saving and referencing.
```

### 13. Myth-Busting Carousel

```
Create a myth-busting carousel: "{topic} Myths Debunked"

Structure:
Slide 1: "X Myths About {topic}"
Slides 2-N:
  - MYTH: [common misconception]
  - TRUTH: [correct information]
  - WHY IT MATTERS: [impact]
Final Slide: Key takeaway + follow CTA

Use contrasting colors for myth vs truth.
```

### 14. Before/After Carousel

```
Outline a transformation carousel showing {transformation}.

Slides:
1. The Starting Point (problem)
2-3. What Changed (2-3 key changes)
4-N. The Process (specific actions)
Final: The Result + Next Steps

Include: Timeline, key metrics, lessons learned
Make it: Inspirational but realistic
```

### 15. Resource Compilation Carousel

```
Create a "{number} Best {resources} for {audience}" carousel.

Each resource slide:
- Resource name/title
- What it does (1 sentence)
- Why it's great (2 bullets)
- Who it's for
- Link/access info

Final slide: Bonus tip + save this post CTA
```

---

## Video Scripts

### 16. Short-Form Video Script (15-30s)

```
Write a {duration}-second video script for {platform} about "{topic}".

Structure:
[0-3s] HOOK: Attention grab
[3-10s] PROMISE: What they'll learn
[10-25s] CONTENT: Main points (2-3 max)
[25-30s] CTA: Follow, like, save

Visual cues: [Show/Point/Text on screen]
Audio: On-screen text vs voiceover notes
Pacing: Fast, punchy, scroll-stopping
```

### 17. Tutorial Video Script (60-90s)

```
Create a tutorial video script for "{how_to}".

Intro (5s): Problem + quick solution preview
Step 1 (15-20s): [First step with demo]
Step 2 (15-20s): [Second step with demo]
Step 3 (15-20s): [Third step with demo]
Results (10s): Before/after
Outro (5-10s): CTA + follow

Include: B-roll suggestions, text overlays, transitions
```

### 18. Story-Time Video Script

```
Script a story-time video: "{story_topic}"

Act 1 - Setup (10-15s):
- Hook with the outcome/punchline tease
- Set the scene

Act 2 - Conflict (30-40s):
- The situation/challenge
- Build tension/interest
- Relatable moment

Act 3 - Resolution (15-20s):
- What happened
- Lesson learned
- Broader application

Make it: Personal, authentic, with a point
```

### 19. Product Demo Script

```
Write a product demo script for {product}.

Hook (3s): The problem it solves
Intro (5s): Quick product intro
Feature 1 (15s): Show + explain
Feature 2 (15s): Show + explain
Feature 3 (15s): Show + explain
Results (7s): Benefits recap
CTA (5s): Where to get it

Style: Authentic review, not ad
Show: Real usage, honest reactions
```

### 20. Day-in-the-Life Script

```
Script a "Day in the Life of {role}" video.

Morning (20s): Wake up routine + mindset
Midday (30s): Key work/activities
Highlights (20s): Interesting moments/behind scenes
Evening (15s): Wind down
Reflection (10s): Lessons/thoughts
CTA (5s): Follow for more

Include: Time stamps, activity transitions, personality moments
```

---

## Repurpose Pipelines

### 21. Long-Form → Short-Form Pipeline

```
Repurpose this long-form content into short-form formats:

Original: {long_form_content}

Create:
1. Instagram Reel script (30s)
   - Hook + 3 key points + CTA

2. TikTok video (15s)
   - Fast-paced version with text overlays

3. Twitter thread (5-7 tweets)
   - Each tweet: One key insight

4. Instagram Story series (3-5 slides)
   - Swipe-through format

Maintain: Core message
Adapt: Format-specific best practices
```

### 22. Blog Post → Social Content

```
Transform this blog post into social content:

Blog: {blog_content}
Target: {platforms}

Generate:
1. LinkedIn post (professional angle)
2. Instagram carousel (visual breakdown)
3. Twitter thread (key takeaways)
4. Pinterest pin description
5. Facebook post (community angle)

Each should: Stand alone, drive to full post
```

### 23. Video → Multi-Platform

```
Repurpose this video content:

Video topic: {topic}
Duration: {duration}
Key points: {points}

Create:
1. YouTube Short (60s vertical)
2. Instagram Reel (30s)
3. TikTok (15s trending audio version)
4. LinkedIn (professional context)
5. Twitter (key quote + teaser)

Include: Captions for each, hashtags, CTAs
```

### 24. Podcast → Content Suite

```
From this podcast episode, create:

Episode: {episode_topic}
Duration: {duration}
Guest: {guest}
Key insights: {insights}

Generate:
1. Audiogram quote clips (3x 15-30s)
2. Quote graphics (5x Instagram posts)
3. Twitter thread (episode highlights)
4. LinkedIn article (professional insights)
5. Blog post outline
6. Email newsletter section

Focus: Most shareable, valuable moments
```

### 25. One Core Idea → 10 Pieces

```
Take this core idea and create 10 content pieces:

Core Idea: {idea}

Generate:
1. Instagram post caption
2. Instagram carousel (5 slides)
3. Instagram Reel script
4. TikTok script
5. Twitter thread
6. LinkedIn post
7. YouTube Short outline
8. Pinterest pin description
9. Facebook post
10. Newsletter snippet

Same idea, 10 formats, platform-optimized
```

---

## Brand Pitch Templates

### 26. Cold Brand Outreach

```
Write a brand collaboration pitch for:

Creator: {creator_name}
Niche: {niche}
Stats: {followers}, {engagement_rate}
Brand: {brand_name}

Email structure:
Subject: {Personalized hook}
Intro: Why you love their brand (specific)
Value Prop: What you offer (data-backed)
Collaboration Ideas: 2-3 specific concepts
Social Proof: Past collaborations/results
CTA: Calendar link or next steps

Tone: Professional but personality-filled
Length: 150-200 words
```

### 27. Media Kit Summary

```
Create a media kit summary for {creator_name}:

Include:
- One-line bio
- Niche/expertise
- Audience demographics
- Key stats (followers, engagement, reach)
- Content pillars
- Past brand collaborations
- Rate card overview
- Contact info

Format: Scannable, professional, visual
Goal: Make brands want to work with you
```

### 28. Collaboration Proposal

```
Draft a detailed collaboration proposal:

Brand: {brand}
Campaign: {campaign_type}

Proposal sections:
1. Campaign Overview
2. Deliverables (specific content pieces)
3. Timeline
4. Unique Angle (your creative approach)
5. Expected Results (reach, engagement, conversions)
6. Investment (pricing)
7. Add-ons/options

Make it: Professional, detailed, results-focused
```

### 29. Value Proposition Statement

```
Craft a value proposition for creator-brand partnerships:

Creator: {name}
Niche: {niche}
Unique angle: {what_makes_you_different}

Create:
- Elevator pitch (30 seconds)
- Extended pitch (2 minutes)
- Written bio (100 words)
- One-liner for emails

Focus: ROI for brands, authentic audience connection
```

### 30. Case Study Template

```
Write a case study for:

Brand: {brand}
Campaign: {campaign}
Results: {metrics}

Structure:
1. The Challenge: Brand's goal
2. The Solution: Your approach
3. The Execution: What you created
4. The Results: Metrics + screenshots
5. The Testimonial: Brand quote
6. Call to Action: Work with me

Use: Specific numbers, visual proof
```

---

## Viral Score Evaluation

### 31. Content Viral Potential Scorer

```
Analyze this content and predict viral score (0-100):

Content: {content}
Platform: {platform}
Current stats: {current_metrics}

Evaluate:
1. Hook strength (0-20 points)
2. Content quality (0-20 points)
3. Timing/relevance (0-15 points)
4. Engagement drivers (0-15 points)
5. Shareability (0-15 points)
6. Platform optimization (0-15 points)

Return JSON:
{
  "viral_score": 0-100,
  "breakdown": {category: score},
  "strengths": [],
  "improvements": [],
  "prediction": "low/medium/high viral potential"
}
```

### 32. Hook Effectiveness Analyzer

```
Rate this hook's effectiveness:

Hook: "{hook}"
Platform: {platform}
Target: {audience}

Scoring criteria:
- Pattern interrupt (0-10)
- Curiosity gap (0-10)
- Clarity (0-10)
- Emotional trigger (0-10)
- Length optimization (0-10)

Total: /50

Provide:
- Score with breakdown
- What works well
- Suggested improvements
- Alternative versions (3)
```

### 33. Engagement Prediction Model

```
Predict engagement for this post:

Content: {content}
Account stats: {followers}, {avg_engagement}
Post type: {type}
Timing: {time}
Hashtags: {hashtags}

Estimate:
- Expected likes: {range}
- Expected comments: {range}
- Expected shares: {range}
- Expected saves: {range}
- Viral probability: {percentage}

Based on: Historical data + content analysis
```

---

## Hashtag Generation

### 34. Smart Hashtag Generator

```
Generate optimal hashtags for:

Content: {content_description}
Platform: {platform}
Niche: {niche}
Goal: {reach/engagement/conversion}

Create 3 tiers:
1. Niche hashtags (100K-500K posts) - 5 tags
2. Growing hashtags (10K-100K posts) - 10 tags
3. Branded/specific (under 10K) - 5 tags

Return:
- 20 total hashtags
- Mix strategy explanation
- Tags to avoid (oversaturated)
```

### 35. Trending Hashtag Finder

```
Find trending hashtags for {niche} on {platform}:

Requirements:
- Currently trending (last 7 days)
- Relevant to {topic}
- Not overly saturated
- Suitable for {content_type}

Return:
- 10 trending tags with trend score
- Why each is trending
- How to use it effectively
```

---

## Advanced Prompts

### 36. Competitor Content Analyzer

```
Analyze competitor's top-performing content:

Competitor: {handle}
Platform: {platform}
Sample posts: {post_data}

Identify:
- Common themes in top posts
- Content formats that work
- Engagement patterns
- Hook styles
- Caption structures
- Hashtag strategies

Generate: Insights for differentiation
```

### 37. Content Calendar Ideas

```
Generate 30 content ideas for {niche}:

Theme: {monthly_theme}
Mix required:
- Educational (40%)
- Entertaining (30%)
- Promotional (20%)
- Community/engagement (10%)

For each idea provide:
- Content type (reel/carousel/post)
- Hook/title
- Key points
- Best posting day

Ensure: Variety, consistency, brand alignment
```

### 38. A/B Testing Variants

```
Create A/B testing variants for:

Original: {original_content}

Generate 3 variants testing:
Variant A: Different hook style
Variant B: Different caption structure
Variant C: Different CTA approach

For each:
- Full content
- What's being tested
- Success metrics to track
- Hypothesis
```

### 39. Audience Avatar Content

```
Create content specifically for:

Avatar: {audience_avatar}
Pain points: {pain_points}
Goals: {goals}
Platform behavior: {behavior}

Generate:
- 5 content ideas that resonate
- Specific language/phrases to use
- Topics they care about
- CTAs that convert this avatar

Make it: Hyper-targeted, speaks their language
```

### 40. Crisis/Trend Response

```
Quick-response content for:

Trending topic: {trend}
Your angle: {angle}
Time sensitivity: {urgent/timely}

Create:
- Immediate response post (fast, relevant)
- Hook tying to trend
- Your unique take
- How it relates to your niche
- CTAs

Goal: Ride the wave while staying authentic
```

---

## Usage Guidelines

### How to Use These Prompts

1. **Personalization**: Replace {variables} with your specific details
2. **Iteration**: Run prompts multiple times for variety
3. **Combination**: Mix and match for unique approaches
4. **A/B Testing**: Generate multiple versions and test
5. **Brand Voice**: Add your brand voice guidelines to any prompt

### Best Practices

- Always provide context (niche, audience, goal)
- Be specific with desired output format
- Include constraints (length, tone, style)
- Request JSON for structured data
- Iterate and refine based on results

### Customization Tips

- Add your brand's tone guidelines to system prompts
- Include successful past examples for pattern matching
- Specify platform requirements explicitly
- Request multiple variants for testing
- Combine prompts for complex workflows

---

## Prompt Engineering Tips

1. **Be Specific**: More context = better output
2. **Use Examples**: Show the style you want
3. **Set Constraints**: Length, tone, format
4. **Request Formats**: JSON, markdown, bullet points
5. **Iterate**: Refine prompts based on results
6. **Test Variations**: Same prompt, different temperatures
7. **Combine Prompts**: Chain for complex tasks

---

*Last Updated: 2024*
*Version: 1.0*
*SocialDesk AI Team*
