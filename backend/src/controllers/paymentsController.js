const { query } = require('../db');

async function createCheckout(request, reply) {
  // TODO: Implement Stripe checkout session
  return reply.code(501).send({
    message: 'Stripe checkout not yet implemented',
    note: 'Requires Stripe SDK integration',
  });
}

async function webhook(request, reply) {
  // TODO: Implement Stripe webhook handling
  request.log.info('Stripe webhook received');
  return { received: true };
}

async function transactions(request, reply) {
  const userId = request.currentUser.id;
  const { limit = 20, offset = 0 } = request.query;

  try {
    const result = await query(
      `SELECT id, transaction_type, amount_cents, currency, status, description, created_at
       FROM transactions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return { transactions: result.rows, total: result.rows.length };
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Fetch Failed',
      message: 'Failed to fetch transactions',
    });
  }
}

module.exports = {
  createCheckout,
  webhook,
  transactions,
};
