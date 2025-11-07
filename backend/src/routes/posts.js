/**
 * Posts routes
 */

const postsController = require('../controllers/postsController');

async function postsRoutes(fastify, options) {
  // Generate AI captions/hooks
  fastify.post(
    '/generate',
    {
      onRequest: [fastify.authenticate, fastify.loadUser],
      schema: {
        description: 'Generate AI captions and hooks',
        tags: ['posts'],
        security: [{ Bearer: [] }],
      },
    },
    postsController.generate
  );

  // Schedule a post
  fastify.post(
    '/schedule',
    {
      onRequest: [fastify.authenticate, fastify.loadUser],
      schema: {
        description: 'Schedule a post for publishing',
        tags: ['posts'],
        security: [{ Bearer: [] }],
      },
    },
    postsController.schedule
  );

  // List user posts
  fastify.get(
    '/',
    {
      onRequest: [fastify.authenticate, fastify.loadUser],
      schema: {
        description: 'List user posts',
        tags: ['posts'],
        security: [{ Bearer: [] }],
      },
    },
    postsController.list
  );

  // Get single post
  fastify.get(
    '/:id',
    {
      onRequest: [fastify.authenticate, fastify.loadUser],
      schema: {
        description: 'Get post by ID',
        tags: ['posts'],
        security: [{ Bearer: [] }],
      },
    },
    postsController.getById
  );

  // Update post
  fastify.patch(
    '/:id',
    {
      onRequest: [fastify.authenticate, fastify.loadUser],
      schema: {
        description: 'Update post',
        tags: ['posts'],
        security: [{ Bearer: [] }],
      },
    },
    postsController.update
  );

  // Delete post
  fastify.delete(
    '/:id',
    {
      onRequest: [fastify.authenticate, fastify.loadUser],
      schema: {
        description: 'Delete post',
        tags: ['posts'],
        security: [{ Bearer: [] }],
      },
    },
    postsController.delete
  );
}

module.exports = postsRoutes;
