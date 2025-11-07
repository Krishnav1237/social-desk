/**
 * AI routes
 */

const aiController = require('../controllers/aiController');

async function aiRoutes(fastify, options) {
  // Generate viral hooks
  fastify.post(
    '/hooks',
    {
      onRequest: [fastify.authenticate, fastify.loadUser],
      schema: {
        description: 'Generate viral hooks',
        tags: ['ai'],
        security: [{ Bearer: [] }],
      },
    },
    aiController.generateHooks
  );

  // Generate viral score
  fastify.post(
    '/viral-score',
    {
      onRequest: [fastify.authenticate, fastify.loadUser],
      schema: {
        description: 'Calculate viral score prediction',
        tags: ['ai'],
        security: [{ Bearer: [] }],
      },
    },
    aiController.viralScore
  );

  // Repurpose content
  fastify.post(
    '/repurpose',
    {
      onRequest: [fastify.authenticate, fastify.loadUser],
      schema: {
        description: 'Repurpose content across platforms',
        tags: ['ai'],
        security: [{ Bearer: [] }],
      },
    },
    aiController.repurpose
  );
}

module.exports = aiRoutes;
