const { query } = require('../db');

async function suggest(request, reply) {
  // TODO: Implement AI-powered brand collaboration suggestions
  return reply.code(501).send({
    message: 'Collaboration suggestions not yet implemented',
    note: 'Will use AI to match creators with relevant brands based on niche and performance',
  });
}

async function list(request, reply) {
  const userId = request.currentUser.id;
  const { status, limit = 20, offset = 0 } = request.query;

  try {
    let queryText = 'SELECT * FROM collaborations WHERE creator_id = $1';
    const params = [userId];
    let paramIndex = 2;

    if (status) {
      queryText += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    return { collaborations: result.rows, total: result.rows.length };
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Fetch Failed',
      message: 'Failed to fetch collaborations',
    });
  }
}

async function update(request, reply) {
  const { id } = request.params;
  const { status } = request.body;
  const userId = request.currentUser.id;

  try {
    const result = await query(
      `UPDATE collaborations
       SET status = $1, updated_at = NOW()
       WHERE id = $2 AND creator_id = $3
       RETURNING *`,
      [status, id, userId]
    );

    if (result.rows.length === 0) {
      return reply.code(404).send({
        error: 'Not Found',
        message: 'Collaboration not found',
      });
    }

    return result.rows[0];
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Update Failed',
      message: 'Failed to update collaboration',
    });
  }
}

module.exports = {
  suggest,
  list,
  update,
};
