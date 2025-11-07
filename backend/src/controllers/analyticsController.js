const { query } = require('../db');

async function getPostAnalytics(request, reply) {
  const { id } = request.params;
  const userId = request.currentUser.id;

  try {
    const result = await query(
      'SELECT analytics, viral_score FROM posts WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return reply.code(404).send({
        error: 'Not Found',
        message: 'Post not found',
      });
    }

    return {
      post_id: id,
      analytics: result.rows[0].analytics || {},
      viral_score: result.rows[0].viral_score || 0,
    };
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Fetch Failed',
      message: 'Failed to fetch analytics',
    });
  }
}

async function getDashboard(request, reply) {
  const userId = request.currentUser.id;

  try {
    const stats = await query(
      `SELECT
        COUNT(*) FILTER (WHERE status = 'published') as published_posts,
        COUNT(*) FILTER (WHERE status = 'scheduled') as scheduled_posts,
        AVG(viral_score) FILTER (WHERE viral_score > 0) as avg_viral_score,
        SUM((analytics->>'likes')::int) FILTER (WHERE analytics->>'likes' IS NOT NULL) as total_likes,
        SUM((analytics->>'comments')::int) FILTER (WHERE analytics->>'comments' IS NOT NULL) as total_comments
      FROM posts
      WHERE user_id = $1 AND created_at > NOW() - INTERVAL '30 days'`,
      [userId]
    );

    return {
      period: '30_days',
      stats: stats.rows[0],
    };
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Fetch Failed',
      message: 'Failed to fetch dashboard analytics',
    });
  }
}

async function sync(request, reply) {
  // TODO: Implement analytics sync from platforms
  return reply.code(501).send({
    message: 'Analytics sync not yet implemented',
    note: 'Requires social platform API integration',
  });
}

module.exports = {
  getPostAnalytics,
  getDashboard,
  sync,
};
