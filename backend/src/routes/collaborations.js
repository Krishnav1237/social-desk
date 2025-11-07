/**
 * Collaborations routes
 */

const collaborationsController = require('../controllers/collaborationsController');

async function collaborationsRoutes(fastify, options) {
  // Get collaboration suggestions
  fastify.get(
    '/suggest',
    {
      onRequest: [fastify.authenticate, fastify.loadUser],
      schema: {
        description: 'Get brand collaboration suggestions',
        tags: ['collaborations'],
        security: [{ Bearer: [] }],
      },
    },
    collaborationsController.suggest
  );

  // List user collaborations
  fastify.get(
    '/',
    {
      onRequest: [fastify.authenticate, fastify.loadUser],
      schema: {
        description: 'List user collaborations',
        tags: ['collaborations'],
        security: [{ Bearer: [] }],
      },
    },
    collaborationsController.list
  );

  // Update collaboration status
  fastify.patch(
    '/:id',
    {
      onRequest: [fastify.authenticate, fastify.loadUser],
      schema: {
        description: 'Update collaboration status',
        tags: ['collaborations'],
        security: [{ Bearer: [] }],
      },
    },
    collaborationsController.update
  );
}

module.exports = collaborationsRoutes;
