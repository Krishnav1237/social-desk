const { query } = require('../db');

async function list(request, reply) {
  const { category, limit = 20, offset = 0 } = request.query;

  try {
    let queryText = 'SELECT * FROM templates WHERE is_published = true';
    const params = [];
    let paramIndex = 1;

    if (category) {
      queryText += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    queryText += ` ORDER BY rating DESC, download_count DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    return { templates: result.rows, total: result.rows.length };
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Fetch Failed',
      message: 'Failed to fetch templates',
    });
  }
}

async function getById(request, reply) {
  const { id } = request.params;

  try {
    const result = await query('SELECT * FROM templates WHERE id = $1 AND is_published = true', [
      id,
    ]);

    if (result.rows.length === 0) {
      return reply.code(404).send({
        error: 'Not Found',
        message: 'Template not found',
      });
    }

    return result.rows[0];
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Fetch Failed',
      message: 'Failed to fetch template',
    });
  }
}

async function purchase(request, reply) {
  // TODO: Implement Stripe checkout
  return reply.code(501).send({
    message: 'Template purchase not yet implemented',
    note: 'Requires Stripe integration',
  });
}

async function create(request, reply) {
  const { title, description, category, templateType, content, priceCents } = request.body;
  const userId = request.currentUser.id;

  try {
    const result = await query(
      `INSERT INTO templates (creator_id, title, description, category, template_type, content, price_cents)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        userId,
        title,
        description,
        category,
        templateType,
        JSON.stringify(content),
        priceCents || 0,
      ]
    );

    return result.rows[0];
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Creation Failed',
      message: 'Failed to create template',
    });
  }
}

module.exports = {
  list,
  getById,
  purchase,
  create,
};
