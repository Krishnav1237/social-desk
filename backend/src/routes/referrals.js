/**
 * Referrals routes
 */

const referralsController = require('../controllers/referralsController');

async function referralsRoutes(fastify, options) {
  // Get user's referral info
  fastify.get(
    '/',
    {
      onRequest: [fastify.authenticate, fastify.loadUser],
      schema: {
        description: 'Get user referral information',
        tags: ['referrals'],
        security: [{ Bearer: [] }],
      },
    },
    referralsController.getInfo
  );

  // Apply referral code
  fastify.post(
    '/redeem',
    {
      onRequest: [fastify.authenticate, fastify.loadUser],
      schema: {
        description: 'Redeem a referral code',
        tags: ['referrals'],
        security: [{ Bearer: [] }],
      },
    },
    referralsController.redeem
  );
}

module.exports = referralsRoutes;
