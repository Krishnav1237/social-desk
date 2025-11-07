/**
 * Analytics routes
 */

const analyticsController = require('../controllers/analyticsController');

async function analyticsRoutes(fastify, options) {
  // Get post analytics
  fastify.get(
    '/post/:id',
    {
      onRequest: [fastify.authenticate, fastify.loadUser],
      schema: {
        description: 'Get analytics for a specific post',
        tags: ['analytics'],
        security: [{ Bearer: [] }],
      },
    },
    analyticsController.getPostAnalytics
  );

  // Get dashboard analytics
  fastify.get(
    '/dashboard',
    {
      onRequest: [fastify.authenticate, fastify.loadUser],
      schema: {
        description: 'Get dashboard analytics overview',
        tags: ['analytics'],
        security: [{ Bearer: [] }],
      },
    },
    analyticsController.getDashboard
  );

  // Sync analytics from platforms
  fastify.post(
    '/sync',
    {
      onRequest: [fastify.authenticate, fastify.loadUser],
      schema: {
        description: 'Sync analytics from social platforms',
        tags: ['analytics'],
        security: [{ Bearer: [] }],
      },
    },
    analyticsController.sync
  );
}

module.exports = analyticsRoutes;
