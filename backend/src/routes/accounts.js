/**
 * Social accounts routes
 */

const accountsController = require('../controllers/accountsController');

async function accountsRoutes(fastify, options) {
  // Connect social account
  fastify.post(
    '/connect',
    {
      onRequest: [fastify.authenticate, fastify.loadUser],
      schema: {
        description: 'Initiate social account connection',
        tags: ['accounts'],
        security: [{ Bearer: [] }],
      },
    },
    accountsController.connect
  );

  // OAuth callback
  fastify.get('/callback', accountsController.callback);

  // List connected accounts
  fastify.get(
    '/',
    {
      onRequest: [fastify.authenticate, fastify.loadUser],
      schema: {
        description: 'List connected accounts',
        tags: ['accounts'],
        security: [{ Bearer: [] }],
      },
    },
    accountsController.list
  );

  // Disconnect account
  fastify.delete(
    '/:id',
    {
      onRequest: [fastify.authenticate, fastify.loadUser],
      schema: {
        description: 'Disconnect social account',
        tags: ['accounts'],
        security: [{ Bearer: [] }],
      },
    },
    accountsController.disconnect
  );
}

module.exports = accountsRoutes;
