const { query } = require('../db');
const llm = require('../services/llmService');

/**
 * Generate AI captions/hooks
 */
async function generate(request, reply) {
  const { mediaUrl, tone, goal, postType } = request.body;
  const userId = request.currentUser.id;

  try {
    // Check user credits
    if (request.currentUser.credits < 1) {
      return reply.code(402).send({
        error: 'Insufficient Credits',
        message: 'You need at least 1 credit to generate content',
      });
    }

    // Generate content using LLM
    const result = await llm.generateCaption({
      userId,
      mediaUrl,
      tone: tone || 'casual',
      goal: goal || 'engagement',
      postType: postType || 'image',
    });

    // Deduct credits
    await query('UPDATE users SET credits = credits - 1 WHERE id = $1', [userId]);

    // Log generation
    await query(
      `INSERT INTO ai_generations (user_id, generation_type, input_data, output_data, model_used, cost_credits)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        userId,
        'caption',
        JSON.stringify({ mediaUrl, tone, goal, postType }),
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
      message: error.message || 'Failed to generate content',
    });
  }
}

/**
 * Schedule a post
 */
async function schedule(request, reply) {
  const { accountId, content, scheduledAt, postType } = request.body;
  const userId = request.currentUser.id;

  try {
    // Verify account belongs to user
    const accountCheck = await query(
      'SELECT id FROM accounts WHERE id = $1 AND user_id = $2',
      [accountId, userId]
    );

    if (accountCheck.rows.length === 0) {
      return reply.code(404).send({
        error: 'Account Not Found',
        message: 'Social account not found or does not belong to you',
      });
    }

    // Create post
    const result = await query(
      `INSERT INTO posts (user_id, account_id, content, post_type, status, scheduled_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, accountId, JSON.stringify(content), postType || 'image', 'scheduled', scheduledAt]
    );

    // TODO: Add to job queue for publishing

    return result.rows[0];
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Scheduling Failed',
      message: 'Failed to schedule post',
    });
  }
}

/**
 * List user posts
 */
async function list(request, reply) {
  const userId = request.currentUser.id;
  const { status, limit = 20, offset = 0 } = request.query;

  try {
    let queryText = `
      SELECT p.*, a.provider, a.provider_username
      FROM posts p
      LEFT JOIN accounts a ON p.account_id = a.id
      WHERE p.user_id = $1
    `;

    const params = [userId];
    let paramIndex = 2;

    if (status) {
      queryText += ` AND p.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    queryText += ` ORDER BY p.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    return { posts: result.rows, total: result.rows.length };
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Fetch Failed',
      message: 'Failed to fetch posts',
    });
  }
}

/**
 * Get post by ID
 */
async function getById(request, reply) {
  const { id } = request.params;
  const userId = request.currentUser.id;

  try {
    const result = await query(
      `SELECT p.*, a.provider, a.provider_username
       FROM posts p
       LEFT JOIN accounts a ON p.account_id = a.id
       WHERE p.id = $1 AND p.user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return reply.code(404).send({
        error: 'Not Found',
        message: 'Post not found',
      });
    }

    return result.rows[0];
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Fetch Failed',
      message: 'Failed to fetch post',
    });
  }
}

/**
 * Update post
 */
async function update(request, reply) {
  const { id } = request.params;
  const userId = request.currentUser.id;
  const { content, scheduledAt, status } = request.body;

  try {
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (content) {
      updates.push(`content = $${paramIndex}`);
      params.push(JSON.stringify(content));
      paramIndex++;
    }

    if (scheduledAt) {
      updates.push(`scheduled_at = $${paramIndex}`);
      params.push(scheduledAt);
      paramIndex++;
    }

    if (status) {
      updates.push(`status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    if (updates.length === 0) {
      return reply.code(400).send({
        error: 'Bad Request',
        message: 'No updates provided',
      });
    }

    params.push(id, userId);

    const result = await query(
      `UPDATE posts
       SET ${updates.join(', ')}, updated_at = NOW()
       WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
       RETURNING *`,
      params
    );

    if (result.rows.length === 0) {
      return reply.code(404).send({
        error: 'Not Found',
        message: 'Post not found',
      });
    }

    return result.rows[0];
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Update Failed',
      message: 'Failed to update post',
    });
  }
}

/**
 * Delete post
 */
async function deletePost(request, reply) {
  const { id } = request.params;
  const userId = request.currentUser.id;

  try {
    const result = await query('DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING id', [
      id,
      userId,
    ]);

    if (result.rows.length === 0) {
      return reply.code(404).send({
        error: 'Not Found',
        message: 'Post not found',
      });
    }

    return { message: 'Post deleted successfully' };
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Delete Failed',
      message: 'Failed to delete post',
    });
  }
}

module.exports = {
  generate,
  schedule,
  list,
  getById,
  update,
  delete: deletePost,
};
