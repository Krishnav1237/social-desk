/**
 * Payments routes
 */

const paymentsController = require('../controllers/paymentsController');

async function paymentsRoutes(fastify, options) {
  // Create checkout session
  fastify.post(
    '/checkout',
    {
      onRequest: [fastify.authenticate, fastify.loadUser],
      schema: {
        description: 'Create Stripe checkout session',
        tags: ['payments'],
        security: [{ Bearer: [] }],
      },
    },
    paymentsController.createCheckout
  );

  // Stripe webhook
  fastify.post(
    '/webhook',
    {
      schema: {
        description: 'Stripe webhook endpoint',
        tags: ['payments'],
      },
    },
    paymentsController.webhook
  );

  // Get transaction history
  fastify.get(
    '/transactions',
    {
      onRequest: [fastify.authenticate, fastify.loadUser],
      schema: {
        description: 'Get user transaction history',
        tags: ['payments'],
        security: [{ Bearer: [] }],
      },
    },
    paymentsController.transactions
  );
}

module.exports = paymentsRoutes;
