const { query } = require('../db');

async function connect(request, reply) {
  const { provider } = request.body;

  // TODO: Implement OAuth flow
  return reply.code(501).send({
    message: 'OAuth flow not yet implemented',
    provider,
    instructions: 'Visit Instagram Developer Portal to set up OAuth',
  });
}

async function callback(request, reply) {
  // TODO: Handle OAuth callback
  return reply.code(501).send({
    message: 'OAuth callback not yet implemented',
  });
}

async function list(request, reply) {
  const userId = request.currentUser.id;

  try {
    const result = await query(
      `SELECT id, provider, provider_username, is_active, connected_at
       FROM accounts
       WHERE user_id = $1
       ORDER BY connected_at DESC`,
      [userId]
    );

    return { accounts: result.rows };
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Fetch Failed',
      message: 'Failed to fetch accounts',
    });
  }
}

async function disconnect(request, reply) {
  const { id } = request.params;
  const userId = request.currentUser.id;

  try {
    const result = await query(
      'UPDATE accounts SET is_active = false WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return reply.code(404).send({
        error: 'Not Found',
        message: 'Account not found',
      });
    }

    return { message: 'Account disconnected successfully' };
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Disconnect Failed',
      message: 'Failed to disconnect account',
    });
  }
}

module.exports = {
  connect,
  callback,
  list,
  disconnect,
};
