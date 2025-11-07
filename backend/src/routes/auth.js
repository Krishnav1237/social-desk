/**
 * Authentication routes
 */

const authController = require('../controllers/authController');

async function authRoutes(fastify, options) {
  // Signup
  fastify.post(
    '/signup',
    {
      schema: {
        description: 'Create a new user account',
        tags: ['auth'],
        body: {
          type: 'object',
          required: ['email', 'username', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            username: { type: 'string', minLength: 3, maxLength: 30 },
            password: { type: 'string', minLength: 8 },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  email: { type: 'string' },
                  username: { type: 'string' },
                  plan: { type: 'string' },
                  credits: { type: 'number' },
                },
              },
              token: { type: 'string' },
            },
          },
        },
      },
    },
    authController.signup
  );

  // Login
  fastify.post(
    '/login',
    {
      schema: {
        description: 'Login to an existing account',
        tags: ['auth'],
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  email: { type: 'string' },
                  username: { type: 'string' },
                  plan: { type: 'string' },
                  credits: { type: 'number' },
                },
              },
              token: { type: 'string' },
            },
          },
        },
      },
    },
    authController.login
  );

  // Get current user (protected)
  fastify.get(
    '/me',
    {
      onRequest: [fastify.authenticate, fastify.loadUser],
      schema: {
        description: 'Get current authenticated user',
        tags: ['auth'],
        security: [{ Bearer: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string' },
              username: { type: 'string' },
              plan: { type: 'string' },
              credits: { type: 'number' },
              avatar_url: { type: 'string' },
              bio: { type: 'string' },
              onboarded: { type: 'boolean' },
              created_at: { type: 'string' },
            },
          },
        },
      },
    },
    authController.me
  );

  // Update profile
  fastify.patch(
    '/profile',
    {
      onRequest: [fastify.authenticate, fastify.loadUser],
      schema: {
        description: 'Update user profile',
        tags: ['auth'],
        security: [{ Bearer: [] }],
        body: {
          type: 'object',
          properties: {
            username: { type: 'string', minLength: 3, maxLength: 30 },
            bio: { type: 'string', maxLength: 500 },
            avatar_url: { type: 'string', format: 'uri' },
            website: { type: 'string', format: 'uri' },
          },
        },
      },
    },
    authController.updateProfile
  );

  // Logout
  fastify.post(
    '/logout',
    {
      onRequest: [fastify.authenticate],
      schema: {
        description: 'Logout current user',
        tags: ['auth'],
        security: [{ Bearer: [] }],
      },
    },
    authController.logout
  );

  // Complete onboarding
  fastify.post(
    '/onboarding/complete',
    {
      onRequest: [fastify.authenticate, fastify.loadUser],
      schema: {
        description: 'Mark onboarding as complete',
        tags: ['auth'],
        security: [{ Bearer: [] }],
      },
    },
    authController.completeOnboarding
  );
}

module.exports = authRoutes;
