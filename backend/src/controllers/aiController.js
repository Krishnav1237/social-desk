const llm = require('../services/llmService');
const { query } = require('../db');

async function generateHooks(request, reply) {
  const { topic, platform, count = 5 } = request.body;
  const userId = request.currentUser.id;

  try {
    // Check credits
    if (request.currentUser.credits < 1) {
      return reply.code(402).send({
        error: 'Insufficient Credits',
        message: 'You need at least 1 credit to generate hooks',
      });
    }

    const result = await llm.generateHooks({ topic, platform, count });

    // Deduct credits
    await query('UPDATE users SET credits = credits - 1 WHERE id = $1', [userId]);

    // Log generation
    await query(
      `INSERT INTO ai_generations (user_id, generation_type, input_data, output_data, model_used, cost_credits)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        userId,
        'hook',
        JSON.stringify({ topic, platform, count }),
        JSON.stringify(result),
        process.env.LLM_MODEL || 'gpt-4-turbo',
        1,
      ]
    );

    return result;
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Generation Failed',
      message: error.message || 'Failed to generate hooks',
    });
  }
}

async function viralScore(request, reply) {
  const { postFeatures } = request.body;

  try {
    const score = await llm.getViralScore(postFeatures);
    return { viral_score: score };
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Scoring Failed',
      message: 'Failed to calculate viral score',
    });
  }
}

async function repurpose(request, reply) {
  const { longText, targetPlatforms } = request.body;
  const userId = request.currentUser.id;

  try {
    if (request.currentUser.credits < 2) {
      return reply.code(402).send({
        error: 'Insufficient Credits',
        message: 'You need at least 2 credits to repurpose content',
      });
    }

    const result = await llm.repurposeContent({ longText, targetPlatforms });

    // Deduct credits
    await query('UPDATE users SET credits = credits - 2 WHERE id = $1', [userId]);

    return result;
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Repurpose Failed',
      message: 'Failed to repurpose content',
    });
  }
}

module.exports = {
  generateHooks,
  viralScore,
  repurpose,
};
